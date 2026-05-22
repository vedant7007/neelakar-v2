'use client'

import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import LiquidEther from '@/components/LiquidEther'
import Shuffle from '@/components/Shuffle'

gsap.registerPlugin(ScrollTrigger)

const BG = '#060F0B'
const GOLD = '#C8A96E'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"
const NUSRAT = "'Nusrat', cursive"
const TITLE_RED = 'rgba(160, 28, 28, 0.9)'

const ETHER_COLORS = ['#0FF0FC', '#7B2FFF', '#00FF88', '#5B00D4', '#00C9FF'] as const

export default function MagazineCoverHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const leftTopRef = useRef<HTMLDivElement>(null)
  const leftBotRef = useRef<HTMLDivElement>(null)
  const rightTopRef = useRef<HTMLDivElement>(null)
  const rightBotRef = useRef<HTMLDivElement>(null)
  const metaLeftRef = useRef<HTMLDivElement>(null)
  const metaRightRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

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
      const subtitle = subtitleRef.current
      const imageWrap = imageWrapRef.current
      if (!container || !title || !subtitle || !imageWrap) return

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

      tl.to(title, { yPercent: -30, opacity: 0, duration: 0.5, ease: 'none' }, 0.5)
      tl.to(subtitle, { yPercent: -20, opacity: 0, duration: 0.4, ease: 'none' }, 0.5)
      tl.to(imageWrap, { scale: 0.95, opacity: 0, duration: 0.45, ease: 'none' }, 0.5)
      allText.forEach((el, i) => {
        tl.to(el, { y: -30, opacity: 0, duration: 0.35, ease: 'none' }, 0.52 + i * 0.02)
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const shuffleBaseStyle = {
    fontFamily: DISPLAY,
    fontSize: 'clamp(1.2rem, 1.7vw, 1.75rem)',
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '0.04em',
  }

  return (
    <div
      ref={containerRef}
      className="relative z-[1] w-full h-screen overflow-hidden"
      style={{ backgroundColor: BG }}
    >
      {!isMobile && (
        <div className="absolute inset-0 z-[1] pointer-events-auto opacity-40">
          <LiquidEther
            colors={[...ETHER_COLORS]}
            mouseForce={6}
            cursorSize={90}
            resolution={0.4}
            iterationsPoisson={12}
            iterationsViscous={12}
            isBounce
            autoDemo
            autoSpeed={0.25}
            autoIntensity={1.2}
            takeoverDuration={0.4}
            autoResumeDelay={2000}
            autoRampDuration={1.2}
          />
        </div>
      )}

      <h1
        ref={titleRef}
        className="absolute inset-x-0 top-0 z-[2] text-center pointer-events-none select-none"
        style={{
          fontFamily: DISPLAY,
          fontSize: 'clamp(6rem, 20vw, 26rem)',
          fontWeight: 900,
          lineHeight: 0.78,
          letterSpacing: '-0.04em',
          color: TITLE_RED,
          paddingTop: 'clamp(0.5rem, 2vh, 2rem)',
          willChange: 'transform, opacity',
        }}
      >
        NEELAKAR
      </h1>

      <div
        ref={imageWrapRef}
        className="absolute inset-0 z-[3]"
        style={{ willChange: 'transform, opacity' }}
      >
        <Image
          src="https://images.unsplash.com/photo-1504730030853-eff311f57d3c?w=1920&h=1200&fit=crop&q=90"
          alt="Fashion Editorial"
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 50% 45%, transparent 15%, rgba(6,15,11,0.45) 45%, ${BG} 80%),
              linear-gradient(to top, ${BG} 0%, transparent 25%),
              linear-gradient(to bottom, rgba(6,15,11,0.55) 0%, transparent 20%),
              linear-gradient(to right, ${BG} 0%, transparent 25%),
              linear-gradient(to left, ${BG} 0%, transparent 25%)
            `,
          }}
        />
      </div>

      <div
        ref={subtitleRef}
        className="absolute z-[4] pointer-events-none"
        style={{
          top: 'clamp(6rem, 14vh, 13rem)',
          right: 'clamp(1.5rem, 6vw, 6rem)',
          willChange: 'transform, opacity',
        }}
      >
        <span style={{ fontFamily: NUSRAT, fontSize: 'clamp(2rem, 5vw, 5rem)', color: GOLD, lineHeight: 1.1 }}>
          Fashion &amp; Jewellery
        </span>
      </div>

      {/* LEFT-TOP callout */}
      <div
        ref={leftTopRef}
        className="absolute z-[4] pointer-events-none left-[clamp(1.5rem,4vw,4rem)] top-[clamp(11rem,30vh,25rem)]"
        style={{ maxWidth: 'clamp(220px, 24vw, 320px)', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.5em' }}>
          <Shuffle
            text="HONORING THE CRAFT"
            tag="span"
            textAlign="left"
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
            style={{ ...shuffleBaseStyle, color: TITLE_RED }}
            className="font-[inherit] !leading-[1.25]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.85rem, 1vw, 1.05rem)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
          Translating the painstaking details of design into an enchanting editorial vision.
        </p>
      </div>

      {/* LEFT-BOTTOM callout */}
      <div
        ref={leftBotRef}
        className="absolute z-[4] pointer-events-none left-[clamp(1.5rem,4vw,4rem)] bottom-[clamp(5rem,14vh,11rem)]"
        style={{ maxWidth: 'clamp(220px, 24vw, 320px)', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.5em' }}>
          <Shuffle
            text="THE ARCHITECTURE OF ADORNMENT"
            tag="span"
            textAlign="left"
            shuffleDirection="up"
            animationMode="random"
            maxDelay={4.5}
            duration={1.4}
            ease="sine.inOut"
            shuffleTimes={1}
            loop
            loopDelay={9}
            triggerOnce={false}
            triggerOnHover={false}
            rootMargin="0px"
            style={{ ...shuffleBaseStyle, color: TITLE_RED }}
            className="font-[inherit] !leading-[1.25]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.85rem, 1vw, 1.05rem)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
          Where Sculptural Heritage Meets the Modern Eye.
        </p>
      </div>

      {/* RIGHT-TOP: THE PORTFOLIO EDITION */}
      <div
        ref={rightTopRef}
        className="absolute z-[4] pointer-events-none right-[clamp(1.5rem,4vw,4rem)] top-[clamp(11rem,30vh,25rem)]"
        style={{ maxWidth: 'clamp(220px, 24vw, 320px)', textAlign: 'right', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.4em' }}>
          <Shuffle
            text="THE PORTFOLIO EDITION"
            tag="span"
            textAlign="right"
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
            style={{ ...shuffleBaseStyle, fontSize: 'clamp(1.2rem, 1.65vw, 1.7rem)', color: GOLD }}
            className="font-[inherit] !leading-[1.25]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.85rem, 1vw, 1.05rem)', fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
          Neelakar Creative House
        </p>
      </div>

      {/* RIGHT-BOTTOM callout */}
      <div
        ref={rightBotRef}
        className="absolute z-[4] pointer-events-none right-[clamp(1.5rem,4vw,4rem)] bottom-[clamp(5rem,14vh,11rem)]"
        style={{ maxWidth: 'clamp(220px, 24vw, 320px)', textAlign: 'right', willChange: 'transform, opacity' }}
      >
        <div style={{ marginBottom: '0.5em' }}>
          <Shuffle
            text="A CONVERSATION IN LIGHT"
            tag="span"
            textAlign="right"
            shuffleDirection="up"
            animationMode="random"
            maxDelay={4.2}
            duration={1.4}
            ease="sine.inOut"
            shuffleTimes={1}
            loop
            loopDelay={8.5}
            triggerOnce={false}
            triggerOnHover={false}
            rootMargin="0px"
            style={{ ...shuffleBaseStyle, color: GOLD }}
            className="font-[inherit] !leading-[1.25]"
          />
        </div>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(0.85rem, 1vw, 1.05rem)', fontWeight: 300, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
          Crafting a Visual Lexicon for Designers and Jewelers.
        </p>
      </div>

      <div
        ref={metaLeftRef}
        className="absolute bottom-7 left-[clamp(1.5rem,4vw,4rem)] z-[4] pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <span style={{ fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
          2026
        </span>
      </div>

      <div
        ref={metaRightRef}
        className="absolute bottom-7 right-[clamp(1.5rem,4vw,4rem)] z-[4] pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <span style={{ fontFamily: SANS, fontSize: 'clamp(0.78rem, 0.85vw, 0.9rem)', fontWeight: 400, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
          @Neelakar_House
        </span>
      </div>
    </div>
  )
}
