'use client'

import { motion } from 'framer-motion'
import { Mail, Github, Linkedin, Code } from 'lucide-react'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: Github,
    description: 'Check out my code and projects'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: Linkedin,
    description: 'Connect with me professionally'
  },
  {
    name: 'LeetCode',
    url: 'https://leetcode.com',
    icon: Code,
    description: 'See my problem-solving skills'
  }
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

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
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
              Get In Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Interested in collaborating on NLP, backend, or fintech projects? Let's connect and build something amazing together.
            </p>
          </motion.div>

          {/* Email Section */}
          <motion.section variants={itemVariants} className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-6 bg-pink-500 rounded-full">
                <Mail size={48} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Email Me</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The best way to reach me is through email
              </p>
              <a
                href="mailto:hpa2309@gmail.com?subject=Portfolio Contact – [Your Name]"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-100 transition-all duration-200 font-medium text-lg"
              >
                <Mail size={20} />
                hpa2309@gmail.com
              </a>
            </div>
          </motion.section>

          {/* Social Links */}
          <motion.section variants={itemVariants} className="space-y-8">
            <h2 className="text-2xl font-bold text-center">Find Me Online</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-pink-100 dark:group-hover:bg-pink-900 transition-colors">
                      <social.icon size={24} className="text-pink-500" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-pink-500 transition-colors">
                    {social.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {social.description}
                  </p>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* Additional Info */}
          <motion.section variants={itemVariants} className="text-center space-y-6">
            <h2 className="text-2xl font-bold">What I'm Looking For</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-pink-500">Collaboration</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Open to collaborating on interesting projects, especially in NLP, backend systems, and fintech.
                </p>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h3 className="text-lg font-semibold mb-2 text-pink-500">Opportunities</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Seeking internships and full-time opportunities in software engineering, with a focus on AI and backend development.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Response Time */}
          <motion.div
            variants={itemVariants}
            className="text-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-xl"
          >
            <p className="text-gray-600 dark:text-gray-300">
              <strong>Response Time:</strong> I typically respond within 24 hours during weekdays.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
