import Link from 'next/link'

const GOLD = '#C8A96E'
const DISPLAY = "var(--font-neel-display), 'Playfair Display', serif"
const SANS = "var(--font-dm-sans), 'DM Sans', sans-serif"

export default function NotFound() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ backgroundColor: '#060F0B' }}
    >
      <span
        style={{
          fontFamily: SANS, fontSize: 'clamp(0.6rem, 0.7vw, 0.75rem)', fontWeight: 600,
          color: GOLD, letterSpacing: '0.45em', textTransform: 'uppercase',
        }}
      >
        404
      </span>
      <h1
        className="mt-6"
        style={{
          fontFamily: DISPLAY, fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', fontWeight: 300,
          fontStyle: 'italic', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em',
        }}
      >
        This scene was never shot.
      </h1>
      <p
        className="mt-5 max-w-md"
        style={{
          fontFamily: SANS, fontSize: 'clamp(0.85rem, 0.95vw, 1rem)', fontWeight: 300,
          color: 'rgba(255,255,255,0.4)', lineHeight: 1.8,
        }}
      >
        The page you&rsquo;re looking for doesn&rsquo;t exist — or it moved somewhere more cinematic.
      </p>
      <Link href="/" className="group inline-flex items-center gap-4 mt-12" style={{ textDecoration: 'none' }}>
        <span
          className="h-px w-6 transition-all duration-500 group-hover:w-12"
          style={{ backgroundColor: GOLD, display: 'inline-block' }}
        />
        <span
          style={{
            fontFamily: SANS, fontSize: 'clamp(0.65rem, 0.72vw, 0.75rem)', fontWeight: 600,
            color: GOLD, letterSpacing: '0.3em', textTransform: 'uppercase',
          }}
        >
          Back to home
        </span>
      </Link>
    </main>
  )
}
