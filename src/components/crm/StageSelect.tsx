'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { STAGES } from '@/lib/crm'
import { cn } from '@/lib/utils'

export function StageSelect({
  slug,
  contactId,
  stage,
  className,
}: {
  slug: string
  contactId: string
  stage: string
  className?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(stage)
  const [pending, startTransition] = useTransition()

  const change = async (next: string) => {
    const prev = value
    setValue(next)
    const res = await fetch('/api/panel/crm/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, id: contactId, patch: { stage: next } }),
    })
    if (!res.ok) {
      setValue(prev)
      return
    }
    startTransition(() => router.refresh())
  }

  return (
    <select
      value={value}
      disabled={pending}
      onChange={(e) => void change(e.target.value)}
      aria-label="Etapa del cliente"
      className={cn(
        'h-8 rounded-lg border bg-surface px-2 text-xs text-text outline-none transition-colors focus-visible:border-accent disabled:opacity-50',
        className
      )}
    >
      {STAGES.map((s) => (
        <option key={s.key} value={s.key}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
