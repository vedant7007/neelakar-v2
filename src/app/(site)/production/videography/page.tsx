'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BG = 'rgb(30,30,28)'
const LEMON = '#ffeec8'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

interface Project {
  title: [string, string]
  category: string
  client: string
  imageId: number
}

const PROJECTS: Project[] = [
  { title: ['The Greatest', 'Love Story'], category: 'Feature Documentary', client: 'Amazon Originals', imageId: 1015 },
  { title: ['Shadows of', 'Tomorrow'], category: 'Commercial', client: 'Nike India', imageId: 1018 },
  { title: ['Silent', 'Rebellion'], category: 'Music Video', client: 'Universal Music', imageId: 1035 },
  { title: ['Golden', 'Hour'], category: 'Fashion Film', client: 'Vogue India', imageId: 1036 },
  { title: ['Between the', 'Lines'], category: 'Short Film', client: 'MUBI Originals', imageId: 1039 },
  { title: ['Eternal', 'Bloom'], category: 'Brand Film', client: 'Tanishq', imageId: 1043 },
  { title: ['Raw', 'Elegance'], category: 'Editorial', client: "Harper's Bazaar", imageId: 1044 },
  { title: ['City of', 'Dreams'], category: 'Documentary', client: 'Netflix India', imageId: 1049 },
]

