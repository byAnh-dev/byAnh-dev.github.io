'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function Thoughts() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
    <div className="min-h-screen bg-black text-white">


             {/* Main Content */}
       <div className="pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-pink-500/20 rounded-full">
                  <MessageSquare size={48} className="text-pink-500" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                Thoughts?
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                Have something on your mind? Feel free to share your thoughts, feedback, or just say hello.
              </p>
            </motion.div>

            {/* Placeholder Content */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-semibold text-white/90">
                    Coming Soon
                  </h2>
                  <p className="text-white/70 max-w-md mx-auto">
                    This feature is currently under development. Soon you'll be able to leave messages, feedback, or just share your thoughts with me.
                  </p>
                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/20 border border-pink-500/30 rounded-lg text-pink-400 text-sm">
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                      In Development
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternative Contact */}
              <motion.div variants={itemVariants} className="text-center space-y-4">
                <p className="text-white/60">
                  In the meantime, feel free to reach out through other channels:
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-all duration-300 font-medium"
                  >
                    Contact Page
                  </Link>
                  <a
                    href="mailto:hpa2309@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300 font-medium"
                  >
                    Email Me
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
