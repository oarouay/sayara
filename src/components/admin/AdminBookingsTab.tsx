"use client"

import React, { useState } from 'react'

type Booking = {
  id: string
  user: string
  carModel: string
  startDate: string
  endDate: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  total: number
  pickupLocation?: string
  dropoffLocation?: string
  insuranceCost?: number
}

export default function AdminBookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'b1', user: 'John Doe', carModel: 'BMW X5', startDate: '2025-12-01', endDate: '2025-12-10', status: 'confirmed', total: 1500, pickupLocation: 'Downtown', dropoffLocation: 'Airport', insuranceCost: 150 },
    { id: 'b2', user: 'Jane Smith', carModel: 'Audi A6', startDate: '2025-11-15', endDate: '2025-11-20', status: 'completed', total: 800, pickupLocation: 'Airport', dropoffLocation: 'Airport' },
  ])

  const updateStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const remove = (id: string) => {
    if (!confirm('Delete booking?')) return
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Bookings</h3>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr className="text-sm font-semibold text-green-700">
              <th className="py-4 px-4">User</th>
              <th className="py-4 px-4">Car</th>
              <th className="py-4 px-4">Start Date</th>
              <th className="py-4 px-4">End Date</th>
              <th className="py-4 px-4">Pickup</th>
              <th className="py-4 px-4">Dropoff</th>
              <th className="py-4 px-4">Insurance</th>
              <th className="py-4 px-4">Total</th>
              <th className="py-4 px-4">Status & Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-green-50">
                <td className="py-4 px-4 text-gray-900 font-medium">{b.user}</td>
                <td className="py-4 px-4 text-gray-900">{b.carModel}</td>
                <td className="py-4 px-4 text-gray-900">{b.startDate}</td>
                <td className="py-4 px-4 text-gray-900">{b.endDate}</td>
                <td className="py-4 px-4 text-gray-900">{b.pickupLocation || '—'}</td>
                <td className="py-4 px-4 text-gray-900">{b.dropoffLocation || '—'}</td>
                <td className="py-4 px-4 text-gray-900 font-semibold">
                  {b.insuranceCost ? `$${b.insuranceCost}` : '—'}
                </td>
                <td className="py-4 px-4 text-gray-900 font-semibold">${b.total}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2 items-center">
                    <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value as Booking['status'])} className={`p-2 border rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-200 ${b.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : b.status === 'completed' ? 'bg-gray-100 text-gray-800 border-gray-200' : b.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
                      <option value="pending" className="bg-white text-gray-900">Pending</option>
                      <option value="confirmed" className="bg-white text-gray-900">Confirmed</option>
                      <option value="cancelled" className="bg-white text-gray-900">Cancelled</option>
                      <option value="completed" className="bg-white text-gray-900">Completed</option>
                    </select>
                    <button onClick={() => remove(b.id)} className="px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
