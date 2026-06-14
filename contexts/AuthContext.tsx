'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

export type AdminRole = 'super_admin' | 'marketing_admin' | 'sales_admin'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface AuthContextType {
  user: User | null
  loading: boolean
  role: AdminRole | null
  roleLoading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (email: string, password: string) => Promise<User>
  signInWithGoogle: () => Promise<User>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<AdminRole | null>(null)
  const [roleLoading, setRoleLoading] = useState(true)

  // Ask the backend to verify the ID token and return the whitelisted admin role.
  // Returns null if the user is not an authorized admin (or on any failure).
  const resolveRole = async (currentUser: User): Promise<AdminRole | null> => {
    try {
      const token = await currentUser.getIdToken()
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        return (json.data?.role as AdminRole) ?? null
      }
      return null
    } catch {
      return null
    }
  }

  // Fetch role from the backend /auth/me endpoint and store it in context.
  const fetchRole = async (currentUser: User) => {
    setRoleLoading(true)
    try {
      setRole(await resolveRole(currentUser))
    } finally {
      setRoleLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      console.warn('Auth check timeout - setting loading to false')
      setLoading(false)
    }, 3000)

    let unsubscribe: (() => void) | null = null

    try {
      if (!auth) {
        console.warn('Firebase auth not available - auth disabled')
        setLoading(false)
        clearTimeout(timeout)
        return
      }

      unsubscribe = onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(currentUser)
          setLoading(false)
          clearTimeout(timeout)
          if (currentUser) {
            fetchRole(currentUser)
          } else {
            setRole(null)
            setRoleLoading(false)
          }
        },
        (error) => {
          console.error('Auth state error:', error)
          setLoading(false)
          clearTimeout(timeout)
        }
      )
    } catch (error) {
      console.error('Firebase auth initialization error:', error)
      setLoading(false)
      clearTimeout(timeout)
    }

    return () => {
      if (unsubscribe) unsubscribe()
      clearTimeout(timeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error: any) {
      throw new Error('Login failed: ' + error.message)
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error: any) {
      throw new Error('Registration failed: ' + error.message)
    }
  }

  const signInWithGoogle = async () => {
    let signedInUser: User
    try {
      const result = await signInWithPopup(auth, googleProvider)
      signedInUser = result.user
    } catch (error: any) {
      // Log the real error for debugging, but surface a generic message to the user
      // so we don't leak technical Firebase codes (e.g. auth/unauthorized-domain).
      console.error('Google sign-in error:', error)

      const code = error?.code as string | undefined
      // User dismissed the popup — not an error worth alarming them about.
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        throw new Error('Sign-in was cancelled. Please try again.')
      }

      throw new Error('Unable to sign in. Please try again.')
    }

    // Authorization is decided by the backend: verify the token and confirm this
    // account is in the admin whitelist before letting them proceed.
    const resolvedRole = await resolveRole(signedInUser)
    if (!resolvedRole) {
      await signOut(auth).catch(() => { })
      setRole(null)
      throw new Error('This account is not authorized, please contact the administrator.')
    }

    setRole(resolvedRole)
    setRoleLoading(false)
    return signedInUser
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setRole(null)
    } catch (error: any) {
      throw new Error('Logout failed: ' + error.message)
    }
  }

  const value = { user, loading, role, roleLoading, signIn, signUp, signInWithGoogle, logout }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/** Convenience hook — returns the current admin role (null if not an admin) */
export function useRole() {
  return useAuth().role
}
