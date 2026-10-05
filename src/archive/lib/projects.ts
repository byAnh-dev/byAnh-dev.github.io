export interface ProjectData {
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

export const projectsData: Record<string, ProjectData> = {
  'ai-syllabus-extractor': {
    slug: 'ai-syllabus-extractor',
    title: 'AI-powered Syllabus Extractor',
    summary: 'Extracts unstructured course info from PDFs using NLP and regex pipelines.',
    problem: 'Each professor has a different way of writing the syllabus, which makes the structure of the document becomes very random. Manual extraction is time-consuming and error-prone, especially when dealing with various PDF formats and layouts.',
    approach: 'Prototyped multiple parsing paths under strict LLM-token and latency budgets, benchmarked them, and selected a solution optimized for a serverless backend (low cold-start, low cost) with reliable schema extraction.',
    stack: ['Python', 'spaCy', 'Regex', 'Hugging Face', 'LangChain', 'LLMs'],
    result: 'Successfully extracted course information with 90% accuracy across different PDF formats. Reduced manual processing time from minutes to seconds. ',
    media: ['/images/syllabus-extractor-1.png', '/images/syllabus-extractor-2.png'],
    links: {
      github: 'https://github.com/example/syllabus-extractor',
      demo: 'https://syllabus-extractor-demo.vercel.app'
    },
    date: 'May 2025',
    duration: '3 months'
  },
  'fintech-app': {
    slug: 'fintech-app',
    title: 'PanAIcount',
    summary: 'FReMP stack application for accounting and business insight aiming at Small and Medium Enterprises (SMEs)',
    problem: 'Many SME owners don’t have an in-house analyst or accountant. Without expertise to interpret the numbers, decisions default to intuition instead of KPIs like EBITDA, margins, and unit economics—making it hard to see what’s working, what’s leaking, and where to act next.',
    approach: 'PanAIcount acts as a one-stop “business IQ” hub. It cleans and restructures operational data, surfaces the right KPIs (EBITDA, gross margin, CAC/LTV, top cost drivers), and explains changes in simple language so owners can move from instincts to evidence.',
    stack: ['React','TailwindCSS', 'MongoDB','Flask', 'Chart.js', 'JWT'],
    result: '3× faster API responses on core endpoints (3s → 1s) and ~60% reduction in query response times after automated cleansing & reindexing',
    media: ['/images/fintech-app-1.png', '/images/fintech-app-2.png'],
    links: {
      github: 'https://github.com/example/fintech-app',
      live: 'https://fintech-app-demo.vercel.app'
    },
    date: 'December 2024',
    duration: 'On-going'
  }
}


