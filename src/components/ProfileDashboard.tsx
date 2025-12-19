"use client"

import { useEffect, useState } from "react"
import Header from "./Header"
import Footer from "./Footer"
import UserDetailsTab from "./profile/UserDetailsTab"
import RentalDashboardTab from "./profile/RentalDashboardTab"
import PaymentDetailsTab from "./profile/PaymentDetailsTab"
import DocumentValidationTab from "./profile/DocumentValidationTab"
import type { PublicUser } from "@/types/user"

type Tab = "details" | "rental" | "payment" | "documents"

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("details")
  const [user, setUser] = useState<PublicUser | null>(null)
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  async function fetchProfile() {
    const res = await fetch("/api/profile", {
      credentials: "include"   // ✅ REQUIRED for HttpOnly cookies
    })

    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
    }

    setLoading(false)
  }

  fetchProfile()
}, [])


  if (loading) {
    return <div className="py-20 text-center">Loading profile...</div>
  }

  if (!user) {
    return <div className="py-20 text-center">Not authenticated</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600 mb-8">
          Manage your account, rentals, and payments
        </p>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          {["details", "rental", "payment", "documents"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`pb-2 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-green-600 text-green-600"
                  : "text-gray-500"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-white rounded shadow p-6">
          {activeTab === "details" && (
            <UserDetailsTab
              userProfile={{
                firstName: user.name?.split(" ")[0] ?? "",
                lastName: user.name?.split(" ")[1] ?? "",
                email: user.email ?? "",
                phone: user.phone ?? "",
                dateOfBirth: user.dateOfBirth ?? "",
                address: user.address ?? "",
                city: user.city ?? "", // ✅ Add this if your UserProfile expects it
                country: user.nationality ?? "",
                licenseNumber: user.driverLicenseNumber ?? "",
                nationalId: user.idDocumentNumber ?? "",
              }}
            />
          )}

          {activeTab === "rental" && (
            <RentalDashboardTab rentals={{ activeRentals: user.rentals }} />
          )}

          {activeTab === "payment" && (
            <PaymentDetailsTab paymentDetails={user.paymentDetails} />
          )}

          {activeTab === "documents" && (
            <DocumentValidationTab
              documents={{
                driverLicense: user.driverLicenseNumber ?? null,
                nationalIdCard: user.idDocumentNumber ?? null,
                driverLicenseVerified: user.driverLicenseVerified,
                nationalIdVerified: user.idDocumentVerified,
              }}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}