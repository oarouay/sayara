"use client"

import React, { useState } from 'react'
import Header from '../Header'
import Footer from '../Footer'

import AdminUsersTab from './AdminUsersTab'
import AdminBookingsTab from './AdminBookingsTab'
import AdminDocsTab from './AdminDocsTab'
import AdminSupportTab from './AdminSupportTab'
import AdminCarsTab from './AdminCarsTab'

type Tab = 'users' | 'cars' | 'bookings' | 'documents' | 'support'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('users')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogin={() => {}} onRegister={() => {}} />

      <main className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-6 px-6">
              <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
              <p className="mt-1 text-green-50">Manage users, bookings, documents and support — local state only</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white px-6 py-5 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'users' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200'}`}>
                    Users
                  </button>
                  <button onClick={() => setActiveTab('cars')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'cars' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200'}`}>
                    Cars
                  </button>
                  <button onClick={() => setActiveTab('bookings')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'bookings' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200'}`}>
                    Bookings
                  </button>
                  <button onClick={() => setActiveTab('documents')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'documents' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200'}`}>
                    Documents
                  </button>
                  <button onClick={() => setActiveTab('support')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'support' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md hover:scale-105 border border-gray-200'}`}>
                    Support
                  </button>
                
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {activeTab === 'users' && <AdminUsersTab />}
            {activeTab === 'bookings' && <AdminBookingsTab />}
            {activeTab === 'documents' && <AdminDocsTab />}
            {activeTab === 'support' && <AdminSupportTab />}
            {activeTab === 'cars' && <AdminCarsTab />}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
