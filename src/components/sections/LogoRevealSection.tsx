'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LiquidEther from '@/components/LiquidEther'

gsap.registerPlugin(ScrollTrigger)

const BG_COLOR = '#060F0B'
const BRAND_FONT = "'all-round-gothic', sans-serif"

export default function LogoRevealSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const lockupRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const lockup = lockupRef.current
      const logo = logoRef.current
      const text = textRef.current
      if (!container || !lockup || !logo || !text) return

      const textWidth = text.offsetWidth
      const gap = 24
      const offset = (gap + textWidth) / 2

      gsap.set(lockup, { xPercent: -50, yPercent: -50, x: offset })
      gsap.set(text, { clipPath: 'inset(0 100% 0 0)' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=450vh',
          scrub: 3,
          pin: true,
        },
      })

      tl.to(logo, {
        scale: 1.15, duration: 0.3, ease: 'power1.inOut', force3D: true,
      }, 0)
      tl.to(logo, {
        scale: 1, duration: 0.15, ease: 'power2.out', force3D: true,
      }, 0.3)

      tl.to(lockup, {
        x: 0, duration: 0.28, ease: 'power2.inOut', force3D: true,
      }, 0.3)
      tl.to(text, {
        clipPath: 'inset(0 0% 0 0)', duration: 0.28, ease: 'power2.out',
      }, 0.32)

      tl.to(lockup, {
        opacity: 0, scale: 0.85, duration: 0.25,
        ease: 'power2.inOut', force3D: true,
      }, 0.7)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG_COLOR }}
    >
      {!isMobile && (
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <LiquidEther
            colors={['#0FF0FC', '#7B2FFF', '#00FF88', '#5B00D4', '#00C9FF']}
            mouseForce={5}
            cursorSize={80}
            resolution={0.3}
            iterationsPoisson={12}
            iterationsViscous={12}
            isBounce
            autoDemo={false}
            autoSpeed={0.2}
            autoIntensity={1}
            takeoverDuration={0.3}
            autoResumeDelay={3000}
            autoRampDuration={1}
          />
        </div>
      )}

      <div
        ref={lockupRef}
        className="absolute left-1/2 top-1/2 flex items-center gap-6"
        style={{ willChange: 'transform, opacity' }}
      >
        <div
          ref={logoRef}
          className="flex-shrink-0"
          style={{ willChange: 'transform' }}
        >
          <div className="relative w-[28vh] h-[28vh]">
            <Image
              src="/NCH_logo_white.png"
              alt="Neelakar"
              fill
              className="object-contain"
              sizes="28vh"
              priority
            />
          </div>
        </div>

        <div
          ref={textRef}
          className="flex flex-col"
          style={{ willChange: 'clip-path' }}
        >
          <h1
            className="text-[clamp(3.5rem,10vw,8.5rem)] text-white/90 leading-[1] tracking-tight whitespace-nowrap"
            style={{ fontFamily: BRAND_FONT, fontWeight: 200 }}
          >
            Neelakar
          </h1>
          <p
            className="text-[clamp(2rem,5.5vw,4.5rem)] text-white/90 leading-[1] whitespace-nowrap"
            style={{ fontFamily: BRAND_FONT, fontWeight: 200 }}
          >
            Creative House
          </p>
        </div>
      </div>
    </div>
  )
}
