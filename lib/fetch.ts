import 'server-only'

import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value
  const antiCsrf = cookieStore.get(AUTH_COOKIES.ANTI_CSRF)?.value

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (accessToken) {
    headers['Cookie'] = `${AUTH_COOKIES.ACCESS_TOKEN}=${accessToken}`
  }

  if (antiCsrf) {
    headers['anti-csrf'] = antiCsrf
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new FetchError(response.status, error.message || 'Request failed')
  }

  return response.json()
}

export class FetchError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'FetchError'
  }
}
