'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const BG = '#060F0B'
const GOLD = '#C8A96E'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const NUSRAT = "'Nusrat', cursive"

const CAMPAIGNS = [
  {
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1600&h=900&fit=crop&q=85',
    label: 'FASHION EDITORIAL',
    headline1: 'The Art of',
    headline2: 'Draping',
    accent: 'silk.',
    description: 'A cinematic exploration of how fabric becomes form — movement captured in every frame.',
    tags: ['Direction', 'Photography', 'Styling'],
  },
  {
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=900&fit=crop&q=85',
    label: 'JEWELLERY CAMPAIGN',
    headline1: 'Heritage in',
    headline2: 'Every Stone',
    accent: 'radiance.',
    description: 'Where traditional craftsmanship meets contemporary vision — each piece tells a dynasty.',
    tags: ['Campaign', 'Film', 'Post'],
  },
  {
    image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1600&h=900&fit=crop&q=85',
    label: 'BRAND IDENTITY',
    headline1: 'Building',
    headline2: 'Visual Worlds',
    accent: 'narrative.',
    description: 'Complete identity systems that transform brands from names into living experiences.',
    tags: ['Strategy', 'Identity', 'Systems'],
  },
  {
    image: 'https://images.unsplash.com/photo-1490725263030-1f0521cec8ec?w=1600&h=900&fit=crop&q=85',
    label: 'FILM PRODUCTION',
    headline1: 'Frames That',
    headline2: 'Linger',
    accent: 'emotion.',
    description: 'Cinematic campaigns that stay in the mind long after the screen goes dark.',
    tags: ['Direction', 'Production', 'Grade'],
  },
]

