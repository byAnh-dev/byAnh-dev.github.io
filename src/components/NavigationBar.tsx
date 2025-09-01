'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function NavigationBar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <motion.div 
      className="fixed top-10 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex gap-4 bg-black/50 border-2 border-black shadow-lg px-4 py-2 rounded">
        <Link 
          href="/" 
          className={`font-medium px-3 py-1.5 hover:bg-gray-100/30 hover:text-black rounded transition-colors relative ${
            isActive('/') ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded' : ''
          }`}
        >
          Home
        </Link>
        <Link 
          href="/about" 
          className={`text-black font-medium px-3 py-1.5 hover:bg-gray-100/30 rounded transition-colors relative ${
            isActive('/about') ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white after:rounded' : ''
          }`}
        >
          About
        </Link>
        <Link 
          href="/projects" 
          className={`text-black font-medium px-3 py-1.5 hover:bg-gray-100/30 rounded transition-colors relative ${
            isActive('/projects') ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:rounded' : ''
          }`}
        >
          Projects
        </Link>
        <Link 
          href="/contact" 
          className={`text-black font-medium px-3 py-1.5 hover:bg-gray-100/30 rounded transition-colors relative ${
            isActive('/contact') ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:rounded' : ''
          }`}
        >
          Contact
        </Link>
        <Link 
          href="/thoughts" 
          className={`text-black font-medium px-3 py-1.5 hover:bg-gray-100/30 rounded transition-colors relative ${
            isActive('/thoughts') ? 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:rounded' : ''
          }`}
        >
          Thoughts?
        </Link>
      </div>
    </motion.div>
  )
}
