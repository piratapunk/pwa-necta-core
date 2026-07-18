import { createHmac, timingSafeEqual } from 'node:crypto'

/*
 * Cliente mínimo del canal (nunca se nombra al proveedor de cara al usuario).
 * Un profile por tenant; el Embedded Signup de Meta hace QR y verificación.
 */

const BASE = 'https://zernio.com/api/v1'

function authHeaders() {
  const key = process.env.ABI_ZERNIO_API_KEY
  if (!key) return null
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
}

export async function createChannelProfile(name: string): Promise<string | null> {
  const headers = authHeaders()
  if (!headers) return null
  try {
    const res = await fetch(`${BASE}/profiles`, {
      method: 'POST',
      headers,
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({ name: name.slice(0, 80) }),
    })
    if (!res.ok) {
      const errText = (await res.text()).slice(0, 200)
      /* nombre ya existente (reintento tras fallo previo): adoptar ese perfil */
      if (res.status === 400 && errText.includes('already exists')) {
        return findProfileByName(name)
      }
      console.error('[zernio] create profile status', res.status, errText)
      return null
    }
    const data = (await res.json()) as {
      profile?: { _id?: string; id?: string }
      _id?: string
      id?: string
    }
    return data.profile?._id ?? data.profile?.id ?? data._id ?? data.id ?? null
  } catch (err) {
    console.error('[zernio] create profile error', err)
    return null
  }
}

async function findProfileByName(name: string): Promise<string | null> {
  const headers = authHeaders()
  if (!headers) return null
  try {
    const res = await fetch(`${BASE}/profiles`, {
      headers,
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as {
      profiles?: { _id?: string; name?: string }[]
      data?: { _id?: string; name?: string }[]
    }
    const list = data.profiles ?? data.data ?? []
    const hit = list.find((p) => p.name === name.slice(0, 80))
    return hit?._id ?? null
  } catch {
    return null
  }
}

export async function getWhatsAppConnectUrl(
  profileId: string,
  redirectUrl: string
): Promise<string | null> {
  const headers = authHeaders()
  if (!headers) return null
  try {
    const url = new URL(`${BASE}/connect/whatsapp`)
    url.searchParams.set('profileId', profileId)
    url.searchParams.set('redirect_url', redirectUrl)
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(15_000),
    })
    if (!res.ok) {
      console.error('[zernio] connect url status', res.status, (await res.text()).slice(0, 200))
      return null
    }
    const data = (await res.json()) as { authUrl?: string; url?: string }
    return data.authUrl ?? data.url ?? null
  } catch (err) {
    console.error('[zernio] connect url error', err)
    return null
  }
}

export async function sendInboxMessage(
  conversationId: string,
  text: string
): Promise<boolean> {
  const headers = authHeaders()
  if (!headers) return false
  try {
    const res = await fetch(
      `${BASE}/inbox/conversations/${encodeURIComponent(conversationId)}/messages`,
      {
        method: 'POST',
        headers,
        signal: AbortSignal.timeout(15_000),
        body: JSON.stringify({ text: text.slice(0, 4000) }),
      }
    )
    if (!res.ok) {
      console.error('[zernio] inbox send status', res.status, (await res.text()).slice(0, 200))
      return false
    }
    return true
  } catch (err) {
    console.error('[zernio] inbox send error', err)
    return false
  }
}

/* state firmado del redirect (anti-CSRF del callback) */
function stateSecret(): string {
  const s = process.env.ABI_FACTORY_HMAC_SECRET
  if (!s || s.length < 32) throw new Error('ABI_FACTORY_HMAC_SECRET no configurado')
  return s
}

export function signConnectState(slug: string): string {
  const secret = stateSecret()
  const ts = Math.floor(Date.now() / 1000)
  const payload = `${slug}.${ts}`
  const sig = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifyConnectState(state: string): string | null {
  let secret: string
  try {
    secret = stateSecret()
  } catch {
    return null
  }
  const m = /^([a-z][a-z0-9-]{2,29})\.(\d+)\.([0-9a-f]{64})$/.exec(state)
  if (!m) return null
  const [, slug, ts, sig] = m
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 3600) return null
  const expected = createHmac('sha256', secret).update(`${slug}.${ts}`).digest()
  const got = Buffer.from(sig, 'hex')
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null
  return slug
}
