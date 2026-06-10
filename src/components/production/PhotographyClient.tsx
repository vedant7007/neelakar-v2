'use client'

import Link from 'next/link'
import OrbitCanvas from '@/components/production/OrbitCanvas'
import { COLORS, FONTS } from '@/lib/theme'

const BG = COLORS.bg
const SANS = FONTS.sans

const navLink: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
  fontWeight: 600,
  letterSpacing: '0.15em',
  color: '#fff',
  textDecoration: 'none',
  pointerEvents: 'auto',
  whiteSpace: 'nowrap',
  textTransform: 'uppercase',
  transition: 'opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
}

export default function PhotographyClient({
  orbitImages,
  bgImages,
}: {
  orbitImages: string[]
  bgImages: string[]
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: BG,
        overflow: 'hidden',
        zIndex: 50,
      }}
    >
      <OrbitCanvas images={orbitImages} backgrounds={bgImages} />

      {/* Back button */}
      <style>{`
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
      `}</style>
      <Link href="/production" className="back-btn">
        <div className="back-btn__inner">
          <svg style={{ width:'18px', height:'18px', color:'rgba(255,255,255,0.5)', flexShrink:0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          <span className="back-btn__label">Back</span>
        </div>
      </Link>

      {/* Full-screen centered nav overlay */}
      <header
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '28px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Link
          href="/"
          className="hover:!opacity-50"
          style={navLink}
        >
          <span>Neelakar</span>
        </Link>
      </header>
    </div>
  )
}
