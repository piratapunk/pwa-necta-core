import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { CHAT_BEHAVIOR_VERSION, getSystemPrompt } from '@/lib/chat/behavior'
import {
  clientIp,
  hasAllowedOrigin,
  looksLikeInjection,
  rateLimit,
} from '@/lib/security'

const chatRequestSchema = z
  .object({
    message: z.string().min(1).max(2000),
    sessionId: z.uuid(),
    turnCount: z.number().int().min(0).max(500),
    conversationHistory: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().max(4000),
        })
      )
      .max(10),
    pagePath: z.string().max(200).optional(),
    _h: z.string().max(0),
  })
  .strict()

const FALLBACK =
  'Se me atoró algo aquí adentro. ¿Lo intentamos de nuevo en un momento?'

export async function POST(req: NextRequest) {
  if (!hasAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const ip = clientIp(req)
  if (
    !rateLimit(`ip-min:${ip}`, 20, 60_000) ||
    !rateLimit(`ip-hr:${ip}`, 80, 3_600_000)
  ) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: z.infer<typeof chatRequestSchema>
  try {
    body = chatRequestSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  if (!rateLimit(`sid:${body.sessionId}`, 12, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  if (looksLikeInjection(body.message)) {
    return NextResponse.json({
      output:
        'Yo solo sé de una cosa: armar asistentes para negocios 🐝 ¿Me cuentas del tuyo?',
    })
  }

  const webhookUrl = process.env.NECTA_CHAT_N8N_WEBHOOK_URL
  if (!webhookUrl) {
    return NextResponse.json({ output: FALLBACK }, { status: 200 })
  }

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        behaviorVersion: CHAT_BEHAVIOR_VERSION,
        systemPrompt: getSystemPrompt(),
        message: body.message,
        sessionId: body.sessionId,
        turnCount: body.turnCount,
        conversationHistory: body.conversationHistory,
        pagePath: body.pagePath ?? '/',
        locale: 'es',
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ output: FALLBACK }, { status: 200 })
    }

    const data = (await res.json()) as Record<string, unknown>
    const output =
      (typeof data.output === 'string' && data.output) ||
      (typeof data.text === 'string' && data.text) ||
      (typeof data.response === 'string' && data.response) ||
      (typeof data.message === 'string' && data.message) ||
      FALLBACK

    return NextResponse.json({ output })
  } catch {
    return NextResponse.json({ output: FALLBACK }, { status: 200 })
  }
}
