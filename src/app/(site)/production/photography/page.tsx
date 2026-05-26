'use client'

import Link from 'next/link'
import OrbitCanvas from '@/components/OrbitCanvas'

const BG = '#060F0B'
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

const thumb = (id: string) =>
  `https://images.unsplash.com/${id}?w=200&h=250&fit=crop&q=80`

const ORBIT_IMAGES = [
  thumb('photo-1509631179647-0177331693ae'),
  thumb('photo-1534528741775-53994a69daeb'),
  thumb('photo-1602751584552-8ba73aad10e1'),
  thumb('photo-1487958449943-2429e8be8625'),
  thumb('photo-1515562141589-67f0d569b6f5'),
  thumb('photo-1469334031218-e382a71b716b'),
  thumb('photo-1558618666-fcd25c85f82e'),
  thumb('photo-1581044777550-4cfa60707998'),
  thumb('photo-1531746020798-e6953c6e8e04'),
  thumb('photo-1505765050516-f72dcac9c60e'),
  thumb('photo-1583391733956-6c78276477e2'),
  thumb('photo-1617038220319-276d3cfab638'),
  thumb('photo-1558171813-4c088753af8f'),
  thumb('photo-1606800052052-a08af7148866'),
  thumb('photo-1523275335684-37898b6baf30'),
  thumb('photo-1494790108377-be9c29b29330'),
  thumb('photo-1542038784456-1ea8e935640e'),
  thumb('photo-1492691527719-9d1e07e534b4'),
  thumb('photo-1516035069371-29a1b244cc32'),
  thumb('photo-1554048612-b6a482bc67e5'),
]

const navLink: React.CSSProperties = {
  fontFamily: SANS,
  fontSize: '10.5px',
  fontWeight: 600,
  letterSpacing: '0.01em',
  lineHeight: '10.5px',
  color: '#fff',
  textDecoration: 'none',
  padding: '10.5px 0',
  pointerEvents: 'auto',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
}

export default function PhotographyPage() {
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
      <OrbitCanvas images={ORBIT_IMAGES} />

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
          <span>Neelakar™</span>
        </Link>

        <Link
          href="/production"
          className="hover:!opacity-50"
          style={navLink}
        >
          <span>Archive</span>
        </Link>

        <Link
          href="/create-with-us"
          className="hover:!opacity-50"
          style={navLink}
        >
          <span>Create With Us</span>
        </Link>
      </header>
    </div>
  )
}
