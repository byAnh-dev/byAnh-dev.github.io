import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Anh Hoang — Portfolio',
  description: 'Software, applied AI, and the questions behind the work.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}{process.env.VERCEL_ENV === 'production' && <SpeedInsights />}</body></html>
}
