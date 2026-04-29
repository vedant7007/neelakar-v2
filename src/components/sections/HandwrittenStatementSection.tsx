'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG_LIGHT = '#C7C7C7'
const BG_DARK = '#060F0B'
const HEADLINE = "var(--font-neel-display), 'Playfair Display', serif"
const NUSRAT = "'Nusrat', cursive"
const SANS = "var(--font-dm-sans), sans-serif"
const INK = '#141414'
const RUST = '#C8A96E'

export default function HandwrittenStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const feltRef = useRef<HTMLSpanElement>(null)
  const penRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const label = labelRef.current
      const line = lineRef.current
      const headline = headlineRef.current
      const felt = feltRef.current
      const pen = penRef.current
      if (!container || !label || !line || !headline || !felt || !pen) return

      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(label, { opacity: 0, y: 12 })
      gsap.set(headline, { opacity: 0, y: 40 })
      gsap.set(felt, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(pen, { left: '0%', opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=400vh',
          scrub: 3,
          pin: true,
        },
      })

      tl.to(line, { scaleX: 1, duration: 0.1, ease: 'power2.out' }, 0)
      tl.to(label, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.06)
      tl.to(headline, { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }, 0.12)
      tl.to(pen, { opacity: 1, duration: 0.02 }, 0.38)
      tl.to(pen, { left: '100%', duration: 0.22, ease: 'power1.inOut' }, 0.38)
      tl.to(felt, { clipPath: 'inset(0 0% 0 0)', duration: 0.22, ease: 'power1.inOut' }, 0.38)
      tl.to(pen, { opacity: 0, duration: 0.02 }, 0.60)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Dark → Light transition */}
      <div
        className="relative z-[2] w-full"
        style={{
          height: '60vh',
          background: `linear-gradient(to bottom, ${BG_DARK} 0%, ${BG_DARK} 10%, #1a1a1a 25%, #3e3e3e 42%, #6a6a6a 58%, #969696 74%, #b4b4b4 88%, ${BG_LIGHT} 100%)`,
        }}
      />

      {/* Pinned manifesto */}
      <div
        ref={containerRef}
        className="relative z-[2] w-screen h-screen overflow-hidden"
        style={{ backgroundColor: BG_LIGHT }}
      >
        <div className="absolute inset-0 flex flex-col justify-center pl-[6vw] pr-[6vw]">
          <div className="mb-8">
            <div
              ref={lineRef}
              className="w-14 h-px mb-4"
              style={{ backgroundColor: INK, opacity: 0.2, willChange: 'transform' }}
            />
            <div
              ref={labelRef}
              className="uppercase tracking-[0.5em]"
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.5rem, 0.65vw, 0.7rem)',
                fontWeight: 600,
                color: 'rgba(20,20,20,0.3)',
                willChange: 'transform, opacity',
              }}
            >
              Our Manifesto
            </div>
          </div>

          <div
            ref={headlineRef}
            style={{
              fontFamily: HEADLINE,
              fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: INK,
              lineHeight: 1.15,
              willChange: 'transform, opacity',
            }}
          >
            True fashion is not merely seen;
            <br />
            it is{' '}
            <span className="relative inline-block" style={{ paddingRight: '0.15em' }}>
              <span
                ref={feltRef}
                className="inline-block"
                style={{
                  fontFamily: NUSRAT,
                  fontSize: '1.15em',
                  color: RUST,
                  fontWeight: 400,
                  fontStyle: 'normal',
                  willChange: 'clip-path',
                }}
              >
                felt.
              </span>
              <div
                ref={penRef}
                className="absolute"
                style={{
                  top: '10%',
                  height: '80%',
                  width: '2px',
                  backgroundColor: RUST,
                  borderRadius: '1px',
                  willChange: 'left, opacity',
                  filter: `drop-shadow(0 0 4px ${RUST})`,
                }}
              />
            </span>
          </div>
        </div>

        {/* Bottom fade built into the section — no seam */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: '35%',
            background: `linear-gradient(to bottom, transparent 0%, #b8b8b8 100%)`,
          }}
        />
      </div>

      {/* Light → Dark atmospheric gradient */}
      <div
        className="relative z-[2] w-full"
        style={{
          height: '80vh',
          background: `linear-gradient(to bottom, #b8b8b8 0%, #9a9a9a 12%, #787878 26%, #585858 40%, #3c3c3c 55%, #242424 72%, #121212 88%, ${BG_DARK} 100%)`,
        }}
      />
    </>
  )
}
