'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Shuffle from '@/components/Shuffle'

gsap.registerPlugin(ScrollTrigger)

const GOLD = '#C8A96E'
const BG_DARK = '#060F0B'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

const SERVICE_CARDS = [
  {
    number: '01',
    title: 'Brand &\nCreative',
    description:
      'We find your truth. Then define your brand identity and creative structure.',
    tags: ['Strategy', 'Narrative', 'Direction'],
  },
  {
    number: '02',
    title: 'Campaign\n& Film',
    description:
      'From concept to screen — cinematic campaigns that move audiences and markets.',
    tags: ['Production', 'Direction', 'Post'],
  },
  {
    number: '03',
    title: 'Visual &\nContent',
    description:
      'Photography, motion, and design systems that make your brand unmistakable.',
    tags: ['Photography', 'Motion', 'Design'],
  },
  {
    number: '04',
    title: 'Growth &\nPartnership',
    description:
      "We connect creativity with operations so ideas ship and don't die in a deck.",
    tags: ['PR', 'Process', 'Procurement'],
  },
]

const STACK_ROTATIONS = [3, -2.5, 4, -3]

const PROCESS_CARDS = [
  { number: '01', label: 'DISCOVER', desc: 'Deep-dive into your brand, audience, and market position.' },
  { number: '02', label: 'STRATEGIZE', desc: 'Define the creative direction and campaign architecture.' },
  { number: '03', label: 'CREATE', desc: 'Design, shoot, and produce every visual and narrative asset.' },
  { number: '04', label: 'DELIVER', desc: 'Launch, measure, and refine across every touchpoint.' },
]

const headingStyle = {
  fontFamily: SANS,
  fontSize: 'clamp(4.5rem, 14vw, 13rem)',
  fontWeight: 700,
  lineHeight: 0.9,
  letterSpacing: '-0.03em',
}

