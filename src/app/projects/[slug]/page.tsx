import { notFound } from 'next/navigation'
import ProjectPageClient from './ProjectPageClient'

interface ProjectData {
  slug: string
  title: string
  summary: string
  problem: string
  approach: string
  stack: string[]
  result: string
  media: string[]
  links: {
    github?: string
    live?: string
    demo?: string
  }
  date: string
  duration: string
}

const projectsData: Record<string, ProjectData> = {
  'ai-syllabus-extractor': {
    slug: 'ai-syllabus-extractor',
    title: 'AI-powered Syllabus Extractor',
    summary: 'Extracts unstructured course info from PDFs using NLP and regex pipelines.',
    problem: 'Any professor at any different university has a different way of writing the syllabus, which makes the structure of the document becomes very random. Manual extraction is time-consuming and error-prone, especially when dealing with various PDF formats and layouts.',
    approach: 'Explored different approaches with different resource constraints with respect to LLM usage (tokens) and efficiency. After some benchmark experiments, I came into conclusion with one solution that works best for serverless backend system (low cold start time and cheap usage).',
    stack: ['Python', 'spaCy', 'Regex', 'PDF Processing', 'Flask'],
    result: 'Successfully extracted course information with 95% accuracy across different PDF formats. Reduced manual processing time from minutes to seconds. ',
    media: ['/images/syllabus-extractor-1.jpg', '/images/syllabus-extractor-2.jpg'],
    links: {
      github: 'https://github.com/example/syllabus-extractor',
      demo: 'https://syllabus-extractor-demo.vercel.app'
    },
    date: 'July 2024',
    duration: '1 months'
  },
  'fintech-app': {
    slug: 'fintech-app',
    title: 'Full Stack Fin-Tech Application',
    summary: 'MERN app for tracking expenses, bank integration, and financial reporting.',
    problem: 'Individuals and small businesses need a comprehensive financial management solution that can integrate with multiple bank accounts, categorize transactions, and provide actionable insights through intuitive visualizations.',
    approach: 'Built a full-stack MERN application with real-time bank integration using Plaid API. Implemented secure authentication, transaction categorization using machine learning, and interactive dashboards with Chart.js.',
    stack: ['React', 'Node.js', 'MongoDB', 'Express', 'Plaid API', 'Chart.js', 'JWT'],
    result: 'Launched MVP with 500+ active users. Achieved 99.9% uptime and processed over $2M in transactions. Users reported 40% improvement in financial awareness.',
    media: ['/images/fintech-app-1.jpg', '/images/fintech-app-2.jpg'],
    links: {
      github: 'https://github.com/example/fintech-app',
      live: 'https://fintech-app-demo.vercel.app'
    },
    date: 'January 2024',
    duration: '6 months'
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = projectsData[slug]

  if (!project) {
    notFound()
  }

  return <ProjectPageClient project={project} />
}

export async function generateStaticParams() {
  return Object.keys(projectsData).map((slug) => ({
    slug: slug,
  }))
}
