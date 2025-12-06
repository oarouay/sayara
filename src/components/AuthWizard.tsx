"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface AuthWizardProps {
  type: "login" | "register"
  onClose: () => void
}

export default function AuthWizard({ type, onClose }: AuthWizardProps) {
  const router = useRouter()
  const [step, setStep] = useState<"login" | "register" | "2fa-method" | "2fa-verify">(type)
  const [dateValue, setDateValue] = useState('')
  const [nationalityValue, setNationalityValue] = useState('')
  const [twoFAMethod, setTwoFAMethod] = useState<"email" | "mobile" | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [registrationPhone, setRegistrationPhone] = useState('')
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
            onClick={() => {
              setStep("login")
              setVerificationCode('')
              setTwoFAMethod(null)
            }}
          >
            Login
          </button>
          <button
            className={`px-4 py-2 rounded-md font-semibold ${
              step === "register" || step === "2fa-method" || step === "2fa-verify"
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-green-700"
            }`}
            onClick={() => {
              setStep("register")
              setVerificationCode('')
              setTwoFAMethod(null)
            }}
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
        ) : step === "2fa-method" ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Verification Method</h3>
              <p className="text-sm text-gray-600 mt-1">We'll send a verification code to your chosen method</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setTwoFAMethod("email")
                  setStep("2fa-verify")
                }}
                className="w-full border-2 border-gray-300 hover:border-green-600 rounded-lg p-4 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-gray-900">Send to Email</p>
                    <p className="text-sm text-gray-600">{registrationEmail}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setTwoFAMethod("mobile")
                  setStep("2fa-verify")
                }}
                className="w-full border-2 border-gray-300 hover:border-green-600 rounded-lg p-4 transition text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-semibold text-gray-900">Send to Phone</p>
                    <p className="text-sm text-gray-600">{registrationPhone}</p>
                  </div>
                </div>
              </button>
            </div>

            <button 
              onClick={() => setStep("register")}
              className="w-full text-gray-600 py-2 rounded-md hover:bg-gray-100 transition text-sm"
            >
              ← Back to Registration
            </button>
          </div>
        ) : step === "2fa-verify" ? (
          <form className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700 mb-2">
                <strong>Verification Code Sent!</strong>
              </p>
              <p className="text-xs text-gray-600">
                We've sent a 6-digit verification code to your {twoFAMethod === "email" ? "email" : "phone number"}. 
                {twoFAMethod === "email" && ` (${registrationEmail})`}
                {twoFAMethod === "mobile" && ` (${registrationPhone})`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
                           text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-green-300 focus:border-green-400 text-center text-2xl tracking-widest"
              />
            </div>

            <button 
              onClick={() => {
                if (verificationCode.length === 6) {
                  alert('✓ Account verified! Registration complete.');
                  setStep("register");
                  setVerificationCode('');
                  setTwoFAMethod(null);
                  setRegistrationEmail('');
                  setRegistrationPhone('');
                  setDateValue('');
                  setNationalityValue('');
                  onClose();
                }
              }}
              disabled={verificationCode.length !== 6}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Complete Registration
            </button>

            <button 
              onClick={() => alert('Resending code...')}
              className="w-full text-green-600 py-2 rounded-md hover:bg-gray-100 transition text-sm"
            >
              Resend Code
            </button>

            <button 
              onClick={() => setStep("2fa-method")}
              className="w-full text-gray-600 py-2 rounded-md hover:bg-gray-100 transition text-sm"
            >
              ← Change Method
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
              value={registrationEmail}
              onChange={(e) => setRegistrationEmail(e.target.value)}
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
              value={registrationPhone}
              onChange={(e) => setRegistrationPhone(e.target.value)}
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

            <button 
              onClick={() => {
                if (registrationEmail && registrationPhone) {
                  setStep("2fa-method")
                } else {
                  alert('Please fill in email and phone number')
                }
              }}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  )
}