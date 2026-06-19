const API_URL = process.env.NEXT_PUBLIC_API_URL

interface ApiRequestOptions extends Omit<RequestInit, 'body' | 'headers'> {
  body?: unknown
  headers?: Record<string, string>
  token?: string | null
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function parseResponseBody(response: Response) {
  const text = await response.text()

  if (!text) return null

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getErrorMessage(body: unknown, fallback: string) {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message

    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
  }

  return fallback
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new ApiError(0, 'NEXT_PUBLIC_API_URL no está configurada', null)
  }

  const headers: Record<string, string> = {
    ...options.headers
  }

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData || typeof options.body === 'string'
        ? options.body
        : options.body !== undefined
          ? JSON.stringify(options.body)
          : undefined
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(
      response.status,
      getErrorMessage(body, `Request failed with status ${response.status}`),
      body
    )
  }

  return body as T
}
