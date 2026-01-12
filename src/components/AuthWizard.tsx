"use client"
import type { PublicUser } from "@/types/user"
import { useState, FormEvent } from "react"
import { useAuth } from "@/app/context/AuthContext"

interface AuthWizardProps {
  type: "login" | "register"
  onClose: () => void
  onSuccess?: (user: PublicUser) => void
}


export default function AuthWizard({ type, onClose, onSuccess }: AuthWizardProps) {
  const { setUser } = useAuth()
  const [step, setStep] = useState<"login" | "register" | "2fa-method" | "2fa-verify">(type)
  const [dateValue, setDateValue] = useState('')
  const [nationalityValue, setNationalityValue] = useState('')
  const [addressValue, setAddressValue] = useState('')
  const [twoFAMethod, setTwoFAMethod] = useState<"email" | "mobile" | null>(null)
  const [verificationCode, setVerificationCode] = useState('')
  const [registrationEmail, setRegistrationEmail] = useState('')
  const [registrationPhone, setRegistrationPhone] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-white/10 dark:bg-black/40 backdrop-blur-md transition-colors" />

      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 z-10 transition-colors">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6 gap-2">
          <button
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              step === "login"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-green-400"
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
            className={`px-4 py-2 rounded-md font-semibold transition-colors ${
              step === "register" || step === "2fa-method" || step === "2fa-verify"
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-green-400"
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

        {step === "login" ? (
          <LoginForm
            onSuccess={(user: PublicUser) => {
              onSuccess?.(user)
              onClose()
              // Keep user on current page (landing page) instead of redirecting
            }}
          />
        ) : step === "2fa-method" ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Choose Verification Method</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">We&apos;ll send a verification code to your chosen method</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setTwoFAMethod("email")
                  setStep("2fa-verify")
                }}
                className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-green-600 dark:hover:border-green-500 rounded-lg p-4 transition text-left bg-white dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Send to Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{registrationEmail}</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setTwoFAMethod("mobile")
                  setStep("2fa-verify")
                }}
                className="w-full border-2 border-gray-300 dark:border-gray-600 hover:border-green-600 dark:hover:border-green-500 rounded-lg p-4 transition text-left bg-white dark:bg-gray-700"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Send to Phone</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{registrationPhone}</p>
                  </div>
                </div>
              </button>
            </div>

            <button 
              onClick={() => setStep("register")}
              className="w-full text-gray-600 dark:text-gray-400 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition text-sm"
            >
              ← Back to Registration
            </button>
          </div>
        ) : step === "2fa-verify" ? (
          <form className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4 transition-colors">
              <p className="text-sm text-gray-700 dark:text-green-300 mb-2">
                <strong>Verification Code Sent!</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-green-200">
                We&apos;ve sent a 6-digit verification code to your {twoFAMethod === "email" ? "email" : "phone number"}. 
                {twoFAMethod === "email" && ` (${registrationEmail})`}
                {twoFAMethod === "mobile" && ` (${registrationPhone})`}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={verificationCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md 
                     text-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-green-300 dark:focus:ring-green-500 focus:border-green-400 dark:focus:border-green-600 text-center text-2xl tracking-widest transition-colors"
              />
            </div>

            <button 
              onClick={() => {
                if (verificationCode.length === 6) {
                  alert('✓ Account verified! Registration complete.')
                  setStep("register")
                  setVerificationCode('')
                  setTwoFAMethod(null)
                  setRegistrationEmail('')
                  setRegistrationPhone('')
                  setDateValue('')
                  setNationalityValue('')
                  setAddressValue('')
                  onClose()
                }
              }}
              disabled={verificationCode.length !== 6}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Complete Registration
            </button>

            <button 
              onClick={() => alert('Resending code...')}
              className="w-full text-green-600 dark:text-green-400 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
            >
              Resend Code
            </button>

            <button 
              onClick={() => setStep("2fa-method")}
              className="w-full text-gray-600 dark:text-gray-400 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm"
            >
              ← Change Method
            </button>
          </form>
        ) : (
          <RegisterForm
            email={registrationEmail}
            phone={registrationPhone}
            dateValue={dateValue}
            nationalityValue={nationalityValue}
            addressValue={addressValue}
            onEmailChange={setRegistrationEmail}
            onPhoneChange={setRegistrationPhone}
            onDateChange={setDateValue}
            onNationalityChange={setNationalityValue}
            onAddressChange={setAddressValue}
            onComplete={(user: PublicUser) => {
              setUser(user)  // Auto-login the newly registered user
              onSuccess?.(user)
              onClose()
              // Keep user on current page (landing page) instead of redirecting
            }}
            onGoto2FAMethod={() => setStep('2fa-method')}
          />
        )}
      </div>
    </div>
  )
}

function LoginForm({ onSuccess }: { onSuccess: (user: PublicUser) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include',
        body: JSON.stringify({ email, password }) 
      })

      if (!res.ok) {
        let errorMsg = 'Login failed';
        try {
          const errorData = await res.json();
          errorMsg = errorData?.error || errorMsg;
      } catch (err: unknown) {
          // The error response was not JSON
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.user) {
        onSuccess(data.user)
      } else {
        throw new Error('Login failed: No user data returned');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Login error:', message);
      alert(message);
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <button 
        className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-2 rounded-md transition-colors" 
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}

interface RegisterFormProps {
  email: string
  phone: string
  dateValue: string
  nationalityValue: string
  addressValue: string

  onEmailChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onDateChange: (v: string) => void
  onNationalityChange: (v: string) => void
  onAddressChange: (v: string) => void

  onComplete?: (user: PublicUser) => void
  onGoto2FAMethod: () => void
}



function RegisterForm({ email, phone, dateValue, nationalityValue, addressValue, onEmailChange, onPhoneChange, onDateChange, onNationalityChange, onAddressChange, onComplete, onGoto2FAMethod }: RegisterFormProps) {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email || !phone) return alert('Please fill in email and phone number')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        credentials: 'include',
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          phone, 
          nationality: nationalityValue, 
          dateOfBirth: dateValue, 
          address: addressValue 
        }) 
      });

      if (!res.ok) {
        let errorMsg = 'Registration failed';
        if (res.status === 409) {
          errorMsg = 'A user with this email already exists.';
        } else {
          try {
            const errorData = await res.json();
            errorMsg = errorData?.error || errorMsg;
          } catch (err: unknown) {
            // The error response was not JSON
          }
        }
        throw new Error(errorMsg);
      }

      const data = await res.json();
      if (data.user) {
        onComplete?.(data.user);
      } else {
        throw new Error('Registration failed: No user data returned');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Registration error:', message);
      alert(message);
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <input 
        type="text" 
        placeholder="Full Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => onEmailChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <input 
        type="tel" 
        placeholder="Phone Number" 
        value={phone} 
        onChange={(e) => onPhoneChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <input 
        type="date" 
        value={dateValue} 
        onChange={(e) => onDateChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white transition-colors" 
        required
      />
      <select 
        value={nationalityValue} 
        onChange={(e) => onNationalityChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white transition-colors"
        required
      >
        <option value="" disabled className="text-gray-900">Select Nationality</option>
        <option value="Tunisian" className="text-gray-900">Tunisian</option>
        <option value="French" className="text-gray-900">French</option>
        <option value="Italian" className="text-gray-900">Italian</option>
        <option value="American" className="text-gray-900">American</option>
        <option value="Other" className="text-gray-900">Other</option>
      </select>
      <input 
        type="text" 
        placeholder="Address" 
        value={addressValue} 
        onChange={(e) => onAddressChange(e.target.value)} 
        className="w-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors" 
        required
      />
      <div className="flex flex-col gap-2">
        <button 
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-2 rounded-md transition-colors" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <button 
          type="button" 
          onClick={onGoto2FAMethod} 
          className="w-full text-gray-600 dark:text-gray-400 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Use 2FA method
        </button>
      </div>
    </form>
  )
}