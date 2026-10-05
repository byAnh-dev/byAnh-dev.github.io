import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const dynamic = 'force-static'

// Use the SDK from package-lock.json, including on the non-React HTML pages.
export async function GET() {
  const sdk = await readFile(path.join(process.cwd(), 'node_modules/posthog-js/dist/array.js'), 'utf8')
  return new Response(sdk.replace(/\/\/# sourceMappingURL=.*$/m, ''), {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  })
}
