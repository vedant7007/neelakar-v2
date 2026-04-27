import { Toaster } from 'sonner'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Neelakar Admin',
  robots: { index: false, follow: false },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141414',
            color: '#EBE6D9',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />
    </>
  )
}
