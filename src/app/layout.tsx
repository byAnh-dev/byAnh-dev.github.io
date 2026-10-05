import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anh Hoang — Portfolio',
  description: 'Software, applied AI, and the questions behind the work.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}
