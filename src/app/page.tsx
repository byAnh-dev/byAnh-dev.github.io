'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Mail } from 'lucide-react'
import EventBadge from '@/components/EventBadge'

export default function Home() {
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  return (
    <div className="min-h-screen bg-black  relative overflow-hidden">


      {/* Main Content */}
      <div className="flex min-h-screen content-center">
        {/* Left Side - Information */}
        <div className="w-full lg:w-1/3 flex items-center justify-center p-8 lg:p-20 lg:ml-40 relative z-10" >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent z-10"></div>
          
          {/* Content */}
          <div className="relative z-20 max-w-2xl">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
              <motion.div variants={itemVariants} className="space-y-6">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white" style={{ fontSize: '4rem', lineHeight: 1.05, fontWeight: 700, marginBottom: '0.5rem'  }}>
                  Anh Hoang
                </h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed" style={{ fontSize: '1.2rem', lineHeight: 1.25, marginBottom: '2rem'  }}>
                  Less noise. <br/>More signal. <br/>Better software. <br/>Finding clean solutions for messy problems.
                </p>
              </motion.div>


              {/* CTAs */}
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 pt-8"
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-1 bg-black rounded-lg border-2 border-white/30 text-white rounded-lg hover:border-white hover:bg-white/10 hover:text-black transition-all duration-300 font-medium"
                  
                >
                  View Projects
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <a
                  href="/resume.pdf"
                  download
                  className="group inline-flex items-center justify-center gap-3 px-8 py-1 border-2 border-white/30 text-white rounded-lg hover:border-white hover:bg-white/10 transition-all duration-300 font-medium "
                >
                  <Download size={20} />
                  Download Resume
                </a>
                
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-3 px-8  bg-pink-500 text-black rounded-lg hover:bg-pink-600 transition-all duration-300 font-medium"
                >
                  <Mail size={20} />
                  Contact
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Side - Interactive EventBadge */}
        <div className="lg:block w-2/3 relative z-0">
          {/* Gradient Overlay for smooth transition */}
          <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-black to-transparent"></div>
          
          {/* EventBadge Container */}
          <div className="relative h-full lg:mr-4" style={{ marginTop: '-3rem'}}>
            <EventBadge
              width="100%"
              height="125vh"
              variant="hero"
              minSpeed={10}
              maxSpeed={30}
              backgroundColor="#ec4899"
              className="w-full h-1/3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}