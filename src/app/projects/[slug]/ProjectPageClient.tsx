'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github, Calendar, Code, Target, Award } from 'lucide-react'

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

interface ProjectPageClientProps {
  project: ProjectData
}

export default function ProjectPageClient({ project }: ProjectPageClientProps) {
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

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-pink-500 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">{project.summary}</p>
            
            {/* Project Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                {project.date}
              </div>
              <div className="flex items-center gap-2">
                <Code size={16} />
                {project.duration}
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4">
              {project.links.github && (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                >
                  <Github size={16} />
                  View Code Is Not Available Due to NDA
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                >
                  <ExternalLink size={16} />
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>

          {/* Problem */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Target size={24} className="text-pink-500" />
              Problem
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.problem}</p>
          </motion.section>

          {/* Approach */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Code size={24} className="text-pink-500" />
              Approach
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.approach}</p>
          </motion.section>

          {/* Tech Stack */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.section>

          {/* Result */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Award size={24} className="text-pink-500" />
              Result
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{project.result}</p>
          </motion.section>

          {/* Media */}
          {project.media.length > 0 && (
            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="text-2xl font-bold">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.media.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-medium"
                  >
                    Screenshot {index + 1}
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </motion.div>
      </div>
    </div>
  )
}
