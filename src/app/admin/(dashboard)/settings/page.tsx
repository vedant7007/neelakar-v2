'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, ScanFace, KeyRound, Shield, Trash2, Loader2, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import FaceCapture from '@/components/admin/FaceCapture'

export default function SettingsPage() {
  const supabase = createClient()
  const [showFaceCapture, setShowFaceCapture] = useState(false)
  const [faceRegistered, setFaceRegistered] = useState(false)
  const [loading, setLoading] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' })

  const handleFaceCapture = async (descriptor: number[]) => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/face/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descriptor }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Failed to register face')
        return
      }

      setFaceRegistered(true)
      setShowFaceCapture(false)
      toast.success('Face registered successfully!')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFace = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/face/register', { method: 'DELETE' })
      if (!res.ok) {
        toast.error('Failed to remove face data')
        return
      }
      setFaceRegistered(false)
      toast.success('Face data removed')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Password updated')
      setPasswordForm({ current: '', newPassword: '', confirm: '' })
    }
    setLoading(false)
  }

  const inputClass = 'w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white placeholder-white/15 outline-none focus:border-white/15 focus:ring-2 focus:ring-neel-rust/10 transition-all text-sm'

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Settings size={28} className="text-neel-rust" />
          Settings
        </h1>
        <p className="text-white/30 mt-1">Manage your admin account</p>
      </div>

      {/* Face Recognition */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neel-softteal/10 flex items-center justify-center">
              <ScanFace size={20} className="text-neel-softteal" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">Face Recognition</h2>
              <p className="text-sm text-white/30">Use your face to login</p>
            </div>
            <div className="ml-auto">
              {faceRegistered ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                  <Check size={12} /> Active
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-white/[0.03] text-white/25 text-xs font-medium">
                  Not set up
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {showFaceCapture ? (
              <motion.div
                key="capture"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex justify-center"
              >
                <FaceCapture
                  mode="register"
                  onCapture={handleFaceCapture}
                  onCancel={() => setShowFaceCapture(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="buttons"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <button
                  onClick={() => setShowFaceCapture(true)}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-neel-softteal text-white text-sm font-medium hover:bg-neel-softteal/85 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <ScanFace size={16} />
                  {faceRegistered ? 'Update Face' : 'Register Face'}
                </button>

                {faceRegistered && (
                  <button
                    onClick={handleRemoveFace}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Remove
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neel-rust/10 flex items-center justify-center">
              <KeyRound size={20} className="text-neel-rust" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-white">Change Password</h2>
              <p className="text-sm text-white/30">Update your login password</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-white/30 mb-1.5 uppercase tracking-wider font-medium">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
              className={inputClass}
              placeholder="Min 8 characters"
            />
          </div>
          <div>
            <label className="block text-xs text-white/30 mb-1.5 uppercase tracking-wider font-medium">Confirm Password</label>
            <input
              type="password"
              required
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
              className={inputClass}
              placeholder="Repeat password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-neel-rust text-white text-sm font-medium hover:bg-neel-rust/85 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Shield size={16} />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}
