'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, X, Expand } from 'lucide-react'
import type { ProjectData } from '@/archive/lib/projects'
import ContactInvite from '@/archive/components/ContactInvite'

export default function ProjectPageClient({ project }: { project: ProjectData }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [selectedImage, setSelectedImage] = useState(project.media[0])

  return <>
    <section className="section-pad case-intro">
      <Link className="text-link small-link" href="/archive/projects"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>
      <h1>{project.title}</h1><p className="case-summary">{project.summary}</p>
      <div className="case-meta eyebrow"><span>{project.date}</span><span>{project.duration}</span><span>Source code private / NDA</span></div>
    </section>
    <div className="section-pad case-study">
      {[['01', 'The problem', project.problem], ['02', 'The approach', project.approach], ['03', 'The result', project.result]].map(([number, title, body]) => <section className="case-row" key={number}><div><span className="eyebrow">{number}</span><h2>{title}</h2></div><p>{body}</p></section>)}
      <section className="case-row"><div><span className="eyebrow">04</span><h2>The toolkit</h2></div><ul className="tech-list">{project.stack.map(tech => <li key={tech}>{tech}</li>)}</ul></section>
      <section className="case-gallery"><div className="section-topline"><h2>In practice.</h2><span className="eyebrow">Select to expand</span></div><div className="gallery-grid">{project.media.map((image, index) => <button className="gallery-button" type="button" key={image} aria-label={`Expand ${project.title} screenshot ${index + 1}`} onClick={() => { setSelectedImage(image); dialog.current?.showModal() }}><Image src={image} alt={`${project.title} screenshot ${index + 1}`} width={1440} height={810} sizes="(max-width: 700px) 100vw, 50vw" /><Expand className="expand-icon" size={20} aria-hidden="true" /></button>)}</div></section>
      <Link className="text-link" href={`/archive/projects/${project.slug === 'fintech-app' ? 'ai-syllabus-extractor' : 'fintech-app'}`}>Next project <ArrowUpRight size={18} aria-hidden="true" /></Link>
    </div>
    <dialog ref={dialog} className="image-dialog" aria-label={`${project.title} expanded screenshot`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}><button type="button" className="dialog-close" onClick={() => dialog.current?.close()} aria-label="Close screenshot" autoFocus><X size={24} /></button><Image src={selectedImage} alt={`${project.title} expanded screenshot`} width={1920} height={1080} sizes="95vw" /></dialog>
    <ContactInvite />
  </>
}

