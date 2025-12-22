"use client"

import React, { useState, useEffect } from 'react'

type User = {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  nationality?: string
  driverLicenseNumber?: string
  driverLicenseVerified: boolean
  idDocumentNumber?: string
  idDocumentVerified: boolean
  createdAt: string
}

export default function AdminUsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    nationality: '', 
    driverLicenseNumber: '',
    password: ''
  })
  const [saving, setSaving] = useState(false)

  // Fetch users on mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users', {
        credentials: 'include'
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users)
      } else {
        alert('Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      alert('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const startCreate = () => {
    setEditingId(null)
    setForm({ name: '', email: '', phone: '', address: '', nationality: '', driverLicenseNumber: '', password: '' })
    setShowModal(true)
  }

  const startEdit = (u: User) => {
    setEditingId(u.id)
    setForm({ 
      name: u.name, 
      email: u.email, 
      phone: u.phone ?? '', 
      address: u.address ?? '', 
      nationality: u.nationality ?? '', 
      driverLicenseNumber: u.driverLicenseNumber ?? '',
      password: ''
    })
    setShowModal(true)
  }

  const save = async () => {
    if (!form.name || !form.email) return alert('Name and email required')
    if (!editingId && !form.password) return alert('Password required for new user')

    setSaving(true)
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/users/${editingId}` : '/api/admin/users'
      
      const body = { ...form }
      if (!editingId) {
        // For POST, include password
      } else {
        // For PUT, only include password if changed, otherwise remove it from the body
        if (!form.password) (body as any).password = undefined;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })

      if (res.ok) {
        await fetchUsers()
        setShowModal(false)
        setForm({ name: '', email: '', phone: '', address: '', nationality: '', driverLicenseNumber: '', password: '' })
      } else {
        const err = await res.json().catch(() => ({}))
        alert(`Failed to save: ${err.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to save user')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete user?')) return
    
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (res.ok) {
        await fetchUsers()
      } else {
        alert('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const toggleVerified = async (id: string, type: 'license' | 'id') => {
    const user = users.find(u => u.id === id)
    if (!user) return

    const updateData = type === 'license' 
      ? { driverLicenseVerified: !user.driverLicenseVerified }
      : { idDocumentVerified: !user.idDocumentVerified }

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updateData)
      })

      if (res.ok) {
        await fetchUsers()
      } else {
        alert('Failed to update verification status')
      }
    } catch (error) {
      console.error('Error updating:', error)
      alert('Failed to update verification status')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>
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
              <th className="py-4 px-4">License</th>
              <th className="py-4 px-4">National ID</th>
              <th className="py-4 px-4">Created</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="hover:bg-green-50">
                <td className="py-4 px-4 text-gray-900 font-medium">{u.name}</td>
                <td className="py-4 px-4 text-gray-900">{u.email}</td>
                <td className="py-4 px-4 text-gray-900">{u.phone || '—'}</td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => toggleVerified(u.id, 'license')}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${u.driverLicenseVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {u.driverLicenseVerified ? 'Verified' : 'Pending'}
                  </button>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => toggleVerified(u.id, 'id')}
                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${u.idDocumentVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {u.idDocumentVerified ? 'Verified' : 'Pending'}
                  </button>
                </td>
                <td className="py-4 px-4 text-gray-900">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(u)} className="text-sm px-3 py-1 bg-white border text-green-700 rounded-md hover:bg-green-50">Edit</button>
                    <button onClick={() => remove(u.id)} className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
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
                    value={form.driverLicenseNumber} 
                    onChange={(e) => setForm(prev => ({ ...prev, driverLicenseNumber: e.target.value }))} 
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                  <input 
                    value={form.nationality} 
                    onChange={(e) => setForm(prev => ({ ...prev, nationality: e.target.value }))} 
                    placeholder="USA" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{editingId ? 'Password (leave empty to keep)' : 'Password *'}</label>
                  <input 
                    type="password"
                    value={form.password} 
                    onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} 
                    placeholder="••••••••" 
                    className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500" 
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-4 border-t">
                <button 
                  onClick={save} 
                  disabled={saving}
                  className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editingId ? 'Update User' : 'Create User')}
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