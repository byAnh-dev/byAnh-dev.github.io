import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { projectsData } from '@/archive/lib/projects'

export default function ProjectList() {
  return <div className="project-grid">{Object.values(projectsData).map((project, index) => (
    <Link href={`/archive/projects/${project.slug}/`} key={project.slug} className={`project-card project-${index}`}>
      <div className="project-image">
        <div className="project-image-top"><span>0{index + 1} / {index === 0 ? 'Applied AI' : 'Full-stack development'}</span><ArrowUpRight aria-hidden="true" size={22} /></div>
        <Image src={project.media[0]} alt={`${project.title} application preview`} width={1440} height={810} sizes="(max-width: 700px) 100vw, 50vw" />
      </div>
      <div className="project-description"><h3>{project.title}</h3><ArrowUpRight size={25} aria-hidden="true" /></div>
      <p>{index === 0 ? 'Turning unstructured syllabi into useful course data.' : 'Accounting and business insights for small and medium businesses.'}</p>
      <div className="project-meta eyebrow"><span>{index === 0 ? 'Python / NLP / LLMs' : 'React / Flask / MongoDB'}</span><span>{project.date}</span></div>
    </Link>
  ))}</div>
}

