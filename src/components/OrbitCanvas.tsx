'use client'

import { useEffect, useRef } from 'react'

interface OrbitCanvasProps {
  images: string[]
  backgrounds?: string[]
}

export default function OrbitCanvas({ images, backgrounds }: OrbitCanvasProps) {
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
    let scrollVelocity = 0
    let targetScrollVelocity = 0
    let bgOpacity = 0
    let activeIdx = 0
    let stripOffset = 0

    const items: { img: HTMLImageElement; loaded: boolean }[] = images.map((src) => {
      const el = new Image()
      el.crossOrigin = 'anonymous'
      el.referrerPolicy = 'no-referrer'
      const item = { img: el, loaded: false }
      el.onload = () => { item.loaded = true }
      el.onerror = () => { item.loaded = false }
      el.src = src
      return item
    })

    const bgItems: { img: HTMLImageElement; loaded: boolean }[] = (backgrounds || []).map((src) => {
      const el = new Image()
      el.crossOrigin = 'anonymous'
      el.referrerPolicy = 'no-referrer'
      const item = { img: el, loaded: false }
      el.onload = () => { item.loaded = true }
      el.onerror = () => { item.loaded = false }
      el.src = src
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetScrollVelocity += e.deltaY * 0.00008
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('wheel', onWheel, { passive: false })

    const render = () => {
      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const radius = Math.min(w, h) * 0.42
      const rx = radius
      const ry = radius
      const thumbW = 60 * dpr
      const thumbH = 75 * dpr
      const n = items.length

      mouseX += (targetMouseX - mouseX) * 0.04
      mouseY += (targetMouseY - mouseY) * 0.04

      const parallaxX = mouseX * 12 * dpr
      const parallaxY = mouseY * 8 * dpr

      ctx.clearRect(0, 0, w, h)

      if (n === 0) { raf = requestAnimationFrame(render); return }

      // Find which thumbnail is at the bottom (front) of the circle
      let maxSin = -2
      for (let i = 0; i < n; i++) {
        const a = angle + (i / n) * Math.PI * 2
        const s = Math.sin(a)
        if (s > maxSin) { maxSin = s; activeIdx = i }
      }

      // Background strip — portrait images with blur at edges
      if (bgItems.length > 0) {
        const stripImgH = h
        const stripImgW = stripImgH * 0.6
        const cellW = stripImgW
        const edgeZone = w * 0.25

        stripOffset -= 0.5 * dpr + scrollVelocity * 400 * dpr

        const isScrolling = Math.abs(scrollVelocity) > 0.001
        const targetOp = isScrolling ? 0.45 : 0
        bgOpacity += (targetOp - bgOpacity) * 0.25

        if (bgOpacity > 0.005) {
          const startI = Math.floor(-stripOffset / cellW) - 1
          const endI = startI + Math.ceil(w / cellW) + 3
          for (let i = startI; i <= endI; i++) {
            const idx = ((i % bgItems.length) + bgItems.length) % bgItems.length
            const bg = bgItems[idx]
            if (!bg?.loaded) continue
            const x = stripOffset + i * cellW
            const imgCx = x + stripImgW / 2

            let blur = 0
            if (imgCx < edgeZone) {
              blur = (1 - imgCx / edgeZone) * 8 * dpr
            } else if (imgCx > w - edgeZone) {
              blur = (1 - (w - imgCx) / edgeZone) * 8 * dpr
            }

            ctx.globalAlpha = bgOpacity
            ctx.filter = blur > 0.5 ? `blur(${blur}px)` : 'none'
            ctx.drawImage(bg.img, x, 0, stripImgW, stripImgH)
          }
          ctx.filter = 'none'
          ctx.globalAlpha = 1
        }
      }

      // Orbit thumbnails
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

      positions.forEach(({ item, x, y }) => {
        if (!item.loaded) return
        const sw = thumbW
        const sh = thumbH
        ctx.globalAlpha = 0.6
        ctx.shadowColor = 'rgba(200,169,110,0.85)'
        ctx.shadowBlur = 40 * dpr
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.drawImage(item.img, x - sw / 2, y - sh / 2, sw, sh)
        ctx.shadowColor = 'transparent'
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
        ctx.drawImage(item.img, x - sw / 2, y - sh / 2, sw, sh)
      })

      ctx.globalAlpha = 1
      scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.08
      targetScrollVelocity *= 0.95
      angle += 0.0012 + scrollVelocity
      raf = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('wheel', onWheel)
    }
  }, [images, backgrounds])

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
