"use client"

import { useState } from "react"

interface AuthWizardProps {
  type: "login" | "register"
  onClose: () => void
}

export default function AuthWizard({ type, onClose }: AuthWizardProps) {
  const [step, setStep] = useState(type)
  const [dateValue, setDateValue] = useState('');
  const [nationalityValue, setNationalityValue] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Light Blurry Overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

      {/* Modal Card */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Tabs */}
        <div className="flex justify-center mb-6 gap-2">
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              step === "login"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-green-700"
            }`}
            onClick={() => setStep("login")}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              step === "register"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-green-700"
            }`}
            onClick={() => setStep("register")}
          >
            Register
          </button>
        </div>

        {/* Forms */}
        {step === "login" ? (
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                         text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-300 focus:border-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                         text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-300 focus:border-green-400"
            />
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                         text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-300 focus:border-green-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                         text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-300 focus:border-green-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                         text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-300 focus:border-green-400"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                         text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-green-300 focus:border-green-400"
            />
            

            <input
              type="date"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className={`w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 
                        [color-scheme:light] ${dateValue ? 'text-gray-900' : 'text-gray-400'}`}
            />

            <select
              value={nationalityValue}
              onChange={(e) => setNationalityValue(e.target.value)}
              className={`w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                        focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400
                        ${nationalityValue ? 'text-gray-900' : 'text-gray-400'}`}
            >
              <option value="" disabled>Select Nationality</option>
              <option value="Tunisian" className="text-gray-900">Tunisian</option>
              <option value="French" className="text-gray-900">French</option>
              <option value="Italian" className="text-gray-900">Italian</option>
              <option value="American" className="text-gray-900">American</option>
              <option value="Other" className="text-gray-900">Other</option>
            </select>
            <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}