import 'server-only'

import { cookies } from 'next/headers'

import { AUTH_COOKIES } from '@/modules/auth/constants'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const DEFAULT_TIMEOUT_MS = 15000

interface FetchOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
  timeoutMs?: number
}

export async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const cookieStore = await cookies()
  const idToken = cookieStore.get(AUTH_COOKIES.ID_TOKEN)?.value

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`
  }

  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  )

  let response: Response

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new FetchError(408, 'La solicitud tardó demasiado en responder')
    }

    throw error
  } finally {
    clearTimeout(timeout)
  }

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
