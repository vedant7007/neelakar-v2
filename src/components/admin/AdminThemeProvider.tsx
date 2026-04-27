'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type AdminTheme = 'dark' | 'light'

const AdminThemeContext = createContext<{
  theme: AdminTheme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function useAdminTheme() {
  return useContext(AdminThemeContext)
}

export default function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('neelakar-admin-theme') as AdminTheme | null
    if (saved) setTheme(saved)
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('neelakar-admin-theme', next)
      return next
    })
  }

  return (
    <AdminThemeContext.Provider value={{ theme, toggle }}>
      <div data-admin-theme={theme}>
        {children}
      </div>
    </AdminThemeContext.Provider>
  )
}
