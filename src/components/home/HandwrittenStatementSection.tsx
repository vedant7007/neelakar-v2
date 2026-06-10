'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COLORS, FONTS } from '@/lib/theme'

gsap.registerPlugin(ScrollTrigger)

const BG_CREAM = COLORS.cream
const SANS = FONTS.sans
const NUSRAT = FONTS.nusrat
const INK = '#1C1C1A'
const GOLD = COLORS.gold

export default function HandwrittenStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const accentRef = useRef<HTMLSpanElement>(null)
  const lineDecoRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const content = contentRef.current
      const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[]
      const accent = accentRef.current
      const lineDeco = lineDecoRef.current
      const label = labelRef.current
      if (!container || !content || lines.length === 0 || !accent || !lineDeco || !label) return

      gsap.set(lineDeco, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(label, { opacity: 0, y: 10 })
      lines.forEach((l) => gsap.set(l, { y: 50, opacity: 0 }))
      gsap.set(accent, { opacity: 0, y: 15 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          end: '+=400vh',
          scrub: 2,
          pin: true,
          pinSpacing: true,
        },
      })

      // Phase 1: Reveal (0 → 0.4)
      tl.to(lineDeco, {
        scaleX: 1,
        duration: 0.12,
        ease: 'sine.inOut',
      }, 0)

      tl.to(label, {
        opacity: 0.5,
        y: 0,
        duration: 0.1,
        ease: 'sine.out',
      }, 0.06)

      lines.forEach((l, i) => {
        tl.to(l, {
          y: 0,
          opacity: 1,
          duration: 0.14,
          ease: 'sine.out',
        }, 0.1 + i * 0.06)
      })

      tl.to(accent, {
        opacity: 1,
        y: 0,
        duration: 0.18,
        ease: 'sine.out',
      }, 0.32)

      // Phase 2: Hold for reading (0.5 → 0.65)

      // Phase 3: Slide left smoothly (0.65 → 0.9)
      tl.to(content, {
        xPercent: -25,
        duration: 0.25,
        ease: 'sine.inOut',
      }, 0.65)

      tl.to(accent, {
        scale: 1.12,
        duration: 0.25,
        ease: 'sine.inOut',
      }, 0.65)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const headlineStyle = {
    fontFamily: SANS,
    fontWeight: 700 as const,
    textTransform: 'uppercase' as const,
    color: INK,
    lineHeight: 1.08,
    letterSpacing: '-0.025em',
    fontSize: 'clamp(1.8rem, 5vw, 5.5rem)',
  }

  return (
    <div
      ref={containerRef}
      className="relative z-[2] w-screen h-screen overflow-hidden"
      style={{ background: BG_CREAM }}
    >
      {/* Top gradient */}
      <div
        className="absolute inset-x-0 top-0 h-[8vh] pointer-events-none z-10"
        style={{
          background: `linear-gradient(to bottom, #060F0B 0%, rgba(6,15,11,0.3) 50%, transparent 100%)`,
        }}
      />

      {/* Subtle paper texture grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        {/* Decorative line + label */}
        <div className="mb-8 flex items-center gap-4">
          <div
            ref={lineDecoRef}
            className="h-px w-16"
            style={{ backgroundColor: GOLD, willChange: 'transform' }}
          />
          <span
            ref={labelRef}
            style={{
              fontFamily: SANS,
              fontSize: 'clamp(0.55rem, 0.7vw, 0.7rem)',
              fontWeight: 500,
              color: INK,
              letterSpacing: '0.4em',
              textTransform: 'uppercase',
              willChange: 'transform, opacity',
            }}
          >
            Our Manifesto
          </span>
        </div>

        {/* Statement text — centered */}
        <div className="text-center">
          {['True fashion is', 'not merely seen;'].map((line, i) => (
            <div
              key={i}
              ref={(el) => { lineRefs.current[i] = el }}
              style={{ ...headlineStyle, willChange: 'transform, opacity' }}
            >
              {line}
            </div>
          ))}
          <div
            ref={(el) => { lineRefs.current[2] = el }}
            style={{ ...headlineStyle, willChange: 'transform, opacity' }}
          >
            <span>it is </span>
            <span
              ref={accentRef}
              style={{
                fontFamily: NUSRAT,
                fontWeight: 400,
                textTransform: 'none',
                fontSize: '1.35em',
                color: GOLD,
                letterSpacing: '0',
                lineHeight: 1,
                willChange: 'transform, opacity',
                position: 'relative',
                top: '0.06em',
                display: 'inline-block',
                transformOrigin: 'left bottom',
              }}
            >
              felt.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
