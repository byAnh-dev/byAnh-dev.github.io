import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return <footer className="site-footer">
    <Link href="/archive/" className="footer-name">Anh Hoang <span className="pixel-period" /></Link>
    <p>Always a work in progress.</p>
    <div className="footer-links">
      <a href="https://github.com/byAnh-dev" target="_blank" rel="noopener noreferrer">GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
      <a href="https://www.linkedin.com/in/anh-hoang-ku/" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} aria-hidden="true" /></a>
      <a href="mailto:hpa2309@gmail.com">Email <ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
  </footer>
}

