// components/profile/PaymentDetailsTab.tsx
"use client"

import { useState } from "react"

interface PaymentDetailsTabProps {
  paymentDetails: {
    cardHolder?: string
    cardNumber?: string
    expiryDate?: string
    billingAddress?: string
  }
}

// Card brand detection
const detectCardBrand = (cardNumber: string) => {
  const cleaned = cardNumber.replace(/\s/g, '')
  
  if (/^4/.test(cleaned)) {
    return { 
      brand: 'visa', 
      bgGradient: 'from-blue-600 to-blue-800',
      logo: '💳'
    }
  }
  if (/^5[1-5]/.test(cleaned)) {
    return { 
      brand: 'mastercard', 
      bgGradient: 'from-red-600 to-orange-600',
      logo: '💳'
    }
  }
  if (/^3[47]/.test(cleaned)) {
    return { 
      brand: 'amex', 
      bgGradient: 'from-teal-600 to-cyan-600',
      logo: '💳'
    }
  }
  return { 
    brand: 'generic', 
    bgGradient: 'from-gray-700 to-gray-900',
    logo: '💳'
  }
}

export default function PaymentDetailsTab({ paymentDetails }: PaymentDetailsTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  
  const [formData, setFormData] = useState({
    cardHolder: paymentDetails?.cardHolder || "",
    cardNumber: paymentDetails?.cardNumber || "",
    expiryDate: paymentDetails?.expiryDate || "",
    cvv: "",
    billingAddress: paymentDetails?.billingAddress || ""
  })

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
    // Here you would typically make an API call to save the data
    // For now, we'll just simulate success
    setSuccessMessage("Payment details updated successfully!")
    setIsEditing(false)
    
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleCancel = () => {
    setFormData({
      cardHolder: paymentDetails?.cardHolder || "",
      cardNumber: paymentDetails?.cardNumber || "",
      expiryDate: paymentDetails?.expiryDate || "",
      cvv: "",
      billingAddress: paymentDetails?.billingAddress || ""
    })
    setIsEditing(false)
  }

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, "")
    if (!cleaned || cleaned.length < 4) return "**** **** **** ****"
    const lastFour = cleaned.slice(-4)
    return `**** **** **** ${lastFour}`
  }

  const brandInfo = detectCardBrand(formData.cardNumber || paymentDetails?.cardNumber || "")

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
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
          ✓ {successMessage}
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
              {paymentDetails?.cardHolder || "Not set"}
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
              {maskCardNumber(paymentDetails?.cardNumber || "")}
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
              {paymentDetails?.expiryDate || "Not set"}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Preview</h3>

          <div
            className={`bg-gradient-to-br ${brandInfo.bgGradient} rounded-xl p-6 text-white max-w-sm shadow-2xl transform hover:scale-105 transition-transform`}
          >
            {/* Card Header */}
            <div className="flex justify-between items-start mb-12">
              <div className="text-sm font-semibold opacity-80">CREDIT CARD</div>
              <div className="text-3xl">{brandInfo.logo}</div>
            </div>

            {/* Card Number */}
            <div className="mb-6">
              <p className="text-xs opacity-70 mb-2 tracking-wide">CARD NUMBER</p>
              <p className="text-lg font-mono tracking-widest">
                {maskCardNumber(paymentDetails.cardNumber)}
              </p>
            </div>

            {/* Card Details */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-70 mb-1 tracking-wide">CARD HOLDER</p>
                <p className="text-sm font-semibold uppercase">
                  {paymentDetails.cardHolder || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-70 mb-1 tracking-wide">EXPIRES</p>
                <p className="text-sm font-semibold">
                  {paymentDetails.expiryDate || "N/A"}
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