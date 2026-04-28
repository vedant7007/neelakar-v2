'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE_FONT = "var(--font-neel-display), 'Playfair Display', serif"
const GOLD = '#C8A96E'

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

const CARD_ROTATIONS = [3, -2.5, 4, -3]

export default function WhatWeDoSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgTextRef = useRef<HTMLDivElement>(null)
  const whatRef = useRef<HTMLDivElement>(null)
  const howRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const bgText = bgTextRef.current
      const whatEl = whatRef.current
      const howEl = howRef.current
      if (!section || !bgText || !whatEl || !howEl) return

      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[]
      if (cards.length === 0) return

      gsap.set(howEl, { rotationX: -90, opacity: 0 })

      cards.forEach((card, i) => {
        gsap.set(card, {
          y: '120vh',
          rotation: CARD_ROTATIONS[i] * 2.5,
          opacity: 0,
        })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(cards.length + 3) * 150}vh`,
          scrub: 3,
          pin: true,
        },
      })

      // Phase 1 (0%→20%): WHAT flips to HOW
      tl.to(whatEl, {
        rotationX: 90,
        opacity: 0,
        duration: 0.08,
        ease: 'power2.in',
        force3D: true,
      }, 0.06)

      tl.to(howEl, {
        rotationX: 0,
        opacity: 1,
        duration: 0.08,
        ease: 'power2.out',
        force3D: true,
      }, 0.12)

      // Phase 2 (22%→30%): Background text blurs
      tl.to(bgText, {
        filter: 'blur(10px)',
        opacity: 0.35,
        duration: 0.10,
      }, 0.22)

      // Phase 3 (30%→90%): Cards stack in
      const segmentSize = 0.60 / cards.length
      cards.forEach((card, i) => {
        const start = 0.30 + i * segmentSize

        tl.to(card, {
          y: 0,
          rotation: CARD_ROTATIONS[i],
          opacity: 1,
          duration: segmentSize * 0.6,
          ease: 'power3.out',
          force3D: true,
        }, start)
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const headlineStyle = {
    fontFamily: HEADLINE_FONT,
    fontSize: 'clamp(5.5rem, 16vw, 15rem)',
    lineHeight: 0.88,
  }

  return (
    <div
      ref={sectionRef}
      className="relative z-[5] w-full h-screen overflow-hidden"
      style={{ backgroundColor: '#F5F5F0' }}
    >
      {/* ── Background typography ── */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 px-[5vw] flex flex-col justify-center"
        style={{ willChange: 'filter, opacity', perspective: '1200px' }}
      >
        {/* WHAT / HOW flip + We Do stacked tight */}
        <div className="flex flex-col gap-0">
          <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
            <div
              ref={whatRef}
              className="italic text-black"
              style={{ ...headlineStyle, fontWeight: 300, willChange: 'transform, opacity' }}
            >
              What
            </div>
            <div
              ref={howRef}
              className="absolute inset-0 italic"
              style={{
                ...headlineStyle,
                fontWeight: 300,
                color: GOLD,
                willChange: 'transform, opacity',
              }}
            >
              How
            </div>
          </div>

          <div
            className="italic text-black"
            style={{ ...headlineStyle, fontWeight: 300 }}
          >
            We Do
          </div>
        </div>

        {/* Description + CTA below the headline */}
        <div className="mt-6 pl-[1vw] max-w-lg">
          <p
            className="text-black/40 leading-[1.8] mb-6"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 'clamp(0.8rem, 0.9vw, 0.95rem)',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          >
            Vision is nothing without execution. We build both.
            We create campaigns, films, and the systems that get them made.
          </p>
          <a
            href="#"
            className="inline-block px-5 py-2.5 border border-black/80 text-black hover:bg-black hover:text-white transition-colors duration-300 uppercase"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: 'clamp(0.5rem, 0.6vw, 0.65rem)',
              letterSpacing: '0.35em',
              fontWeight: 600,
            }}
          >
            Our Services
          </a>
        </div>
      </div>

      {/* ── Stacking cards ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {SERVICE_CARDS.map((card, i) => (
          <div
            key={card.number}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
            className="absolute"
            style={{
              width: 'min(420px, 75vw)',
              zIndex: 10 + i,
              willChange: 'transform, opacity',
            }}
          >
            <div
              className="rounded-2xl p-[clamp(1.5rem,3vw,2.5rem)] flex flex-col justify-between shadow-xl"
              style={{
                backgroundColor: '#D5DAE0',
                aspectRatio: '3 / 4',
              }}
            >
              <div>
                <h3
                  className="italic leading-[1.05] text-black mb-3 whitespace-pre-line"
                  style={{
                    fontFamily: HEADLINE_FONT,
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                    fontWeight: 400,
                  }}
                >
                  {card.title}
                </h3>
                <p
                  className="text-black/40 leading-[1.7] max-w-[28ch]"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: 'clamp(0.75rem, 0.85vw, 0.9rem)',
                    fontWeight: 300,
                    letterSpacing: '0.015em',
                  }}
                >
                  {card.description}
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-0.5">
                  {card.tags.map((tag) => (
                    <div
                      key={tag}
                      className="text-black/50 uppercase"
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: 'clamp(0.55rem, 0.65vw, 0.7rem)',
                        letterSpacing: '0.3em',
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <span
                  className="italic text-black/15 leading-none"
                  style={{
                    fontFamily: HEADLINE_FONT,
                    fontSize: 'clamp(3rem, 6vw, 5.5rem)',
                    fontWeight: 300,
                  }}
                >
                  {card.number}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
