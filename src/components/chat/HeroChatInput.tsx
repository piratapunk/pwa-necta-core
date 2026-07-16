'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { useChat } from '@/components/chat/ChatContext'
import { Button } from '@/components/ui/button'

export function HeroChatInput() {
  const { openChat } = useChat()
  const [value, setValue] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    openChat(value.trim() || undefined)
    setValue('')
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-xl items-center gap-2 rounded-2xl border bg-surface/80 p-2 backdrop-blur-sm transition-shadow focus-within:honey-glow"
    >
      <span className="pl-2 text-lg" aria-hidden>
        🐝
      </span>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cuéntale a Abi a qué se dedica tu negocio…"
        maxLength={2000}
        aria-label="Escríbele a Abi"
        className="h-10 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted/70"
      />
      <Button type="submit" size="default" className="shrink-0">
        <span className="hidden sm:inline">Pregúntale</span>
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
