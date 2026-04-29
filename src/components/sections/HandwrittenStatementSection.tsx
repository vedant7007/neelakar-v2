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
  const bodyRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const label = labelRef.current
      const line = lineRef.current
      const headline = headlineRef.current
      const felt = feltRef.current
      const pen = penRef.current
      const body = bodyRef.current
      if (!container || !label || !line || !headline || !felt || !pen || !body) return

      gsap.set(line, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(label, { opacity: 0, y: 12 })
      gsap.set(headline, { clipPath: 'inset(0 0 100% 0)' })
      gsap.set(felt, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(pen, { left: '0%', opacity: 0 })
      gsap.set(body, { opacity: 0, y: 30 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=400vh',
          scrub: 3,
          pin: true,
        },
      })

      tl.to(line, { scaleX: 1, duration: 0.12, ease: 'power2.out' }, 0)
      tl.to(label, { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' }, 0.08)
      tl.to(headline, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.25,
        ease: 'power2.out',
      }, 0.15)
      tl.to(pen, { opacity: 1, duration: 0.02 }, 0.42)
      tl.to(pen, {
        left: '100%',
        duration: 0.2,
        ease: 'power1.inOut',
      }, 0.42)
      tl.to(felt, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.2,
        ease: 'power1.inOut',
      }, 0.42)
      tl.to(pen, { opacity: 0, duration: 0.02 }, 0.62)
      tl.to(body, {
        opacity: 1,
        y: 0,
        duration: 0.15,
        ease: 'power2.out',
      }, 0.65)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Dark → Light atmospheric gradient */}
      <div
        className="relative z-[2] w-full"
        style={{
          height: '60vh',
          background: [
            `radial-gradient(ellipse 140% 60% at 50% 85%, rgba(199,199,199,0.2) 0%, transparent 70%)`,
            `linear-gradient(to bottom, ${BG_DARK} 0%, ${BG_DARK} 8%, #121612 18%, #222622 30%, #3e3e3e 44%, #5e5e5e 56%, #848484 68%, #a6a6a6 80%, #bbbcbb 90%, ${BG_LIGHT} 100%)`,
          ].join(', '),
        }}
      />

      {/* Pinned manifesto section */}
      <div
        ref={containerRef}
        className="relative z-[2] w-screen h-screen flex items-end overflow-hidden"
        style={{ backgroundColor: BG_LIGHT }}
      >
        <div className="pl-[6vw] pr-[6vw] pb-[10vh] w-full">
          <div className="mb-10">
            <div
              ref={lineRef}
              className="w-16 h-px mb-4"
              style={{
                backgroundColor: INK,
                opacity: 0.2,
                willChange: 'transform',
              }}
            />
            <div
              ref={labelRef}
              className="uppercase tracking-[0.5em]"
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.55rem, 0.7vw, 0.75rem)',
                fontWeight: 600,
                color: 'rgba(20,20,20,0.35)',
                willChange: 'transform, opacity',
              }}
            >
              Our Manifesto
            </div>
          </div>

          <div
            ref={headlineRef}
            className="leading-[1.12] mb-8"
            style={{
              fontFamily: HEADLINE,
              fontSize: 'clamp(2rem, 5vw, 5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: INK,
              willChange: 'clip-path',
            }}
          >
            True fashion is not merely seen;
            <br />
            it is{' '}
            <span
              className="relative inline-block"
              style={{ paddingRight: '0.15em' }}
            >
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

          <div
            ref={bodyRef}
            className="max-w-2xl"
            style={{ willChange: 'transform, opacity' }}
          >
            <p
              className="leading-[1.9]"
              style={{
                fontFamily: SANS,
                fontSize: 'clamp(0.85rem, 1vw, 1.05rem)',
                fontWeight: 300,
                letterSpacing: '0.02em',
                color: 'rgba(20,20,20,0.4)',
              }}
            >
              At Neelakar, we understand the language of the craft, the tension
              between texture and light, the deliberate weight of a garment, the
              nuance of a metal&rsquo;s patina. We exist at the intersection of
              creative intuition and technical mastery, partnering with designers
              who refuse to compromise on their aesthetic integrity.
            </p>
          </div>
        </div>
      </div>

      {/* Light → Dark atmospheric gradient (off.site style) */}
      <div
        className="relative z-[2] w-full"
        style={{
          height: '80vh',
          background: [
            `radial-gradient(ellipse 160% 50% at 50% 15%, rgba(199,199,199,0.35) 0%, transparent 65%)`,
            `linear-gradient(to bottom, ${BG_LIGHT} 0%, #b8bab8 10%, #9a9e9a 22%, #707470 36%, #484c48 50%, #2a302c 64%, #141a16 80%, ${BG_DARK} 100%)`,
          ].join(', '),
        }}
      />
    </>
  )
}
