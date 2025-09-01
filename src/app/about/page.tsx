'use client'

import { motion } from 'framer-motion'
import { Code, Database, Wrench, GraduationCap, Gamepad2, Mountain, Brush, BotMessageSquare } from 'lucide-react'

const skills = {
  frontend: [
    'React', 'Next.js', 'TailwindCSS', 'Svelte', 'Skeleton', 'Figma'
  ],
  backend: [
    'Node.js', 'Flask', 'REST APIs', 'MongoDB'
  ],
  tools: [
    'Git/GitHub', 'Docker', 'AWS: EC2, S3, Lambda, CloudFront', 'GCP'
  ],
  aiml: [
    'Matplotlib', 'Pandas', 'Hugging Face', 'spaCy', 'Named Entity Recognition', 'LLMs'
  ]
}

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

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8  bg-black">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Computer Science student with a passion for backend systems and AI
            </p>
          </motion.div>

          {/* Skills */}
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="text-3xl font-bold text-center">Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Frontend */}
              <motion.div
                variants={itemVariants}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Brush size={24} className="text-pink-500" />
                  <h3 className="text-xl font-semibold">Frontend</h3>
                </div>
                <div className="space-y-2">
                  {skills.frontend.map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Backend */}
              <motion.div
                variants={itemVariants}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Database size={24} className="text-pink-500" />
                  <h3 className="text-xl font-semibold">Backend</h3>
                </div>
                <div className="space-y-2">
                  {skills.backend.map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tools */}
              <motion.div
                variants={itemVariants}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <Wrench size={24} className="text-pink-500" />
                  <h3 className="text-xl font-semibold">Tools & Other</h3>
                </div>
                <div className="space-y-2">
                  {skills.tools.map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>
            
              {/* AI&ML */}
              <motion.div
                variants={itemVariants}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <BotMessageSquare size={24} className="text-pink-500" />
                  <h3 className="text-xl font-semibold">AI & ML</h3>
                </div>
                <div className="space-y-2">
                  {skills.aiml.map((skill) => (
                    <div
                      key={skill}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Interests */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl font-bold text-center">What you'll find me do if I'm not coding</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                variants={itemVariants}
                className="text-center space-y-3"
              >
                <div className="flex justify-center">
                  <Mountain size={48} className="text-white-500" />
                </div>
                <h3 className="text-lg font-semibold">Touching Grass/ Gym</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  I love travel! You'll find me in the gym or some random hike exploring the world
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-center space-y-3"
              >
                <div className="flex justify-center">
                  <GraduationCap size={48} className="text-white-500" />
                </div>
                <h3 className="text-lg font-semibold">Learning</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Exploring new technologies and concepts. I'm trying to teach myself ML and AI!
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-center space-y-3"
              >
                <div className="flex justify-center">
                  <Gamepad2 size={48} className="text-white-500" />
                </div>
                <h3 className="text-lg font-semibold">Gaming</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  League, Valorant, Don't Starve Together, you name it! (I'm lowky a Riot fan)
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4"
          >
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Interested in collaborating on NLP, backend, or fintech projects?
            </p>
            <a
              href="mailto:hpa2309@gmail.com?subject=Portfolio Contact – [Your Name]"
              className="inline-flex items-center gap-2 px-8 py-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-all duration-200 font-medium"
            >
              Let's Connect
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
