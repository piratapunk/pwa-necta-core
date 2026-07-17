import { NextRequest, NextResponse } from 'next/server'

import { createAuthClient, getAppOrigin } from '@/lib/auth/server'
import { getSql } from '@/lib/db'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function GET(req: NextRequest) {
  const origin = await getAppOrigin()
  const tokenHash = req.nextUrl.searchParams.get('token_hash')
  const type = req.nextUrl.searchParams.get('type')
  const bs = req.nextUrl.searchParams.get('bs')

  if (!tokenHash || !type || !['magiclink', 'signup', 'recovery'].includes(type)) {
    return NextResponse.redirect(`${origin}/?auth=invalid`)
  }

  const supabase = await createAuthClient()
  const { data, error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as 'magiclink' | 'signup' | 'recovery',
  })

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/?auth=expired`)
  }

  /* claim: liga los bots de la sesión del constructor al usuario recién entrado */
  if (bs && UUID_RE.test(bs)) {
    const sql = getSql()
    if (sql) {
      try {
        await sql`select abi.claim_tenant(${bs}::uuid, ${data.user.id}::uuid)`
      } catch {}
    }
  }

  return NextResponse.redirect(`${origin}/mis-bots`)
}
