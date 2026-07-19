'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

import { AbiBee } from '@/components/brand/AbiBee'
import { Button } from '@/components/ui/button'

/* auto-verifica al montar: el JS solo corre en el navegador real, no en los
   prefetchers del correo — el enlace de un solo uso llega vivo al click */

export function ConfirmLogin() {
  const params = useSearchParams()
  const [state, setState] = useState<'working' | 'error'>('working')
  const fired = useRef(false)

  const verify = useCallback(async () => {
    setState('working')
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token_hash: params.get('token_hash') ?? '',
          type: params.get('type') ?? 'magiclink',
          ...(params.get('bs') ? { bs: params.get('bs') } : {}),
        }),
      })
      const data = (await res.json()) as { ok?: boolean; redirect?: string }
      if (!res.ok || !data.ok) {
        setState('error')
        return
      }
      window.location.replace(data.redirect ?? '/inicio')
    } catch {
      setState('error')
    }
  }, [params])

  useEffect(() => {
    if (fired.current) return
    fired.current = true
    void verify()
  }, [verify])

  if (state === 'error') {
    return (
      <div className="w-full animate-pop-in rounded-2xl border bg-surface p-8 text-center">
        <AbiBee className="mx-auto block text-5xl" />
        <h1 className="mt-4 text-xl font-semibold">Este enlace ya no sirve</h1>
        <p className="mt-2 text-sm text-text-muted">
          Caducó o ya se usó. Pide uno nuevo y entras al instante.
        </p>
        <Button className="mt-5" asChild>
          <a href="/entrar">Pedir un enlace nuevo</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full animate-pop-in rounded-2xl border bg-surface p-8 text-center">
      <AbiBee className="mx-auto block text-5xl" />
      <h1 className="mt-4 text-xl font-semibold">Entrando a tu colmena…</h1>
      <p className="mt-3 flex items-center justify-center gap-2 text-sm text-text-muted">
        <Loader2 className="size-4 animate-spin text-accent" /> Un segundo, te
        estoy abriendo la puerta 🐝
      </p>
    </div>
  )
}
