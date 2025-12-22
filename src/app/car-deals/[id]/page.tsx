
"use client"

import { useParams } from "next/navigation"
import { JSX } from "react";
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import AuthWizard from "../../../components/AuthWizard"

import {
  GiCarWheel,
  GiCarDoor,
  GiCarSeat,
  GiSteeringWheel,
  GiLockedDoor,
  GiBoltShield,
} from "react-icons/gi"
import { FaMusic, FaCogs, FaCarSide, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"

type Car = {
  id: number
  maker: string
  name: string
  type: string
  logo: string
  image: string
  monthly: number
  mileage: number
  insuranceCost: number
  price: number
  leasingTerm?: number
  leasingMileageLimit?: number
}

type CarDetails = {
  keyInfo?: Record<string, string>
  stats?: Record<string, string>
  features?: Record<string, string[]>
}

const EMPTY_DETAILS = { keyInfo: {}, stats: {}, features: {} } as const

// Formatting helpers: unit maps and star rendering for safety ratings
const keyInfoUnits: Record<string,string> = {
  "Engine power": "hp",
  Doors: "",
  Seats: "",
  Warranty: "yrs",
}

const statsUnits: Record<string,string> = {
  "CO2 emissions": "g/km",
  "Acceleration (0–100 km/h)": "s",
  "Top speed": "km/h",
  Efficiency: "L/100km",
  "Boot (seats up)": "L",
}

const formatValueWithUnit = (label: string, value: any, unitsMap: Record<string,string>) => {
  if (value === null || value === undefined) return ''
  const unit = unitsMap[label] || ''
  if (typeof value === 'number') return unit ? `${value.toLocaleString()} ${unit}` : value.toLocaleString()
  return `${value}${unit ? ' ' + unit : ''}`
}

const renderStars = (rating: number) => {
  const r = Math.max(0, Math.min(5, Number(rating) || 0))
  const stars = [] as JSX.Element[]
  for (let i = 1; i <= 5; i++) {
    if (r >= i) stars.push(<FaStar key={i} className="text-green-600 inline mr-1" />)
    else if (r >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-green-600 inline mr-1" />)
    else stars.push(<FaRegStar key={i} className="text-green-600 inline mr-1" />)
  }
  return <div className="flex items-center">{stars}<span className="text-sm text-gray-500 ml-2">{r}</span></div>
}

const formatKeyInfo = (label: string, value: any) => formatValueWithUnit(label, value, keyInfoUnits)
const formatStat = (label: string, value: any) => {
  if (label === 'Safety rating') return renderStars(Number(value))
  return formatValueWithUnit(label, value, statsUnits)
}

// Feature rendering: format wheels and entertainment numeric entries
const renderFeatureItem = (category: string, item: any) => {
  if (item === null || item === undefined) return ''
  // Wheels: numeric => "16-inch Wheels"
  if (category === 'Wheels' && typeof item === 'number') return `${item}" Alloy Wheels`
  // Entertainment: numeric => "8-inch Touchscreen"
  if (category === 'Entertainment' && typeof item === 'number') return `${item}-inch Touchscreen`
  // Otherwise return as-is
  return String(item)
}

type RemoteCar = Car & { details?: CarDetails }

export default function CarDetailsPage() {
  const { id } = useParams()
  const [car, setCar] = useState<RemoteCar | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const carId = typeof id === 'string' ? id : undefined
    if (!carId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    ;(async () => {
      try {
        const res = await fetch(`/api/cars/${carId}`)
        if (!res.ok) {
          setError(res.status === 404 ? 'Car not found' : 'Failed to fetch car')
          return
        }
        const data = await res.json()
        if (!cancelled) setCar(data)
      } catch (e) {
        if (!cancelled) setError('Failed to fetch car')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [id])

  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)
  const details = car?.details ?? EMPTY_DETAILS

  const router = useRouter()
  const auth = useAuth()

  if (loading) return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onLogin={() => setShowAuth("login")} onRegister={() => setShowAuth("register")} />
      <main className="flex-1 max-w-7xl mx-auto px-10 py-14">
        <p className="text-center py-20 text-gray-600">Loading car...</p>
      </main>
      <Footer />
      {showAuth && <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />}
    </div>
  )

  if (error || !car) return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onLogin={() => setShowAuth("login")} onRegister={() => setShowAuth("register")} />
      <main className="flex-1 max-w-7xl mx-auto px-10 py-14">
        <p className="text-center py-20 text-red-600">{error || 'Car not found'}</p>
      </main>
      <Footer />
      {showAuth && <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />}
    </div>
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Passive Safety": return <GiBoltShield className="inline mr-2 text-green-600" />
      case "Security": return <GiLockedDoor className="inline mr-2 text-green-600" />
      case "Interior Features": return <GiCarSeat className="inline mr-2 text-green-600" />
      case "Exterior Features": return <FaCarSide className="inline mr-2 text-green-600" />
      case "Entertainment": return <FaMusic className="inline mr-2 text-green-600" />
      case "Driver Convenience": return <GiSteeringWheel className="inline mr-2 text-green-600" />
      case "Engine/Drivetrain/Suspension": return <FaCogs className="inline mr-2 text-green-600" />
      case "Trim": return <GiCarDoor className="inline mr-2 text-green-600" />
      case "Wheels": return <GiCarWheel className="inline mr-2 text-green-600" />
      default: return null
    }
  }
const backButtonTexts = [
  "Back to the real deal",
  "See other deals",
  "Browse all cars",
  "Return to deals",
  "Back to car deals",
  "View all offers",
  "More cars await"
]

const backButtonText = backButtonTexts[Math.floor(Math.random() * backButtonTexts.length)]
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header
        onLogin={() => setShowAuth("login")}
        onRegister={() => setShowAuth("register")}
      />

    <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
      <div className="flex items-center justify-between">
        <a
            href="/car-deals"
            className="inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-700 px-5 py-2 rounded-lg transition-all duration-300 hover:bg-green-50">
          <span>←</span>
          <span>{backButtonText}</span>
          </a>
        <h1 className="text-3xl font-bold text-gray-900">
          {car.maker} {car.name}
        </h1>
        </div>

        {/* Image and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {car.image ? (
              <img
                src={car.image}
                alt={`${car.maker} ${car.name}`}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg">
            {/* Car Logo and Name Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-green-200">
            <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center p-3">
              <img
                src={car.logo}
                alt={car.maker}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700">
                {car.maker} {car.name}
              </h2>
              <p className="text-base font-medium tracking-wide text-green-1200 uppercase">
                {car.type}
              </p>
            </div>
          </div>


            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Monthly Payment</span>
                <span className="text-2xl font-bold text-green-600">TND {car.monthly}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Mileage Limit</span>
                <span className="text-lg font-semibold text-gray-800">{car.leasingMileageLimit?.toLocaleString()} km/year</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Current Mileage</span>
                <span className="text-lg font-semibold text-gray-800">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Insurance Cost</span>
                <span className="text-lg font-semibold text-gray-800">TND {car.insuranceCost}/month</span>
              </div>
            </div>
            <button
              onClick={() => {
                // If user is not signed in, show Auth modal; otherwise go to rent form
                if (!auth.user) setShowAuth("login")
                else router.push(`/rent/${car.id}`)
              }}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Key Information */}
        {details.keyInfo && (
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Key Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(details.keyInfo).map(([label, value]) => (
                <div key={label} className="bg-gray-50 p-5 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-green-700">{formatKeyInfo(label, value)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats & Performance */}
        {details.stats && (
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Stats & Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(details.stats).map(([label, value]) => (
                <div key={label} className="bg-gray-50 p-5 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">{label}</p>
                  <div className="text-lg font-semibold text-green-700">{label === 'Safety rating' ? renderStars(Number(value)) : formatStat(label, value)}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vehicle Features */}
        {details.features && (
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Vehicle Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(details.features).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category}>
                    <h3 className="text-green-600 font-bold mb-3 flex items-center">
                      {getCategoryIcon(category)} {category}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-800 space-y-2">
                      {items.map((item) => (
                        <li key={String(item)}>{renderFeatureItem(category, item)}</li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {showAuth && (
        <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />
      )}
    </div>
  )
}