'use client'

import { useState, useEffect } from 'react'
import { FileText, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

type ContentItem = {
  id: string
  key: string
  value: string
  valueType: string
  label: string | null
  category: string
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [edits, setEdits] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content')
        if (res.ok) setItems(await res.json())
      } catch { /* */ } finally { setLoading(false) }
    }
    fetchContent()
  }, [])

  const categories = [...new Set(items.map(i => i.category))]

  const handleSave = async (key: string) => {
    if (edits[key] === undefined) return
    setSaving(key)
    try {
      const res = await fetch(`/api/content/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: edits[key] }),
      })
      if (!res.ok) throw new Error()
      toast.success('Content updated')
      setItems(prev => prev.map(i => i.key === key ? { ...i, value: edits[key] } : i))
      setEdits(prev => { const next = { ...prev }; delete next[key]; return next })
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <FileText size={28} className="text-neel-rust" /> Site Content
        </h1>
        <p className="text-white/40 mt-1">Edit dynamic numbers, text, and stats displayed on the site</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-white/20" /></div>
      ) : items.length === 0 ? (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-12 text-center text-white/25">
          <FileText size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No content entries yet</p>
          <p className="text-xs mt-1">Content will appear here once the database is seeded</p>
        </div>
      ) : (
        categories.map(cat => (
          <div key={cat} className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-4 capitalize">{cat}</h2>
            <div className="space-y-4">
              {items.filter(i => i.category === cat).map(item => {
                const currentValue = edits[item.key] ?? item.value
                const hasChange = edits[item.key] !== undefined && edits[item.key] !== item.value

                return (
                  <div key={item.key} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1">
                        {item.label || item.key}
                      </label>
                      <input
                        value={currentValue}
                        onChange={e => setEdits(prev => ({ ...prev, [item.key]: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 focus:ring-2 focus:ring-neel-rust/5 transition-all"
                      />
                    </div>
                    {hasChange && (
                      <button
                        onClick={() => handleSave(item.key)}
                        disabled={saving === item.key}
                        className="mt-5 p-2.5 rounded-lg bg-white/[0.08] text-white hover:bg-white/[0.12] disabled:opacity-50 transition-all"
                      >
                        {saving === item.key ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
