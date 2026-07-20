/*
 * GoTrue guarda UN solo token por tipo por usuario: cada generate_link
 * regenera el token e invalida en silencio el enlace del correo anterior. Si
 * el usuario reenvía (botón "inténtalo de nuevo") acaba con varios correos y el
 * que abre suele ser uno ya superado → "enlace expirado" aunque haga click al
 * instante. Cacheamos el enlace vivo por correo y reenviamos EL MISMO dentro de
 * la ventana, así todos los correos que reciba siguen funcionando; al canjearse
 * (verify OK) se evita, para no reenviar un enlace ya consumido.
 * Proceso único en Coolify → un Map en memoria basta (igual que rateLimit).
 */

const LINK_TTL_MS = 15 * 60_000
const liveLinks = new Map<string, { url: string; expiresAt: number }>()

export function getLiveLink(email: string): string | null {
  const hit = liveLinks.get(email)
  if (!hit) return null
  if (hit.expiresAt <= Date.now()) {
    liveLinks.delete(email)
    return null
  }
  return hit.url
}

export function setLiveLink(email: string, url: string): void {
  const now = Date.now()
  liveLinks.set(email, { url, expiresAt: now + LINK_TTL_MS })
  if (liveLinks.size > 10_000) {
    for (const [k, v] of liveLinks) if (v.expiresAt < now) liveLinks.delete(k)
  }
}

export function dropLiveLink(email: string): void {
  liveLinks.delete(email)
}
