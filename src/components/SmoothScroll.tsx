'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

declare global {
  interface Window { __lenis?: Lenis }
}

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete window.__lenis
    }
  }, [])
  return null
}
