"use client"

import React, { useState, useEffect } from 'react'

type Booking = {
  id: string
  user: string
  carModel: string
  startDate: string
  endDate: string
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  total: number
  pickupLocation?: string
  dropoffLocation?: string
  insuranceCost?: number | string | null
  dailyInsuranceCost?: number
  durationDays?: number
}

export default function AdminBookingsTab() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/rentals', { credentials: 'include' })
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch')
      const data = await res.json()
      const items = (data.rentals || []).map((r: any) => {
        const rentalStart = new Date(r.rentalDate)
        const rentalEnd = new Date(r.returnDate)
        const durationDays = Math.ceil((rentalEnd.getTime() - rentalStart.getTime()) / (1000 * 60 * 60 * 24))
        const dailyInsurance = r.insurance ? (Number(r.insuranceCost ?? 0) / 30) : 0
        const totalInsurance = dailyInsurance * durationDays
        
        return {
          id: r.id,
          user: r.user?.name || r.user?.email || r.userId,
          carModel: r.car ? `${r.car.maker} ${r.car.name}` : r.carModel || '—',
          startDate: rentalStart.toISOString().slice(0, 10),
          endDate: rentalEnd.toISOString().slice(0, 10),
          status: r.status.toUpperCase(),
          total: r.totalCost ?? r.total ?? 0,
          pickupLocation: r.pickupLocation,
          dropoffLocation: r.dropoffLocation,
          insuranceCost: r.insurance ? (r.insuranceCost ?? '—') : null,
          dailyInsuranceCost: dailyInsurance,
          durationDays: durationDays,
        }
      })
      setBookings(items)
    } catch (err: any) {
      console.error('Failed to load bookings', err)
      setError(err?.message || 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const updateStatus = async (id: string, status: Booking['status']) => {
    if (!confirm(`Change status to ${status}?`)) return
    setActionLoading(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`/api/admin/rentals/${id}`, { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to update')
      const updated = await res.json()
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: updated.rental.status } : b))
    } catch (err: any) {
      console.error('Update failed', err)
      alert(err?.message || 'Update failed')
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete booking? This cannot be undone.')) return
    setActionLoading(prev => ({ ...prev, [id]: true }))
    try {
      const res = await fetch(`/api/admin/rentals/${id}`, { method: 'DELETE', credentials: 'include' })
      if (res.status !== 204 && !res.ok) throw new Error((await res.json()).message || 'Failed to delete')
      setBookings(prev => prev.filter(b => b.id !== id))
    } catch (err: any) {
      console.error('Delete failed', err)
      alert(err?.message || 'Delete failed')
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Bookings</h3>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading bookings…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
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
                    {b.insuranceCost && b.dailyInsuranceCost ? `TND ${(b.dailyInsuranceCost * b.durationDays!).toFixed(2)}` : (b.insuranceCost === null ? 'No' : '—')}
                  </td>
                  <td className="py-4 px-4 text-gray-900 font-semibold">TND ${b.total}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 items-center">
                      <select value={b.status} onChange={(e) => updateStatus(b.id, e.target.value as Booking['status'])} className={`p-2 border rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-200 ${b.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' : b.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800 border-gray-200' : b.status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}` } disabled={!!actionLoading[b.id]}>
                        <option value="PENDING" className="bg-white text-gray-900">Pending</option>
                        <option value="ACTIVE" className="bg-white text-gray-900">Active</option>
                        <option value="CANCELLED" className="bg-white text-gray-900">Cancelled</option>
                        <option value="COMPLETED" className="bg-white text-gray-900">Completed</option>
                      </select>
                      <button onClick={() => remove(b.id)} disabled={!!actionLoading[b.id]} className="px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">{actionLoading[b.id] ? 'Working…' : 'Delete'}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
