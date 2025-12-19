"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import SearchForm from "../../components/SearchForm"
import AuthWizard from "../../components/AuthWizard"

type Car = {
  id: number
  maker: string
  name: string
  type: string
  logo: string
  image: string
  monthly: number
  mileage: number
  insuranceCost: number
  price: number
  leasingTerm?: number
  leasingMileageLimit?: number
}

const cars: Car[] = [
  { id: 1, maker: "Toyota", name: "Corolla", type: "Sedan", logo: "/data/toyota.svg", image: "", monthly: 289, mileage: 25000, insuranceCost: 150, price: 18000 },
  { id: 2, maker: "BMW", name: "3 Series", type: "Sedan", logo: "/data/BMW.svg", image: "", monthly: 399, mileage: 15000, insuranceCost: 150, price: 32000 },
  { id: 3, maker: "Mercedes", name: "C-Class", type: "Sedan", logo: "/data/mercedes.svg", image: "", monthly: 429, mileage: 12000, insuranceCost: 150, price: 35000 },
  { id: 4, maker: "Ford", name: "Mustang", type: "Sports Car", logo: "/data/Ford.svg", image: "", monthly: 499, mileage: 8000, insuranceCost: 150, price: 42000 },
  { id: 8, maker: "Renault", name: "Megane", type: "Hatchback", logo: "/data/Renault.svg", image: "", monthly: 259, mileage: 35000, insuranceCost: 130, price: 16000 },
  { id: 9, maker: "VW", name: "Golf", type: "Hatchback", logo: "/data/vw.svg", image: "", monthly: 319, mileage: 20000, insuranceCost: 155, price: 22000 },
  { id: 11, maker: "Toyota", name: "RAV4", type: "SUV", logo: "/data/toyota.svg", image: "", monthly: 379, mileage: 18000, insuranceCost: 165, price: 28000 },
  { id: 12, maker: "Honda", name: "CR-V", type: "SUV", logo: "/data/honda.svg", image: "", monthly: 359, mileage: 20000, insuranceCost: 160, price: 26500 },
  { id: 13, maker: "Mazda", name: "CX-5", type: "SUV", logo: "/data/mazda.svg", image: "", monthly: 349, mileage: 19000, insuranceCost: 155, price: 25500 },
  { id: 16, maker: "Ford", name: "Explorer", type: "SUV", logo: "/data/Ford.svg", image: "", monthly: 429, mileage: 14000, insuranceCost: 175, price: 34000 },
  { id: 17, maker: "Jeep", name: "Grand Cherokee", type: "SUV", logo: "/data/jeep.svg", image: "", monthly: 459, mileage: 12000, insuranceCost: 185, price: 37000 },
  { id: 18, maker: "Subaru", name: "Outback", type: "SUV", logo: "/data/subaru.svg", image: "", monthly: 369, mileage: 17000, insuranceCost: 160, price: 27500 },
  { id: 19, maker: "Volkswagen", name: "Tiguan", type: "SUV", logo: "/data/vw.svg", image: "", monthly: 339, mileage: 21000, insuranceCost: 155, price: 24500 },
]

export default function CarDealsPage() {
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)
  const searchParams = useSearchParams()

  // Read filters from query string
  const availability = searchParams.get("availability") || "all"
  const maker = searchParams.get("maker") || "all"
  const type = searchParams.get("type") || "all"
  const minPrice = Number(searchParams.get("minPrice") || 200)
  const maxPrice = Number(searchParams.get("maxPrice") || 1500)

  // Apply filters
  const filteredCars = cars.filter((car) => {
    const makerMatch = maker === "all" || car.maker === maker
    const typeMatch = type === "all" || car.type === type
    const priceMatch = car.monthly >= minPrice && car.monthly <= maxPrice
    return makerMatch && typeMatch && priceMatch
  })

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header
        onLogin={() => setShowAuth("login")}
        onRegister={() => setShowAuth("register")}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
        {/* ✅ Search bar at top */}
        <div id="search" className="mb-10 flex items-center justify-between">
          <SearchForm />
          {/* Small reset icon */}
          <Link
            href="/car-deals"
            className="ml-4 text-gray-500 hover:text-gray-700 transition-colors"
            title="Reset Filters"
          >
            ↺
          </Link>
        </div>

        <h1 className="text-4xl font-extrabold text-green-700 mb-8 text-center">
          Got something to your liking?
        </h1>

        {/* ✅ Empty state or Filtered Car Grid */}
        {filteredCars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">Yeah, we don't have that here yet 😞</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-green-700">
                    {car.maker} {car.name}
                  </h2>
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
                  <p className="mt-1 text-gray-600 text-sm">
                    Total Price:{" "}
                    <span className="font-semibold text-gray-900">
                      ${car.price.toLocaleString()}
                    </span>
                  </p>
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
        )}
      </main>

      <Footer />

      {showAuth && (
        <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />
      )}
    </div>
  )
}