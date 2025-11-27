"use client"

import { useState } from "react"
import { FaUser, FaLock } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login:", { email, password })
    // TODO: call your API route
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-pink-500 via-purple-600 to-orange-400 text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold mb-4">Welcome to Sayara</h1>
          <p className="text-lg font-medium">
            Rent your dream car with ease. Explore, book, and drive — all in one place.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">USER LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500"
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-purple-600" />
                Remember?
              </label>
              <a href="#" className="text-purple-700 font-medium hover:underline">
                Forgot password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              LOGIN
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-700">
            Don’t have an account?{" "}
            <a href="/auth/register" className="text-purple-700 font-medium hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}