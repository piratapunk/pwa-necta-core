'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Boxes, LogOut, Settings } from 'lucide-react'

import { cn } from '@/lib/utils'

/* bloque de identidad estilo bjj: avatar + correo, con menú emergente
   (Mis asistentes / Configuración / Cerrar sesión) */

export function UserMenu({
  email,
  name,
  settingsHref,
}: {
  email: string
  name?: string
  settingsHref?: string
}) {
  const [open, setOpen] = useState(false)
  const initial = (name ?? email ?? '?').trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="relative">
      {open && (
        <>
          <button
            type="button"
            aria-label="Cerrar menú"
            className="fixed inset-0 z-20 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute bottom-full left-0 z-30 mb-2 w-56 animate-pop-in overflow-hidden rounded-xl border bg-surface shadow-xl">
            <p className="truncate border-b px-3.5 py-2.5 text-xs text-text-muted">
              {email || 'tu cuenta'}
            </p>
            <Link
              href="/mis-bots"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text transition-colors hover:bg-surface-raised"
            >
              <Boxes className="size-4 text-text-muted" /> Mis asistentes
            </Link>
            {settingsHref && (
              <Link
                href={settingsHref}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-text transition-colors hover:bg-surface-raised"
              >
                <Settings className="size-4 text-text-muted" /> Configuración
              </Link>
            )}
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 border-t px-3.5 py-2.5 text-sm text-warn transition-colors hover:bg-surface-raised"
              >
                <LogOut className="size-4" /> Cerrar sesión
              </button>
            </form>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-2.5 rounded-xl border bg-surface px-3 py-2.5 text-left transition-colors hover:bg-surface-raised',
          open && 'bg-surface-raised'
        )}
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
          {initial}
        </span>
        <span className="min-w-0">
          {name && <span className="block truncate text-sm font-medium">{name}</span>}
          <span className="block truncate text-xs text-text-muted">{email || 'tu cuenta'}</span>
        </span>
      </button>
    </div>
  )
}
