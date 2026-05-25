'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LiquidEther from '@/components/LiquidEther'
import Shuffle from '@/components/Shuffle'

gsap.registerPlugin(ScrollTrigger)

const BG = '#060F0B'
const GOLD = '#C8A96E'
const TITLE_RED = 'rgba(160, 28, 28, 0.9)'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const NUSRAT = "'Nusrat', cursive"

const ETHER_COLORS = ['#0FF0FC', '#7B2FFF', '#00FF88', '#5B00D4', '#00C9FF'] as const

export default function MagazineCoverHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const modelRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const leftTopRef = useRef<HTMLDivElement>(null)
  const leftBotRef = useRef<HTMLDivElement>(null)
  const rightTopRef = useRef<HTMLDivElement>(null)
  const rightBotRef = useRef<HTMLDivElement>(null)
  const metaLeftRef = useRef<HTMLDivElement>(null)
  const metaRightRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mouseInHero, setMouseInHero] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const title = titleRef.current
      const model = modelRef.current
      const subtitle = subtitleRef.current
      if (!container || !title || !model || !subtitle) return

      const allText = [leftTopRef, leftBotRef, rightTopRef, rightBotRef, metaLeftRef, metaRightRef]
        .map(r => r.current).filter(Boolean) as HTMLDivElement[]

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=280vh',
          scrub: 1.5,
          pin: true,
        },
      })

      tl.to(title, { yPercent: -50, opacity: 0, duration: 0.5, ease: 'none' }, 0.5)
      tl.to(model, { yPercent: -12, opacity: 0, scale: 0.97, duration: 0.45, ease: 'none' }, 0.55)
      tl.to(subtitle, { yPercent: -20, opacity: 0, duration: 0.4, ease: 'none' }, 0.5)
      allText.forEach((el, i) => {
        tl.to(el, { y: -30, opacity: 0, duration: 0.35, ease: 'none' }, 0.52 + i * 0.02)
      })

    }, containerRef)
    return () => ctx.revert()
  }, [])

  const shuffleBaseStyle = {
    fontFamily: DISPLAY,
    fontSize: 'clamp(1.2rem, 1.6vw, 1.7rem)',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '0.04em',
  }

  const shuffleProps = {
    tag: 'span' as const,
    shuffleDirection: 'up' as const,
    animationMode: 'random' as const,
    maxDelay: 1.2,
    duration: 0.8,
    ease: 'power3.out',
    shuffleTimes: 1,
    loop: true,
    triggerOnce: false,
    triggerOnHover: false,
    rootMargin: '0px',
  }

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG }}
      onMouseEnter={() => setMouseInHero(true)}
      onMouseLeave={() => setMouseInHero(false)}
    >
      {!isMobile && mouseInHero && (
        <div className="absolute inset-0 z-[1] pointer-events-auto opacity-70">
          <LiquidEther
            colors={[...ETHER_COLORS]}
            mouseForce={12}
            cursorSize={140}
            resolution={0.5}
            iterationsPoisson={18}
            iterationsViscous={18}
            autoDemo={false}
            autoSpeed={0}
            autoIntensity={0}
            takeoverDuration={0.3}
          />
        </div>
      )}

      <h1
        ref={titleRef}
        className="absolute inset-x-0 z-[2] text-center pointer-events-none select-none"
        style={{
          fontFamily: DISPLAY,
          fontSize: 'clamp(4.5rem, 12vw, 14rem)',
          fontWeight: 900,
          lineHeight: 0.85,
          letterSpacing: '0.04em',
          color: TITLE_RED,
          top: '2vh',
          willChange: 'transform, opacity',
        }}
      >
        NEELAKAR
      </h1>

      <div
        ref={modelRef}
        className="absolute inset-0 z-[3] flex items-end justify-center"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="relative" style={{ width: 'min(100vw, 1600px)', height: '97vh', marginBottom: '-4vh' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/cutout.png"
            alt="Fashion Editorial"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom',
            }}
          />
        </div>
      </div>

      <div
        ref={subtitleRef}
        className="absolute z-[5] pointer-events-none"
        style={{
          top: 'clamp(6rem, 14vh, 13rem)',
          right: 'clamp(1.5rem, 5vw, 5rem)',
          willChange: 'transform, opacity',
        }}
      >
        <span style={{
          fontFamily: NUSRAT,
          fontSize: 'clamp(1.6rem, 2.8vw, 2.8rem)',
          color: GOLD,
          lineHeight: 1.1,
          display: 'inline-block',
          fontStyle: 'normal',
        }}>
          Fashion &amp; Jewellery
        </span>
      </div>

      {/* LEFT-TOP */}
      <div
        ref={leftTopRef}
        className="absolute z-[5] pointer-events-none left-[clamp(1.5rem,4vw,4rem)] top-[clamp(11rem,30vh,25rem)]"
        style={{ maxWidth: 'clamp(180px, 18vw, 260px)', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.5em' }}>
          <Shuffle
            text="HONORING THE CRAFT"
            {...shuffleProps}
            textAlign="left"
            loopDelay={6}
            style={{ ...shuffleBaseStyle, color: TITLE_RED }}
            className="font-[inherit] !leading-[1.2]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.78vw, 0.85rem)', fontWeight: 300, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
          Translating the painstaking details of design into an enchanting editorial vision.
        </p>
      </div>

      {/* LEFT-BOTTOM */}
      <div
        ref={leftBotRef}
        className="absolute z-[5] pointer-events-none left-[clamp(1.5rem,4vw,4rem)] bottom-[clamp(5rem,14vh,11rem)]"
        style={{ maxWidth: 'clamp(180px, 18vw, 260px)', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.5em' }}>
          <Shuffle
            text="THE ARCHITECTURE OF ADORNMENT"
            {...shuffleProps}
            textAlign="left"
            loopDelay={7}
            style={{ ...shuffleBaseStyle, color: TITLE_RED }}
            className="font-[inherit] !leading-[1.2]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.78vw, 0.85rem)', fontWeight: 300, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
          Where Sculptural Heritage Meets the Modern Eye.
        </p>
      </div>

      {/* RIGHT-TOP */}
      <div
        ref={rightTopRef}
        className="absolute z-[5] pointer-events-none right-[clamp(1.5rem,4vw,4rem)] top-[clamp(11rem,30vh,25rem)]"
        style={{ maxWidth: 'clamp(180px, 18vw, 260px)', textAlign: 'right', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.4em' }}>
          <Shuffle
            text="THE NEELAKAR EDITION"
            {...shuffleProps}
            textAlign="right"
            loopDelay={6.5}
            style={{ ...shuffleBaseStyle, color: GOLD }}
            className="font-[inherit] !leading-[1.2]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.78vw, 0.85rem)', fontWeight: 300, color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
          Neelakar Creative House
        </p>
      </div>

      {/* RIGHT-BOTTOM */}
      <div
        ref={rightBotRef}
        className="absolute z-[5] pointer-events-none right-[clamp(1.5rem,4vw,4rem)] bottom-[clamp(5rem,10vh,8rem)]"
        style={{ maxWidth: 'clamp(180px, 18vw, 260px)', textAlign: 'right', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.5em' }}>
          <Shuffle
            text="A CONVERSATION IN LIGHT"
            {...shuffleProps}
            textAlign="right"
            loopDelay={7}
            style={{ ...shuffleBaseStyle, color: GOLD }}
            className="font-[inherit] !leading-[1.2]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.78vw, 0.85rem)', fontWeight: 300, color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
          Crafting a Visual Lexicon for Designers and Jewelers.
        </p>
      </div>

      {/* Meta */}
      <div
        ref={metaLeftRef}
        className="absolute bottom-7 left-[clamp(1.5rem,4vw,4rem)] z-[5] pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <span style={{ fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
          2026
        </span>
      </div>

      <div
        ref={metaRightRef}
        className="absolute bottom-7 right-[clamp(1.5rem,4vw,4rem)] z-[5] pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <span style={{ fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
          @Neelakar_House
        </span>
      </div>
    </div>
  )
}
