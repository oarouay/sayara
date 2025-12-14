"use client"

import React, { useState } from 'react'

type User = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  licenseNumber?: string
  verified: boolean
  createdAt: string
}

type Doc = {
  id: string
  userId: string
  userName: string
  type: 'license' | 'nationalId'
  url: string | null
  verified: boolean
}

export default function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'John Doe', email: 'john.doe@example.com', phone: '+123456789', address: '123 Main St', city: 'New York', country: 'USA', licenseNumber: 'DL12345', verified: true, createdAt: '2025-01-01' },
    { id: 'u2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+198765432', address: '456 Oak Ave', city: 'Los Angeles', country: 'USA', licenseNumber: 'DL67890', verified: false, createdAt: '2025-02-12' },
  ])

  const [docs, setDocs] = useState<Doc[]>([
    { id: 'd1', userId: 'u1', userName: 'John Doe', type: 'license', url: '/data/sample-license.png', verified: true },
    { id: 'd2', userId: 'u1', userName: 'John Doe', type: 'nationalId', url: '/data/sample-id.png', verified: false },
    { id: 'd3', userId: 'u2', userName: 'Jane Smith', type: 'license', url: '/data/sample-license.png', verified: false },
    { id: 'd4', userId: 'u2', userName: 'Jane Smith', type: 'nationalId', url: '/data/sample-id.png', verified: false },
  ])

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    country: '', 
    licenseNumber: '',
    verified: false
  })

  const startCreate = () => {
    setEditingId(null)
    setForm({ name: '', email: '', phone: '', address: '', city: '', country: '', licenseNumber: '', verified: false })
    setShowModal(true)
  }

  const startEdit = (u: User) => {
    setEditingId(u.id)
    setForm({ 
      name: u.name, 
      email: u.email, 
      phone: u.phone ?? '', 
      address: u.address ?? '', 
      city: u.city ?? '', 
      country: u.country ?? '', 
      licenseNumber: u.licenseNumber ?? '',
      verified: u.verified
    })
    setShowModal(true)
  }

  const save = () => {
    if (!form.name || !form.email) return alert('Name and email required')
    if (editingId) {
      setUsers(prev => prev.map(u => u.id === editingId ? { 
        ...u, 
        name: form.name, 
        email: form.email, 
        phone: form.phone, 
        address: form.address, 
        city: form.city, 
        country: form.country, 
        licenseNumber: form.licenseNumber,
        verified: form.verified
      } : u))
    } else {
      const id = 'u' + (Math.random() * 100000 | 0)
      setUsers(prev => [{ 
        id, 
        name: form.name, 
        email: form.email, 
        phone: form.phone, 
        address: form.address, 
        city: form.city, 
        country: form.country, 
        licenseNumber: form.licenseNumber,
        verified: form.verified,
        createdAt: new Date().toISOString().slice(0,10) 
      }, ...prev])
    }
    setShowModal(false)
    setForm({ name: '', email: '', phone: '', address: '', city: '', country: '', licenseNumber: '', verified: false })
  }

  const remove = (id: string) => {
    if (!confirm('Delete user?')) return
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const toggleVerified = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: !u.verified } : u))
  }

  const getDocStatus = (userId: string, type: 'license' | 'nationalId') => {
    const doc = docs.find(d => d.userId === userId && d.type === type)
    if (!doc) return { status: 'Pending', verified: false }
    return { status: doc.verified ? 'Confirmed' : 'Pending', verified: doc.verified }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Users</h3>
        <button onClick={startCreate} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow-sm hover:shadow-md transition-shadow">New User</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr className="text-sm font-semibold text-green-700">
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Email</th>
              <th className="py-4 px-4">Phone</th>
              <th className="py-4 px-4">Address</th>
              <th className="py-4 px-4">City</th>
              <th className="py-4 px-4">Country</th>
              <th className="py-4 px-4">License</th>
              <th className="py-4 px-4">National ID</th>
              <th className="py-4 px-4">Verified</th>
              <th className="py-4 px-4">Created</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => {
              const licenseStatus = getDocStatus(u.id, 'license')
              const idStatus = getDocStatus(u.id, 'nationalId')
              return (
                <tr key={u.id} className="hover:bg-green-50">
                  <td className="py-4 px-4 text-gray-900 font-medium">{u.name}</td>
                  <td className="py-4 px-4 text-gray-900">{u.email}</td>
                  <td className="py-4 px-4 text-gray-900">{u.phone || '—'}</td>
                  <td className="py-4 px-4 text-gray-900">{u.address || '—'}</td>
                  <td className="py-4 px-4 text-gray-900">{u.city || '—'}</td>
                  <td className="py-4 px-4 text-gray-900">{u.country || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${licenseStatus.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {licenseStatus.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${idStatus.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {idStatus.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => toggleVerified(u.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${u.verified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      {u.verified ? 'Verified' : 'Pending'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-gray-900">{u.createdAt}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(u)} className="text-sm px-3 py-1 bg-white border text-green-700 rounded-md hover:bg-green-50">Edit</button>
                      <button onClick={() => remove(u.id)} className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-lg">
              <h4 className="text-xl font-semibold">{editingId ? 'Edit User' : 'Create New User'}</h4>
              <p className="text-sm text-green-100 mt-1">Fill in all user details below</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input 
                    value={form.name} 
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} 
                    placeholder="John Doe" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input 
                    value={form.email} 
                    onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} 
                    placeholder="john@example.com" 
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    value={form.phone} 
                    onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} 
                    placeholder="+1234567890" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <input 
                    value={form.licenseNumber} 
                    onChange={(e) => setForm(prev => ({ ...prev, licenseNumber: e.target.value }))} 
                    placeholder="DL123456" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input 
                    value={form.address} 
                    onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))} 
                    placeholder="123 Main Street" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input 
                    value={form.city} 
                    onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))} 
                    placeholder="New York" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input 
                    value={form.country} 
                    onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))} 
                    placeholder="USA" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={form.verified}
                      onChange={(e) => setForm(prev => ({ ...prev, verified: e.target.checked }))}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Verified User</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button onClick={save} className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">
                  {editingId ? 'Update User' : 'Create User'}
                </button>
                <button onClick={() => setShowModal(false)} className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}