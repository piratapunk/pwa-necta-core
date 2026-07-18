'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { STAGES, type CrmContact } from '@/lib/crm'

export function ContactEditor({ slug, contact }: { slug: string; contact: CrmContact }) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: contact.name ?? '',
    phone: contact.phone ?? '',
    email: contact.email ?? '',
    company: contact.company ?? '',
    stage: contact.stage,
    tags: contact.tags.join(', '),
    notes: contact.notes ?? '',
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setStatus('idle')
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('saving')
    setError('')
    const res = await fetch('/api/panel/crm/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        id: contact.id,
        patch: {
          name: form.name,
          phone: form.phone,
          email: form.email,
          company: form.company,
          stage: form.stage,
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
          notes: form.notes,
        },
      }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      setError(data?.error ?? 'No se pudo guardar. Inténtalo de nuevo.')
      setStatus('error')
      return
    }
    setStatus('saved')
    router.refresh()
  }

  const field = 'flex h-10 w-full rounded-lg border bg-surface px-3.5 py-2 text-sm text-text outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30'

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-xs text-text-muted">
          Nombre
          <Input value={form.name} onChange={set('name')} className="mt-1" maxLength={160} />
        </label>
        <label className="block text-xs text-text-muted">
          Empresa
          <Input value={form.company} onChange={set('company')} className="mt-1" maxLength={160} />
        </label>
        <label className="block text-xs text-text-muted">
          Teléfono
          <Input value={form.phone} onChange={set('phone')} className="mt-1" maxLength={30} inputMode="tel" />
        </label>
        <label className="block text-xs text-text-muted">
          Email
          <Input value={form.email} onChange={set('email')} className="mt-1" maxLength={200} type="email" />
        </label>
        <label className="block text-xs text-text-muted">
          Etapa
          <select value={form.stage} onChange={set('stage')} className={`${field} mt-1`}>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-text-muted">
          Etiquetas (separadas por coma)
          <Input value={form.tags} onChange={set('tags')} className="mt-1" placeholder="mayorista, urgente" />
        </label>
      </div>
      <label className="block text-xs text-text-muted">
        Notas
        <textarea
          value={form.notes}
          onChange={set('notes')}
          maxLength={4000}
          rows={4}
          className={`${field} mt-1 h-auto resize-y`}
        />
      </label>
      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={status === 'saving'}>
          {status === 'saving' ? 'Guardando…' : 'Guardar cambios'}
        </Button>
        {status === 'saved' && <span className="text-xs text-success">Guardado ✓</span>}
        {status === 'error' && <span className="text-xs text-warn">{error}</span>}
      </div>
    </form>
  )
}
