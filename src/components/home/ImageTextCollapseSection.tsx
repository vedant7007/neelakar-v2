'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { COLORS, FONTS } from '@/lib/theme'

gsap.registerPlugin(ScrollTrigger)

const BG = COLORS.bg
const DISPLAY = FONTS.display
const SANS = FONTS.sans
const GOLD = COLORS.gold
const NUSRAT = FONTS.nusrat

export default function ImageTextCollapseSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pair1Ref = useRef<HTMLDivElement>(null)
  const pair2Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const pair1 = pair1Ref.current
      const pair2 = pair2Ref.current
      if (!container || !pair1 || !pair2) return

      gsap.set(pair1, { clipPath: 'inset(0 50% 0 50%)' })
      gsap.set(pair2, { clipPath: 'inset(0 50% 0 50%)', visibility: 'hidden' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=700vh',
          scrub: 2,
          pin: true,
        },
      })

      tl.to(pair1, {
        clipPath: 'inset(0 0% 0 0%)',
        duration: 0.18,
        ease: 'power3.inOut',
      }, 0.02)

      tl.to(pair1, {
        clipPath: 'inset(0 50% 0 50%)',
        duration: 0.16,
        ease: 'power3.inOut',
      }, 0.38)

      tl.set(pair1, { visibility: 'hidden' }, 0.54)
      tl.set(pair2, { visibility: 'visible' }, 0.54)

      tl.to(pair2, {
        clipPath: 'inset(0 0% 0 0%)',
        duration: 0.18,
        ease: 'power3.inOut',
      }, 0.56)

      tl.to(pair2, {
        clipPath: 'inset(0 50% 0 50%)',
        duration: 0.16,
        ease: 'power3.inOut',
      }, 0.82)

    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-[3] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* ═══ Pair 1: Fashion — image LEFT, text panel RIGHT, headline overlaps onto image ═══ */}
      <div ref={pair1Ref} className="absolute inset-0" style={{ willChange: 'clip-path' }}>
        {/* Image — left side */}
        <div className="absolute left-0 top-0 h-full" style={{ width: '62%' }}>
          <Image
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=1600&fit=crop"
            alt="Fashion Editorial"
            fill
            className="object-cover"
            sizes="62vw"
          />
          <div
            className="absolute top-0 right-0 h-full w-[18%]"
            style={{ background: `linear-gradient(to left, ${BG}, transparent)` }}
          />
        </div>

        {/* Text panel — right side, overflow visible so headline can break out */}
        <div
          className="absolute right-0 top-0 h-full"
          style={{ width: '38%', backgroundColor: BG, overflow: 'visible' }}
        >
          <div className="h-full flex flex-col justify-center px-[clamp(1.5rem,3vw,3rem)]">
            <span style={{
              fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.8vw, 0.85rem)', fontWeight: 600,
              color: GOLD, letterSpacing: '0.4em', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem',
            }}>
              For The Fashion Designer
            </span>

            {/* Headline — in flow, but negative margin pulls it left over the image */}
            <h2 style={{
              fontFamily: DISPLAY, fontSize: 'clamp(3rem, 5.5vw, 6.5rem)', fontWeight: 300,
              fontStyle: 'italic', color: '#fff', lineHeight: 0.95, marginBottom: '0.5em',
              marginLeft: 'clamp(-200px, -18vw, -100px)',
              textShadow: '0 2px 30px rgba(0,0,0,0.7)',
            }}>
              Your Runway<br />Is The World
            </h2>

            <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1.3rem, 2.2vw, 2.2rem)', color: GOLD, display: 'block', marginBottom: '1.2rem' }}>
              movement.
            </span>

            <div className="w-8 h-px mb-5" style={{ backgroundColor: GOLD, opacity: 0.4 }} />

            <p style={{
              fontFamily: SANS, fontSize: 'clamp(0.82rem, 0.92vw, 0.95rem)', fontWeight: 300,
              color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, maxWidth: '28ch', marginBottom: '1.5rem',
            }}>
              We build the visual intensity that commands attention, focusing on movement, structure, and the raw texture of your textiles.
            </p>

            <div className="flex gap-4">
              {['Movement', 'Structure', 'Texture'].map(tag => (
                <span key={tag} style={{
                  fontFamily: SANS, fontSize: 'clamp(0.6rem, 0.68vw, 0.7rem)', fontWeight: 500,
                  color: 'rgba(255,255,255,0.25)', letterSpacing: '0.25em', textTransform: 'uppercase',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <span className="absolute bottom-[5vh] left-[3vw]" style={{
            fontFamily: DISPLAY, fontSize: 'clamp(1.2rem, 2vw, 2.2rem)', color: 'rgba(255,255,255,0.08)', fontWeight: 300, fontStyle: 'italic',
          }}>01</span>
        </div>
      </div>

      {/* ═══ Pair 2: Jewellery — image RIGHT, text panel LEFT, headline overlaps onto image ═══ */}
      <div ref={pair2Ref} className="absolute inset-0" style={{ willChange: 'clip-path' }}>
        {/* Image — right side */}
        <div className="absolute right-0 top-0 h-full" style={{ width: '62%' }}>
          <Image
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1200&h=1600&fit=crop"
            alt="Jewellery Editorial"
            fill
            className="object-cover"
            sizes="62vw"
          />
          <div
            className="absolute top-0 left-0 h-full w-[18%]"
            style={{ background: `linear-gradient(to right, ${BG}, transparent)` }}
          />
        </div>

        {/* Text panel — left side, overflow visible so headline can break out */}
        <div
          className="absolute left-0 top-0 h-full"
          style={{ width: '38%', backgroundColor: BG, overflow: 'visible' }}
        >
          <div className="h-full flex flex-col justify-center items-end text-right px-[clamp(1.5rem,3vw,3rem)]">
            <div style={{ overflow: 'visible' }}>
              <span style={{
                fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.8vw, 0.85rem)', fontWeight: 600,
                color: GOLD, letterSpacing: '0.4em', textTransform: 'uppercase', display: 'block', marginBottom: '1.5rem',
              }}>
                For The Jewellery Couturier
              </span>

              {/* Headline — in flow, but negative margin pulls it right over the image */}
              <h2 style={{
                fontFamily: DISPLAY, fontSize: 'clamp(3rem, 5.5vw, 6.5rem)', fontWeight: 300,
                fontStyle: 'italic', color: '#fff', lineHeight: 0.95, marginBottom: '0.5em',
                marginRight: 'clamp(-200px, -18vw, -100px)',
                textShadow: '0 2px 30px rgba(0,0,0,0.7)',
              }}>
                Life Within<br />The Stone
              </h2>

              <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(1.3rem, 2.2vw, 2.2rem)', color: GOLD, display: 'block', marginBottom: '1.2rem' }}>
                radiance.
              </span>

              <div className="w-8 h-px mb-5 ml-auto" style={{ backgroundColor: GOLD, opacity: 0.4 }} />

              <p style={{
                fontFamily: SANS, fontSize: 'clamp(0.82rem, 0.92vw, 0.95rem)', fontWeight: 300,
                color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, maxWidth: '28ch', marginLeft: 'auto', marginBottom: '1.5rem',
              }}>
                Our lens finds the unspoken dialogue between the piece and the wearer, documenting the subtle complexity that defines your house.
              </p>

              <div className="flex gap-4 justify-end">
                {['Prestige', 'Heritage', 'Patina'].map(tag => (
                  <span key={tag} style={{
                    fontFamily: SANS, fontSize: 'clamp(0.6rem, 0.68vw, 0.7rem)', fontWeight: 500,
                    color: 'rgba(255,255,255,0.25)', letterSpacing: '0.25em', textTransform: 'uppercase',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <span className="absolute bottom-[5vh] right-[3vw]" style={{
            fontFamily: DISPLAY, fontSize: 'clamp(1.2rem, 2vw, 2.2rem)', color: 'rgba(255,255,255,0.08)', fontWeight: 300, fontStyle: 'italic',
          }}>02</span>
        </div>
      </div>
    </div>
  )
}
