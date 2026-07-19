'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      aria-label="Regresar"
      onClick={() => router.back()}
      className={cn(
        'flex size-9 items-center justify-center rounded-full border bg-surface text-text-muted transition-colors hover:bg-surface-raised hover:text-text',
        className
      )}
    >
      <ArrowLeft className="size-4" />
    </button>
  )
}
