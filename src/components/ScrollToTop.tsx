'use client'

import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      setVisible(v > 0.18)
    })
  }, [scrollYProgress])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="group fixed bottom-6 left-6 z-40 h-12 w-12 rounded-full backdrop-blur-xl bg-neel-cream/40 border border-white/40 text-neel-ink flex items-center justify-center shadow-[0_8px_32px_rgba(20,20,20,0.15),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:bg-neel-cream/60 transition-colors cursor-pointer"
          style={{ WebkitBackdropFilter: 'blur(20px)' }}
        >
          <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
