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

/* Sesiones del constructor ya verificadas (memoria de proceso, TTL 2 h). */
const verified = new Map<string, number>()

export function isSessionVerified(sid: string): boolean {
  const at = verified.get(sid)
  if (!at) return false
  if (Date.now() - at > 2 * 3_600_000) {
    verified.delete(sid)
    return false
  }
  return true
}

export function markSessionVerified(sid: string): void {
  if (verified.size > 5_000) {
    const cutoff = Date.now() - 2 * 3_600_000
    for (const [k, v] of verified) if (v < cutoff) verified.delete(k)
  }
  verified.set(sid, Date.now())
}
