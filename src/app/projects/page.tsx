'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'

interface Project {
  slug: string
  title: string
  summary: string
  image: string
  tags: string[]
  githubUrl?: string
  liveUrl?: string
}

const projects: Project[] = [
  {
    slug: 'ai-syllabus-extractor',
    title: 'AI-powered Syllabus Extractor',
    summary: 'Extracts structured course info from PDFs using NLP and regex pipelines.',
    image: '/images/syllabus-extractor.jpg',
    tags: ['Python', 'NLP', 'spaCy', 'Regex', 'PDF Processing'],
    githubUrl: 'https://github.com/example/syllabus-extractor',
  },
  {
    slug: 'fintech-app',
    title: 'Full Stack Fin-Tech Application',
    summary: 'MERN app for tracking expenses, bank integration, and financial reporting.',
    image: '/images/fintech-app.jpg',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'Financial APIs'],
    githubUrl: 'https://github.com/example/fintech-app',
    liveUrl: 'https://fintech-app-demo.vercel.app',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const
    }
  }
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Projects
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of projects where backend systems meet AI, especially natural language processing.
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.slug}
              variants={itemVariants}
              className="group"
            >
              <Link href={`/projects/${project.slug}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
                  {/* Project Image */}
                  <div className="aspect-video bg-gradient-to-br from-pink-500 to-purple-600 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                      {project.title.split(' ')[0]}
                    </div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-pink-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {project.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full text-gray-600 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-pink-500 font-medium">
                        View Case Study
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                            aria-label="View on GitHub"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                            aria-label="View live demo"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Interested in collaborating or have a project in mind?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 font-medium"
          >
            Let's Connect
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
