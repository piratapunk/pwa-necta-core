import type { NextRequest } from 'next/server'

/* Rate limiting en memoria (proceso único en Coolify). */
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  bucket.count += 1
  if (buckets.size > 10_000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
  }
  return bucket.count <= max
}

export function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export function hasAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  const allowed = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    'http://localhost:3000',
  ].filter(Boolean) as string[]
  return allowed.some((a) => origin === a || origin === a.replace(/\/$/, ''))
}

/*
 * Primera línea anti prompt-injection del lado web. La defensa real es
 * arquitectural (el mensaje viaja como DATO al brain; ver docs/SECURITY.md) —
 * esto solo corta lo burdo antes de gastar tokens.
 */
const injectionPatterns = [
  /ignore (all )?(previous|prior|above) (instructions|prompts)/i,
  /olvida (todas )?(las )?instrucciones/i,
  /you are now|act as if you|pretend to be/i,
  /system prompt|prompt del sistema/i,
  /\[\[?(system|assistant)\]?\]/i,
]

export function looksLikeInjection(text: string): boolean {
  return injectionPatterns.some((p) => p.test(text))
}
