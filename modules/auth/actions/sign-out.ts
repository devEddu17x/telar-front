'use server'

import { redirect } from 'next/navigation'

import { clearSession } from '../lib/dal'

export async function signOut(): Promise<void> {
  await clearSession()
  redirect('/sign-in')
}
