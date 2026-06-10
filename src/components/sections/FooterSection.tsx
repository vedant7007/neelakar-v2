'use client'

import { useRef, useCallback, useEffect } from 'react'

const BG = '#060F0B'
const GOLD = '#C8A96E'
const BRAND_FONT = "'all-round-gothic', sans-serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  opacity: number
  color: string
}

const FOOTER_LINKS = [
  { text: 'Production', href: '/production' },
  { text: 'Photography', href: '/production/photography' },
  { text: 'Films', href: '/production/videography' },
  { text: 'Inquire', href: '/create-with-us' },
]

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)
  const isHoveredRef = useRef(false)

  const spawnParticles = useCallback((w: number, h: number) => {
    const count = 25
    const skyColors = ['#4A90D9', '#6BB5FF', '#3B6CB4', '#7EC8E3', '#A0C4FF']
    for (let i = 0; i < count; i++) {
      const roll = Math.random()
      const color = roll < 0.35 ? GOLD
        : roll < 0.5 ? '#FFFFFF'
        : skyColors[Math.floor(Math.random() * skyColors.length)]
      particlesRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 1.2 - 0.3,
        life: 0,
        maxLife: 80 + Math.random() * 100,
        size: 0.5 + Math.random() * 2.2,
        opacity: 0.2 + Math.random() * 0.5,
        color,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio, 2)

    const resize = () => {
      const r = section.getBoundingClientRect()
      canvas.width = r.width * dpr
      canvas.height = r.height * dpr
      canvas.style.width = `${r.width}px`
      canvas.style.height = `${r.height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const r = section.getBoundingClientRect()
      const w = r.width
      const h = r.height
      ctx.clearRect(0, 0, w, h)

      if (isHoveredRef.current) {
        spawnParticles(w, h)
      }

      particlesRef.current = particlesRef.current.filter((p) => {
        if (!isHoveredRef.current) {
          p.life += 12
        } else {
          p.life++
        }
        if (p.life > p.maxLife) return false

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.995

        const progress = p.life / p.maxLife
        const alpha = progress < 0.15
          ? (progress / 0.15) * p.opacity
          : p.opacity * (1 - (progress - 0.15) / 0.85)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowBlur = 6
        ctx.shadowColor = p.color
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

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
    <footer
      ref={sectionRef}
      className="relative z-[6] w-full h-screen flex flex-col justify-center px-[clamp(1.5rem,5vw,5rem)]"
      style={{ backgroundColor: BG }}
    >
      {/* Full-screen particle canvas — behind everything */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      <div className="relative z-10 w-full">
        <div className="w-full h-px mb-16" style={{ backgroundColor: 'rgba(200,169,110,0.15)' }} />

        <div className="flex flex-col items-center gap-10">
          <p className="text-center" style={{
            fontFamily: SANS, fontSize: 'clamp(0.7rem, 0.85vw, 0.9rem)', fontWeight: 300,
            color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            Your vision, our form.
          </p>

          {/* NEELAKAR — hover here triggers full-screen background particles */}
          <h2
            className="text-center text-white leading-[1] tracking-tight select-none cursor-default"
            style={{
              fontFamily: BRAND_FONT,
              fontWeight: 700,
              fontSize: 'clamp(4rem, 13vw, 13rem)',
            }}
            onMouseEnter={() => { isHoveredRef.current = true }}
            onMouseLeave={() => { isHoveredRef.current = false }}
          >
            Neelakar
          </h2>

          <p style={{
            fontFamily: BRAND_FONT, fontWeight: 300, fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
            color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3em', textTransform: 'uppercase',
          }}>
            Creative House
          </p>

          <nav className="flex items-center gap-8 mt-4">
            {FOOTER_LINKS.map(link => (
              <a
                key={link.text}
                href={link.href}
                className="transition-colors duration-300 hover:text-white/70"
                style={{
                  fontFamily: SANS, fontSize: 'clamp(0.65rem, 0.75vw, 0.8rem)', fontWeight: 400,
                  color: 'rgba(255,255,255,0.45)', letterSpacing: '0.2em', textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                {link.text}
              </a>
            ))}
          </nav>

          <div className="w-full flex items-center justify-between mt-12 pt-8 border-t"
            style={{ borderColor: 'rgba(200,169,110,0.1)' }}
          >
            <span style={{ fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.6vw, 0.65rem)', fontWeight: 400, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
              Hyderabad, India
            </span>
            <span style={{ fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.6vw, 0.65rem)', fontWeight: 400, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em' }}>
              &copy; {new Date().getFullYear()} Neelakar Creative House
            </span>
            <a href="https://www.instagram.com/neelakar_house" target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: SANS, fontSize: 'clamp(0.55rem, 0.6vw, 0.65rem)', fontWeight: 400, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.15em', textDecoration: 'none' }}>
              @Neelakar_House
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
