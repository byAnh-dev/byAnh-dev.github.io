import { notFound } from 'next/navigation'
import { projectsData } from '@/archive/lib/projects'
import ProjectPageClient from './ProjectPageClient'

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectsData[slug]
  if (!project) notFound()
  return <ProjectPageClient project={project} />
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return { title: projectsData[slug] ? `${projectsData[slug].title} · Anh Hoang` : 'Project not found · Anh Hoang' }
}

export function generateStaticParams() {
  return Object.keys(projectsData).map(slug => ({ slug }))
}

