import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  BarChart3,
  Filter,
  FolderOpen,
  Home,
  MessageSquare,
  Plug,
  Settings,
  Sparkles,
  UsersRound,
} from 'lucide-react'

import { NectaWordmark } from '@/components/brand/NectaMark'
import { UserMenu } from '@/components/panel/UserMenu'
import { Badge } from '@/components/ui/badge'
import { getAuthUser } from '@/lib/auth/server'
import { getSql } from '@/lib/db'

export const dynamic = 'force-dynamic'

const nav = [
  { href: '', label: 'Resumen', icon: Home },
  { href: '/conversaciones', label: 'Conversaciones', icon: MessageSquare },
  { href: '/clientes', label: 'Clientes', icon: UsersRound },
  { href: '/embudo', label: 'Embudo', icon: Filter },
  { href: '/archivos', label: 'Archivos y memoria', icon: FolderOpen },
  { href: '/conexiones', label: 'Conexiones', icon: Plug },
  { href: '/funciones', label: 'Funciones a la medida', icon: Sparkles },
  { href: '/plan', label: 'Mi plan', icon: BarChart3 },
  { href: '/ajustes', label: 'Configuración', icon: Settings },
]

export default async function PanelLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const user = await getAuthUser()
  if (!user) redirect('/entrar')
  const userId = user.id

  const sql = getSql()
  if (!sql) notFound()
  const rows = await sql`select abi.user_owns_tenant(${userId}::uuid, ${slug}) as id`
  if (!rows[0]?.id) notFound()

  const tenantRows = await sql`
    select name, plan from abi.tenants where slug = ${slug}
  `
  const tenant = tenantRows[0] as { name: string; plan: string }

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-surface/60 p-4 md:flex">
        <Link href="/" className="px-2">
          <NectaWordmark />
        </Link>
        <Link
          href="/mis-bots"
          title="Cambiar de asistente"
          className="mt-6 block rounded-lg border bg-surface px-3 py-2.5 transition-colors hover:bg-surface-raised"
        >
          <p className="truncate text-sm font-semibold">{tenant.name}</p>
          <Badge variant={tenant.plan === 'free' ? 'soft' : 'premium'} className="mt-1">
            {tenant.plan}
          </Badge>
        </Link>
        <nav className="mt-6 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={`/panel/${slug}${item.href}`}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-raised hover:text-text"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <UserMenu email={user.email} settingsHref={`/panel/${slug}/ajustes`} />
        </div>
      </aside>

      <div className="flex-1">
        <div className="border-b bg-surface/40 px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{tenant.name}</p>
            <Link href="/mis-bots" className="text-xs text-accent">
              Mis bots
            </Link>
          </div>
          <div className="mt-2 flex gap-3 overflow-x-auto text-xs">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={`/panel/${slug}${item.href}`}
                className="whitespace-nowrap text-text-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
