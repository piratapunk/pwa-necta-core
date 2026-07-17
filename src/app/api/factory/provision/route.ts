import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { getSql } from '@/lib/db'
import { botSpecSchema } from '@/lib/factory/spec'
import { clientIp, hasAllowedOrigin, rateLimit } from '@/lib/security'
import { isSessionVerified, verifyTurnstile } from '@/lib/turnstile'

/*
 * Materializa un bot_spec: schema propio + rol propio + subdominio, vía el
 * contrato abi.provision_tenant (SECURITY DEFINER, idempotente por sesión).
 * La master key solo existe en el entorno del servidor; jamás sale en la
 * respuesta ni se persiste en claro.
 */

const provisionSchema = z
  .object({
    builderSessionId: z.uuid(),
    spec: botSpecSchema,
    turnstileToken: z.string().max(3000).optional(),
    _h: z.string().max(0),
  })
  .strict()

export async function POST(req: NextRequest) {
  if (!hasAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const ip = clientIp(req)
  if (!rateLimit(`provision:${ip}`, 12, 3_600_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  }

  let body: z.infer<typeof provisionSchema>
  try {
    body = provisionSchema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  /* humano verificado: o la sesión ya pasó Turnstile en el constructor, o
     trae token propio */
  if (!isSessionVerified(body.builderSessionId)) {
    const ok = body.turnstileToken
      ? await verifyTurnstile(body.turnstileToken, ip)
      : false
    if (!ok) {
      return NextResponse.json({ error: 'turnstile_required' }, { status: 403 })
    }
  }

  const sql = getSql()
  const masterKey = process.env.ABI_FACTORY_MASTER_KEY
  if (!sql || !masterKey) {
    return NextResponse.json({ error: 'unavailable' }, { status: 503 })
  }

  try {
    const rows = await sql`
      select abi.provision_tenant(
        ${body.builderSessionId}::uuid,
        ${sql.json(body.spec)},
        ${masterKey}
      ) as result
    `
    const result = rows[0]?.result as {
      ok: boolean
      slug: string
      subdomain: string
    }
    if (!result?.ok) {
      return NextResponse.json({ error: 'provision_failed' }, { status: 500 })
    }
    return NextResponse.json({
      ok: true,
      slug: result.slug,
      subdomain: result.subdomain,
      url: `https://${result.subdomain}`,
    })
  } catch (err) {
    try {
      await sql`select abi.factory_log_failure(
        ${body.builderSessionId}::uuid,
        ${err instanceof Error ? err.message : 'error desconocido'}
      )`
    } catch {}
    return NextResponse.json({ error: 'provision_failed' }, { status: 500 })
  }
}
