import Link from 'next/link'

import { NectaWordmark } from '@/components/brand/NectaMark'

/* shell de app (sin navbar/footer de la landing): aquí el dueño ya está en casa */
export default function MisBotsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b bg-surface/60 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/mis-bots">
            <NectaWordmark />
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
