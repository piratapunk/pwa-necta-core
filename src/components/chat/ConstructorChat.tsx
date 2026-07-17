'use client'

import { useEffect, useRef, useState } from 'react'
import { ExternalLink, Send } from 'lucide-react'

import { AbiBee } from '@/components/brand/AbiBee'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Msg = { id: string; role: 'user' | 'assistant'; content: string }

const GREETING =
  'Hola, soy Abi 🐝 En un ratito armamos tu asistente — y lo dejamos funcionando de verdad. ¿A qué se dedica tu negocio?'

function getBuilderSession(): string {
  const key = 'necta_builder_session'
  try {
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

export function ConstructorChat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [botUrl, setBotUrl] = useState<string | null>(null)
  const sidRef = useRef('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    sidRef.current = getBuilderSession()
    setMessages([{ id: 'greeting', role: 'assistant', content: GREETING }])
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text || busy) return
    setDraft('')
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', content: text },
    ])
    setBusy(true)
    try {
      const res = await fetch('/api/constructor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          builderSessionId: sidRef.current,
          message: text,
          _h: '',
        }),
      })
      const data = (await res.json()) as {
        output?: string
        provisioned?: { subdomain?: string } | null
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            data.output?.trim() || 'Se me atoró algo. ¿Me lo repites?',
        },
      ])
      if (data.provisioned?.subdomain) {
        setBotUrl(`https://${data.provisioned.subdomain}`)
      }
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
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-surface">
      <div className="flex items-center gap-2.5 border-b bg-bg/60 px-4 py-3">
        <AbiBee className="size-9" />
        <div>
          <p className="font-display text-sm font-bold leading-tight">
            Abi · el Constructor
          </p>
          <p className="text-xs text-text-muted">
            {busy ? 'trabajando…' : 'armando tu asistente'}
          </p>
        </div>
      </div>

      {botUrl && (
        <a
          href={botUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 border-b bg-accent-soft px-4 py-2.5 text-sm font-semibold text-accent hover:underline"
        >
          Tu bot ya está en línea — pruébalo aquí
          <ExternalLink className="size-4" />
        </a>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
              m.role === 'user'
                ? 'ml-auto rounded-br-sm bg-accent text-on-accent'
                : 'rounded-bl-sm bg-surface-raised text-text'
            )}
          >
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-sm bg-surface-raised px-4 py-3 text-xs text-text-muted">
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent" />
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent [animation-delay:0.4s]" />
            <span className="size-1.5 animate-honey-pulse rounded-full bg-accent [animation-delay:0.8s]" />
            Abi está trabajando…
          </div>
        )}
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t bg-bg/60 p-3">
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Cuéntale a Abi de tu negocio…"
          maxLength={2000}
          aria-label="Mensaje para Abi"
        />
        <Button type="submit" size="icon" aria-label="Enviar" disabled={!draft.trim() || busy}>
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