export default function WhatWeDoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgTextRef = useRef<HTMLDivElement>(null)
  const whatRef = useRef<HTMLDivElement>(null)
  const howRef = useRef<HTMLDivElement>(null)
  const weDoRef = useRef<HTMLDivElement>(null)
  const subRef = useRef<HTMLDivElement>(null)
  const textGroupRef = useRef<HTMLDivElement>(null)
  const darkOverlayRef = useRef<HTMLDivElement>(null)
  const stackCardRefs = useRef<(HTMLDivElement | null)[]>([])
  const processCardRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const bgText = bgTextRef.current
      const whatEl = whatRef.current
      const howEl = howRef.current
      const weDoEl = weDoRef.current
      const subEl = subRef.current
      const darkOverlay = darkOverlayRef.current
      if (!section || !bgText || !whatEl || !howEl || !weDoEl || !subEl || !darkOverlay) return

      const textGroup = textGroupRef.current
      const stackCards = stackCardRefs.current.filter(Boolean) as HTMLDivElement[]
      const processCards = processCardRefs.current.filter(Boolean) as HTMLDivElement[]
      if (stackCards.length === 0 || !textGroup) return

      gsap.set(textGroup, { x: -window.innerWidth * 0.25 })
      gsap.set(howEl, { opacity: 0, y: 40 })
      gsap.set(darkOverlay, { clipPath: 'circle(0% at 50% 50%)' })

      stackCards.forEach((card, i) => {
        gsap.set(card, { y: '120vh', rotation: STACK_ROTATIONS[i] * 2.5, opacity: 0 })
      })

      processCards.forEach((card) => {
        gsap.set(card, { y: '110vh', opacity: 0 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=2800vh',
          scrub: 1.5,
          pin: true,
        },
      })

      // === ACT 1: WHAT WE DO on LEFT, blurs while cards stack (0 → 0.22) ===
      tl.to(bgText, { filter: 'blur(10px)', opacity: 0.25, duration: 0.03 }, 0.02)

      const inSize = 0.16 / stackCards.length
      stackCards.forEach((card, i) => {
        tl.to(card, {
          y: 0, rotation: STACK_ROTATIONS[i], opacity: 1,
          duration: inSize * 0.6, ease: 'power3.out', force3D: true,
        }, 0.04 + i * inSize)
      })

      // Cards fly out
      tl.to(stackCards, {
        y: '-120vh', opacity: 0, duration: 0.05,
        ease: 'power2.in', stagger: 0.008, force3D: true,
      }, 0.22)

      // === ACT 2: WHAT WE DO comes back (unblur, still LEFT) (0.27 → 0.32) ===
      tl.to(bgText, { filter: 'blur(0px)', opacity: 1, duration: 0.04 }, 0.27)

      // === ACT 3: WHAT WE DO slides to CENTER (0.33 → 0.40) ===
      tl.to(textGroup, { x: 0, duration: 0.07, ease: 'sine.inOut' }, 0.33)
      tl.to(subEl, { opacity: 0, duration: 0.03 }, 0.33)

      // === ACT 4: WHAT morphs to HOW (0.42 → 0.48) ===
      tl.to(whatEl, { opacity: 0, y: -30, duration: 0.03, ease: 'sine.inOut' }, 0.42)
      tl.to(howEl, { opacity: 1, y: 0, duration: 0.03, ease: 'sine.inOut' }, 0.44)

      // === ACT 5: Dark circle expands from HOW's O (0.50 → 0.58) ===
      tl.to(darkOverlay, {
        clipPath: 'circle(150% at 50% 45%)',
        duration: 0.08,
        ease: 'power2.out',
      }, 0.50)

      tl.to(weDoEl, { color: '#ffffff', duration: 0.04 }, 0.52)

      // === ACT 6: Process cards rise alternating (0.60 → 0.86) ===
      const procSize = 0.065
      processCards.forEach((card, i) => {
        const start = 0.60 + i * procSize

        tl.to(card, {
          y: 0, opacity: 1,
          duration: 0.05, ease: 'sine.out', force3D: true,
        }, start)

        tl.to(card, {
          y: '-110vh', opacity: 0,
          duration: 0.045, ease: 'sine.in', force3D: true,
        }, start + 0.055)
      })

      // === ACT 7: Everything fades out (0.90 → 0.96) ===
      tl.to(bgText, { opacity: 0, y: -60, duration: 0.06, ease: 'sine.in' }, 0.90)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative z-[5] w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#F5F5F0' }}
    >
      {/* Dark overlay — expands as circle from center */}
      <div
        ref={darkOverlayRef}
        className="absolute inset-0 z-[2]"
        style={{ backgroundColor: BG_DARK, willChange: 'clip-path' }}
      />

      {/* WHAT/HOW WE DO — starts left, slides to center, WHAT morphs to HOW */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ willChange: 'filter, opacity', zIndex: 3 }}
      >
        <div ref={textGroupRef} className="flex flex-col items-center gap-2" style={{ willChange: 'transform' }}>
          <div className="relative">
            <div ref={whatRef} style={{ willChange: 'transform, opacity' }}>
              <Shuffle
                text="WHAT"
                tag="h2"
                textAlign="center"
                shuffleDirection="up"
                animationMode="random"
                maxDelay={3.5}
                duration={1.4}
                ease="sine.inOut"
                shuffleTimes={1}
                loop
                loopDelay={7}
                triggerOnce={false}
                triggerOnHover={false}
                rootMargin="0px"
                style={{ ...headingStyle, color: '#1C1C1A' }}
                className="font-[inherit] !leading-[0.9]"
              />
            </div>
            <div ref={howRef} className="absolute inset-0 flex items-center justify-center" style={{ willChange: 'transform, opacity' }}>
              <Shuffle
                text="HOW"
                tag="h2"
                textAlign="center"
                shuffleDirection="up"
                animationMode="random"
                maxDelay={3}
                duration={1.4}
                ease="sine.inOut"
                shuffleTimes={1}
                loop
                loopDelay={7}
                triggerOnce={false}
                triggerOnHover={false}
                rootMargin="0px"
                style={{ ...headingStyle, color: GOLD }}
                className="font-[inherit] !leading-[0.9]"
              />
            </div>
          </div>

          <div ref={weDoRef} style={{ willChange: 'color' }}>
            <Shuffle
              text="WE DO"
              tag="h2"
              textAlign="center"
              shuffleDirection="up"
              animationMode="random"
              maxDelay={4}
              duration={1.4}
              ease="sine.inOut"
              shuffleTimes={1}
              loop
              loopDelay={8}
              triggerOnce={false}
              triggerOnHover={false}
              rootMargin="0px"
              style={{ ...headingStyle, color: '#1C1C1A' }}
              className="font-[inherit] !leading-[0.9]"
            />
          </div>
        </div>

        <div ref={subRef} className="mt-6 max-w-lg text-center" style={{ willChange: 'opacity' }}>
          <p style={{
            fontFamily: SANS, fontSize: 'clamp(0.8rem, 0.9vw, 0.95rem)',
            fontWeight: 300, color: 'rgba(0,0,0,0.35)', lineHeight: 1.8,
            letterSpacing: '0.02em', marginBottom: '1.5rem',
          }}>
            Vision is nothing without execution. We build both.
            We create campaigns, films, and the systems that get them made.
          </p>
          <a
            href="#"
            className="inline-block px-5 py-2.5 transition-colors duration-300 uppercase hover:bg-black hover:text-white"
            style={{
              fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
              letterSpacing: '0.35em', fontWeight: 600, color: '#1C1C1A',
              border: '1px solid rgba(0,0,0,0.7)', textDecoration: 'none',
            }}
          >
            Our Services
          </a>
        </div>
      </div>

      {/* Stacking service cards */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 5 }}>
        {SERVICE_CARDS.map((card, i) => (
          <div
            key={`stack-${card.number}`}
            ref={(el) => { stackCardRefs.current[i] = el }}
            className="absolute"
            style={{ width: 'min(480px, 80vw)', zIndex: 10 + i, willChange: 'transform, opacity' }}
          >
            <div
              className="flex flex-col justify-between"
              style={{
                backgroundColor: '#E8E2D9', aspectRatio: '4 / 5',
                padding: 'clamp(2.2rem, 4vw, 3.5rem)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.1), 0 6px 20px rgba(0,0,0,0.06)',
                border: '1px solid rgba(200,169,110,0.2)',
              }}
            >
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <span style={{ fontFamily: SANS, fontSize: 'clamp(0.6rem, 0.7vw, 0.72rem)', fontWeight: 500, color: GOLD, letterSpacing: '0.2em' }}>
                    {card.number}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: GOLD, opacity: 0.25 }} />
                </div>
                <h3 className="uppercase whitespace-pre-line" style={{
                  fontFamily: SANS, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700,
                  color: '#1C1C1A', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: '1.2rem',
                }}>
                  {card.title}
                </h3>
                <p className="max-w-[30ch]" style={{
                  fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)', fontWeight: 300,
                  color: 'rgba(0,0,0,0.4)', lineHeight: 1.75,
                }}>
                  {card.description}
                </p>
              </div>
              <div className="flex gap-4">
                {card.tags.map((tag) => (
                  <span key={tag} className="uppercase" style={{
                    fontFamily: SANS, fontSize: 'clamp(0.5rem, 0.58vw, 0.62rem)',
                    letterSpacing: '0.25em', fontWeight: 500, color: GOLD,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Process cards — dark themed with glow, alternate right/left */}
      {PROCESS_CARDS.map((card, i) => {
        const isRight = i % 2 === 0
        return (
          <div
            key={`proc-${card.number}`}
            ref={(el) => { processCardRefs.current[i] = el }}
            className="absolute"
            style={{
              [isRight ? 'right' : 'left']: 'clamp(2rem, 8vw, 8rem)',
              top: '50%',
              transform: 'translateY(-50%)',
              width: 'min(420px, 48vw)',
              zIndex: 20,
              willChange: 'transform, opacity',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(12, 22, 16, 0.85)',
                backdropFilter: 'blur(20px)',
                padding: 'clamp(2.2rem, 4vw, 3.2rem)',
                border: '1px solid rgba(200,169,110,0.2)',
                boxShadow: `
                  0 0 50px rgba(200,169,110,0.08),
                  0 0 100px rgba(200,169,110,0.04),
                  0 30px 70px rgba(0,0,0,0.35),
                  inset 0 1px 0 rgba(200,169,110,0.1)
                `,
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span style={{
                  fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.65vw, 0.68rem)',
                  fontWeight: 600, color: GOLD, letterSpacing: '0.25em',
                }}>
                  STEP {card.number}
                </span>
                <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, ${GOLD}, transparent)`, opacity: 0.3 }} />
              </div>
              <h4 className="uppercase" style={{
                fontFamily: SANS, fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                fontWeight: 700, color: '#fff', letterSpacing: '0.06em', marginBottom: '1rem',
                textShadow: '0 0 30px rgba(200,169,110,0.15)',
              }}>
                {card.label}
              </h4>
              <p style={{
                fontFamily: SANS, fontSize: 'clamp(0.82rem, 0.9vw, 0.95rem)',
                fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8,
              }}>
                {card.desc}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
