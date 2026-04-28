'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG_COLOR = '#060F0B'
const DISPLAY = "var(--font-neel-display), 'Cormorant Garamond', serif"
const SANS = "var(--font-dm-sans), sans-serif"

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
          end: '+=825vh',
          scrub: 3,
          pin: true,
        },
      })

      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.05)
      tl.to(wipeL, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to(img1, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to(wipeR, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to(txt1, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.05)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.19)

      tl.set(wipeL, { left: '0%' }, 0.34)
      tl.set(wipeR, { left: '100%' }, 0.34)
      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.34)
      tl.to(wipeL, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to(img1, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to(wipeR, { left: '50%', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to(txt1, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.34)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.48)

      tl.set(wipeL, { left: '50%' }, 0.52)
      tl.set(wipeR, { left: '50%' }, 0.52)
      tl.to([wipeL, wipeR], { opacity: 1, duration: 0.01 }, 0.52)
      tl.to(wipeL, { left: '0%', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to(txt2, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to(wipeR, { left: '100%', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to(img2, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.14, ease: 'power2.inOut' }, 0.52)
      tl.to([wipeL, wipeR], { opacity: 0, duration: 0.02 }, 0.66)

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

      {/* ── Pair 1: Image left, text right ── */}
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
        <div className="absolute bottom-[8%] left-[6%] z-10">
          <span
            className="uppercase tracking-[0.4em] text-white/40"
            style={{ fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.7vw, 0.75rem)', fontWeight: 500 }}
          >
            Vol. I — Spring 2026
          </span>
        </div>
        <div className="absolute top-[8%] right-[6%] z-10">
          <span
            className="text-white/20 font-light"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 8vw, 8rem)' }}
          >
            01
          </span>
        </div>
      </div>

      <div
        ref={txt1Ref}
        className="absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center px-[5vw]"
        style={{ willChange: 'clip-path' }}
      >
        <span
          className="uppercase tracking-[0.5em] text-white/30 mb-6 block"
          style={{ fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.65vw, 0.7rem)', fontWeight: 600 }}
        >
          The Edit
        </span>
        <h2
          className="italic text-white leading-[1.05] mb-8"
          style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 5vw, 5.5rem)', fontWeight: 300 }}
        >
          Editorial<br />&amp; Fashion
        </h2>
        <div className="w-12 h-px bg-white/15 mb-8" />
        <p
          className="text-white/35 leading-[1.8] max-w-sm"
          style={{ fontFamily: SANS, fontSize: 'clamp(0.8rem, 0.9vw, 0.95rem)', fontWeight: 300, letterSpacing: '0.02em' }}
        >
          We sculpt visual stories for haute couture and luxury brands,
          where every frame breathes elegance and every detail is an act
          of intention.
        </p>
        <span
          className="uppercase tracking-[0.4em] text-white/15 mt-12 block"
          style={{ fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.55vw, 0.6rem)', fontWeight: 500 }}
        >
          Campaign &bull; Editorial &bull; Lookbook
        </span>
      </div>

      {/* ── Pair 2: Text left, image right ── */}
      <div
        ref={txt2Ref}
        className="absolute left-0 top-0 w-1/2 h-full flex flex-col justify-center items-end px-[5vw]"
        style={{ willChange: 'clip-path' }}
      >
        <div className="text-right">
          <span
            className="uppercase tracking-[0.5em] text-white/30 mb-6 block"
            style={{ fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.65vw, 0.7rem)', fontWeight: 600 }}
          >
            The Craft
          </span>
          <h2
            className="italic text-white leading-[1.05] mb-8"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 5vw, 5.5rem)', fontWeight: 300 }}
          >
            Luxury<br />&amp; Jewellery
          </h2>
          <div className="w-12 h-px bg-white/15 mb-8 ml-auto" />
          <p
            className="text-white/35 leading-[1.8] max-w-sm ml-auto"
            style={{ fontFamily: SANS, fontSize: 'clamp(0.8rem, 0.9vw, 0.95rem)', fontWeight: 300, letterSpacing: '0.02em' }}
          >
            From fine jewellery to prestige labels, we craft campaigns
            that honour heritage and radiate the quiet confidence of
            true luxury.
          </p>
          <span
            className="uppercase tracking-[0.4em] text-white/15 mt-12 block"
            style={{ fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.55vw, 0.6rem)', fontWeight: 500 }}
          >
            Prestige &bull; Heritage &bull; Identity
          </span>
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
        <div className="absolute bottom-[8%] right-[6%] z-10">
          <span
            className="uppercase tracking-[0.4em] text-white/40"
            style={{ fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.7vw, 0.75rem)', fontWeight: 500 }}
          >
            Neelakar &mdash; Est. 2024
          </span>
        </div>
        <div className="absolute top-[8%] left-[6%] z-10">
          <span
            className="text-white/20 font-light"
            style={{ fontFamily: DISPLAY, fontSize: 'clamp(4rem, 8vw, 8rem)' }}
          >
            02
          </span>
        </div>
      </div>
    </div>
  )
}
