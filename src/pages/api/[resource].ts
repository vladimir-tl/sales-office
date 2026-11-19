import type { APIRoute } from 'astro';

/**
 * Stub for data endpoints the backend doesn't implement yet.
 * It never answers in time: the frontend aborts after 10 s and shows the timeout state.
 * Point PUBLIC_DATA_API_URL at the real backend once /sales and /products exist.
 */
const STUB_RESOURCES = new Set(['sales', 'products']);
const HANG_MS = 30_000;

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  if (!STUB_RESOURCES.has(params.resource ?? '')) {
    return new Response('Not found', { status: 404 });
  }

  await new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, HANG_MS);
    request.signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      resolve();
    });
  });

  return new Response(JSON.stringify({ message: 'Not implemented yet' }), {
    status: 504,
    headers: { 'content-type': 'application/json' },
  });
};
