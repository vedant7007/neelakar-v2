'use client'

import { useEffect, useRef } from 'react'

interface OrbitCanvasProps {
  images: string[]
}

export default function OrbitCanvas({ images }: OrbitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let angle = 0
    let raf = 0
    let mouseX = 0
    let mouseY = 0
    let targetMouseX = 0
    let targetMouseY = 0

    const items: { img: HTMLImageElement; loaded: boolean }[] = images.map((src) => {
      const el = new Image()
      el.crossOrigin = 'anonymous'
      el.src = src
      const item = { img: el, loaded: false }
      el.onload = () => { item.loaded = true }
      return item
    })

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
    }

    const onMouse = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)

    const render = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) * 0.42
      const rx = radius
      const ry = radius
      const thumbW = 32 * dpr
      const thumbH = 40 * dpr
      const n = items.length

      mouseX += (targetMouseX - mouseX) * 0.04
      mouseY += (targetMouseY - mouseY) * 0.04

      const parallaxX = mouseX * 12 * dpr
      const parallaxY = mouseY * 8 * dpr

      ctx.clearRect(0, 0, w, h)

      if (n === 0) { raf = requestAnimationFrame(render); return }

      const positions = items.map((item, i) => {
        const a = angle + (i / n) * Math.PI * 2
        const cosA = Math.cos(a)
        const sinA = Math.sin(a)
        return {
          item,
          x: cx + cosA * rx + parallaxX * (sinA * 0.15),
          y: cy + sinA * ry + parallaxY * (cosA * 0.1),
          z: sinA,
        }
      })

      positions.sort((a, b) => a.z - b.z)

      positions.forEach(({ item, x, y, z }) => {
        if (!item.loaded) return
        const t = (z + 1) / 2
        const scale = 0.45 + t * 0.55
        const sw = thumbW * scale
        const sh = thumbH * scale
        ctx.globalAlpha = 0.12 + t * 0.63
        ctx.drawImage(item.img, x - sw / 2, y - sh / 2, sw, sh)
      })

      ctx.globalAlpha = 1
      angle += 0.0012
      raf = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [images])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
