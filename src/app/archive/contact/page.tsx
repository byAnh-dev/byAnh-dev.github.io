import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = { title: 'Contact · Anh Hoang' }
const links = [
  ['Email', 'hpa2309@gmail.com', 'mailto:hpa2309@gmail.com'],
  ['GitHub', 'byAnh-dev', 'https://github.com/byAnh-dev'],
  ['LinkedIn', 'Anh Hoang', 'https://www.linkedin.com/in/anh-hoang-ku/'],
  ['LeetCode', 'hpa2309', 'https://leetcode.com/u/hpa2309/'],
]

export default function ContactPage() {
  return <>
    <section className="section-pad page-intro contact-page-intro"><span className="eyebrow">Start a conversation / 03</span><h1>LET'S<br />CONNECT<span className="title-period">.</span></h1><p>Have a project, an opportunity, or a question?<br />I'd like to hear about it.</p></section>
    <section className="section-pad contact-channels" aria-label="Contact channels">{links.map(([name, label, href]) => <a className="contact-channel" href={href} key={name} {...(href.startsWith('https:') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}><span className="eyebrow">{name}</span><span>{label}</span><ArrowUpRight aria-hidden="true" /></a>)}</section>
    <section className="section-pad editorial-row"><h2>What I'm<br />looking for.</h2><div className="prose"><p>Internships and full-time opportunities in software engineering, particularly AI and backend development.</p><p>I'm also open to collaborating on NLP, backend, and fintech projects. Tell me what you're working on and where I might help.</p><p className="eyebrow">I typically reply within 24 hours on weekdays.</p></div></section>
  </>
}

