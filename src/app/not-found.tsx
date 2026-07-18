import Link from 'next/link'

import { AbiBee } from '@/components/brand/AbiBee'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <AbiBee className="text-7xl opacity-80" />
      <h1 className="mt-6 text-3xl font-semibold">Aquí todavía no hay nada 🐝</h1>
      <p className="mt-3 max-w-md text-sm text-text-muted">
        Esta página no existe — o el asistente de esta dirección aún no se ha
        construido. Si estás armando tu bot, termina el proceso con Abi y esta
        dirección cobrará vida al instante.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/constructor">Armar mi asistente</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/">Ir al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
