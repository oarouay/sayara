"use client"

import { useState } from "react"
import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import SearchForm from "../../components/SearchForm"
import AuthWizard from "../../components/AuthWizard"

type Car = {
  id: number
  name: string
  image: string
  monthly: number
  mileage: number
  insuranceCost: number
}

const cars: Car[] = [
  {
    id: 1,
    name: "Toyota Corolla",
    image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a",
    monthly: 289,
    mileage: 25000,
    insuranceCost: 150,
  },
  {
    id: 2,
    name: "BMW 3 Series",
    image: "https://images.unsplash.com/photo-1617814077082-9d2e3f3a9f3a",
    monthly: 399,
    mileage: 15000,
    insuranceCost: 150,
  },
  {
    id: 3,
    name: "Mercedes C-Class",
    image: "https://images.unsplash.com/photo-1620057633739-1f9f3f3e9f3a",
    monthly: 429,
    mileage: 12000,
    insuranceCost: 150,
  },
  {
    id: 4,
    name: "Ford Mustang",
    image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a",
    monthly: 499,
    mileage: 8000,
    insuranceCost: 150,
  },
]

export default function CarDealsPage() {
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* ✅ Header with login/register handlers */}
      <Header
        onLogin={() => setShowAuth("login")}
        onRegister={() => setShowAuth("register")}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        {/* Search Form at the top */}
        <div id="search" className="mb-10">
          <SearchForm />
        </div>

        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center">
          🚘 All Car Deals
        </h1>

        {/* Car grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-bold text-green-700">{car.name}</h2>
                <p className="mt-2 text-gray-600">
                  <span className="font-semibold text-green-600">
                    ${car.monthly}/month
                  </span>{" "}
                  <span className="ml-2 text-sm text-gray-500">
                    {car.mileage.toLocaleString()} km
                  </span>
                </p>
                <p className="mt-1 text-gray-600 text-sm">
                  Insurance:{" "}
                  <span className="font-semibold text-green-600">
                    ${car.insuranceCost}/month
                  </span>
                </p>

                {/* ✅ View Details button using Link */}
                <Link
                  href={`/car-deals/${car.id}`}
                  className="mt-4 block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-center transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />

      {/* Auth modal */}
      {showAuth && (
        <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />
      )}
    </div>
  )
}
