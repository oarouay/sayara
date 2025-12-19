"use client"
import type { PublicUser } from "@/types/user"
import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

interface AuthWizardProps {
  type: "login" | "register"
  onClose: () => void
  onSuccess?: (user: PublicUser) => void
}


export default function AuthWizard({ type, onClose, onSuccess }: AuthWizardProps) {
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
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

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

        {step === "login" ? (
          <LoginForm
            onSuccess={(user: PublicUser) => {
              onSuccess?.(user)
              onClose()
              router.push('/car-deals')
            }}
          />
        ) : step === "2fa-method" ? (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Verification Method</h3>
              <p className="text-sm text-gray-600 mt-1">We&apos;ll send a verification code to your chosen method</p>
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
          We&apos;ve sent a 6-digit verification code to your {twoFAMethod === "email" ? "email" : "phone number"}. 
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md 
               text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 
               focus:ring-green-300 focus:border-green-400 text-center text-2xl tracking-widest"
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
            onClose()
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
          <RegisterForm
            email={registrationEmail}
            phone={registrationPhone}
            dateValue={dateValue}
            nationalityValue={nationalityValue}
            onEmailChange={setRegistrationEmail}
            onPhoneChange={setRegistrationPhone}
            onDateChange={setDateValue}
            onNationalityChange={setNationalityValue}
            onComplete={(user: PublicUser) => {
              onSuccess?.(user)
              onClose()
              router.push('/car-deals')
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
      const data = await res.json()
      if (res.ok && data.user) {
        onSuccess(data.user)
      } else {
        alert(data?.error || 'Login failed')
      }
    } catch (err: Error | unknown) {
      console.error('Login error:', err)
      alert(err instanceof Error ? err.message : 'Network error')
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
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <button 
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700" 
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

  onEmailChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onDateChange: (v: string) => void
  onNationalityChange: (v: string) => void

  onComplete?: (user: PublicUser) => void
  onGoto2FAMethod: () => void
}



function RegisterForm({ email, phone, dateValue, nationalityValue, onEmailChange, onPhoneChange, onDateChange, onNationalityChange, onComplete, onGoto2FAMethod }: RegisterFormProps) {
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
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          phone, 
          nationality: nationalityValue, 
          dateOfBirth: dateValue, 
          address: '' 
        }) 
      })
      const data = await res.json()
      if (res.ok && data.user) {
        onComplete?.(data.user)
      } else if (res.status === 409) {
        alert('User already exists')
      } else {
        alert(data?.error || 'Registration failed')
      }
    } catch (err) {
      alert('Network error')
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
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => onEmailChange(e.target.value)} 
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <input 
        type="tel" 
        placeholder="Phone Number" 
        value={phone} 
        onChange={(e) => onPhoneChange(e.target.value)} 
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <input 
        type="date" 
        value={dateValue} 
        onChange={(e) => onDateChange(e.target.value)} 
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md" 
        required
      />
      <select 
        value={nationalityValue} 
        onChange={(e) => onNationalityChange(e.target.value)} 
        className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-md"
        required
      >
        <option value="" disabled>Select Nationality</option>
        <option value="Tunisian">Tunisian</option>
        <option value="French">French</option>
        <option value="Italian">Italian</option>
        <option value="American">American</option>
        <option value="Other">Other</option>
      </select>
      <div className="flex flex-col gap-2">
        <button 
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <button 
          type="button" 
          onClick={onGoto2FAMethod} 
          className="w-full text-gray-600 py-2 rounded-md hover:bg-gray-100"
        >
          Use 2FA method
        </button>
      </div>
    </form>
  )
}