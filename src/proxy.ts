import { NextRequest, NextResponse } from 'next/server'

const SLUG_RE = /^[a-z][a-z0-9-]{2,29}$/

/*
 * Routing multi-tenant estilo Netlify: <slug>.nectacore.com sirve el bot del
 * tenant reescribiendo internamente a /t/<slug>. El dominio raíz (y www) sigue
 * sirviendo el sitio normal.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    /\.[\w]+$/.test(pathname)
  ) {
    return NextResponse.next()
  }

  const host = (request.headers.get('host') ?? '').split(':')[0].toLowerCase()
  const m = /^([a-z0-9-]+)\.nectacore\.com$/.exec(host)
  if (m && m[1] !== 'www' && SLUG_RE.test(m[1])) {
    const url = request.nextUrl.clone()
    url.pathname = `/t/${m[1]}${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
