'use client'

import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'

import { Linkify } from '@/components/chat/Linkify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Msg = { id: string; role: 'user' | 'assistant'; content: string }

function getSid(slug: string): string {
  const key = `necta_tenant_sid_${slug}`
  try {
    /* localStorage: la sesión sobrevive al cierre del navegador — el bot
       recuerda al visitante 1:1 */
    let sid = localStorage.getItem(key)
    if (!sid) {
      sid = crypto.randomUUID()
      localStorage.setItem(key, sid)
    }
    return sid
  } catch {
    return crypto.randomUUID()
  }
}

export function TenantChat({
  slug,
  botName,
  greeting,
  suggestions = [],
}: {
  slug: string
  botName: string
  greeting: string
  suggestions?: string[]
}) {
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const sidRef = useRef('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const hasUserMessages = messages.some((m) => m.role === 'user')

  useEffect(() => {
    sidRef.current = getSid(slug)
    setMessages([{ id: 'greeting', role: 'assistant', content: greeting }])
    fetch(`/api/t/${slug}/history?sessionId=${sidRef.current}`)
      .then((r) => r.json())
      .then((data: { messages?: { role: 'user' | 'assistant'; content: string }[] }) => {
        if (data.messages?.length) {
          setMessages([
            { id: 'greeting', role: 'assistant', content: greeting },
            ...data.messages.map((m) => ({
              id: crypto.randomUUID(),
              role: m.role,
              content: m.content,
            })),
          ])
        }
      })
      .catch(() => {})
  }, [slug, greeting])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    void sendText(draft)
  }

  const sendText = async (raw: string) => {
    const text = raw.trim()
    if (!text || busy) return
    setDraft('')
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: text },
    ])
    setBusy(true)
    try {
      const history = messages
        .filter((m) => m.id !== 'greeting')
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }))
      const body = JSON.stringify({
        message: text,
        sessionId: sidRef.current,
        conversationHistory: history,
        _h: '',
      })
      /* un reintento ante fallos transitorios (521 de deploy, WiFi de venue) */
      let res: Response | null = null
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await fetch(`/api/t/${slug}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          })
          if (res.ok) break
        } catch {
          res = null
        }
        if (attempt === 0) await new Promise((r) => setTimeout(r, 1500))
      }
      if (!res) throw new Error('network')
      const data = (await res.json()) as { output?: string }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            data.output?.trim() ||
            'Se me atoró algo. ¿Lo intentamos de nuevo?',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Se me atoró la conexión. Inténtalo otra vez en un momento.',
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-surface">
      <div className="border-b bg-bg/60 px-4 py-3">
        <p className="font-display text-sm font-bold">{botName}</p>
        <p className="text-xs text-text-muted">{busy ? 'escribiendo…' : 'en línea'}</p>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
              m.role === 'user'
                ? 'ml-auto rounded-br-sm bg-accent text-on-accent'
                : 'rounded-bl-sm bg-surface-raised text-text'
            )}
          >
            <Linkify text={m.content} />
          </div>
        ))}
        {busy && (
          <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm bg-surface-raised px-4 py-3">
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent" />
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent [animation-delay:0.4s]" />
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent [animation-delay:0.8s]" />
          </div>
        )}

        {!hasUserMessages && !busy && suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void sendText(q)}
                className="rounded-full border border-accent/40 bg-accent-soft px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent hover:text-on-accent"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t bg-bg/60 p-3">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Escribe tu mensaje…"
          maxLength={2000}
          aria-label="Mensaje"
        />
        <Button type="submit" size="icon" aria-label="Enviar" disabled={!draft.trim() || busy}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
