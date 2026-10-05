import { servePage } from '@/site/serve-page'

export const dynamic = 'force-static'

export function GET() {
  return servePage('/')
}
