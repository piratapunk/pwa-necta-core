import Link from 'next/link'
import { Lock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function CrmLocked({ slug, feature }: { slug: string; feature: string }) {
  return (
    <div className="mt-10 rounded-2xl border border-accent/30 bg-surface p-10 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent-soft">
        <Lock className="size-5 text-accent" />
      </span>
      <Badge variant="premium" className="mt-4">Premium</Badge>
      <h2 className="mt-3 text-lg font-semibold">{feature}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
        Tu asistente ya está captando los datos de tus clientes en cada plática.
        Con Premium los ves organizados aquí: quién es, en qué etapa va y qué sigue.
      </p>
      <Button className="mt-5" asChild>
        <Link href={`/panel/${slug}/plan`}>Desbloquear con Premium</Link>
      </Button>
    </div>
  )
}
