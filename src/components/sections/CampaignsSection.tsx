'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG_COLOR = '#060F0B'

const IMAGES = [
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?w=1600&h=900&fit=crop',
  'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&h=900&fit=crop',
]

export default function CampaignsSection() {
  const galleryRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const gallery = galleryRef.current
      const images = imageRefs.current.filter(Boolean) as HTMLDivElement[]
      if (!gallery || images.length === 0) return

      images.forEach((img, i) => {
        if (i === 0) {
          gsap.set(img, { xPercent: 0, scale: 1, borderRadius: '0px' })
        } else {
          gsap.set(img, {
            xPercent: 100,
            scale: 0.5,
            borderRadius: '16px',
          })
        }
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gallery,
          start: 'top top',
          end: `+=${images.length * 150}vh`,
          scrub: 3,
          pin: true,
        },
      })

      const seg = 1 / images.length

      images.forEach((img, i) => {
        if (i === 0) return

        const start = (i - 0.15) * seg
        const expandEnd = start + seg * 0.75

        tl.to(images[i - 1], {
          filter: 'blur(12px)',
          scale: 1.05,
          duration: seg * 0.6,
          ease: 'power2.inOut',
          force3D: true,
        }, start)

        tl.fromTo(img,
          { xPercent: 100, scale: 0.45, borderRadius: '20px' },
          {
            xPercent: 0,
            scale: 1,
            borderRadius: '0px',
            duration: expandEnd - start,
            ease: 'power3.out',
            force3D: true,
          },
          start,
        )
      })

    }, galleryRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative z-[4]" style={{ backgroundColor: BG_COLOR }}>
      <div className="w-full pt-[10vh] pb-[6vh] px-[5vw]">
        <span
          className="block text-white/25 uppercase mb-4"
          style={{
            fontFamily: 'var(--font-dm-sans), sans-serif',
            fontSize: 'clamp(0.5rem, 0.65vw, 0.7rem)',
            letterSpacing: '0.5em',
            fontWeight: 600,
          }}
        >
          Selected Works
        </span>
        <h2
          className="text-white font-light italic leading-[0.95]"
          style={{
            fontFamily: 'var(--font-neel-display), serif',
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
          }}
        >
          Our Campaigns
        </h2>
        <div className="w-16 h-px bg-white/10 mt-6" />
      </div>

      <div
        ref={galleryRef}
        className="relative w-full h-screen overflow-hidden"
        style={{ backgroundColor: BG_COLOR }}
      >
        {IMAGES.map((src, i) => (
          <div
            key={i}
            ref={(el) => { imageRefs.current[i] = el }}
            className="absolute inset-0 overflow-hidden"
            style={{
              willChange: 'transform, filter, border-radius',
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
