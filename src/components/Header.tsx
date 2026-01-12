"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"
import { useTheme } from "@/app/context/ThemeContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Sun, Moon } from "lucide-react"

export default function Header({ onLogin, onRegister }: any) {
  const { user, loading, setUser } = useAuth()
  const { theme, toggleTheme } = useTheme()
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
    <header className="bg-green-600 dark:bg-green-900 text-white dark:text-gray-900 px-6 py-4 flex justify-between items-center transition-colors duration-200">
      <Link href="/" className="flex items-center gap-2">
        <img src="/data/logo.png" alt="Sayara Logo" className="h-14 w-22" />
        <div className="text-2xl font-bold">Sayara</div>
      </Link>

      <div className="flex gap-4 items-center">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5 text-green-700" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>

        {!user ? (
          <>
            <button onClick={onLogin} className="hover:bg-green-700 dark:hover:bg-green-800 px-3 py-1 rounded transition-colors">
              Sign in
            </button>
            <button
              onClick={onRegister}
              className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-4 py-2 rounded font-medium hover:opacity-90 transition-opacity"
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
                alt={user.name}
                className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-700"
              />
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 hover:opacity-90 dark:hover:opacity-80 disabled:opacity-50 px-4 py-2 rounded font-medium transition"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  )}