'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const HEADLINE_FONT = "'all-round-gothic', sans-serif"
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
          end: `+=${(cards.length + 3) * 100}vh`,
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
        {/* WHAT / HOW flip */}
        <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
          <div
            ref={whatRef}
            className="font-black uppercase text-black"
            style={{ ...headlineStyle, willChange: 'transform, opacity' }}
          >
            WHAT
          </div>
          <div
            ref={howRef}
            className="absolute inset-0 font-black uppercase"
            style={{
              ...headlineStyle,
              color: GOLD,
              willChange: 'transform, opacity',
            }}
          >
            HOW
          </div>
        </div>

        <div className="flex items-center justify-between my-2">
          <div className="max-w-md pl-[2vw]">
            <p
              className="text-black/50 font-light leading-relaxed tracking-wide mb-6"
              style={{ fontSize: 'clamp(0.85rem, 1vw, 1.05rem)' }}
            >
              Vision is nothing without execution. We build both.
              We create campaigns, films, and the systems that get them made.
            </p>
            <a
              href="#"
              className="inline-block px-5 py-2.5 border border-black/80 text-black text-[0.65rem] tracking-[0.25em] uppercase font-semibold hover:bg-black hover:text-white transition-colors duration-300"
            >
              Our Services ↗
            </a>
          </div>

          <div
            className="font-black uppercase text-black"
            style={headlineStyle}
          >
            WE
          </div>
        </div>

        <div
          className="font-black uppercase text-black"
          style={headlineStyle}
        >
          DO
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
                  className="font-black uppercase leading-[1.05] text-black mb-3 whitespace-pre-line"
                  style={{
                    fontFamily: HEADLINE_FONT,
                    fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-black/50 font-light leading-relaxed text-[clamp(0.8rem,0.95vw,0.95rem)] max-w-[28ch]">
                  {card.description}
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-0.5">
                  {card.tags.map((tag) => (
                    <div
                      key={tag}
                      className="text-black/70 font-semibold text-[clamp(0.8rem,1vw,1rem)]"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <span
                  className="font-light text-black/70 leading-none"
                  style={{
                    fontFamily: HEADLINE_FONT,
                    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
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
