'use client'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          backgroundColor: '#060F0B', fontFamily: "'DM Sans', sans-serif", padding: '0 24px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 300,
            fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff', lineHeight: 1.1,
          }}
        >
          Something went off-script.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 300, marginTop: 16 }}>
          A fatal error interrupted the show.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 40, padding: '16px 40px', backgroundColor: 'transparent', color: '#C8A96E',
            border: '1px solid rgba(200,169,110,0.3)', letterSpacing: '0.35em',
            textTransform: 'uppercase', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
