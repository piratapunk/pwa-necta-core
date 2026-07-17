'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { ExternalLink, Send } from 'lucide-react'

import { AbiBee } from '@/components/brand/AbiBee'
import { Linkify } from '@/components/chat/Linkify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Msg = { id: string; role: 'user' | 'assistant'; content: string }
type Stage = 'inicio' | 'conversando' | 'borrador' | 'construido'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: string | HTMLElement,
        opts: {
          sitekey: string
          callback: (token: string) => void
          'error-callback'?: () => void
          appearance?: string
          theme?: string
          retry?: string
          'retry-interval'?: number
          'refresh-expired'?: string
        }
      ) => string
      reset: (id?: string) => void
    }
  }
}

const GREETING =
  'Hola, soy Abi 🐝 En un ratito armamos tu asistente — y lo dejamos funcionando de verdad. ¿A qué se dedica tu negocio?'

/* endowed progress: el panal nunca arranca vacío */
const STAGE_CELLS: Record<Stage, number> = {
  inicio: 2,
  conversando: 3,
  borrador: 5,
  construido: 6,
}

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

function HoneycombProgress({ filled }: { filled: number }) {
  return (
    <svg viewBox="0 0 340 60" className="mx-auto w-full max-w-[260px]" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => {
        const x = 20 + i * 52
        const points = `${x},14 ${x + 22},2 ${x + 44},14 ${x + 44},40 ${x + 22},52 ${x},40`
        return (
          <polygon
            key={i}
            points={points}
            fill={i < filled ? 'var(--accent)' : 'transparent'}
            stroke="var(--accent)"
            strokeOpacity={i < filled ? 1 : 0.35}
            strokeWidth="2"
            style={{ transition: 'fill 0.6s ease' }}
          />
        )
      })}
    </svg>
  )
}

export function ConstructorChat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [botUrl, setBotUrl] = useState<string | null>(null)
  const [stage, setStage] = useState<Stage>('inicio')
  const [tsToken, setTsToken] = useState<string | null>(null)
  const [tsVerified, setTsVerified] = useState(false)
  /* overlay del reto: visible → fading (éxito, se desvanece) → hidden */
  const [tsOverlay, setTsOverlay] = useState<'visible' | 'fading' | 'hidden'>('visible')
  const [claimEmail, setClaimEmail] = useState('')
  const [claimState, setClaimState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const sidRef = useRef('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const tsContainer = useRef<HTMLDivElement>(null)
  const tsRendered = useRef(false)

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    sidRef.current = getBuilderSession()
    setMessages([{ id: 'greeting', role: 'assistant', content: GREETING }])
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, busy])

  const renderTurnstile = useCallback(() => {
    if (tsRendered.current || !siteKey || !window.turnstile || !tsContainer.current) return
    tsRendered.current = true
    window.turnstile.render(tsContainer.current, {
      sitekey: siteKey,
      appearance: 'always',
      retry: 'auto',
      'retry-interval': 4000,
      'refresh-expired': 'auto',
      callback: (token) => {
        setTsToken(token)
        setTsOverlay('fading')
        setTimeout(() => setTsOverlay('hidden'), 700)
      },
      'error-callback': () => {
        setTsToken(null)
        setTsOverlay('visible')
        /* reto atorado (red/extensión): reintentar en vez de morir */
        setTimeout(() => {
          try {
            window.turnstile?.reset()
          } catch {}
        }, 4000)
      },
    })
  }, [siteKey])

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
          ...(!tsVerified && tsToken ? { turnstileToken: tsToken } : {}),
          _h: '',
        }),
      })
      const data = (await res.json()) as {
        output?: string
        error?: string
        provisioned?: { subdomain?: string } | null
        stage?: Stage
      }
      if (res.status === 403 && data.error?.startsWith('turnstile')) {
        setTsVerified(false)
        setTsToken(null)
        setTsOverlay('visible')
        tsRendered.current = false
        setTimeout(renderTurnstile, 100)
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content:
              'Antes de seguir, márcame la casilla de "soy humano" aquí abajo 🐝 y me lo vuelves a mandar.',
          },
        ])
        return
      }
      setTsVerified(true)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.output?.trim() || 'Se me atoró algo. ¿Me lo repites?',
        },
      ])
      if (data.stage) setStage(data.stage)
      if (data.provisioned?.subdomain) {
        setBotUrl(`https://${data.provisioned.subdomain}`)
        setStage('construido')
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
    <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border bg-surface">
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      )}

      <div className="flex items-center justify-between gap-2.5 border-b bg-bg/60 px-4 py-3">
        <div className="flex items-center gap-2.5">
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
        <HoneycombProgress filled={STAGE_CELLS[stage]} />
      </div>

      {botUrl && (
        <div className="border-b bg-accent-soft">
          <a
            href={botUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-accent hover:underline"
          >
            Tu bot ya está en línea — pruébalo aquí
            <ExternalLink className="size-4" />
          </a>
          {claimState !== 'sent' ? (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                if (!claimEmail.trim() || claimState === 'sending') return
                setClaimState('sending')
                try {
                  const res = await fetch('/api/auth/request-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: claimEmail.trim(),
                      builderSessionId: sidRef.current,
                      _h: '',
                    }),
                  })
                  setClaimState(res.ok ? 'sent' : 'error')
                } catch {
                  setClaimState('error')
                }
              }}
              className="flex items-center gap-2 px-4 pb-3"
            >
              <Input
                type="email"
                value={claimEmail}
                onChange={(e) => setClaimEmail(e.target.value)}
                placeholder="Tu correo — para que el bot quede a tu nombre"
                aria-label="Correo para reclamar tu bot"
                className="h-9 bg-surface text-xs"
              />
              <Button type="submit" size="sm" disabled={claimState === 'sending'}>
                {claimState === 'sending' ? 'Enviando…' : 'Ligarlo a mí'}
              </Button>
            </form>
          ) : (
            <p className="px-4 pb-3 text-center text-xs text-text-muted">
              Te mandé un enlace de acceso 🐝 revisa tu correo.
            </p>
          )}
          {claimState === 'error' && (
            <p className="px-4 pb-3 text-center text-xs text-warn">
              No pude mandar el correo ahorita — tu bot sigue en línea; inténtalo más tarde.
            </p>
          )}
        </div>
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
            <Linkify text={m.content} />
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

      {!tsVerified && siteKey && tsOverlay !== 'hidden' && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center bg-bg/70 backdrop-blur-[2px] transition-opacity duration-500',
            tsOverlay === 'fading' && 'pointer-events-none opacity-0'
          )}
        >
          <div className="flex flex-col items-center gap-3 rounded-2xl border bg-surface/95 px-6 py-5 shadow-xl">
            <p className="text-sm text-text-muted">
              Un segundo — confirmando que eres humano 🐝
            </p>
            <div ref={tsContainer} />
          </div>
        </div>
      )}

      <form onSubmit={send} className="flex items-center gap-2 border-t bg-bg/60 p-3">
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Cuéntale a Abi de tu negocio…"
          maxLength={2000}
          aria-label="Mensaje para Abi"
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Enviar"
          disabled={!draft.trim() || busy || (!tsVerified && !!siteKey && !tsToken)}
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  )
}
