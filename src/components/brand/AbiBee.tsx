import { cn } from '@/lib/utils'

/*
 * Mascota Abi = el emoji nativo 🐝. Se ve como el emoji de Apple en dispositivos
 * Apple (público objetivo). El tamaño se controla con clases de texto (text-6xl…).
 */
export function AbiBee({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Abi la abejita"
      className={cn('inline-block select-none leading-none', className)}
    >
      🐝
    </span>
  )
}
