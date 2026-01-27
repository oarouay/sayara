// components/profile/PaymentDetailsTab.tsx
"use client"

import { useState, useEffect } from "react"
import { detectCardBrand, getBrandGradient } from './cardBrands'
import CardIcon from '../CardIcon'

interface Rental {
  id: string
  carModel: string
  licensePlate: string
  carId?: string
  car?: {
    id: string
    maker: string
    name: string
    type: string
    image: string
    logo: string
  }
}

interface Payment {
  id: string
  amount: number
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE'
  status: 'PENDING' | 'PAID' | 'FAILED'
  paymentDate: string
  cardLast4?: string
  cardBrand?: string
  rental: Rental
}

interface PaymentDetailsTabProps {
  onUpdate?: () => void;
  paymentDetails?: {
    cardHolderName?: string;  // Changed from cardHolder
    cardNumber?: string;
    cardBrand?: string;
    cardExpiryDate?: string;  // Changed from expiryDate
    billingAddress?: string;
  };
}

const getStatusColor = (status: Payment['status']) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function PaymentDetailsTab({ paymentDetails, onUpdate }: PaymentDetailsTabProps) {
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showFullCard, setShowFullCard] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  const [formData, setFormData] = useState({
    cardHolder: paymentDetails?.cardHolderName || "",
    cardNumber: paymentDetails?.cardNumber || "",
    expiryDate: paymentDetails?.cardExpiryDate || "",
    cvv: "",
    billingAddress: paymentDetails?.billingAddress || ""
  })

  // Sync formData with paymentDetails prop when it changes
  useEffect(() => {
    if (paymentDetails) {
      setFormData({
        cardHolder: paymentDetails.cardHolderName || "",
        cardNumber: paymentDetails.cardNumber || "",
        expiryDate: paymentDetails.cardExpiryDate || "",
        cvv: "",
        billingAddress: paymentDetails.billingAddress || ""
      })
    }
    setLoading(false)
  }, [paymentDetails])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces (XXXX XXXX XXXX XXXX)
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19) // Max 16 digits + 3 spaces
    }

    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .slice(0, 4)
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + "/" + formattedValue.slice(2)
      }
    }

    // CVV - only digits, max 4
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
  }

  const handleSave = async () => {
    try {
      const cardBrand = detectCardBrand(formData.cardNumber).brand
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethod: formData.cardNumber ? 'CARD' : undefined,
          cardHolderName: formData.cardHolder,
          cardNumber: formData.cardNumber ? formData.cardNumber.replace(/\s/g, '') : undefined,
          cardExpiryDate: formData.expiryDate || undefined,
          cardBrand: cardBrand,
          billingAddress: formData.billingAddress
          // CVV is NOT sent to server for security - it's only used for display in the form
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccessMessage("Payment details updated successfully!")
        setIsEditing(false)
        if (onUpdate) {
          onUpdate()
        }
      } else {
        console.error('API Error:', data)
        setSuccessMessage(`Failed to save: ${data.error || data.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving payment:', error)
      setSuccessMessage("Error saving payment details. Please try again.")
    }
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleCancel = () => {
    setFormData({
      cardHolder: paymentDetails?.cardHolderName || "",
      cardNumber: paymentDetails?.cardNumber || "",
      expiryDate: paymentDetails?.cardExpiryDate || "",
      cvv: "",
      billingAddress: paymentDetails?.billingAddress || ""
    })
    setIsEditing(false)
    setSuccessMessage("")
  }

  const maskCardNumber = (cardNumber: string, showFull: boolean = false) => {
    const cleaned = cardNumber.replace(/\s/g, "")
    if (!cleaned || cleaned.length < 4) return "**** **** **** ****"
    if (showFull) {
      // Format full number as XXXX XXXX XXXX XXXX
      return cleaned.replace(/(\d{4})/g, "$1 ").trim()
    }
    const lastFour = cleaned.slice(-4)
    return `**** **** **** ${lastFour}`
  }

  // Use brand from form data while editing (full card number available)
  // Use saved brand when viewing (only first 6 + last 4 digits available)
  const brandName = isEditing 
    ? detectCardBrand(formData.cardNumber).brand 
    : (paymentDetails?.cardBrand || 'westernunion')
  const brandInfo = { brand: brandName, bgGradient: '' }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading payment details...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payment Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Edit Payment
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className={`mb-4 p-4 rounded ${
          successMessage.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {successMessage.includes('successfully') ? '✓' : '✗'} {successMessage}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          {isEditing ? (
            <input
              type="text"
              name="cardHolder"
              value={formData.cardHolder}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          ) : (
            <p className="text-gray-900 font-medium">
              {paymentDetails?.cardHolderName || "Not set"}
            </p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          {isEditing ? (
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-gray-900"
            />
          ) : (
            <p className="text-gray-900 font-mono font-medium">
              {maskCardNumber(paymentDetails?.cardNumber || "", false)}
            </p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          {isEditing ? (
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          ) : (
            <p className="text-gray-900 font-medium">
              {paymentDetails?.cardExpiryDate && paymentDetails.cardExpiryDate.trim() ? paymentDetails.cardExpiryDate : "Not set"}
            </p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          {isEditing ? (
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="***"
              maxLength={4}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          ) : (
            <p className="text-gray-900 font-medium">***</p>
          )}
        </div>

        {/* Billing Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Billing Address
          </label>
          {isEditing ? (
            <input
              type="text"
              name="billingAddress"
              value={formData.billingAddress}
              onChange={handleChange}
              placeholder="123 Main St, City, Country"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            />
          ) : (
            <p className="text-gray-900 font-medium">
              {paymentDetails?.billingAddress || "Not set"}
            </p>
          )}
        </div>
      </div>

      {/* Credit Card Preview */}
      {!isEditing && paymentDetails?.cardNumber && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Saved Card
            <span className="text-xs text-gray-500 ml-2">(Click to view details)</span>
          </h3>

          <div
            className={`${getBrandGradient(brandInfo.brand)} rounded-xl p-6 text-white max-w-sm shadow-2xl transform hover:scale-105 transition-transform cursor-pointer`}
            onClick={() => setShowFullCard(!showFullCard)}
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-12">
              <div className="text-sm font-semibold opacity-80">CREDIT CARD</div>
              <CardIcon brand={brandInfo.brand} className="h-10 w-auto" />
            </div>

            {/* Card Number */}
            <div className="mb-6">
              <p className="text-xs opacity-70 mb-2 tracking-wide">CARD NUMBER</p>
              <p className="text-lg font-mono tracking-widest">
                {showFullCard ? maskCardNumber(paymentDetails.cardNumber, false) : maskCardNumber(paymentDetails.cardNumber)}
              </p>
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1 tracking-wide">CARD HOLDER</p>
                <p className="text-sm font-semibold uppercase">
                  {paymentDetails.cardHolderName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1 tracking-wide">EXPIRES</p>
                <p className="text-sm font-semibold">
                  {paymentDetails.cardExpiryDate && paymentDetails.cardExpiryDate.trim() ? paymentDetails.cardExpiryDate : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Full Card Details Modal */}
          {showFullCard && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-sm">
              <h4 className="font-semibold text-gray-900 mb-4">Full Card Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Card Holder</p>
                  <p className="text-sm font-mono text-gray-900">{paymentDetails.cardHolderName || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Full Card Number</p>
                  <p className="text-sm font-mono text-gray-900">{maskCardNumber(paymentDetails.cardNumber, false)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Card Brand</p>
                  <p className="text-sm font-mono text-gray-900">{paymentDetails?.cardBrand || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Expiry Date</p>
                  <p className="text-sm font-mono text-gray-900">{paymentDetails.cardExpiryDate || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Billing Address</p>
                  <p className="text-sm text-gray-900">{paymentDetails.billingAddress || "Not set"}</p>
                </div>
              </div>
              <button
                onClick={() => setShowFullCard(false)}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Hide Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* Live Card Preview While Editing */}
      {isEditing && formData.cardNumber && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h3>

          <div
            className={`${getBrandGradient(brandInfo.brand)} rounded-xl p-6 text-white max-w-sm shadow-2xl`}
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-12">
              <div className="text-sm font-semibold opacity-80">CREDIT CARD</div>
              <CardIcon brand={brandInfo.brand} className="h-10 w-auto" />
            </div>

            {/* Card Number */}
            <div className="mb-6">
              <p className="text-xs opacity-70 mb-2 tracking-wide">CARD NUMBER</p>
              <p className="text-lg font-mono tracking-widest">
                {maskCardNumber(formData.cardNumber)}
              </p>
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1 tracking-wide">CARD HOLDER</p>
                <p className="text-sm font-semibold uppercase">
                  {formData.cardHolder || "YOUR NAME"}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1 tracking-wide">EXPIRES</p>
                <p className="text-sm font-semibold">
                  {formData.expiryDate || "MM/YY"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Card Message */}
      {!isEditing && !paymentDetails?.cardNumber && (
        <div className="mt-10 text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-4">💳 No payment method on file</p>
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Add Payment Method
          </button>
        </div>
      )}

      {/* Save / Cancel Buttons */}
      {isEditing && (
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}