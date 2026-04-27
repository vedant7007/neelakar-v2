'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useHasMounted } from '@/hooks/useHasMounted'

interface CrowdCanvasProps {
  src: string
  rows?: number
  cols?: number
  paused?: boolean
}

type Peep = {
  image: HTMLImageElement
  rect: number[]
  width: number
  height: number
  x: number
  y: number
  anchorY: number
  scaleX: number
  walk: gsap.core.Timeline | null
  setRect: (rect: number[]) => void
  render: (ctx: CanvasRenderingContext2D) => void
}

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function randomIndex<T>(arr: T[]) {
  return (randomRange(0, arr.length) | 0)
}

function removeFromArray<T>(arr: T[], i: number) {
  return arr.splice(i, 1)[0]
}

function removeRandomFromArray<T>(arr: T[]) {
  return removeFromArray(arr, randomIndex(arr))
}

function createPeep(image: HTMLImageElement, rect: number[]): Peep {
  const peep: Peep = {
    image,
    rect: [],
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    anchorY: 0,
    scaleX: 1,
    walk: null,
    setRect(r: number[]) {
      peep.rect = r
      peep.width = r[2]
      peep.height = r[3]
    },
    render(ctx: CanvasRenderingContext2D) {
      ctx.save()
      ctx.translate(peep.x, peep.y)
      ctx.scale(peep.scaleX, 1)
      ctx.drawImage(
        peep.image,
        peep.rect[0], peep.rect[1], peep.rect[2], peep.rect[3],
        0, 0, peep.width, peep.height,
      )
      ctx.restore()
    },
  }
  peep.setRect(rect)
  return peep
}

function resetPeep(stage: { width: number; height: number }, peep: Peep) {
  const direction = Math.random() > 0.5 ? 1 : -1
  const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
  const startY = stage.height - peep.height + offsetY

  let startX: number, endX: number
  if (direction === 1) {
    startX = -peep.width
    endX = stage.width
    peep.scaleX = 1
  } else {
    startX = stage.width + peep.width
    endX = 0
    peep.scaleX = -1
  }

  peep.x = startX
  peep.y = startY
  peep.anchorY = startY

  return { startX, startY, endX }
}

function normalWalk(peep: Peep, props: { startY: number; endX: number }) {
  const xDuration = 10
  const yDuration = 0.25

  const tl = gsap.timeline()
  tl.timeScale(randomRange(0.5, 1.5))
  tl.to(peep, { duration: xDuration, x: props.endX, ease: 'none' }, 0)
  tl.to(peep, { duration: yDuration, repeat: xDuration / yDuration, yoyo: true, y: props.startY - 10 }, 0)

  return tl
}

function CrowdCanvas({ src, rows = 15, cols = 7, paused = false }: CrowdCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const crowdRef = useRef<Peep[]>([])

  useEffect(() => {
    crowdRef.current.forEach((p) => {
      if (paused) p.walk?.pause()
      else p.walk?.resume()
    })
  }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const stage = { width: 0, height: 0 }
    const allPeeps: Peep[] = []
    const availablePeeps: Peep[] = []
    const crowd = crowdRef.current
    crowd.length = 0

    const addPeepToCrowd = (): Peep => {
      const peep = removeRandomFromArray(availablePeeps)
      const props = resetPeep(stage, peep)
      const walk = normalWalk(peep, props).eventCallback('onComplete', () => {
        const idx = crowd.indexOf(peep)
        if (idx !== -1) crowd.splice(idx, 1)
        availablePeeps.push(peep)
        addPeepToCrowd()
      })

      peep.walk = walk
      crowd.push(peep)
      crowd.sort((a, b) => a.anchorY - b.anchorY)
      return peep
    }

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk!.progress(Math.random())
      }
    }

    const render = () => {
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()
      ctx.scale(devicePixelRatio, devicePixelRatio)
      crowd.forEach((p) => p.render(ctx))
      ctx.restore()
    }

    const resize = () => {
      if (!canvas) return
      stage.width = canvas.clientWidth
      stage.height = canvas.clientHeight
      canvas.width = stage.width * devicePixelRatio
      canvas.height = stage.height * devicePixelRatio

      const scale = Math.min(1, stage.width / 1200)
      allPeeps.forEach((p) => {
        p.width = p.rect[2] * scale
        p.height = p.rect[3] * scale
      })

      crowd.forEach((p) => p.walk?.kill())
      crowd.length = 0
      availablePeeps.length = 0
      availablePeeps.push(...allPeeps)
      initCrowd()
    }

    const img = document.createElement('img')

    img.onload = () => {
      const { naturalWidth: w, naturalHeight: h } = img
      const total = rows * cols
      const rw = w / rows
      const rh = h / cols

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep(img, [
            (i % rows) * rw,
            ((i / rows) | 0) * rh,
            rw,
            rh,
          ]),
        )
      }

      resize()
      gsap.ticker.add(render)
    }

    img.src = src

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      gsap.ticker.remove(render)
      crowd.forEach((p) => p.walk?.kill())
    }
  }, [src, rows, cols])

  return <canvas ref={canvasRef} className="absolute bottom-0 w-full h-full" />
}

export default function CrowdCanvasSection() {
  const mounted = useHasMounted()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative w-full h-[40vh] md:h-[50vh] bg-neel-cream overflow-hidden cursor-pointer"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 text-center">
        <span className="font-display text-[10px] tracking-[0.35em] uppercase text-neel-ink/20">
          The Neelakar Crowd
        </span>
      </div>
      {mounted && <CrowdCanvas src="/images/peeps/open-peeps-sheet.png" rows={15} cols={7} paused={hovered} />}
    </div>
  )
}
