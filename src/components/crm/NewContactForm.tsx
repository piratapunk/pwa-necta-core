'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewContactForm({ slug }: { slug: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [error, setError] = useState('')

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    const res = await fetch('/api/panel/crm/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, patch: form }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      setError(data?.error ?? 'No se pudo crear.')
      setStatus('error')
      return
    }
    setForm({ name: '', phone: '', email: '' })
    setOpen(false)
    setStatus('idle')
    router.refresh()
  }

  if (!open) {
    return (
      <Button size="sm" variant="secondary" onClick={() => setOpen(true)}>
        <Plus className="size-4" /> Agregar cliente
      </Button>
    )
  }

  return (
    <form onSubmit={save} className="flex flex-wrap items-end gap-2 rounded-xl border bg-surface p-3">
      <Input
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        placeholder="Nombre"
        className="w-40"
        maxLength={160}
      />
      <Input
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        placeholder="Teléfono"
        className="w-36"
        maxLength={30}
        inputMode="tel"
      />
      <Input
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        placeholder="Email"
        className="w-48"
        maxLength={200}
        type="email"
      />
      <Button type="submit" size="sm" disabled={status === 'saving'}>
        {status === 'saving' ? 'Creando…' : 'Crear'}
      </Button>
      <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      {status === 'error' && <span className="text-xs text-warn">{error}</span>}
    </form>
  )
}
