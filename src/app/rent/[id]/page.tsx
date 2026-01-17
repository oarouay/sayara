"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import AuthWizard from "../../../components/AuthWizard"
import { useAuth } from '@/app/context/AuthContext'
import { calculateDeliveryFee, getDeliveryDistance } from '@/lib/deliveryFee'

const LocationPicker = dynamic(() => import("../../../components/LocationPicker"), { ssr: false })

interface LocationData {
  name: string
  latitude: number
  longitude: number
}

interface Car {
  id: string
  maker: string
  name: string
  monthly?: number
  price?: number
  insuranceCost?: number
  image?: string
}

export default function RentPage() {
  const { id } = useParams()
  const router = useRouter()
  const auth = useAuth()

  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [pickupLocation, setPickupLocation] = useState<LocationData | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<LocationData | null>(null)
  const [insurance, setInsurance] = useState(true)
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)
  const [minPickupDate, setMinPickupDate] = useState('')
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null)
  const [isCarAvailableNow, setIsCarAvailableNow] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'CARD'>('CASH')
  const [userHasSavedCard, setUserHasSavedCard] = useState(false)

  // Format date as YYYY-MM-DD for input type="date"
  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Check if user has a saved card
  useEffect(() => {
    if (!auth.user) {
      setUserHasSavedCard(false)
      return
    }

    ;(async () => {
      try {
        const res = await fetch('/api/profile', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setUserHasSavedCard(!!data.user?.cardNumber)
        }
      } catch (e) {
        console.error('Failed to check saved card:', e)
      }
    })()
  }, [auth.user])

  // Fetch existing rentals for this car and set minimum pickup date
  useEffect(() => {
    const carId = typeof id === 'string' ? id : undefined
    if (!carId) return

    ;(async () => {
      try {
        const res = await fetch(`/api/rentals?carId=${carId}`)
        if (!res.ok) return

        const rentals = await res.json()
        // Filter for PENDING and ACTIVE rentals, find the latest return date
        const activeRentals = (rentals || []).filter((r: any) =>
          r.status === 'PENDING' || r.status === 'ACTIVE'
        )

        let minDate = new Date()

        if (activeRentals.length > 0) {
          // Car has active rentals
          setIsCarAvailableNow(false)
          // Find the latest return date
          const latestReturnDate = new Date(
            Math.max(...activeRentals.map((r: any) => new Date(r.returnDate).getTime()))
          )
          // Set minimum pickup date to the day after the last rental ends
          minDate = new Date(latestReturnDate)
          minDate.setDate(minDate.getDate() + 1)
          setNextAvailableDate(minDate)
        } else {
          // Car is available now (no active rentals)
          setIsCarAvailableNow(true)
          setNextAvailableDate(null)
        }

        setMinPickupDate(formatDate(minDate))
      } catch (e) {
        // If fetch fails, allow booking from today
        const today = new Date()
        setMinPickupDate(formatDate(today))
      }
    })()
  }, [id])

  // Set default dates on component mount (one month rental) or when min date changes
  useEffect(() => {
    if (!minPickupDate) return

    const startDate = new Date(minPickupDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    setPickupDate(minPickupDate)
    setReturnDate(formatDate(endDate))
  }, [minPickupDate])

  // Set default locations to Main Store if car is available now
  // Only set defaults on initial load, not on every isCarAvailableNow change
  useEffect(() => {
    if (isCarAvailableNow && !pickupLocation && !dropoffLocation) {
      const mainStoreLocation = {
        name: 'Main Store',
        latitude: 36.8178547692,
        longitude: 10.1796510816,
      }
      console.log('🔄 Setting default locations to Main Store (car available)')
      setPickupLocation(mainStoreLocation)
      setDropoffLocation(mainStoreLocation)
    } else if (!isCarAvailableNow && (pickupLocation || dropoffLocation)) {
      // Only clear if car is rented AND user hasn't manually selected different locations
      console.log('🔄 Clearing locations (car not available)')
      setPickupLocation(null)
      setDropoffLocation(null)
    }
  }, [isCarAvailableNow]) // Keep this dependency

  // Reset form function
  const resetForm = () => {
    const startDate = new Date(minPickupDate)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + 30)

    setPickupDate(minPickupDate)
    setReturnDate(formatDate(endDate))
    
    // Reset locations: Main Store if available, null if rented
    if (isCarAvailableNow) {
      const mainStoreLocation = {
        name: 'Main Store',
        latitude: 36.817702,
        longitude: 10.179812,
      }
      setPickupLocation(mainStoreLocation)
      setDropoffLocation(mainStoreLocation)
    } else {
      setPickupLocation(null)
      setDropoffLocation(null)
    }
    
    setInsurance(true)
    setError(null)
  }

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

  if (loading) return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-14">
        <p className="text-center py-20 text-gray-600 dark:text-gray-400">Loading...</p>
      </main>
      <Footer />
    </div>
  )

  if (error || !car) return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-14">
        <p className="text-center py-20 text-red-600">{error || 'Car not found'}</p>
      </main>
      <Footer />
    </div>
  )

  // default daily rate estimate: use monthly / 30 if available
  const defaultDailyRate = car.monthly ? (Number(car.monthly) / 30) : (Number(car.price || 0) / 30)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!auth.user) {
      setShowAuth('login')
      return
    }

    console.log('📋 Form submission started')
    console.log('   Pickup location:', pickupLocation)
    console.log('   Dropoff location:', dropoffLocation)
    
    if (!pickupLocation || !dropoffLocation) {
      const missingFields = []
      if (!pickupLocation) missingFields.push('pickup location')
      if (!dropoffLocation) missingFields.push('dropoff location')
      const errorMsg = `Please select: ${missingFields.join(' and ')}`
      console.error('❌ Validation failed:', errorMsg)
      setError(errorMsg)
      return
    }

    try {
      const start = new Date(pickupDate)
      const end = new Date(returnDate)
      if (isNaN(+start) || isNaN(+end) || end <= start) {
        setError('Please select a valid date range (return after pickup)')
        return
      }
      const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24))

      // Enforce minimum 30-day rental period
      if (days < 30) {
        setError(`Minimum rental period is 30 days. You selected ${days} day${days !== 1 ? 's' : ''}.`)
        resetForm()
        return
      }

      const dailyRate = Number((defaultDailyRate).toFixed(2))
      const insuranceDaily = Number(((car.insuranceCost ?? 0) / 30).toFixed(2))
      const totalCost = Number(((dailyRate + (insurance ? insuranceDaily : 0)) * days).toFixed(2))

      setError(null)
      const requestBody = {
        carId: car.id,
        carModel: `${car.maker} ${car.name}`,
        rentalDate: start.toISOString(),
        returnDate: end.toISOString(),
        pickupLocation: pickupLocation.name,
        pickupLatitude: pickupLocation.latitude,
        pickupLongitude: pickupLocation.longitude,
        dropoffLocation: dropoffLocation.name,
        dropoffLatitude: dropoffLocation.latitude,
        dropoffLongitude: dropoffLocation.longitude,
        licensePlate: 'SAYARTI-TN',
        dailyRate,
        totalCost,
        insurance,
        paymentMethod
      }
      
      console.log('📤 Sending rental request with data:', {
        carId: car.id,
        carModel: `${car.maker} ${car.name}`,
        days,
        dailyRate,
        totalCost,
        paymentMethod,
        pickupLocation: pickupLocation?.name,
        dropoffLocation: dropoffLocation?.name,
        rentalDate: start.toISOString(),
        returnDate: end.toISOString(),
      })

      console.log('📤 Full request body:', JSON.stringify(requestBody, null, 2))

      const res = await fetch('/api/rentals', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId: car.id,
          carModel: `${car.maker} ${car.name}`,
          rentalDate: start.toISOString(),
          returnDate: end.toISOString(),
          pickupLocation: pickupLocation.name,
          pickupLatitude: pickupLocation.latitude,
          pickupLongitude: pickupLocation.longitude,
          dropoffLocation: dropoffLocation.name,
          dropoffLatitude: dropoffLocation.latitude,
          dropoffLongitude: dropoffLocation.longitude,
          licensePlate: 'SAYARTI-TN',
          dailyRate,
          totalCost,
          insurance,
          paymentMethod
        })
      })

      console.log('📥 Rental response received')
      console.log('   Status:', res.status)
      console.log('   Status text:', res.statusText)
      console.log('   Headers:', Array.from(res.headers.entries()))

      if (res.status === 401) {
        console.warn('⚠️ Unauthorized - redirecting to login')
        setShowAuth('login')
        return
      }

      if (!res.ok) {
        console.error('❌ Response not OK, attempting to read error details...')
        let payload: any = null
        let rawText = ''
        
        try {
          // Clone response to read body
          const clonedRes = res.clone()
          rawText = await clonedRes.text()
          console.log('   Raw response body:', rawText)
          
          // Try to parse as JSON
          if (rawText && rawText.trim()) {
            try {
              payload = JSON.parse(rawText)
              console.log('   Parsed JSON payload:', payload)
            } catch (parseErr) {
              console.error('   ⚠️ Could not parse response as JSON')
              console.error('   Parse error:', parseErr instanceof Error ? parseErr.message : String(parseErr))
            }
          } else {
            console.log('   Response body is empty')
          }
        } catch (readErr) {
          console.error('   ⚠️ Could not read response body')
          console.error('   Read error:', readErr instanceof Error ? readErr.message : String(readErr))
        }
        
        const errorMessage = 
          (typeof payload?.error === 'string' ? payload.error : undefined) ||
          (typeof payload?.message === 'string' ? payload.message : undefined) ||
          (rawText && rawText.trim() ? rawText : undefined) ||
          `HTTP ${res.status}: ${res.statusText || 'Unknown Error'}`
          
        console.error('❌ Rental creation failed:')
        console.error('   HTTP Status:', res.status)
        console.error('   Error message:', errorMessage)
        console.error('   Full response:', payload || rawText || '(empty response)')
        
        setError(errorMessage)
        return
      }

      const rentalData = await res.json()
      const rentalId = rentalData.id
      console.log('✅ Rental created:', rentalId)

      // Create payment record
      console.log('💳 Creating payment record...')
      console.log('   Rental ID:', rentalId)
      console.log('   Amount:', totalCost)
      console.log('   Payment method:', paymentMethod)

      const paymentRes = await fetch('/api/payments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rentalId,
          amount: totalCost,
          paymentMethod,
        })
      })

      console.log('📥 Payment response received')
      console.log('   Status:', paymentRes.status)

      if (!paymentRes.ok) {
        let errorPayload: any = {}
        let errorText = ''
        
        try {
          const clonedRes = paymentRes.clone()
          errorText = await clonedRes.text()
          console.log('   Raw response:', errorText)
          
          if (errorText && errorText.trim()) {
            try {
              errorPayload = JSON.parse(errorText)
              console.log('   Parsed payload:', errorPayload)
            } catch (parseErr) {
              console.error('   ⚠️ Could not parse as JSON')
            }
          }
        } catch (readErr) {
          console.error('   ⚠️ Could not read response:', readErr)
        }
        
        const errorMsg = 
          (typeof errorPayload?.message === 'string' ? errorPayload.message : undefined) ||
          (typeof errorPayload?.error === 'string' ? errorPayload.error : undefined) ||
          (typeof errorPayload?.details === 'string' ? errorPayload.details : undefined) ||
          (errorText && errorText.trim() ? errorText : undefined) ||
          'Failed to process payment'
          
        console.error('❌ Payment creation failed:')
        console.error('   Status:', paymentRes.status)
        console.error('   Message:', errorMsg)
        console.error('   Full response:', errorPayload || errorText)
        
        setError(errorMsg)
        return
      }

      const paymentData = await paymentRes.json()
      console.log('✅ Payment record created:', paymentData.payment?.id)

      // Success: go to profile rentals
      console.log('✅ Booking completed successfully! Redirecting to profile...')
      router.push('/profile?success=booking_completed')

    } catch (err: any) {
      console.error('🔴 Unexpected error during rental submission:', err)
      console.error('Error type:', typeof err)
      console.error('Error constructor:', err?.constructor?.name)
      console.error('Error message:', err?.message)
      console.error('Error stack:', err?.stack)
      console.error('Full error:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      setError(err?.message || 'Unexpected error while creating rental')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-6 py-14">
        <h1 className="text-2xl font-bold mb-6">Rent {car.maker} {car.name}</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">Pickup date</span>
              <input
                type="date"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                min={minPickupDate}
                className="mt-2 p-3 border rounded"
                required
              />
              {nextAvailableDate && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  Available from: {nextAvailableDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">Return date</span>
              <input
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
                className="mt-2 p-3 border rounded"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LocationPicker
              value={pickupLocation}
              onChange={setPickupLocation}
              title="Pickup Location (Click on map to select)"
            />
            <LocationPicker
              value={dropoffLocation}
              onChange={setDropoffLocation}
              title="Dropoff Location (Click on map to select)"
            />
          </div>

          <label className="flex flex-col">
            <span className="text-sm text-gray-600 dark:text-gray-400">License plate</span>
            <input 
              type="text" 
              value="SAYARTI-TN" 
              disabled 
              className="mt-2 p-3 border rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-not-allowed"
            />
          </label>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={insurance} onChange={e => setInsurance(e.target.checked)} />
              <span className="text-sm text-gray-600 dark:text-gray-400">Add insurance</span>
            </label>
            <div className="ml-auto text-sm text-gray-700 dark:text-gray-300">Estimated daily: <strong>TND {defaultDailyRate.toFixed(2)}</strong></div>
          </div>

          {dropoffLocation && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <p className="text-sm text-amber-900">
                <strong>Delivery Fee:</strong> {calculateDeliveryFee(dropoffLocation.latitude, dropoffLocation.longitude).toFixed(2)} TND
                <span className="text-xs text-amber-700 ml-2">
                  ({getDeliveryDistance(dropoffLocation.latitude, dropoffLocation.longitude).toFixed(1)} km from Main Store • 10 Tunisian Dinar per 500m)
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total estimate</div>
            <div className="text-xl font-bold">TND {(() => {
              if (!pickupDate || !returnDate) return '—'
              const start = new Date(pickupDate)
              const end = new Date(returnDate)
              if (isNaN(+start) || isNaN(+end) || end <= start) return '—'
              const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24))
              const dailyRate = Number(defaultDailyRate.toFixed(2))
              const insuranceDaily = Number(((car.insuranceCost ?? 0) / 30).toFixed(2))
              const rentalCost = (dailyRate + (insurance ? insuranceDaily : 0)) * days
              const deliveryFee = dropoffLocation ? calculateDeliveryFee(dropoffLocation.latitude, dropoffLocation.longitude) : 0
              return (rentalCost + deliveryFee).toFixed(2)
            })()}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-900">
              ℹ️ <strong>Minimum rental period:</strong> Cars must be rented for at least 30 days (1 month)
            </p>
          </div>

          {/* Payment Method Selection */}
          <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition" style={{ backgroundColor: paymentMethod === 'CASH' ? '#f0fdf4' : 'white' }}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="CASH"
                  checked={paymentMethod === 'CASH'}
                  onChange={(e) => setPaymentMethod(e.target.value as 'CASH' | 'CARD')}
                  className="w-4 h-4 text-green-600"
                />
                <span className="ml-3 text-gray-900 dark:text-white font-medium">💵 Cash on Pickup</span>
              </label>

              {userHasSavedCard ? (
                <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition" style={{ backgroundColor: paymentMethod === 'CARD' ? '#f0fdf4' : 'white' }}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={paymentMethod === 'CARD'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'CASH' | 'CARD')}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="ml-3 text-gray-900 dark:text-white font-medium">💳 Saved Card</span>
                </label>
              ) : (
                <div className="flex items-center p-3 border border-yellow-300 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900">
                  <span className="text-gray-500 dark:text-gray-400 text-sm">💳 Saved Card</span>
                  <span className="ml-3 text-xs text-yellow-700 dark:text-yellow-200">Save a card in your profile to use this option</span>
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded">Confirm Booking</button>
          </div>
        </form>
      </main>
      <Footer />

      {showAuth && <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />}
    </div>
  )
}
