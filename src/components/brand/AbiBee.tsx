import { cn } from '@/lib/utils'

/* Abi, la abejita — SVG determinista coloreado por tokens */
export function AbiBee({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 110" aria-hidden="true" className={cn('size-16', className)}>
      {/* alas */}
      <ellipse cx="45" cy="32" rx="16" ry="22" fill="var(--text)" opacity="0.18" transform="rotate(-24 45 32)" />
      <ellipse cx="76" cy="30" rx="14" ry="19" fill="var(--text)" opacity="0.12" transform="rotate(18 76 30)" />
      {/* antenas */}
      <path d="M50 26 Q46 14 38 10" fill="none" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
      <path d="M64 24 Q66 12 74 8" fill="none" stroke="var(--text)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="37" cy="9" r="3.5" fill="var(--accent)" />
      <circle cx="75" cy="7" r="3.5" fill="var(--accent)" />
      {/* cuerpo */}
      <ellipse cx="60" cy="62" rx="38" ry="32" fill="var(--accent)" />
      {/* rayas */}
      <path d="M44 32.5 Q38 48 40 76 L52 88 Q46 60 50 30 Z" fill="var(--bg)" opacity="0.85" />
      <path d="M70 30 Q66 58 72 88 L84 78 Q80 52 82 40 Z" fill="var(--bg)" opacity="0.85" />
      {/* carita */}
      <circle cx="57" cy="56" r="4" fill="var(--bg)" />
      <circle cx="73" cy="56" r="4" fill="var(--bg)" />
      <path d="M58 68 Q65 75 72 68" fill="none" stroke="var(--bg)" strokeWidth="3.5" strokeLinecap="round" />
      {/* aguijón amable */}
      <path d="M96 66 L106 62 L98 74 Z" fill="var(--text)" opacity="0.6" />
    </svg>
  )
}
