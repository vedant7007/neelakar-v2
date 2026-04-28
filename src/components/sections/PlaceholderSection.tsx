'use client'

import { useRef, useCallback, useEffect, useState } from 'react'

const BG_COLOR = '#060F0B'
const BRAND_FONT = "'all-round-gothic', sans-serif"
const SANS = "var(--font-dm-sans), sans-serif"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  opacity: number
}

function DustText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const [isHovered, setIsHovered] = useState(false)
  const isHoveredRef = useRef(false)

  const spawnParticles = useCallback((rect: DOMRect) => {
    const count = 12
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.2 - 0.3,
        life: 0,
        maxLife: 40 + Math.random() * 40,
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.4,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const r = container.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const r = container.getBoundingClientRect()
      ctx.clearRect(0, 0, r.width, r.height)

      if (isHoveredRef.current) {
        spawnParticles(r)
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        p.life++
        if (p.life > p.maxLife) return false

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.99
        p.vy *= 0.995

        const progress = p.life / p.maxLife
        const alpha = progress < 0.2
          ? (progress / 0.2) * p.opacity
          : p.opacity * (1 - (progress - 0.2) / 0.8)

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [spawnParticles])

  return (
    <div
      ref={containerRef}
      className={`relative inline-block cursor-default ${className || ''}`}
      onMouseEnter={() => {
        setIsHovered(true)
        isHoveredRef.current = true
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        isHoveredRef.current = false
      }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />
      <span
        className="relative z-0 transition-all duration-500"
        style={{
          filter: isHovered ? 'blur(1.5px)' : 'none',
          opacity: isHovered ? 0.6 : 1,
        }}
      >
        {text}
      </span>
    </div>
  )
}

export default function PlaceholderSection() {
  return (
    <div
      className="relative z-[4] w-full min-h-screen flex flex-col items-center justify-center px-[5vw] py-[10vh]"
      style={{ backgroundColor: BG_COLOR }}
    >
      <div className="text-center">
        <DustText
          text="Neelakar"
          className="text-white leading-[1] tracking-tight block"
        />
        <style jsx>{`
          .relative :global(span) {
            font-family: ${BRAND_FONT};
            font-weight: 700;
            font-size: clamp(5rem, 14vw, 14rem);
          }
        `}</style>

        <p
          className="text-white/20 mt-4 uppercase"
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(0.55rem, 0.7vw, 0.75rem)',
            letterSpacing: '0.5em',
            fontWeight: 500,
          }}
        >
          Creative House
        </p>
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <div className="w-12 h-px bg-white/10" />
        <p
          className="text-white/15 text-center max-w-md"
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(0.7rem, 0.8vw, 0.85rem)',
            fontWeight: 300,
            lineHeight: 1.8,
            letterSpacing: '0.02em',
          }}
        >
          Vision is nothing without execution. We build both.
        </p>
      </div>

      <div className="absolute bottom-8 text-white/10"
        style={{
          fontFamily: SANS,
          fontSize: 'clamp(0.5rem, 0.55vw, 0.6rem)',
          letterSpacing: '0.4em',
          fontWeight: 500,
        }}
      >
        &copy; 2024 NEELAKAR CREATIVE HOUSE
      </div>
    </div>
  )
}
