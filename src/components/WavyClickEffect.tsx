'use client'

import { useEffect } from 'react'
import gsap from 'gsap'

const CONFIG = {
  color: 'rgb(227, 83, 66)',
  duration: 0.7,
  effectSize: 85,
  strokeWidth: 3,
  rotation: 0,
}

const ANGLES = [45, 90, 135, 180]

function createWavyEffect(x: number, y: number) {
  const { color, duration, effectSize: o, strokeWidth: sw, rotation } = CONFIG

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', String(o))
  svg.setAttribute('height', String(o))
  svg.style.cssText = `
    position: fixed;
    left: ${x - o / 2}px;
    top: ${y - o / 2}px;
    pointer-events: none;
    overflow: visible;
    transform: rotate(${rotation}deg);
    transform-origin: center;
    z-index: 99997;
  `

  const paths: SVGPathElement[] = []

  ANGLES.forEach((angleDeg) => {
    const t = (angleDeg * Math.PI) / 180
    const cx = o / 2
    const cy = o / 2
    const s = o * 0.1
    const c = o * 0.5

    const ux = cx + s * Math.cos(t)
    const uy = cy - s * Math.sin(t)
    const fx = cx + c * Math.cos(t)
    const fy = cy - c * Math.sin(t)
    const mx = (ux + fx) / 2
    const my = (uy + fy) / 2
    const g = o * 0.05

    const cpx = mx + g * Math.cos(t + Math.PI / 2)
    const cpy = my - g * Math.sin(t + Math.PI / 2)

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    const d = `M ${ux} ${uy} Q ${cpx} ${cpy} ${mx} ${my} T ${fx} ${fy}`
    path.setAttribute('d', d)
    path.setAttribute('stroke', color)
    path.setAttribute('stroke-width', String(sw))
    path.setAttribute('stroke-linecap', 'round')
    path.setAttribute('fill', 'none')
    svg.appendChild(path)
    paths.push(path)
  })

  document.body.appendChild(svg)

  paths.forEach((path) => {
    const len = path.getTotalLength()
    gsap.set(path, {
      strokeDasharray: `1, ${len}`,
      strokeDashoffset: 0,
      strokeWidth: sw,
    })
    gsap
      .timeline()
      .to(path, {
        strokeDasharray: `${len}, ${len}`,
        strokeDashoffset: -len,
        duration,
        ease: 'power1.out',
      })
      .to(
        path,
        {
          strokeWidth: 0,
          duration: duration * 0.4,
          ease: 'linear',
        },
        duration * 0.6
      )
  })

  gsap.delayedCall(duration + 0.1, () => svg.remove())
}

export default function WavyClickEffect() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (target?.closest?.('input, textarea, select')) return
      createWavyEffect(e.clientX, e.clientY)
    }

    window.addEventListener('click', onClick, { passive: true })
    return () => window.removeEventListener('click', onClick)
  }, [])

  return null
}
