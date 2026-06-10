'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Hidden admin access: typing the secret sequence anywhere on the public site
// (outside form fields) navigates to the admin login. No visible UI.
export default function AdminGateway() {
  const router = useRouter()

  useEffect(() => {
    const sequence = (process.env.NEXT_PUBLIC_ADMIN_SEQUENCE || '').toLowerCase()
    if (!sequence) return
    let buffer = ''

    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toUpperCase()
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (document.activeElement as HTMLElement)?.isContentEditable) return
      if (e.key.length !== 1) return
      buffer = (buffer + e.key.toLowerCase()).slice(-sequence.length)
      if (buffer === sequence) {
        buffer = ''
        router.push('/admin/login')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router])

  return null
}
