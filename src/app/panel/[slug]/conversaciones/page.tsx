import { MessageSquare } from 'lucide-react'

import { getAuthUserId } from '@/lib/auth/server'
import { getSql } from '@/lib/db'

export const dynamic = 'force-dynamic'

type Conv = {
  session_id: string
  channel: string
  started_at: string
  last_at: string
  messages: number
  last_user_msg: string | null
}

export default async function PanelConversaciones({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const userId = await getAuthUserId()
  const sql = getSql()
  const rows = await sql!`
    select abi.tenant_conversations_list(${userId}::uuid, ${slug}, 50) as r
  `
  const r = rows[0]?.r as { ok: boolean; conversations: Conv[] }
  const convs = r?.ok ? r.conversations : []

  return (
    <div className="mx-auto max-w-4xl">
      <p className="t-eyebrow">Conversaciones</p>
      <h1 className="mt-1 text-2xl font-semibold">Lo que tu asistente ha atendido</h1>

      {convs.length === 0 ? (
        <div className="mt-10 rounded-xl border bg-surface p-10 text-center">
          <MessageSquare className="mx-auto size-8 text-text-muted" />
          <p className="mt-3 text-sm text-text-muted">
            Aún no hay conversaciones. Comparte tu asistente y aquí verás cada plática.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y rounded-xl border bg-surface">
          {convs.map((c) => (
            <li key={c.session_id} className="flex items-center justify-between gap-4 px-4 py-3.5">
              <div className="min-w-0">
                <p className="truncate text-sm">
                  {c.last_user_msg ?? '(sin mensajes del cliente)'}
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {c.channel} · {c.messages} mensajes
                </p>
              </div>
              <p className="shrink-0 text-xs text-text-muted">
                {new Date(c.last_at).toLocaleString('es-MX', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
