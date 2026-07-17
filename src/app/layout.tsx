import type { Metadata, Viewport } from 'next'
import { Baloo_2, Inter } from 'next/font/google'
import Script from 'next/script'

import './globals.css'

const display = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
})

const body = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nectacore.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'NectaCore — La fábrica de asistentes para tu negocio',
    template: '%s · NectaCore',
  },
  description:
    'Arma tu asistente con Abi en minutos: contesta WhatsApp y redes, agenda citas, hace campañas y registra todo en tu CRM. Gratis para armar y probar.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.svg',
    apple: '/brand/nectacore-mark.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: siteUrl,
    siteName: 'NectaCore',
    title: 'NectaCore — La fábrica de asistentes para tu negocio',
    description:
      'Armas tu asistente en minutos. Trabaja para siempre: WhatsApp, redes, teléfono, campañas y CRM.',
  },
}

export const viewport: Viewport = {
  themeColor: '#171310',
  width: 'device-width',
  initialScale: 1,
}

const themeBootstrap = `try{var t=localStorage.getItem('necta-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light')}catch(e){}`

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} font-sans`}>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {themeBootstrap}
        </Script>
        {children}
      </body>
    </html>
  )
}
