import { readFile } from 'node:fs/promises'
import path from 'node:path'
import routes from './routes.json'

type SiteRoute = { file: string } | { redirect: string }
const siteRoutes: Record<string, SiteRoute> = routes

// Serve the original document so its deferred scripts and progressive
// enhancements run once, without React hydration changing the canvas DOM.
export async function servePage(pathname: string) {
  const route = siteRoutes[pathname]
  if (!route) return new Response('Page not found', { status: 404 })
  if ('redirect' in route) {
    return new Response(null, { status: 308, headers: { Location: route.redirect } })
  }
  const html = await readFile(path.join(process.cwd(), 'public', 'site', route.file), 'utf8')
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })
}

export function sitePaths() {
  return Object.keys(siteRoutes).filter(pathname => pathname !== '/')
    .map(pathname => ({ sitePath: pathname.split('/').filter(Boolean) }))
}
