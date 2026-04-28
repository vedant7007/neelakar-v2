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
  const titleRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const gallery = galleryRef.current
      const images = imageRefs.current.filter(Boolean) as HTMLDivElement[]
      if (!gallery || images.length === 0) return

      images.forEach((img, i) => {
        if (i === 0) {
          gsap.set(img, { scale: 1, borderRadius: '0px', opacity: 1 })
        } else {
          gsap.set(img, { scale: 0.3, borderRadius: '24px', opacity: 0 })
        }
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallery,
          start: 'top top',
          end: `+=${images.length * 250}vh`,
          scrub: 3,
          pin: true,
        },
      })

      const seg = 1 / images.length

      images.forEach((_, i) => {
        if (i === 0) return

        const start = (i - 0.3) * seg

        tl.to(images[i - 1], {
          scale: 0.3,
          borderRadius: '24px',
          opacity: 0,
          duration: seg * 0.5,
          ease: 'power2.in',
          force3D: true,
        }, start)

        tl.fromTo(images[i],
          { scale: 0.3, borderRadius: '24px', opacity: 0 },
          {
            scale: 1,
            borderRadius: '0px',
            opacity: 1,
            duration: seg * 0.5,
            ease: 'power2.out',
            force3D: true,
          },
          start + seg * 0.1,
        )
      })
    }, galleryRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative z-[4]" style={{ backgroundColor: BG_COLOR }}>
      {/* ── Full-screen title ── */}
      <div
        ref={titleRef}
        className="w-full h-screen flex flex-col items-center justify-center px-[5vw]"
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

      {/* ── Pinned gallery ── */}
      <div
        ref={galleryRef}
        className="relative w-full h-screen overflow-hidden"
        style={{ backgroundColor: BG_COLOR }}
      >
        {IMAGES.map((src, i) => (
          <div
            key={i}
            ref={(el) => { imageRefs.current[i] = el }}
            className="absolute inset-0 flex items-center justify-center overflow-hidden"
            style={{
              willChange: 'transform, opacity, border-radius',
              zIndex: i + 1,
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
      </div>
    </div>
  )
}
