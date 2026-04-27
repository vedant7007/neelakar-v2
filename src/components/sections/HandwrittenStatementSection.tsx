'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINES = ['MOST OF OUR', 'CLIENT WORK', 'COMES FROM']
const BG_COLOR = '#C7C7C7'
const HEADLINE_FONT = "'all-round-gothic', sans-serif"
const RUST = '#C8A96E'

export default function HandwrittenStatementSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textBlockRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])
  const lastLineRef = useRef<HTMLDivElement>(null)
  const handwrittenRef = useRef<HTMLSpanElement>(null)
  const penRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const textBlock = textBlockRef.current
      const dot = dotRef.current
      const lastLine = lastLineRef.current
      const handwritten = handwrittenRef.current
      const pen = penRef.current
      const lines = lineRefs.current.filter(Boolean) as HTMLDivElement[]
      if (!container || !textBlock || !dot || !lastLine || !handwritten || !pen || lines.length === 0) return

      gsap.set(textBlock, { x: '18vw' })
      gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(lastLine, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(handwritten, { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(pen, { left: '0%', opacity: 0 })
      gsap.set(dot, { opacity: 0, scale: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=350vh',
          scrub: 3,
          pin: true,
        },
      })

      // Text block drifts from center to left during line reveals
      tl.to(textBlock, {
        x: 0,
        duration: 0.45,
        ease: 'power2.out',
        force3D: true,
      }, 0)

      const lineInterval = 0.40 / (lines.length + 1)
      lines.forEach((line, i) => {
        tl.to(line, {
          clipPath: 'inset(0 0% 0 0)',
          duration: lineInterval * 0.85,
          ease: 'power2.out',
          force3D: true,
        }, i * lineInterval)
      })

      tl.to(lastLine, {
        clipPath: 'inset(0 0% 0 0)',
        duration: lineInterval * 0.85,
        ease: 'power2.out',
        force3D: true,
      }, lines.length * lineInterval)

      tl.to(pen, { opacity: 1, duration: 0.02 }, 0.48)
      tl.to(pen, {
        left: '100%',
        duration: 0.32,
        ease: 'power1.inOut',
      }, 0.48)
      tl.to(handwritten, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.32,
        ease: 'power1.inOut',
      }, 0.48)
      tl.to(pen, { opacity: 0, duration: 0.02 }, 0.80)

      tl.to(dot, {
        opacity: 1,
        scale: 1,
        duration: 0.08,
        ease: 'back.out(3)',
      }, 0.88)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative z-[2] w-screen h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div
        ref={textBlockRef}
        className="pl-[5vw] pr-[5vw] w-full"
        style={{ willChange: 'transform' }}
      >
        <div
          className="font-black text-neel-ink uppercase leading-[0.92]"
          style={{
            fontFamily: HEADLINE_FONT,
            fontSize: 'clamp(3rem, 9.5vw, 8rem)',
          }}
        >
          {LINES.map((line, i) => (
            <div
              key={line}
              ref={(el) => { lineRefs.current[i] = el }}
              className="block"
              style={{ willChange: 'clip-path' }}
            >
              {line}
            </div>
          ))}

          <div className="flex items-baseline flex-wrap">
            <div
              ref={lastLineRef}
              style={{ willChange: 'clip-path' }}
            >
              TRUSTED
            </div>

            <div className="relative inline-block" style={{ marginLeft: '-0.05em', paddingRight: '0.35em' }}>
              <span
                ref={handwrittenRef}
                className="inline-block"
                style={{
                  fontFamily: 'var(--font-caveat), cursive',
                  fontSize: '1.1em',
                  color: RUST,
                  fontWeight: 400,
                  textTransform: 'none',
                  lineHeight: 1,
                  willChange: 'clip-path',
                }}
              >
                Referrals
              </span>

              <div
                ref={penRef}
                className="absolute"
                style={{
                  top: '5%',
                  height: '90%',
                  width: '2px',
                  backgroundColor: RUST,
                  borderRadius: '1px',
                  willChange: 'left, opacity',
                  filter: `drop-shadow(0 0 4px ${RUST})`,
                }}
              />

              <div
                ref={dotRef}
                className="absolute rounded-full"
                style={{
                  backgroundColor: RUST,
                  width: '0.12em',
                  height: '0.12em',
                  bottom: '0.1em',
                  right: '-0.25em',
                  willChange: 'transform, opacity',
                }}
              />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
