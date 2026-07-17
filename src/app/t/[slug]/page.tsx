import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { TenantChat } from '@/components/chat/TenantChat'
import { getSql } from '@/lib/db'
import { SLUG_RE } from '@/lib/factory/spec'

export const dynamic = 'force-dynamic'

type TenantContext = {
  ok: boolean
  slug: string
  name: string
  config: {
    persona: {
      bot_name: string
      business_name: string
      greeting: string
    }
  }
}

async function loadTenant(slug: string): Promise<TenantContext | null> {
  if (!SLUG_RE.test(slug)) return null
  const sql = getSql()
  if (!sql) return null
  try {
    const rows = await sql`select abi.tenant_chat_context(${slug}) as ctx`
    const ctx = rows[0]?.ctx as TenantContext
    return ctx?.ok ? ctx : null
  } catch {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const tenant = await loadTenant(slug)
  return {
    title: tenant ? `${tenant.name} · Asistente` : 'Asistente',
    robots: { index: false },
  }
}

export default async function TenantBotPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const tenant = await loadTenant(slug)
  if (!tenant) notFound()

  const persona = tenant.config.persona

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-8rem)] max-w-2xl flex-col px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <p className="t-eyebrow">Asistente de</p>
        <h1 className="mt-1 text-3xl font-bold">{tenant.name}</h1>
      </div>
      <TenantChat
        slug={tenant.slug}
        botName={persona.bot_name}
        greeting={persona.greeting}
      />
      <p className="mt-6 text-center text-xs text-text-muted">
        Este asistente fue creado con{' '}
        <a href="https://nectacore.com" className="text-accent hover:underline">
          Abi · NectaCore
        </a>{' '}
        🐝
      </p>
    </div>
  )
}
