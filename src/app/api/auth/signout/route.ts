import { NextRequest, NextResponse } from 'next/server'

import { createAuthClient, getAppOrigin } from '@/lib/auth/server'
import { hasAllowedOrigin } from '@/lib/security'

export async function POST(req: NextRequest) {
  if (!hasAllowedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }
  const supabase = await createAuthClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(`${await getAppOrigin()}/`, { status: 303 })
}
