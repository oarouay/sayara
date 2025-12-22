"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Header({ onLogin, onRegister }: any) {
  const { user, loading, setUser } = useAuth()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
      setUser(null)
      // Force redirect to home/landing page
      await new Promise(resolve => setTimeout(resolve, 100))
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect even if logout fails
      window.location.href = '/'
    } finally {
      setLoggingOut(false)
    }
  }

  if (loading) return null

  return (
    <header className="bg-green-600 text-white px-6 py-4 flex justify-between items-center">
      <Link href="/" className="flex items-center gap-2">
        <img src="/data/logo.png" alt="Sayara Logo" className="h-14 w-22" />
        <div className="text-2xl font-bold">Sayara</div>
      </Link>

      <div className="flex gap-4 items-center">
        {!user ? (
          <>
            <button onClick={onLogin} className="hover:bg-green-700 px-3 py-1 rounded">
              Sign in
            </button>
            <button
              onClick={onRegister}
              className="bg-white text-green-600 px-4 py-2 rounded font-medium"
            >
              Register
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(user.role === 'ADMIN' ? '/admin' : '/profile')}
              className="flex items-center gap-3 hover:opacity-80 transition"
            >
              <span className="text-lg font-medium">{user.name}</span>
              <img
                src="/data/avatar-placeholder.png"
                className="h-10 w-10 rounded-full border-2 border-white"
              />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-white text-green-600 hover:bg-gray-100 disabled:opacity-50 px-4 py-2 rounded font-medium transition"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
