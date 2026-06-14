/**
 * Server-side API base URL.
 *
 * Prefers a server-only `API_URL` (e.g. an internal ALB / service-DNS address on
 * AWS that isn't exposed to the browser), then falls back to the public
 * `NEXT_PUBLIC_API_URL`, then localhost for local dev.
 *
 * This module must only be imported from Server Components / server code — it
 * reads a non-public env var.
 */
export const SERVER_API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:3001'

/**
 * Fetch JSON from the backend on the server. Returns `fallback` on any failure
 * (network error, non-2xx, bad JSON) so a single failing call never crashes the
 * page render.
 *
 * `revalidate` controls Next.js data-cache freshness in seconds (default 60).
 */
export async function fetchJson<T>(
    path: string,
    fallback: T,
    revalidate = 60
): Promise<T> {
    try {
        const res = await fetch(`${SERVER_API_URL}${path}`, {
            next: { revalidate },
        })
        if (!res.ok) return fallback
        return (await res.json()) as T
    } catch {
        return fallback
    }
}
