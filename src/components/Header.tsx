"use client"

import Link from "next/link"
import { useAuth } from "@/app/context/AuthContext"

export default function Header({ onLogin, onRegister }: any) {
  const { user, loading } = useAuth()

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
          <Link href="/profile" className="flex items-center gap-3">
            <span className="text-lg font-medium">{user.name}</span>
            <img
              src={user.image ?? "/data/avatar-placeholder.png"}
              className="h-10 w-10 rounded-full border-2 border-white"
            />
          </Link>
        )}
      </div>
    </header>
  )
}
