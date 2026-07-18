import { createHmac, timingSafeEqual } from 'node:crypto'

/* Verificación server-side de Cloudflare Turnstile (siteverify). */

export async function verifyTurnstile(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  const secret = process.env.ABI_TURNSTILE_SECRET
  if (!secret) return false
  try {
    const res = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10_000),
        body: JSON.stringify({
          secret,
          response: token,
          ...(remoteIp ? { remoteip: remoteIp } : {}),
        }),
      }
    )
    if (!res.ok) return false
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

/*
 * "Ya verificado" como cookie FIRMADA (24 h) — sin estado en memoria: los
 * deploys no borran la verificación y el usuario no repite el reto.
 */

export const HUMAN_COOKIE = 'abi_hv'
const HUMAN_TTL_S = 86_400

function secret(): string {
  return process.env.ABI_FACTORY_HMAC_SECRET ?? ''
}

export function makeHumanCookie(): string {
  const ts = Math.floor(Date.now() / 1000)
  const sig = createHmac('sha256', secret()).update(`hv.${ts}`).digest('hex')
  return `${ts}.${sig}`
}

export function isHumanCookieValid(value: string | undefined): boolean {
  if (!value) return false
  const m = /^(\d+)\.([0-9a-f]{64})$/.exec(value)
  if (!m) return false
  const ts = Number(m[1])
  if (Date.now() / 1000 - ts > HUMAN_TTL_S) return false
  const expected = createHmac('sha256', secret()).update(`hv.${ts}`).digest()
  const got = Buffer.from(m[2], 'hex')
  return expected.length === got.length && timingSafeEqual(expected, got)
}

export const HUMAN_COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  maxAge: HUMAN_TTL_S,
  path: '/',
}
