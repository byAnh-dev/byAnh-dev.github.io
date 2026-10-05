import { servePage, sitePaths } from '@/site/serve-page'

export const dynamic = 'force-static'
export const dynamicParams = false
export const generateStaticParams = sitePaths

export async function GET(_request: Request, context: { params: Promise<{ sitePath: string[] }> }) {
  const { sitePath } = await context.params
  return servePage(`/${sitePath.join('/')}/`)
}
