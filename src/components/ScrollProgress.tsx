'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const smooth = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX: smooth }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-neel-rust z-[60] origin-left"
    />
  )
}
