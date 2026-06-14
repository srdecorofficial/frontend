'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { Lock, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const { signInWithGoogle } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      router.push('/admin')
    } catch (err: any) {
      const message = err?.message || 'Sign-in failed. Please try again.'
      setError(message)
      // If the account isn't authorized, send them back to the homepage shortly.
      if (message.includes('not authorized')) {
        setTimeout(() => router.push('/'), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-light-bg dark:bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm bg-light-card dark:bg-dark-card rounded-2xl p-8 shadow-soft-lg"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-light-surface dark:bg-dark-surface mb-4">
            <Lock className="text-light-accent dark:text-dark-accent" size={32} />
          </div>
          <h1 className="font-sans text-3xl font-bold text-light-text dark:text-dark-text mb-2">
            Admin Panel
          </h1>
          <p className="text-light-textMuted dark:text-dark-textMuted text-sm">
            Sign in with your authorised Google account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-white dark:bg-dark-surface border border-light-border dark:border-dark-border text-light-text dark:text-dark-text font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-dark-card transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.3 1.2 8.5 3.2l6.3-6.3C34.8 3 29.8 1 24 1 14.7 1 6.8 6.7 3.2 14.8l7.3 5.7C12.1 13.5 17.6 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.3 5.7C43.3 37 46.5 31 46.5 24z" />
              <path fill="#FBBC05" d="M10.5 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5l-7.3-5.7C1.5 17 1 20.4 1 24s.5 7 2.2 10.2l7.3-5.7z" />
              <path fill="#34A853" d="M24 47c5.8 0 10.7-1.9 14.3-5.2l-7.3-5.7c-1.9 1.3-4.3 2-7 2-6.4 0-11.9-4-13.5-9.6l-7.3 5.7C6.8 41.3 14.7 47 24 47z" />
            </svg>
          )}
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p className="mt-6 text-xs text-center text-light-textMuted dark:text-dark-textMuted">
          Only whitelisted email addresses can access the admin panel.
        </p>
      </motion.div>
    </div>
  )
}
