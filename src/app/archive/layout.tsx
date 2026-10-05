import type { Metadata } from 'next'
import './globals.css'
import Footer from '@/archive/components/Footer'
import NavigationBar from '@/archive/components/NavigationBar'


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
    index: false,
    follow: false,
  },
}

export default function ArchiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
        {/* The main site is an HTML route: use a document navigation, not the React router. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <aside className="archive-notice" aria-label="Archived website">You’re viewing the previous website. <a href="/">Visit the current portfolio ↗</a></aside>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="min-h-screen flex flex-col">
          {/* Global Navigation Bar */}
          <NavigationBar />
          
          <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
          <Footer />
        </div>
    </>
  )
}
