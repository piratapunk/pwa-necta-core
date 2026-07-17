import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { signPayload } from '@/lib/factory/hmac'
import { clientIp, hasAllowedOrigin, rateLimit } from '@/lib/security'

const refineSchema = z
  .object({
    builderSessionId: z.uuid(),
    prefs: z
      .object({
        tono: z.enum(['cercano', 'profesional', 'juvenil', 'formal']),
        trato: z.enum(['tu', 'usted']),
        emojis: z.enum(['si', 'no']),
        si_no_sabe: z.enum(['recado', 'llamar', 'humano']),
        objetivo: z.enum(['vender', 'agendar', 'informar', 'captar']),
        estilo: z.enum(['corto', 'detallado']),
        extra: z.string().max(600).optional(),
      })
      .strict(),
    _h: z.string().max(0),
  })
  .strict()

export async function POST(req: NextRequest) {
  if (!hasAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  if (!rateLimit(`refine:${clientIp(req)}`, 10, 3_600_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: z.infer<typeof refineSchema>
  try {
    body = refineSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const serviceUrl = process.env.ABI_CONSTRUCTOR_URL
  const secret = process.env.ABI_FACTORY_HMAC_SECRET
  if (!serviceUrl || !secret) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }

  const payload = JSON.stringify({
    builderSessionId: body.builderSessionId,
    prefs: body.prefs,
  })
  const { header } = signPayload(payload, secret)

  try {
    const res = await fetch(`${serviceUrl}/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-abi-signature': header,
      },
      signal: AbortSignal.timeout(60_000),
      body: payload,
    })
    if (!res.ok) return NextResponse.json({ error: 'refine_failed' }, { status: 502 })
    const data = (await res.json()) as { ok?: boolean; stage?: string; error?: string }
    if (!data.ok) {
      return NextResponse.json({ error: data.error ?? 'refine_failed' }, { status: 502 })
    }
    return NextResponse.json({ ok: true, stage: data.stage ?? 'afinado' })
  } catch {
    return NextResponse.json({ error: 'refine_timeout' }, { status: 503 })
  }
}
