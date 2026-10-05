import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import ContactInvite from '@/archive/components/ContactInvite'

export const metadata: Metadata = { title: 'About · Anh Hoang' }
const skills = [
  ['Frontend', 'React', 'Next.js', 'Tailwind CSS', 'Svelte', 'Skeleton', 'Figma'],
  ['Backend', 'Node.js', 'Flask', 'REST APIs', 'MongoDB'],
  ['AI & machine learning', 'Python', 'Pandas', 'Matplotlib', 'Hugging Face', 'spaCy', 'Named entity recognition', 'LLMs'],
  ['Tools & infrastructure', 'Git / GitHub', 'Docker', 'AWS: EC2, S3, Lambda, CloudFront', 'GCP'],
]

export default function AboutPage() {
  return <>
    <section className="section-pad page-intro"><span className="eyebrow">The person / 02</span><h1>ALWAYS<br />CURIOUS.</h1><p>I'm Anh, a Computer Science student interested in backend systems, AI, and how things work.</p></section>
    <section className="section-pad editorial-row"><h2>A little context.</h2><div className="prose"><p>I like finding clean solutions for messy problems. My work spans extracting course information from unstructured PDFs and building tools that help business owners understand their numbers.</p><p>I'm especially interested in natural language processing and the decisions behind useful software: which approach fits the constraints, what to measure, and what can be simpler.</p><a className="text-link" href="/resume.pdf" target="_blank" rel="noopener noreferrer">Read my résumé <ArrowUpRight size={18} aria-hidden="true" /></a></div></section>
    <section className="section-pad skills-section"><div className="section-topline"><h2 className="eyebrow">My toolkit</h2><span className="eyebrow">Always learning</span></div><div className="skills-grid">{skills.map(([title, ...items], i) => <article key={title}><span className="eyebrow">0{i + 1}</span><h3>{title}</h3><ul>{items.map(skill => <li key={skill}>{skill}</li>)}</ul></article>)}</div></section>
    <section className="section-pad editorial-row"><h2>Outside<br />the editor.</h2><div className="prose"><p>Hiking somewhere new, traveling, or spending some time in the gym. I like having a reason to step away from the screen.</p><p>Then there are games. League of Legends, Valorant, and Don't Starve Together are regulars. The mechanics and strategy are part of the appeal.</p></div></section>
    <ContactInvite />
  </>
}

