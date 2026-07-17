import type { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

import { AbiBee } from '@/components/brand/AbiBee'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { getAuthUserId } from '@/lib/auth/server'
import { getSql } from '@/lib/db'

export const metadata: Metadata = {
  title: 'Mis bots',
  robots: { index: false },
}

export const dynamic = 'force-dynamic'

type TenantRow = {
  slug: string
  name: string
  vertical: string
  plan: string
  status: string
  subdomain: string
}

export default async function MisBotsPage() {
  const userId = await getAuthUserId()

  if (!userId) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center sm:px-6">
        <AbiBee className="mx-auto size-16" />
        <h1 className="mt-6 text-2xl font-bold">Aquí viven tus bots</h1>
        <p className="mt-3 text-sm text-text-muted">
          Cuando armes tu asistente, Abi te manda un enlace de acceso a tu
          correo — con ese enlace entras aquí y tu bot queda ligado a ti.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/constructor">Arma tu asistente gratis</Link>
        </Button>
      </div>
    )
  }

  const sql = getSql()
  let tenants: TenantRow[] = []
  if (sql) {
    try {
      const rows = await sql`select abi.user_tenants(${userId}::uuid) as t`
      tenants = (rows[0]?.t as TenantRow[]) ?? []
    } catch {}
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="t-eyebrow">Tu colmena</p>
          <h1 className="mt-1 text-3xl font-bold">Mis bots</h1>
        </div>
        <form action="/api/auth/signout" method="post">
          <Button variant="ghost" size="sm" type="submit">
            Salir
          </Button>
        </form>
      </div>

      {tenants.length === 0 ? (
        <div className="mt-10 rounded-xl border bg-surface p-8 text-center">
          <p className="text-text-muted">
            Aún no tienes bots ligados a esta cuenta.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/constructor">Armar mi primer asistente</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {tenants.map((t) => (
            <Card key={t.slug}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="truncate">{t.name}</span>
                  <Badge variant={t.plan === 'free' ? 'soft' : 'premium'}>
                    {t.plan}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {t.vertical} ·{' '}
                  {t.status === 'active' ? 'en línea' : t.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/panel/${t.slug}`}>Administrar</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <a
                    href={`https://${t.subdomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir <ExternalLink className="size-3.5" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
