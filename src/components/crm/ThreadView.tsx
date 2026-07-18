'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bot, Send, UserRound } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { CrmMessage } from '@/lib/crm'

export function ThreadView({
  slug,
  session,
  initialMessages,
  initialMode,
  canReply,
}: {
  slug: string
  session: string
  initialMessages: CrmMessage[]
  initialMode: 'bot' | 'human'
  canReply: boolean
}) {
  const router = useRouter()
  const [messages, setMessages] = useState<CrmMessage[]>(initialMessages)
  const [mode, setMode] = useState<'bot' | 'human'>(initialMode)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/panel/crm/thread?slug=${slug}&session=${session}`)
      if (!res.ok) return
      const data = (await res.json()) as {
        ok: boolean
        messages: CrmMessage[]
        conversation: { mode: 'bot' | 'human' }
      }
      if (data.ok) {
        setMessages(data.messages)
        setMode(data.conversation.mode)
      }
    } catch {}
  }, [slug, session])

  /* polling ligero solo con la pestaña visible */
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') void refresh()
    }
    const iv = setInterval(tick, 5000)
    return () => clearInterval(iv)
  }, [refresh])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const setModeRemote = async (next: 'bot' | 'human') => {
    const prev = mode
    setMode(next)
    const res = await fetch('/api/panel/crm/mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, session, mode: next }),
    })
    if (!res.ok) {
      setMode(prev)
      setNotice('No se pudo cambiar el modo.')
      return
    }
    setNotice('')
    router.refresh()
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    setBusy(true)
    setNotice('')
    try {
      const res = await fetch('/api/panel/crm/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, session, message: text }),
      })
      const data = (await res.json().catch(() => null)) as {
        ok?: boolean
        delivered?: boolean
        error?: string
      } | null
      if (!res.ok || !data?.ok) {
        setNotice(data?.error === 'premium_required'
          ? 'Responder tú mismo es parte de Premium.'
          : 'No se pudo enviar. Inténtalo de nuevo.')
        return
      }
      setDraft('')
      setMode('human')
      if (data.delivered === false) {
        setNotice('Se guardó tu mensaje, pero el canal no confirmó la entrega.')
      }
      await refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-surface">
      <div className="flex items-center justify-between gap-3 border-b bg-bg/60 px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-xs text-text-muted">
          {mode === 'human' ? (
            <>
              <UserRound className="size-3.5 text-accent" /> Tú estás atendiendo esta plática
            </>
          ) : (
            <>
              <Bot className="size-3.5" /> Tu asistente está atendiendo
            </>
          )}
        </p>
        {canReply && (
          <Button
            size="sm"
            variant={mode === 'human' ? 'secondary' : 'default'}
            onClick={() => void setModeRemote(mode === 'human' ? 'bot' : 'human')}
          >
            {mode === 'human' ? 'Devolver al asistente' : 'Atender yo'}
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="max-h-[55dvh] min-h-64 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div key={m.id} className={cn('flex flex-col', m.role === 'user' ? 'items-start' : 'items-end')}>
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                m.role === 'user' && 'rounded-bl-sm bg-surface-raised text-text',
                m.role === 'assistant' && 'rounded-br-sm bg-accent-soft text-text',
                m.role === 'owner' && 'rounded-br-sm bg-accent text-on-accent'
              )}
            >
              {m.content}
            </div>
            <p className="mt-0.5 text-[10px] text-text-muted">
              {m.role === 'user' ? 'Cliente' : m.role === 'owner' ? 'Tú' : 'Asistente'}
              {' · '}
              {new Date(m.at).toLocaleString('es-MX', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        ))}
      </div>

      {canReply ? (
        <form onSubmit={send} className="border-t bg-bg/60 p-3">
          {notice && <p className="mb-2 text-xs text-warn">{notice}</p>}
          <div className="flex items-center gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Responder como el negocio…"
              maxLength={4000}
              aria-label="Respuesta"
            />
            <Button type="submit" size="icon" aria-label="Enviar" disabled={!draft.trim() || busy}>
              <Send className="size-4" />
            </Button>
          </div>
          {mode === 'bot' && (
            <p className="mt-1.5 text-[11px] text-text-muted">
              Al responder, la plática pasa a ti y el asistente se pausa hasta que la devuelvas.
            </p>
          )}
        </form>
      ) : (
        <div className="border-t bg-bg/60 p-3 text-center">
          <p className="text-xs text-text-muted">
            Responder tú mismo y pausar al asistente es parte de Premium.{' '}
            <a href={`/panel/${slug}/plan`} className="text-accent underline-offset-2 hover:underline">
              Conocer Premium
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