export default function CampaignsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const counterRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current
      const title = titleRef.current
      const images = imageRefs.current.filter(Boolean) as HTMLDivElement[]
      const texts = textRefs.current.filter(Boolean) as HTMLDivElement[]
      const counter = counterRef.current
      if (!section || !title || images.length === 0) return

      images.forEach((img) => gsap.set(img, { opacity: 0 }))
      texts.forEach((t) => {
        const lines = t.querySelectorAll('.anim-line')
        gsap.set(lines, { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' })
      })
      gsap.set(images[0], { opacity: 1 })

      const total = CAMPAIGNS.length
      const seg = 1 / (total + 1.5)

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${(total + 2) * 500}vh`,
          scrub: 2.5,
          pin: true,
        },
      })

      tl.to(title, { opacity: 0, y: -60, duration: seg * 0.5, ease: 'power2.inOut' }, seg * 0.4)

      // First text enters
      if (texts[0]) {
        const lines = texts[0].querySelectorAll('.anim-line')
        lines.forEach((line, li) => {
          tl.to(line, {
            opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
            duration: seg * 0.4, ease: 'power3.out',
          }, seg * 0.55 + li * seg * 0.06)
        })
      }

      for (let i = 1; i < total; i++) {
        const start = (i + 0.5) * seg

        // Text out — lines slide out staggered
        if (texts[i - 1]) {
          const prevLines = texts[i - 1].querySelectorAll('.anim-line')
          prevLines.forEach((line, li) => {
            tl.to(line, {
              opacity: 0, y: -40, clipPath: 'inset(100% 0 0 0)',
              duration: seg * 0.3, ease: 'power2.in',
            }, start + li * seg * 0.04)
          })
        }

        // Image crossfade
        tl.to(images[i - 1], { opacity: 0, duration: seg * 0.5, ease: 'power1.inOut' }, start + seg * 0.25)
        tl.to(images[i], { opacity: 1, duration: seg * 0.5, ease: 'power1.inOut' }, start + seg * 0.35)

        // Text in — lines reveal staggered
        if (texts[i]) {
          const nextLines = texts[i].querySelectorAll('.anim-line')
          nextLines.forEach((line, li) => {
            tl.to(line, {
              opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
              duration: seg * 0.4, ease: 'power3.out',
            }, start + seg * 0.55 + li * seg * 0.06)
          })
        }

        if (counter) {
          tl.to(counter, { innerText: String(i + 1).padStart(2, '0'), snap: { innerText: 1 }, duration: 0.01 }, start + seg * 0.5)
        }
      }

      // Final exit
      const finalStart = (total + 0.3) * seg
      if (texts[total - 1]) {
        const lastLines = texts[total - 1].querySelectorAll('.anim-line')
        lastLines.forEach((line, li) => {
          tl.to(line, {
            opacity: 0, y: -40, clipPath: 'inset(100% 0 0 0)',
            duration: seg * 0.3, ease: 'power2.in',
          }, finalStart + li * seg * 0.04)
        })
      }
      tl.to(images[total - 1], { opacity: 0.3, duration: seg * 0.5 }, finalStart + seg * 0.25)

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative z-[4] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* Title */}
      <div ref={titleRef} className="absolute inset-0 flex flex-col items-center justify-center z-20"
        style={{ willChange: 'transform, opacity' }}>
        <span style={{
          fontFamily: SANS, fontSize: 'clamp(0.65rem, 0.75vw, 0.8rem)', fontWeight: 500,
          color: GOLD, letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: '1.5rem',
        }}>Selected Works</span>
        <h2 className="italic text-center" style={{
          fontFamily: DISPLAY, fontSize: 'clamp(3.5rem, 10vw, 10rem)', fontWeight: 300,
          color: '#fff', lineHeight: 0.92,
        }}>Our<br />Campaigns</h2>
        <div className="w-12 h-px mt-8" style={{ backgroundColor: GOLD, opacity: 0.3 }} />
      </div>

      {/* Images */}
      {CAMPAIGNS.map((c, i) => (
        <div key={`img-${i}`} ref={(el) => { imageRefs.current[i] = el }}
          className="absolute inset-0 z-[5]" style={{ willChange: 'opacity' }}>
          <Image src={c.image} alt={`${c.headline1} ${c.headline2}`} fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, rgba(6,15,11,0.7) 0%, rgba(6,15,11,0.3) 50%, rgba(6,15,11,0.6) 100%)',
          }} />
        </div>
      ))}

      {/* Text — each element is an .anim-line for staggered clip-path reveal */}
      {CAMPAIGNS.map((c, i) => {
        const isEven = i % 2 === 0
        return (
          <div key={`text-${i}`} ref={(el) => { textRefs.current[i] = el }}
            className={`absolute inset-0 z-[15] flex items-center ${isEven ? 'justify-start' : 'justify-end'}`}
            style={{ padding: 'clamp(2rem, 7vw, 7rem)' }}>
            <div className={`max-w-lg ${isEven ? 'text-left' : 'text-right'}`}>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path' }}>
                <span style={{
                  fontFamily: SANS, fontSize: 'clamp(0.65rem, 0.72vw, 0.75rem)', fontWeight: 600,
                  color: GOLD, letterSpacing: '0.4em', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem',
                }}>{c.label}</span>
              </div>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path' }}>
                <span style={{
                  fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', fontWeight: 300,
                  fontStyle: 'italic', color: '#fff', lineHeight: 1.05, display: 'block',
                }}>{c.headline1}</span>
              </div>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path', marginBottom: '0.3em' }}>
                <span style={{
                  fontFamily: DISPLAY, fontSize: 'clamp(2.8rem, 5.5vw, 5.5rem)', fontWeight: 300,
                  fontStyle: 'italic', color: '#fff', lineHeight: 1.05, display: 'block',
                }}>{c.headline2}</span>
              </div>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path' }}>
                <span style={{
                  fontFamily: NUSRAT, fontSize: 'clamp(1.8rem, 3.5vw, 3.5rem)',
                  color: GOLD, display: 'block', marginBottom: '1.5rem',
                }}>{c.accent}</span>
              </div>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path' }}>
                <div className={`h-px w-10 mb-6 ${isEven ? '' : 'ml-auto'}`}
                  style={{ backgroundColor: GOLD, opacity: 0.4 }} />
              </div>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path' }}>
                <p style={{
                  fontFamily: SANS, fontSize: 'clamp(0.82rem, 0.88vw, 0.92rem)', fontWeight: 300,
                  color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '1.5rem', maxWidth: '36ch',
                }} className={isEven ? '' : 'ml-auto'}>{c.description}</p>
              </div>

              <div className="anim-line" style={{ willChange: 'transform, opacity, clip-path' }}>
                <div className={`flex gap-4 ${isEven ? '' : 'justify-end'}`}>
                  {c.tags.map((tag) => (
                    <span key={tag} style={{
                      fontFamily: SANS, fontSize: 'clamp(0.58rem, 0.62vw, 0.65rem)', fontWeight: 500,
                      color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em', textTransform: 'uppercase',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )
      })}

      {/* Counter */}
      <div ref={counterRef} className="absolute bottom-8 right-[clamp(1.5rem,5vw,5rem)] z-20"
        style={{ fontFamily: DISPLAY, fontSize: 'clamp(1rem, 1.5vw, 1.5rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.25)' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)' }}>01</span>
        <span style={{ margin: '0 0.5em', color: 'rgba(255,255,255,0.15)' }}>/</span>
        <span>{String(CAMPAIGNS.length).padStart(2, '0')}</span>
      </div>
    </div>
  )
}
