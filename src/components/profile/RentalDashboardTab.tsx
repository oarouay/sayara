'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

const LocationViewer = dynamic(() => import('../LocationViewer'), { ssr: false })

export interface Rental {
  id: string
  carModel: string
  rentalDate: string
  returnDate: string
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING' | 'CANCELLED'
  totalCost: number
  deliveryFee?: number
  pickupLocation?: string
  pickupLatitude?: number
  pickupLongitude?: number
  dropoffLocation?: string
  dropoffLatitude?: number
  dropoffLongitude?: number
  licensePlate?: string
  dailyRate?: number
  insuranceCost?: number
  insurance?: boolean
  createdAt?: string
  user?: {
    id: string
    name: string
    email: string
    phone: string
  }
  car?: {
    id: string
    maker: string
    name: string
    type: string
    image: string
    logo: string
    price?: number
    monthly?: number
    insuranceCost?: number
  }
}

export interface Payment {
  id: string
  paymentDate: string
  amount: number
  paymentMethod: 'CASH' | 'CARD' | 'ONLINE'
  status: 'PENDING' | 'PAID' | 'FAILED'
  cardLast4?: string
  cardBrand?: string
}

interface RentalDashboardTabProps {
  rentals?: {
    activeRentals: Rental[]
  }
}