function CornerBracket({ position }: { position: 1 | 2 | 3 | 4 }) {
  const paths: Record<number, string> = {
    1: 'M0 11.178L0 4.147L4.148 0L11.18 0L11.18 0.9L4.52 0.9L0.9 4.52L0.9 11.178Z',
    2: 'M11.179 11.178L11.179 4.147L7.032 0L0 0L0 0.9L6.659 0.9L10.279 4.52L10.279 11.178Z',
    3: 'M0 0L0 7.031L4.148 11.178L11.18 11.178L11.18 10.278L4.52 10.278L0.9 6.658L0.9 0Z',
    4: 'M11.179 0L11.179 7.031L7.032 11.178L0 11.178L0 10.278L6.659 10.278L10.279 6.658L10.279 0Z',
  }
  const pos: Record<number, React.CSSProperties> = {
    1: { top: 0, left: 0 },
    2: { top: 0, right: 0 },
    3: { bottom: 0, left: 0 },
    4: { bottom: 0, right: 0 },
  }
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      style={{ position: 'absolute', width: '0.8vw', height: 'auto', ...pos[position], transition: 'opacity 0.6s' }}
    >
      <path d={paths[position]} fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

export default function VideographyPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [nextIdx, setNextIdx] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastWheel = useRef(0)

  const project = PROJECTS[activeIdx]
  const total = PROJECTS.length

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === activeIdx) return
    const next = ((idx % total) + total) % total
    setNextIdx(next)
    setTransitioning(true)
    setTimeout(() => {
      setActiveIdx(next)
      setNextIdx(null)
      setTransitioning(false)
    }, 800)
  }, [transitioning, activeIdx, total])

  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo])
  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel.current < 1200) return
      lastWheel.current = now
      if (e.deltaY > 20) next()
      else if (e.deltaY < -20) prev()
    }
    const el = containerRef.current
    el?.addEventListener('wheel', onWheel, { passive: false })
    return () => el?.removeEventListener('wheel', onWheel)
  }, [next, prev])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const displayProject = nextIdx !== null ? PROJECTS[nextIdx] : project
  const bgId = displayProject.imageId

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: BG,
        overflow: 'hidden',
        zIndex: 50,
        color: LEMON,
        fontFamily: SANS,
      }}
    >
      <style>{`
        .vbg-img {
          position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
          transition: opacity 0.8s cubic-bezier(0.75, 0, 0.25, 1);
        }
        .back-btn { position:fixed; top:1.5rem; left:1.5rem; z-index:20; text-decoration:none; }
        .back-btn__inner {
          display:flex; align-items:center; gap:0;
          padding:14px;
          background:rgba(255,255,255,0.08);
          backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.1);
          border-radius:12px;
          transition: all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .back-btn:hover .back-btn__inner { gap:8px; background:rgba(255,255,255,0.12); }
        .back-btn__label {
          max-width:0; opacity:0; overflow:hidden; white-space:nowrap;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-size:0.72rem; font-weight:500; letter-spacing:0.12em;
          color:rgba(255,255,255,0.5);
          transition: all 0.5s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .back-btn:hover .back-btn__label { max-width:60px; opacity:1; }
        .vid-title {
          font-family: var(--font-neel-display), 'Playfair Display', serif;
          font-size: clamp(2rem, 6.6vw, 8rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1.06;
          letter-spacing: -0.03em;
          color: ${LEMON};
          transition: opacity 0.6s, transform 0.6s cubic-bezier(0.75,0,0.25,1);
        }
        .vid-title.fade-out { opacity: 0; transform: translateY(20px); }
        .vid-title.fade-in { opacity: 1; transform: translateY(0); }
        .player-frame {
          position: relative;
          width: 34.3vw; height: 21.5vw;
          border-radius: 3px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.6s cubic-bezier(0.75,0,0.25,1);
        }
        .player-frame:hover { transform: scale(1.02); }
        .player-frame:hover .play-label { opacity: 1; transform: translateY(0); }
        .play-label {
          position: absolute; inset: 0; display: flex; justify-content: center; align-items: center;
          font-family: var(--font-neel-display), 'Playfair Display', serif;
          font-size: clamp(1.5rem, 4vw, 5rem); font-weight: 400; font-style: italic;
          color: ${LEMON}; z-index: 5;
          opacity: 0; transform: translateY(15px);
          transition: opacity 0.4s, transform 0.4s cubic-bezier(0.75,0,0.25,1);
        }
        .nav-arrow {
          background: none; border: none; cursor: pointer; padding: 12px;
          color: rgba(255,238,200,0.5); transition: color 0.3s, transform 0.3s;
        }
        .nav-arrow:hover { color: ${LEMON}; transform: scale(1.15); }
        .meta-text {
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-size: clamp(0.55rem, 0.76vw, 0.85rem);
          font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,238,200,0.5);
          transition: opacity 0.5s;
        }
        .slide-counter {
          font-family: var(--font-neel-display), 'Playfair Display', serif;
          font-size: clamp(0.9rem, 1.2vw, 1.5rem); font-weight: 400;
          color: rgba(255,238,200,0.4);
        }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; gap: 1rem !important; }
          .vid-title { font-size: clamp(1.8rem, 8vw, 3rem) !important; text-align: center !important; }
          .player-frame { width: 80vw !important; height: 50vw !important; }
          .title-left, .title-right { text-align: center !important; }
        }
      `}</style>

      {/* Background image */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1 }} />
        <Image
          src={`https://picsum.photos/id/${bgId}/1920/1080`}
          alt=""
          fill
          className="vbg-img"
          style={{ opacity: transitioning ? 0.4 : 1 }}
          sizes="100vw"
          unoptimized
          priority
        />
      </div>

      {/* Back button */}
      <Link href="/production" className="back-btn" style={{ zIndex: 100 }}>
        <div className="back-btn__inner">
          <svg style={{ width: '18px', height: '18px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="back-btn__label">Back</span>
        </div>
      </Link>

      {/* Main hero content */}
      <div
        className="hero-grid"
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '2vw',
          padding: '0 2vw',
        }}
      >
        {/* Left title */}
        <div className="title-left" style={{ flex: '1 1 0', textAlign: 'right', overflow: 'hidden' }}>
          <div className={`vid-title ${transitioning ? 'fade-out' : 'fade-in'}`}>
            {displayProject.title[0].split(' ').map((word, i) => (
              <div key={i}>
                <span style={{ fontStyle: 'italic' }}>{word[0]}</span>
                {word.slice(1)}{' '}
              </div>
            ))}
          </div>
        </div>

        {/* Center: video player */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1vw' }}>
          {/* Category */}
          <div className="meta-text" style={{ opacity: transitioning ? 0 : 1 }}>
            {displayProject.category}
          </div>

          {/* Player frame with corner brackets */}
          <div style={{ position: 'relative', padding: '0.35vw' }}>
            <CornerBracket position={1} />
            <CornerBracket position={2} />
            <CornerBracket position={3} />
            <CornerBracket position={4} />

            <div className="player-frame">
              <Image
                src={`https://picsum.photos/id/${displayProject.imageId}/1280/800`}
                alt={displayProject.title.join(' ')}
                fill
                style={{ objectFit: 'cover', transition: 'opacity 0.6s' }}
                sizes="34.3vw"
                unoptimized
              />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 2 }} />
              <div className="play-label">Play</div>
            </div>
          </div>

          {/* Bottom metadata: counter + client */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5vw', opacity: transitioning ? 0 : 1, transition: 'opacity 0.5s' }}>
            <span className="slide-counter">
              {String(activeIdx + 1).padStart(2, '0')}
            </span>
            <span className="meta-text" style={{ color: 'rgba(255,238,200,0.35)' }}>
              {displayProject.client}
            </span>
            <span className="slide-counter">
              {String(total).padStart(2, '0')}
            </span>
          </div>

          {/* Navigation arrows */}
          <div style={{ display: 'flex', gap: '1.5vw', marginTop: '0.5vw' }}>
            <button className="nav-arrow" onClick={prev} aria-label="Previous">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button className="nav-arrow" onClick={next} aria-label="Next">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right title */}
        <div className="title-right" style={{ flex: '1 1 0', textAlign: 'left', overflow: 'hidden' }}>
          <div className={`vid-title ${transitioning ? 'fade-out' : 'fade-in'}`}>
            {displayProject.title[1].split(' ').map((word, i) => (
              <div key={i}>
                <span style={{ fontStyle: 'italic' }}>{word[0]}</span>
                {word.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical ruler decor (film-ruler feel) */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: '8vw',
          width: '1px',
          background: 'rgba(255,238,200,0.06)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          right: '8vw',
          width: '1px',
          background: 'rgba(255,238,200,0.06)',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
