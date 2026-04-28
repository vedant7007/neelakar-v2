'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG_COLOR = '#060F0B'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), sans-serif"

const IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=900&fit=crop',
]

export default function CampaignsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const title = titleRef.current
      const images = imageRefs.current.filter(Boolean) as HTMLDivElement[]
      if (!section || !title || images.length === 0) return

      // All images start off-screen right, tiny
      images.forEach((img) => {
        gsap.set(img, { xPercent: 100, scale: 0.15, borderRadius: '24px', opacity: 1 })
      })

      // Total phases: 1 (title exit + first image in) + (n-1) image transitions
      const totalPhases = images.length
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(totalPhases + 1) * 350}vh`,
          scrub: 4,
          pin: true,
        },
      })

      const seg = 1 / (totalPhases + 0.5)

      // Phase 0: Title exits left + first image enters from right
      tl.to(title, {
        xPercent: -120,
        opacity: 0,
        duration: seg * 0.8,
        ease: 'power3.inOut',
        force3D: true,
      }, 0)

      tl.to(images[0], {
        xPercent: 0,
        scale: 1,
        borderRadius: '0px',
        duration: seg * 0.8,
        ease: 'power2.out',
        force3D: true,
      }, seg * 0.15)

      // Phases 1+: current image shrinks and exits left, next enters from right
      for (let i = 1; i < images.length; i++) {
        const start = (i + 0.3) * seg

        // Current image shrinks and moves left
        tl.to(images[i - 1], {
          xPercent: -100,
          scale: 0.15,
          borderRadius: '24px',
          duration: seg * 0.85,
          ease: 'power2.inOut',
          force3D: true,
        }, start)

        // Next image enters from right, expanding
        tl.to(images[i], {
          xPercent: 0,
          scale: 1,
          borderRadius: '0px',
          duration: seg * 0.85,
          ease: 'power2.inOut',
          force3D: true,
        }, start)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative z-[4] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG_COLOR }}
    >
      {/* ── Title (exits left on scroll) ── */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-[5vw] z-20"
        style={{ willChange: 'transform, opacity' }}
      >
        <span
          className="block text-white/25 uppercase mb-6"
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(0.5rem, 0.65vw, 0.7rem)',
            letterSpacing: '0.5em',
            fontWeight: 600,
          }}
        >
          Selected Works
        </span>
        <h2
          className="text-white italic leading-[0.92] text-center"
          style={{
            fontFamily: DISPLAY,
            fontSize: 'clamp(4rem, 12vw, 12rem)',
            fontWeight: 300,
          }}
        >
          Our<br />Campaigns
        </h2>
        <div className="w-16 h-px bg-white/10 mt-8" />
      </div>

      {/* ── Images ── */}
      {IMAGES.map((src, i) => (
        <div
          key={i}
          ref={(el) => { imageRefs.current[i] = el }}
          className="absolute inset-0 overflow-hidden z-10"
          style={{
            willChange: 'transform, border-radius',
            zIndex: 10 + IMAGES.length - i,
          }}
        >
          <Image
            src={src}
            alt={`Campaign ${i + 1}`}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Counter */}
      <div
        className="absolute bottom-8 right-8 z-30 text-white/20"
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
          letterSpacing: '0.3em',
          fontWeight: 500,
        }}
      >
        {String(IMAGES.length).padStart(2, '0')} WORKS
      </div>
    </div>
  )
}
