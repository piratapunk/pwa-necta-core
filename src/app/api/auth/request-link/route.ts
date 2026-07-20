import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getAppOrigin } from '@/lib/auth/server'
import { getLiveLink, setLiveLink, dropLiveLink } from '@/lib/auth/link-cache'
import { generateMagicLink, sendMagicLinkEmail } from '@/lib/auth/magic-link'
import { clientIp, hasAllowedOrigin, rateLimit } from '@/lib/security'

const requestLinkSchema = z
  .object({
    email: z.string().email().max(200),
    builderSessionId: z.uuid().optional(),
    _h: z.string().max(0),
  })
  .strict()

export async function POST(req: NextRequest) {
  if (!hasAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const ip = clientIp(req)
  if (
    !rateLimit(`mlink-ip:${ip}`, 6, 3_600_000) ||
    !rateLimit(`mlink-day:${ip}`, 15, 86_400_000)
  ) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: z.infer<typeof requestLinkSchema>
  try {
    body = requestLinkSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const email = body.email.trim().toLowerCase()
  if (!rateLimit(`mlink-em:${email}`, 3, 3_600_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let urlStr = getLiveLink(email)
  if (!urlStr) {
    const link = await generateMagicLink(email)
    /* respuesta uniforme contra enumeración de cuentas */
    if (!link) {
      return NextResponse.json({ ok: true })
    }
    const origin = await getAppOrigin()
    /* página de confirmación (verifica por POST): a prueba del prefetch del correo */
    const url = new URL(`${origin}/entrar/confirmar`)
    url.searchParams.set('token_hash', link.token_hash)
    url.searchParams.set('type', link.type)
    if (body.builderSessionId) url.searchParams.set('bs', body.builderSessionId)
    urlStr = url.toString()
    setLiveLink(email, urlStr)
  }

  const sent = await sendMagicLinkEmail(email, urlStr)
  if (!sent) {
    /* que un fallo de envío no deje el correo "pegado" a un enlace no entregado */
    dropLiveLink(email)
    return NextResponse.json({ error: 'email_unavailable' }, { status: 503 })
  }
  return NextResponse.json({ ok: true })
}
