'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/* ─────────────────────────────────────────────────────────────
 * NEELAKAR ASCII — chunky 7-row block letters
 * '#' = filled; ' ' = empty
 * ───────────────────────────────────────────────────────────── */

const GLYPHS: Record<string, string[]> = {
  N: [
    '##   ##',
    '###  ##',
    '#### ##',
    '## ####',
    '##  ###',
    '##   ##',
    '##   ##',
  ],
  E: [
    '#######',
    '##     ',
    '##     ',
    '#####  ',
    '##     ',
    '##     ',
    '#######',
  ],
  L: [
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '##     ',
    '#######',
  ],
  A: [
    '  ###  ',
    ' ## ## ',
    '##   ##',
    '##   ##',
    '#######',
    '##   ##',
    '##   ##',
  ],
  K: [
    '##  ## ',
    '## ##  ',
    '####   ',
    '###    ',
    '####   ',
    '## ##  ',
    '##  ## ',
  ],
  R: [
    '###### ',
    '##   ##',
    '##   ##',
    '###### ',
    '## ##  ',
    '##  ## ',
    '##   ##',
  ],
}

const WORD = 'NEELAKAR'
const ROWS = 7
const GAP_COLS = 2 // space between letters

interface Cell {
  ch: string
  filled: boolean
  row: number
  col: number
}

function buildGrid(): Cell[][] {
  const grid: Cell[][] = Array.from({ length: ROWS }, () => [])
  let colCursor = 0
  for (let i = 0; i < WORD.length; i++) {
    const letter = WORD[i]!
    const glyph = GLYPHS[letter]!
    const w = glyph[0]!.length
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < w; c++) {
        const ch = glyph[r]![c] ?? ' '
        grid[r]!.push({
          ch: ch === '#' ? '█' : ' ',
          filled: ch === '#',
          row: r,
          col: colCursor + c,
        })
      }
    }
    colCursor += w
    if (i < WORD.length - 1) {
      for (let r = 0; r < ROWS; r++) {
        for (let g = 0; g < GAP_COLS; g++) {
          grid[r]!.push({ ch: ' ', filled: false, row: r, col: colCursor + g })
        }
      }
      colCursor += GAP_COLS
    }
  }
  return grid
}

const RIPPLE_RADIUS = 140
const HINT_FADE_MS = 5500

export default function AsciiSection() {
  const grid = useMemo(() => buildGrid(), [])
  const cols = grid[0]?.length ?? 0
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [active, setActive] = useState(false)
  const [hintVisible, setHintVisible] = useState(true)
  const [time, setTime] = useState(0)

  // Ambient breathing — subtle wave even when cursor is idle
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      setTime((now - start) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const id = window.setTimeout(() => setHintVisible(false), HINT_FADE_MS)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="w-full bg-neel-cream flex flex-col items-center justify-center px-6 py-20 select-none relative">

      <p className="font-display text-xs tracking-[0.4em] uppercase text-neel-ink/50 text-center mb-12">
        Made with care
        <span className="mx-3 text-neel-rust">·</span>
        Neelakar Creative House
      </p>

      <div
        ref={containerRef}
        onPointerMove={(e) => {
          const rect = containerRef.current?.getBoundingClientRect()
          if (!rect) return
          setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          setActive(true)
        }}
        onPointerLeave={() => {
          setActive(false)
          setCursor(null)
        }}
        className="relative cursor-crosshair"
        style={{
          fontSize: 'clamp(8px, 1.6vw, 18px)',
          lineHeight: '1',
          fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
        }}
        role="img"
        aria-label="Interactive ASCII rendering of NEELAKAR"
      >
        {grid.map((row, r) => (
          <div key={r} className="flex justify-center">
            {row.map((cell, c) => {
              return (
                <Char
                  key={`${r}-${c}`}
                  cell={cell}
                  cursor={cursor}
                  active={active}
                  time={time}
                  rowIndex={r}
                  colIndex={c}
                  totalCols={cols}
                />
              )
            })}
          </div>
        ))}
      </div>

      <p
        className="mt-12 font-display text-[10px] tracking-[0.4em] uppercase text-neel-ink/40 text-center transition-opacity duration-700"
        style={{ opacity: hintVisible ? 1 : 0 }}
      >
        ↑ hover or touch the name
      </p>

      <div className="mt-8 flex items-center gap-3 text-neel-ink/30">
        <span className="block w-12 h-px bg-neel-ink/20" />
        <span className="font-display text-[10px] tracking-[0.3em] uppercase">© 2026</span>
        <span className="block w-12 h-px bg-neel-ink/20" />
      </div>
    </div>
  )
}

interface CharProps {
  cell: Cell
  cursor: { x: number; y: number } | null
  active: boolean
  time: number
  rowIndex: number
  colIndex: number
  totalCols: number
}

function Char({ cell, cursor, active, time, rowIndex, colIndex, totalCols }: CharProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [center, setCenter] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (!ref.current) return
    const measure = () => {
      const el = ref.current
      if (!el) return
      const parent = el.closest('[role="img"]') as HTMLElement | null
      if (!parent) return
      const elRect = el.getBoundingClientRect()
      const parentRect = parent.getBoundingClientRect()
      setCenter({
        x: elRect.left - parentRect.left + elRect.width / 2,
        y: elRect.top - parentRect.top + elRect.height / 2,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [rowIndex, colIndex, totalCols])

  if (!cell.filled) {
    return (
      <span className="inline-block opacity-0" aria-hidden>
        █
      </span>
    )
  }

  // Ambient: slow sine wave per cell for subtle breathing
  const ambientY =
    Math.sin(time * 0.8 + (cell.row + cell.col * 0.5) * 0.6) * 1.2

  // Cursor proximity ripple
  let scale = 1
  let translateX = 0
  let translateY = ambientY
  let colorMix = 0

  if (cursor) {
    const dx = center.x - cursor.x
    const dy = center.y - cursor.y
    const dist = Math.hypot(dx, dy)
    if (dist < RIPPLE_RADIUS) {
      const t = 1 - dist / RIPPLE_RADIUS // 0..1, 1 = right at cursor
      const eased = t * t
      const norm = dist === 0 ? 0 : 1 / dist
      const push = eased * 14
      translateX = dx * norm * push
      translateY = ambientY + dy * norm * push
      scale = 1 + eased * 0.6
      colorMix = eased
    }
  }

  const color = colorMix > 0
    ? `color-mix(in srgb, #C9561E ${Math.round(colorMix * 100)}%, #141414)`
    : '#141414'

  const opacity = active ? 1 : 0.92

  return (
    <span
      ref={ref}
      className="inline-block will-change-transform"
      style={{
        color,
        opacity,
        transform: `translate(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px) scale(${scale.toFixed(2)})`,
        transition: cursor ? 'none' : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1), color 500ms ease',
      }}
    >
      {cell.ch}
    </span>
  )
}
