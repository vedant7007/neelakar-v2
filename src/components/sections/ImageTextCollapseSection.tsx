'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG_COLOR = '#060F0B'

export default function ImageTextCollapseSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const img1Ref = useRef<HTMLDivElement>(null)
  const txt1Ref = useRef<HTMLDivElement>(null)
  const img2Ref = useRef<HTMLDivElement>(null)
  const txt2Ref = useRef<HTMLDivElement>(null)
  const wipeLeftRef = useRef<HTMLDivElement>(null)
  const wipeRightRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const img1 = img1Ref.current
      const txt1 = txt1Ref.current
      const img2 = img2Ref.current
      const txt2 = txt2Ref.current
      const wipeL = wipeLeftRef.current
      const wipeR = wipeRightRef.current
      if (!container || !img1 || !txt1 || !img2 || !txt2 || !wipeL || !wipeR) return

      gsap.set(img1, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(txt1, { clipPath: 'inset(0% 0% 0% 100%)' })
      gsap.set(txt2, { clipPath: 'inset(0% 0% 0% 100%)' })
      gsap.set(img2, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(wipeL, { left: '0%', opacity: 0 })
      gsap.set(wipeR, { left: '100%', opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=550vh',
          scrub: 3,
          pin: true,
        },
      })

      // Pair 1 wipe in
      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.05)
      tl.to(wipeL, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to(img1, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to(wipeR, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to(txt1, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.19)

      // Pair 1 wipe out
      tl.set(wipeL, { left: '0%' }, 0.34)
      tl.set(wipeR, { left: '100%' }, 0.34)
      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.34)
      tl.to(wipeL, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to(img1, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to(wipeR, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to(txt1, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.48)

      // Pair 2 wipe in from center
      tl.set(wipeL, { left: '50%' }, 0.52)
      tl.set(wipeR, { left: '50%' }, 0.52)
      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.52)
      tl.to(wipeL, { left: '0%', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to(txt2, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to(wipeR, { left: '100%', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to(img2, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.66)

      // Pair 2 wipe out
      tl.set(wipeL, { left: '0%' }, 0.78)
      tl.set(wipeR, { left: '100%' }, 0.78)
      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.78)
      tl.to(wipeL, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.78)
      tl.to(txt2, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.14, ease: 'power2.inOut' }, 0.78)
      tl.to(wipeR, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.78)
      tl.to(img2, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.78)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.92)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-[3] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div
        ref={wipeLeftRef}
        className="absolute top-0 h-full w-px z-10"
        style={{
          backgroundColor: 'rgba(255,255,255,0.12)',
          willChange: 'left, opacity',
        }}
      />
      <div
        ref={wipeRightRef}
        className="absolute top-0 h-full w-px z-10"
        style={{
          backgroundColor: 'rgba(255,255,255,0.12)',
          willChange: 'left, opacity',
          transform: 'translateX(-1px)',
        }}
      />

      <div
        ref={img1Ref}
        className="absolute left-0 top-0 w-1/2 h-full overflow-hidden"
        style={{ willChange: 'clip-path' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1000&h=1400&fit=crop"
          alt="Editorial & Fashion"
          fill
          className="object-cover"
          sizes="50vw"
        />
      </div>

      <div
        ref={txt1Ref}
        className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center px-[4vw]"
        style={{ willChange: 'clip-path' }}
      >
        <h2 className="font-display text-[clamp(2.2rem,4vw,4rem)] font-light text-white mb-6 leading-[1.1] italic tracking-wide">
          Editorial &amp; Fashion
        </h2>
        <p className="font-sans text-[clamp(0.9rem,1.1vw,1.1rem)] text-white/35 leading-relaxed max-w-md font-light tracking-wide">
          We sculpt visual stories for haute couture and luxury brands,
          where every frame breathes elegance and every detail is an act
          of intention.
        </p>
      </div>

      <div
        ref={txt2Ref}
        className="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center items-end px-[4vw]"
        style={{ willChange: 'clip-path' }}
      >
        <div>
          <h2 className="font-display text-[clamp(2.2rem,4vw,4rem)] font-light text-white mb-6 leading-[1.1] italic tracking-wide">
            Luxury &amp; Jewellery
          </h2>
          <p className="font-sans text-[clamp(0.9rem,1.1vw,1.1rem)] text-white/35 leading-relaxed max-w-md font-light tracking-wide">
            From fine jewellery to prestige labels, we craft campaigns
            that honour heritage and radiate the quiet confidence of
            true luxury.
          </p>
        </div>
      </div>

      <div
        ref={img2Ref}
        className="absolute right-0 top-0 w-1/2 h-full overflow-hidden"
        style={{ willChange: 'clip-path' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1000&h=1400&fit=crop"
          alt="Luxury & Jewellery"
          fill
          className="object-cover"
          sizes="50vw"
        />
      </div>
    </div>
  )
}
