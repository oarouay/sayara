"use client"

import { useState } from "react"
import { FaUser, FaLock, FaPhone, FaGlobe, FaCalendarAlt } from "react-icons/fa"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [nationality, setNationality] = useState("")
  const [birthday, setBirthday] = useState("")
  const [phone, setPhone] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    console.log("Register:", { email, password, nationality, birthday, phone })
    // TODO: call your API route
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-pink-500 via-purple-600 to-orange-400 text-white items-center justify-center p-10">
        <div className="max-w-md">
          <h1 className="text-4xl font-extrabold mb-4">Join Sayara Today</h1>
          <p className="text-lg font-medium">
            Create your account and start renting cars with ease. Fast, flexible, and reliable.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">USER REGISTER</h2>
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-500" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500"
                required
              />
            </div>

            {/* Nationality */}
            <div className="relative">
              <FaGlobe className="absolute top-3 left-3 text-gray-500" />
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              >
                <option value="">Select Nationality</option>
                <option value="Tunisian">Tunisian</option>
                <option value="French">French</option>
                <option value="Italian">Italian</option>
                <option value="American">American</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Birthday */}
            <div className="relative">
              <FaCalendarAlt className="absolute top-3 left-3 text-gray-500" />
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <FaPhone className="absolute top-3 left-3 text-gray-500" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-gray-500"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition"
            >
              REGISTER
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Already have an account?{" "}
            <a href="/auth/login" className="text-purple-700 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}