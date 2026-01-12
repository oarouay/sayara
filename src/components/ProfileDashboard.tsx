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
  const [documents, setDocuments] = useState({
    driverLicense: null as string | null,
    nationalIdCard: null as string | null,
    driverLicenseVerified: false,
    nationalIdVerified: false,
  })

  const fetchProfile = async () => {
    const res = await fetch("/api/profile", {
      credentials: "include"
    })

    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      
      setDocuments({
        driverLicense: data.user.driverLicenseDocument ?? null,
        nationalIdCard: data.user.idDocumentContent ?? null,
        driverLicenseVerified: data.user.driverLicenseVerified,
        nationalIdVerified: data.user.idDocumentVerified,
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchProfile()
  }, [])

  if (loading) {
    return <div className="py-20 text-center dark:text-gray-300">Loading profile...</div>
  }

  if (!user) {
    return <div className="py-20 text-center dark:text-gray-300">Not authenticated</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-2 dark:text-white">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Manage your account, rentals, and payments
        </p>

        <div className="flex gap-4 border-b dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("details")}
            className={`pb-2 font-medium transition-colors ${
              activeTab === "details"
                ? "border-b-2 border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            PROFILE
          </button>
          <button
            onClick={() => setActiveTab("rental")}
            className={`pb-2 font-medium transition-colors ${
              activeTab === "rental"
                ? "border-b-2 border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            RENTALS
          </button>
          <button
            onClick={() => setActiveTab("payment")}
            className={`pb-2 font-medium transition-colors ${
              activeTab === "payment"
                ? "border-b-2 border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            PAYMENTS
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-2 font-medium transition-colors ${
              activeTab === "documents"
                ? "border-b-2 border-green-600 text-green-600 dark:border-green-400 dark:text-green-400"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            DOCUMENTS
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded shadow p-6 min-h-[600px] w-full overflow-hidden transition-colors">
          {activeTab === "details" && (
            <UserDetailsTab
              userProfile={{
                firstName: user.name?.split(" ")[0] ?? "",
                lastName: user.name?.split(" ")[1] ?? "",
                email: user.email ?? "",
                phone: user.phone ?? "",
                dateOfBirth: user.dateOfBirth ?? "",
                address: user.address ?? "",
                city: user.city ?? "",
                country: user.nationality ?? "",
                licenseNumber: user.driverLicenseNumber ?? "",
                nationalId: user.idDocumentNumber ?? "",
              }}
            />
          )}

          {activeTab === "rental" && (
            <RentalDashboardTab
              rentals={{
                activeRentals: (user.rentals || []).map((r) => ({
                  ...r,
                  status: r.status.toUpperCase() as
                    | "ACTIVE"
                    | "COMPLETED"
                    | "PENDING"
                    | "CANCELLED",
                })),
              }}
            />
          )}

          {activeTab === "payment" && (
            <PaymentDetailsTab
              paymentDetails={{
                cardHolder: user.cardHolderName ?? "",
                cardNumber: user.cardLastFour ?? "",
                cardBrand: user.cardBrand ?? "",
                expiryDate: user.expiryDate ?? "",
                billingAddress: user.billingAddress ?? "",
              }}
              onUpdate={fetchProfile}
            />
          )}

          {activeTab === "documents" && (
            <DocumentValidationTab
              documents={documents}
              setDocuments={setDocuments}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}