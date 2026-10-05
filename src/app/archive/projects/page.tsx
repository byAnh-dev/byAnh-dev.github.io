import type { Metadata } from 'next'
import ProjectList from '@/archive/components/ProjectList'
import ContactInvite from '@/archive/components/ContactInvite'

export const metadata: Metadata = { title: 'Selected work · Anh Hoang' }

export default function ProjectsPage() {
  return <><section className="section-pad page-intro"><span className="eyebrow">The portfolio / 01</span><h1>SELECTED<br />WORK.</h1><p>Backend systems, applied AI, and the work of turning an idea into something useful.</p></section><section className="section-pad project-collection" aria-labelledby="projects-heading"><h2 id="projects-heading" className="eyebrow collection-label">Projects / 2024–2025</h2><ProjectList /></section><ContactInvite /></>
}

