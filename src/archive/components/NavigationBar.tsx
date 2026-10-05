'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

export default function NavigationBar() {
  const pathname = usePathname()
  return <header className="site-header">
    <Link href="/archive/" className="wordmark" aria-label="Anh Hoang home">ah<span className="pixel-period" /></Link>
    <nav aria-label="Main navigation">
      {[['/archive/projects', 'Work'], ['/archive/about', 'About'], ['/archive/contact', 'Contact']].map(([href, label]) => <Link key={href} href={href} aria-current={pathname.startsWith(href) ? 'page' : undefined}>{label}</Link>)}
      <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="resume-link">Résumé <ArrowUpRight size={14} aria-hidden="true" /></a>
    </nav>
  </header>
}

