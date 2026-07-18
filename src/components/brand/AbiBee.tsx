import Image from 'next/image'

import { cn } from '@/lib/utils'

/*
 * Mascota Abi = el emoji de abeja de Apple, servido como PNG desde nuestro
 * dominio → IDÉNTICO en todo dispositivo (no depende del emoji del sistema).
 * El tamaño se controla con clases de texto (text-6xl…): la imagen mide 1em,
 * así que hereda el font-size — los usos existentes siguen igual.
 */
export function AbiBee({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/abi-bee.png"
      alt="Abi la abejita"
      width={160}
      height={160}
      priority
      className={cn('inline-block size-[1em] select-none align-middle', className)}
    />
  )
}
