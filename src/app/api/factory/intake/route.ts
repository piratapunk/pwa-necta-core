import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { signPayload } from '@/lib/factory/hmac'
import { botSpecSchema } from '@/lib/factory/spec'
import { clientIp, hasAllowedOrigin, rateLimit } from '@/lib/security'

/*
 * Intake agéntico: recibe el texto crudo del chat/form del Constructor y lo
 * manda al parser LLM (n8n) por canal firmado. Devuelve un bot_spec DRAFT ya
 * validado contra el contrato — nunca lo que el LLM haya dicho tal cual.
 */

const intakeSchema = z
  .object({
    builderSessionId: z.uuid(),
    rawText: z.string().min(10).max(24000),
    hints: z
      .object({
        business_name: z.string().max(120).optional(),
        vertical: z.string().max(40).optional(),
      })
      .optional(),
    _h: z.string().max(0),
  })
  .strict()

export async function POST(req: NextRequest) {
  if (!hasAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const ip = clientIp(req)
  if (!rateLimit(`intake:${ip}`, 10, 3_600_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: z.infer<typeof intakeSchema>
  try {
    body = intakeSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const webhookUrl = process.env.ABI_FACTORY_INTAKE_N8N_WEBHOOK_URL
  const secret = process.env.ABI_FACTORY_HMAC_SECRET
  if (!webhookUrl || !secret) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }

  const payload = JSON.stringify({
    builderSessionId: body.builderSessionId,
    rawText: body.rawText,
    hints: body.hints ?? {},
  })
  const { header } = signPayload(payload, secret)

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-abi-signature': header,
      },
      signal: AbortSignal.timeout(30_000),
      body: payload,
    })
    if (!res.ok) {
      return NextResponse.json({ error: 'intake_failed' }, { status: 502 })
    }
    const data = (await res.json()) as { spec?: unknown; error?: string }
    if (!data.spec) {
      return NextResponse.json({ error: data.error ?? 'intake_failed' }, { status: 502 })
    }

    const spec = botSpecSchema.safeParse(data.spec)
    if (!spec.success) {
      return NextResponse.json({ error: 'spec_invalid' }, { status: 502 })
    }
    return NextResponse.json({ spec: spec.data })
  } catch {
    return NextResponse.json({ error: 'intake_timeout' }, { status: 503 })
  }
}
