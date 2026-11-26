// Types mirror contracts/openapi.yaml
export interface Sale {
  id: string
  date: string
  customer: string
  product: string
  quantity: number
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'cancelled'
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  currency: string
  stock: number
  active: boolean
}

export const REQUEST_TIMEOUT_MS = 10_000

export type ApiErrorKind = 'timeout' | 'unauthorized' | 'http' | 'network' | 'invalid'

export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    message: string,
    readonly status?: number,
  ) {
    super(message)
  }
}

export async function apiGet<T>(
  url: string,
  token: string,
  timeoutMs = REQUEST_TIMEOUT_MS,
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
  } catch (err) {
    if (controller.signal.aborted) {
      throw new ApiError('timeout', `The server didn't respond within ${timeoutMs / 1000} seconds.`)
    }
    throw new ApiError('network', "Couldn't reach the server. Check your internet connection.")
  } finally {
    clearTimeout(timer)
  }

  if (res.status === 401 || res.status === 403) {
    throw new ApiError('unauthorized', 'Your session has expired. Please log in again.', res.status)
  }
  if (!res.ok) {
    throw new ApiError(
      'http',
      `Something went wrong on our side (${res.status}). Please try again later.`,
      res.status,
    )
  }

  try {
    return (await res.json()) as T
  } catch {
    throw new ApiError('invalid', 'The server sent an unexpected response.', res.status)
  }
}

/** Table column description used by ResourceView */
export type ColumnFormat = 'text' | 'number' | 'money' | 'date' | 'status' | 'boolean'
export interface Column {
  key: string
  label: string
  format?: ColumnFormat
}
