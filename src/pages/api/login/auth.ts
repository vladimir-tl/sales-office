import type { APIRoute } from 'astro'

/**
 * Same-origin proxy for login: the browser calls POST /api/login/auth
 * (so DevTools shows "auth"), the Worker forwards it to the backend's /login/student.
 */
const BACKEND = (import.meta.env.PUBLIC_API_URL || 'https://backend.tallinn-learning.ee').replace(
  /\/$/,
  '',
)
const UPSTREAM = `${BACKEND}/login/student`

export const prerender = false

export const POST: APIRoute = async ({ request }) => {
  let upstream: Response
  try {
    upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('content-type') ?? 'application/json',
        Accept: request.headers.get('accept') ?? '*/*',
      },
      body: await request.text(),
    })
  } catch {
    return new Response(JSON.stringify({ message: 'Login service is unreachable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const headers = new Headers({ 'Cache-Control': 'no-store' })
  const type = upstream.headers.get('content-type')
  if (type) headers.set('Content-Type', type)
  return new Response(await upstream.text(), { status: upstream.status, headers })
}
