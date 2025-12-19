'use client'

import React, { useState } from 'react'

export interface RentalData {
  id: string
  carModel: string
  rentalDate: string
  returnDate: string
  status: 'active' | 'completed' | 'pending' | 'cancelled'
  totalCost: number
  pickupLocation?: string
  dropoffLocation?: string
  driverName?: string
  driverPhone?: string
  licensePlate?: string
  dailyRate?: number
  rentalDays?: number
  insurance?: boolean
  additionalServices?: string[]
  notes?: string
}

interface RentalDashboardTabProps {
  rentals: {
    activeRentals: RentalData[]
  }
  setRentals?: React.Dispatch<
    React.SetStateAction<{
      activeRentals: RentalData[]
    }>
  >
}

// Helper function moved outside
const getStatusColor = (status: RentalData['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-700'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Download invoice function moved outside
const downloadInvoice = (r: RentalData) => {
  const logoSrc = `${window.location.origin}/data/logo.png`
  const invoiceHtml = `<!doctype html>
    <html>
      <head><title>Invoice</title></head>
      <body><h1>Invoice for ${r.carModel}</h1><p>Total: $${r.totalCost}</p></body>
    </html>`
  
  const w = window.open('', '_blank')
  if (!w) return
  w.document.write(invoiceHtml)
  w.document.close()
  w.focus()
  setTimeout(() => {
    try {
      w.print()
    } catch {}
  }, 300)
}

// Modal Component - OUTSIDE the main component
const RentalModal = ({ 
  rental, 
  onClose, 
  onCancelRental 
}: { 
  rental: RentalData
  onClose: () => void
  onCancelRental: (id: string) => void
}) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white text-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="bg-green-600 text-white p-6 flex justify-between items-center sticky top-0 rounded-t-lg">
        <div>
          <h2 className="text-2xl font-bold">{rental.carModel}</h2>
          <p className="text-green-100">Rental ID: {rental.id}</p>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:bg-green-700 p-2 rounded transition"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Section */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Rental Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rental.status)}`}>
                {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rental ID</p>
              <p className="font-medium">{rental.id}</p>
            </div>
          </div>
        </div>

        {/* Rental Dates & Location */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Rental Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Pickup Date</p>
              <p className="font-medium">{rental.rentalDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Return Date</p>
              <p className="font-medium">{rental.returnDate}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Pickup Location</p>
              <p className="font-medium">{rental.pickupLocation || 'Downtown Branch'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Dropoff Location</p>
              <p className="font-medium">{rental.dropoffLocation || 'Downtown Branch'}</p>
            </div>
          </div>
        </div>

        {/* Driver Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Driver Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Driver Name</p>
              <p className="font-medium">{rental.driverName || 'John Doe'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact</p>
              <p className="font-medium">{rental.driverPhone || '+1 234 567 8900'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Vehicle Model</p>
              <p className="font-medium">{rental.carModel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">License Plate</p>
              <p className="font-medium">{rental.licensePlate || 'ABC-1234'}</p>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Pricing Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Daily Rate</span>
              <span className="font-medium">${rental.dailyRate || 75}/day</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rental Days</span>
              <span className="font-medium">{rental.rentalDays || 9} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Cost</span>
              <span className="font-medium">${((rental.dailyRate || 75) * (rental.rentalDays || 9)).toFixed(2)}</span>
            </div>
            {rental.insurance && (
              <div className="flex justify-between">
                <span className="text-gray-600">Insurance</span>
                <span className="font-medium">$150.00</span>
              </div>
            )}
            {rental.additionalServices && rental.additionalServices.length > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Additional Services</span>
                <span className="font-medium">${(rental.additionalServices.length * 25).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>Total Cost</span>
              <span className="text-green-600">${rental.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        {rental.additionalServices && rental.additionalServices.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Services</h3>
            <ul className="space-y-2">
              {rental.additionalServices.map((service, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Notes */}
        {rental.notes && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">Notes</h3>
            <p className="text-blue-800">{rental.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium"
          >
            Close
          </button>
          {rental.status === 'active' && (
            <button
              onClick={() => onCancelRental(rental.id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
            >
              Cancel Rental
            </button>
          )}
          <button
            onClick={() => downloadInvoice(rental)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
          >
            Download {rental.status === 'completed' ? 'Invoice' : 'Details'}
          </button>
        </div>
      </div>
    </div>
  </div>
)

// Rental Card Component - OUTSIDE the main component
const RentalCard = ({ 
  rental, 
  onViewDetails 
}: { 
  rental: RentalData
  onViewDetails: (rental: RentalData) => void
}) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-lg transition">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{rental.carModel}</h3>
        <p className="text-sm text-gray-500 mt-1">Rental ID: {rental.id}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(rental.status)}`}>
        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
      </span>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className="text-xs text-gray-500 uppercase">Rental Date</p>
        <p className="text-sm font-medium text-gray-900">{rental.rentalDate}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 uppercase">Return Date</p>
        <p className="text-sm font-medium text-gray-900">{rental.returnDate}</p>
      </div>
    </div>

    <div className="border-t pt-4 flex justify-between items-center">
      <div>
        <p className="text-xs text-gray-500 uppercase">Total Cost</p>
        <p className="text-lg font-bold text-green-600">${rental.totalCost.toFixed(2)}</p>
      </div>
      <button 
        onClick={() => onViewDetails(rental)}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        {rental.status === 'active' ? 'View Details' : 'View Invoice'}
      </button>
    </div>
  </div>
)

// Main Component
const RentalDashboardTab: React.FC<RentalDashboardTabProps> = ({
  rentals,
  setRentals
}) => {
  const [selectedRental, setSelectedRental] = useState<RentalData | null>(null)

  // Categorized rentals
  const activeRentals = rentals.activeRentals.filter(r => r.status === 'active')
  const completedRentals = rentals.activeRentals.filter(r => r.status === 'completed')
  const pendingRentals = rentals.activeRentals.filter(r => r.status === 'pending')

  const handleCancelRental = (id: string) => {
    if (!confirm('Are you sure you want to cancel this rental?')) return

    if (setRentals) {
      setRentals(prev => ({
        ...prev,
        activeRentals: prev.activeRentals.map(r =>
          r.id === id ? { ...r, status: 'cancelled' } : r
        )
      }))
    }

    setSelectedRental(null)
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Rental Dashboard</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <p className="text-sm text-green-700 font-medium">Active Rentals</p>
          <p className="text-3xl font-bold text-green-900">{activeRentals.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <p className="text-sm text-blue-700 font-medium">Completed Rentals</p>
          <p className="text-3xl font-bold text-blue-900">{completedRentals.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-6">
          <p className="text-sm text-yellow-700 font-medium">Total Spent</p>
          <p className="text-3xl font-bold text-yellow-900">
            ${rentals.activeRentals.reduce((sum, r) => sum + r.totalCost, 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Active Rentals */}
      {activeRentals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Rentals</h3>
          {activeRentals.map(rental => (
            <RentalCard key={rental.id} rental={rental} onViewDetails={setSelectedRental} />
          ))}
        </div>
      )}

      {/* Pending Rentals */}
      {pendingRentals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pending Rentals</h3>
          {pendingRentals.map(rental => (
            <RentalCard key={rental.id} rental={rental} onViewDetails={setSelectedRental} />
          ))}
        </div>
      )}

      {/* Completed Rentals */}
      {completedRentals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Completed Rentals</h3>
          {completedRentals.map(rental => (
            <RentalCard key={rental.id} rental={rental} onViewDetails={setSelectedRental} />
          ))}
        </div>
      )}

      {rentals.activeRentals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No rentals yet. Start renting a car today!</p>
        </div>
      )}

      {/* Modal */}
      {selectedRental && (
        <RentalModal 
          rental={selectedRental} 
          onClose={() => setSelectedRental(null)}
          onCancelRental={handleCancelRental}
        />
      )}
    </div>
  )
}

export default RentalDashboardTab