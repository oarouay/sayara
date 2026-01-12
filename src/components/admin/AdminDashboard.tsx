"use client"

import React, { useState } from 'react'
import Header from '../Header'
import Footer from '../Footer'

import AdminUsersTab from './AdminUsersTab'
import AdminBookingsTab from './AdminBookingsTab'
import AdminDocsTab from './AdminDocsTab'
import AdminSupportTab from './AdminSupportTab'
import AdminCarsTab from './AdminCarsTab'

type Tab = 'users' | 'cars' | 'rentals' | 'documents' | 'support'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('users')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header onLogin={() => {}} onRegister={() => {}} />

      <main className="w-full max-w-7xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden shadow-md">
            <div className="w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-6 px-6">
              <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
              <p className="mt-1 text-green-50 dark:text-green-100">Manage users, bookings, documents and support — local state only</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 px-6 py-5 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab('users')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'users' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-600'}`}>
                    Users
                  </button>
                  <button onClick={() => setActiveTab('cars')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'cars' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-600'}`}>
                    Cars
                  </button>
                  <button onClick={() => setActiveTab('rentals')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'rentals' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-600'}`}>
                    Rentals
                  </button>
                  <button onClick={() => setActiveTab('documents')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'documents' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-600'}`}>
                    Documents
                  </button>
                  <button onClick={() => setActiveTab('support')} className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'support' ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-md hover:scale-105 border border-gray-200 dark:border-gray-600'}`}>
                    Support
                  </button>
                
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            {activeTab === 'users' && <AdminUsersTab />}
            {activeTab === 'rentals' && <AdminBookingsTab />}
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