const getStatusColor = (status: Rental['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-700'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusColor = (status: Payment['status']) => {
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

const formatDate = (dateStr: string | Date) => {
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function RentalDashboardTab({ rentals: propRentals }: RentalDashboardTabProps) {
  const [rentals, setRentals] = useState<Rental[]>(propRentals?.activeRentals || [])
  const [rentalPayments, setRentalPayments] = useState<{ [rentalId: string]: Payment[] }>({})
  const [loading, setLoading] = useState(true)
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // Fetch rentals on mount
  useEffect(() => {
    fetchRentals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchRentals = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching rentals from /api/rentals...')
      const res = await fetch('/api/rentals', {
        credentials: 'include'
      })

      console.log('Response status:', res.status)
      
      if (res.ok) {
        const data = await res.json()
        console.log('✅ Rentals fetched:', data)
        // Support both user rentals and admin rentals endpoint
        const rentalList = data.rentals || data.activeRentals || []
        console.log('Rental list:', rentalList)
        setRentals(rentalList)
        
        // Fetch payments for each rental
        rentalList.forEach((rental: Rental) => {
          fetchPaymentsForRental(rental.id)
        })
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('❌ Failed to fetch rentals:', res.status, errorData)
      }
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentsForRental = async (rentalId: string) => {
    try {
      console.log(`🔍 Fetching payments for rental ${rentalId}...`)
      const res = await fetch(`/api/payments?rentalId=${rentalId}`, {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        console.log(`✅ Payments fetched for rental ${rentalId}:`, data)
        setRentalPayments(prev => ({
          ...prev,
          [rentalId]: data.payments || []
        }))
      } else {
        console.error(`❌ Failed to fetch payments for rental ${rentalId}:`, res.status)
      }
    } catch (error) {
      console.error(`Error fetching payments for rental ${rentalId}:`, error)
    }
  }

  const handleCancelRental = async (rentalId: string) => {
    if (!confirm('Are you sure you want to cancel this rental?')) return

    setCancelling(true)
    try {
      const res = await fetch(`/api/rentals/${rentalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'CANCELLED' })
      })

      if (res.ok) {
        await fetchRentals()
        setSelectedRental(null)
        alert('Rental cancelled successfully')
      } else {
        const errorData = await res.json().catch(() => ({}))
        console.error('Cancel rental error:', res.status, errorData)
        alert(`Failed to cancel rental: ${errorData.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error cancelling rental:', error)
      alert('Failed to cancel rental')
    } finally {
      setCancelling(false)
    }
  }

  const downloadReceipt = (rental: Rental) => {
    const paymentData = rentalPayments[rental.id] || []
    
    // Calculate rental duration in days
    const rentalStart = new Date(rental.rentalDate)
    const rentalEnd = new Date(rental.returnDate)
    const durationDays = Math.ceil((rentalEnd.getTime() - rentalStart.getTime()) / (1000 * 60 * 60 * 24))
    
    // Pricing calculation: (insurance cost + daily rate) x duration + delivery
    const insuranceCost = rental.insurance ? (rental.insuranceCost || 0) : 0 // Only include if insurance was selected
    const deliveryFee = rental.deliveryFee || 0
    const subtotal = (insuranceCost + (rental.dailyRate || 0)) * durationDays
    const calculatedTotal = subtotal + deliveryFee

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rental Receipt - ${rental.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f3f4f6;
            padding: 20px;
            color: #1f2937;
          }
          
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          
          .header {
            background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .header-logo {
            max-width: 120px;
            height: auto;
            margin: 0 auto 20px;
            filter: brightness(0) invert(1);
          }
          
          .header h1 {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            letter-spacing: 1px;
          }
          
          .header p {
            font-size: 14px;
            opacity: 0.95;
            font-weight: 500;
          }
          
          .content {
            padding: 40px 30px;
          }
          
          .section {
            margin-bottom: 40px;
          }
          
          .section h2 {
            font-size: 16px;
            font-weight: 600;
            color: #16a34a;
            margin-bottom: 20px;
            border-bottom: 3px solid #16a34a;
            padding-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          
          .info-item {
            display: flex;
            flex-direction: column;
          }
          
          .info-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.05em;
          }
          
          .info-value {
            font-size: 16px;
            color: #1f2937;
            font-weight: 600;
          }
          
          .status-badge {
            display: inline-block;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            width: fit-content;
          }
          
          .status-active {
            background: #dcfce7;
            color: #166534;
          }
          
          .status-completed {
            background: #dbeafe;
            color: #1e40af;
          }
          
          .status-pending {
            background: #fef3c7;
            color: #92400e;
          }
          
          .status-cancelled {
            background: #fee2e2;
            color: #991b1b;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border: 1px solid #e5e7eb;
          }
          
          thead {
            background: #f0fdf4;
            border-bottom: 2px solid #16a34a;
          }
          
          th {
            padding: 14px 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 700;
            color: #16a34a;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          td {
            padding: 14px 12px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 14px;
            color: #374151;
          }
          
          tbody tr:hover {
            background: #f9fafb;
          }
          
          tbody tr:last-child td {
            border-bottom: 2px solid #16a34a;
          }
          
          .payment-method {
            font-weight: 600;
            color: #1f2937;
          }
          
          .amount {
            font-weight: 700;
            color: #16a34a;
            font-size: 16px;
          }
          
          .status-paid {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 4px;
            background: #dcfce7;
            color: #166534;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .status-pending-small {
            display: inline-block;
            padding: 6px 10px;
            border-radius: 4px;
            background: #fef3c7;
            color: #92400e;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
          }
          
          .summary {
            background: #f0fdf4;
            border: 2px solid #16a34a;
            border-radius: 8px;
            padding: 24px;
            margin-top: 20px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 14px;
            font-size: 14px;
            padding: 8px 0;
          }
          
          .summary-row.total {
            border-top: 3px solid #16a34a;
            padding-top: 16px;
            margin-top: 16px;
            font-size: 20px;
            font-weight: 700;
            color: #16a34a;
          }
          
          .summary-label {
            color: #4b5563;
            font-weight: 600;
          }
          
          .summary-value {
            color: #1f2937;
            font-weight: 700;
          }
          
          .breakdown-section {
            margin-bottom: 20px;
            padding-bottom: 16px;
            border-bottom: 1px solid #d1d5db;
          }
          
          .breakdown-title {
            font-size: 13px;
            font-weight: 700;
            color: #16a34a;
            text-transform: uppercase;
            margin-bottom: 8px;
            letter-spacing: 0.5px;
          }
          
          .footer {
            border-top: 2px solid #e5e7eb;
            margin-top: 40px;
            padding-top: 20px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }
          
          .footer p {
            margin-bottom: 6px;
          }
          
          .no-print {
            display: none;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .container {
              box-shadow: none;
              max-width: 100%;
              border-radius: 0;
            }
            
            .header {
              background: linear-gradient(135deg, #16a34a 0%, #15803d 100%) !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            
            .section h2 {
              color: #16a34a !important;
              border-bottom-color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            thead {
              background: #f0fdf4 !important;
              border-bottom-color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            th {
              color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .amount {
              color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .summary {
              background: #f0fdf4 !important;
              border-color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .summary-row.total {
              color: #16a34a !important;
              border-top-color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .breakdown-title {
              color: #16a34a !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-hint {
              display: none;
            }
          }
          
          @media screen {
            .print-hint {
              text-align: center;
              color: #15803d;
              font-size: 12px;
              margin-bottom: 20px;
              padding: 12px;
              background: #f0fdf4;
              border: 1px solid #16a34a;
              border-radius: 4px;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-hint">
          💡 Tip: Use Ctrl+P (or Cmd+P on Mac) to print this receipt as a PDF
        </div>
        
        <div class="container">
          <div class="header">
            <img src="/data/logo.png" alt="Sayara Logo" class="header-logo">
            <h1>RENTAL RECEIPT</h1>
            <p>Sayara Car Rental Service</p>
          </div>
          
          <div class="content">
            <!-- Rental Info Section -->
            <div class="section">
              <h2>Rental Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Rental ID</span>
                  <span class="info-value">${rental.id}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Status</span>
                  <span class="status-badge status-${rental.status.toLowerCase()}">${rental.status}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Receipt Date</span>
                  <span class="info-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Rental Duration</span>
                  <span class="info-value">${durationDays} day${durationDays !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
            
            <!-- Customer Information Section -->
            <div class="section">
              <h2>Customer Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Customer Name</span>
                  <span class="info-value">${rental.user?.name || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email</span>
                  <span class="info-value">${rental.user?.email || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone Number</span>
                  <span class="info-value">${rental.user?.phone || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Booking Date</span>
                  <span class="info-value">${new Date(rental.createdAt || new Date()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
            
            <!-- Vehicle Details Section -->
            <div class="section">
              <h2>Vehicle Details</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Vehicle Model</span>
                  <span class="info-value">${rental.carModel}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">License Plate</span>
                  <span class="info-value">${rental.licensePlate || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Manufacturer</span>
                  <span class="info-value">${rental.car?.maker || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Vehicle Type</span>
                  <span class="info-value">${rental.car?.type || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Daily Rate</span>
                  <span class="info-value">TND ${(rental.dailyRate || 0).toFixed(2)}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Monthly Rate</span>
                  <span class="info-value">TND ${(rental.car?.monthly || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <!-- Rental Period Section -->
            <div class="section">
              <h2>Rental Period & Locations</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">Pickup Date & Time</span>
                  <span class="info-value">${new Date(rental.rentalDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Return Date & Time</span>
                  <span class="info-value">${new Date(rental.returnDate).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Pickup Location</span>
                  <span class="info-value">${rental.pickupLocation || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Pickup Coordinates</span>
                  <span class="info-value">${rental.pickupLatitude && rental.pickupLongitude ? `${(rental.pickupLatitude).toFixed(6)}, ${(rental.pickupLongitude).toFixed(6)}` : 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Dropoff Location</span>
                  <span class="info-value">${rental.dropoffLocation || 'N/A'}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Dropoff Coordinates</span>
                  <span class="info-value">${rental.dropoffLatitude && rental.dropoffLongitude ? `${(rental.dropoffLatitude).toFixed(6)}, ${(rental.dropoffLongitude).toFixed(6)}` : 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <!-- Payment Details Section -->
            <div class="section">
              <h2>Payment Details</h2>
              ${paymentData.length > 0 ? `
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Payment Method</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${paymentData.map(payment => `
                      <tr>
                        <td>${new Date(payment.paymentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td class="payment-method">
                          ${payment.paymentMethod === 'CARD' ? `Card ending in ${payment.cardLast4 || '****'} (${payment.cardBrand || 'Unknown'})` : payment.paymentMethod}
                        </td>
                        <td class="amount">TND ${payment.amount.toFixed(2)}</td>
                        <td><span class="status-${payment.status.toLowerCase()}">${payment.status}</span></td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : `
                <p style="color: #6b7280; font-style: italic; padding: 20px; background: #f9fafb; border-radius: 4px;">No payments recorded yet</p>
              `}
              
              <div class="summary">
                <div class="breakdown-section">
                  <div class="breakdown-title">Pricing Breakdown</div>
                  <div class="summary-row">
                    <span class="summary-label">Daily Rental Rate:</span>
                    <span class="summary-value">TND ${(rental.dailyRate || 0).toFixed(2)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-label">Insurance Selected:</span>
                    <span class="summary-value">${rental.insurance ? 'Yes' : 'No'}</span>
                  </div>
                  ${rental.insurance ? `
                    <div class="summary-row">
                      <span class="summary-label">Daily Insurance Cost:</span>
                      <span class="summary-value">TND ${insuranceCost > 0 ? `${insuranceCost.toFixed(2)}` : '0.00'}</span>
                    </div>
                  ` : ''}
                  <div class="summary-row">
                    <span class="summary-label">Number of Days:</span>
                    <span class="summary-value">${durationDays} day${durationDays !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                
                <div class="summary-row" style="padding: 12px 0; font-size: 13px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 12px;">
                  <span class="summary-label">Rental Fee (TND ${(rental.dailyRate || 0).toFixed(2)} × ${durationDays} days):</span>
                  <span class="summary-value">TND ${((rental.dailyRate || 0) * durationDays).toFixed(2)}</span>
                </div>
                ${rental.insurance ? `
                  <div class="summary-row" style="padding: 12px 0; font-size: 13px; color: #6b7280;">
                    <span class="summary-label">Insurance (TND ${insuranceCost.toFixed(2)} × ${durationDays} days):</span>
                    <span class="summary-value">TND ${(insuranceCost * durationDays).toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="summary-row">
                  <span class="summary-label">Subtotal:</span>
                  <span class="summary-value">TND ${subtotal.toFixed(2)}</span>
                </div>
                ${deliveryFee > 0 ? `
                  <div class="summary-row">
                    <span class="summary-label">Delivery Fee:</span>
                    <span class="summary-value">TND ${deliveryFee.toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="summary-row total">
                  <span>Total Rental Cost:</span>
                  <span>TND ${calculatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <!-- Footer -->
            <div class="footer">
              <p><strong>Thank you for choosing Sayara Car Rental Service!</strong></p>
              <p style="margin-top: 12px;">For support, please contact our customer service team</p>
              <p style="margin-top: 8px; font-size: 11px; color: #9ca3af;">Generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    // Open in new tab
    const newWindow = window.open()
    if (newWindow) {
      newWindow.document.write(htmlContent)
      newWindow.document.close()
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading rentals...</div>
  }

  if (rentals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg mb-4">No rentals found</p>
        <p className="text-gray-500">Start by booking a car from our inventory</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rentals</h2>

      <div className="space-y-4">
        {rentals.map(rental => (
          <div
            key={rental.id}
            className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{rental.carModel}</h3>
                  <p className="text-sm text-gray-600">Rental ID: {rental.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(rental.status)}`}>
                  {rental.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pickup</p>
                  <p className="font-medium text-gray-900">{formatDate(rental.rentalDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Return</p>
                  <p className="font-medium text-gray-900">{formatDate(rental.returnDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Daily Rate</p>
                  <p className="font-medium text-gray-900">TND {rental.dailyRate || 'N/A'}/day</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                  <p className="font-medium text-green-600 text-lg">TND {rental.totalCost.toFixed(2)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                  <p className="text-gray-900">{rental.pickupLocation || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Dropoff Location</p>
                  <p className="text-gray-900">{rental.dropoffLocation || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">License Plate</p>
                  <p className="text-gray-900">{rental.licensePlate || '—'}</p>
                </div>
              </div>

              {/* Payment History for this rental */}
              {rentalPayments[rental.id] && rentalPayments[rental.id].length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Payment History</p>
                  <div className="space-y-2">
                    {rentalPayments[rental.id].map((payment) => (
                      <div key={payment.id} className="bg-gray-50 p-3 rounded flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {payment.paymentMethod === 'CARD' 
                              ? `Card ending in ${payment.cardLast4 || '****'} (${payment.cardBrand || 'Unknown'})` 
                              : payment.paymentMethod}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">TND {payment.amount.toFixed(2)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRental(rental)}
                  className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition text-sm font-medium"
                >
                  View Details
                </button>
                {rental.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelRental(rental.id)}
                    disabled={cancelling}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition text-sm font-medium disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Rental'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedRental && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
            <div className="bg-green-600 dark:bg-green-900 text-white p-6 flex justify-between items-center sticky top-0 rounded-t-lg transition-colors">
              <h2 className="text-2xl font-bold">{selectedRental.carModel}</h2>
              <button
                onClick={() => setSelectedRental(null)}
                className="text-white hover:bg-green-700 dark:hover:bg-green-800 p-2 rounded transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedRental.status)}`}>
                  {selectedRental.status}
                </span>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg transition-colors">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Rental Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pickup Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedRental.rentalDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Return Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedRental.returnDate)}</p>
                  </div>
                </div>
              </div>

              {/* Pickup Location with Map */}
              {selectedRental.pickupLatitude !== undefined && selectedRental.pickupLongitude !== undefined ? (
                <LocationViewer
                  location={{
                    name: selectedRental.pickupLocation || 'Pickup Location',
                    latitude: selectedRental.pickupLatitude,
                    longitude: selectedRental.pickupLongitude,
                  }}
                  title="Pickup Location"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pickup Location</p>
                  <p className="font-medium">{selectedRental.pickupLocation || '—'}</p>
                </div>
              )}

              {/* Dropoff Location with Map */}
              {selectedRental.dropoffLatitude !== undefined && selectedRental.dropoffLongitude !== undefined ? (
                <LocationViewer
                  location={{
                    name: selectedRental.dropoffLocation || 'Dropoff Location',
                    latitude: selectedRental.dropoffLatitude,
                    longitude: selectedRental.dropoffLongitude,
                  }}
                  title="Dropoff Location"
                />
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Dropoff Location</p>
                  <p className="font-medium">{selectedRental.dropoffLocation || '—'}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Rate</span>
                    <span className="font-medium">TND {selectedRental.dailyRate || 'N/A'}</span>
                  </div>
                  {selectedRental.insurance && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Insurance</span>
                      <span className="font-medium">Included</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                    <span>Total Cost</span>
                    <span className="text-green-600">TND {selectedRental.totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment History in modal */}
              {rentalPayments[selectedRental.id] && rentalPayments[selectedRental.id].length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Payment History</h3>
                  <div className="space-y-3">
                    {rentalPayments[selectedRental.id].map((payment) => (
                      <div key={payment.id} className="bg-white p-3 rounded border border-gray-200 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {payment.paymentMethod === 'CARD' 
                              ? `Card ending in ${payment.cardLast4 || '****'} (${payment.cardBrand || 'Unknown'})` 
                              : payment.paymentMethod}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(payment.paymentDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">${payment.amount.toFixed(2)}</span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                {selectedRental.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelRental(selectedRental.id)}
                    disabled={cancelling}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Rental'}
                  </button>
                )}
                <button
                  onClick={() => downloadReceipt(selectedRental)}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center gap-2"
                >
                  <span>📄</span>
                  Download Receipt
                </button>
                <button
                  onClick={() => setSelectedRental(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
