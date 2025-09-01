import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import NavigationBar from '@/components/NavigationBar'

import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700', '800'], // include bold/extrabold
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Anh Hoang - Portfolio',
  description: 'Less noise. More signal. Better software. Finding clean solutions for messy problems.',
  keywords: ['Anh Hoang', 'Portfolio', 'Software Engineer', 'Backend', 'AI', 'NLP'],
  authors: [{ name: 'Anh Hoang' }],
  creator: 'Anh Hoang',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://anh-hoang-portfolio.vercel.app',
    title: 'Anh Hoang - Portfolio',
    description: 'Less noise. More signal. Better software. Finding clean solutions for messy problems.',
    siteName: 'Anh Hoang Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anh Hoang - Portfolio',
    description: 'Less noise. More signal. Better software. Finding clean solutions for messy problems.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={jetbrains.className}>
        <div className="min-h-screen flex flex-col">
          {/* Global Navigation Bar */}
          <NavigationBar />
          
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
