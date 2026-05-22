'use client'

import { useEffect, useRef } from 'react'

const GOLD_PALETTE = ['#C8A96E', '#E8D5A8', '#FFFBE6', '#D4AF37', '#F5E6C8']

interface Sparkle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
  twinkleSpeed: number
  twinkleOffset: number
  glow: number
}

export default function SparkleClickEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparklesRef = useRef<Sparkle[]>([])
  const rafRef = useRef<number>(0)
  const activeRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const canvas = document.createElement('canvas')
    canvas.style.cssText =
      'position:fixed;inset:0;pointer-events:none;z-index:99997;width:100%;height:100%'
    document.body.appendChild(canvas)
    canvasRef.current = canvas

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      const sparks = sparklesRef.current
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.life++
        if (s.life > s.maxLife) {
          sparks.splice(i, 1)
          continue
        }

        s.x += s.vx
        s.y += s.vy
        s.vy += 0.015
        s.vx *= 0.99
        s.vy *= 0.995

        const progress = s.life / s.maxLife
        const fadeIn = Math.min(progress / 0.1, 1)
        const fadeOut = progress > 0.4 ? 1 - (progress - 0.4) / 0.6 : 1
        const twinkle = 0.6 + 0.4 * Math.sin(s.life * s.twinkleSpeed + s.twinkleOffset)
        const alpha = fadeIn * fadeOut * twinkle

        const currentSize = s.size * (1 - progress * 0.5)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.shadowBlur = s.glow
        ctx.shadowColor = s.color
        ctx.fillStyle = s.color
        ctx.beginPath()
        ctx.arc(s.x, s.y, currentSize, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      if (sparks.length > 0) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        activeRef.current = false
      }
    }

    const spawn = (x: number, y: number) => {
      const count = 18 + Math.floor(Math.random() * 10)
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 0.4 + Math.random() * 1.8
        sparklesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          size: 0.8 + Math.random() * 2,
          life: 0,
          maxLife: 30 + Math.random() * 45,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          twinkleSpeed: 0.15 + Math.random() * 0.25,
          twinkleOffset: Math.random() * Math.PI * 2,
          glow: 3 + Math.random() * 6,
        })
      }

      if (!activeRef.current) {
        activeRef.current = true
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (target?.closest?.('input, textarea, select, button, a')) return
      spawn(e.clientX, e.clientY)
    }

    window.addEventListener('click', onClick, { passive: true })

    return () => {
      window.removeEventListener('click', onClick)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(rafRef.current)
      canvas.remove()
    }
  }, [])

  return null
}
