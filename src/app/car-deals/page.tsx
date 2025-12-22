"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SearchForm from "@/components/SearchForm"
import AuthWizard from "@/components/AuthWizard"
import { Car, CarMaker } from "@prisma/client"

export default function CarDealsPage() {
    const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)
    const [cars, setCars] = useState<Car[]>([])
    const [makers, setMakers] = useState<CarMaker[]>([])
    const [types, setTypes] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    
    const searchParams = useSearchParams()

    useEffect(() => {
        async function fetchCars() {
            setLoading(true)
            // Use string form of searchParams to avoid identity/loop issues
            const query = searchParams?.toString() || ''
            const url = query ? `/api/cars?${query}` : `/api/cars`
            const response = await fetch(url)
            const data = await response.json()
            // Support both legacy array response and new { cars, makers, types } shape
            if (Array.isArray(data)) {
                setCars(data)
                setMakers([])
                setTypes([])
            } else {
                setCars(data.cars || [])
                setMakers(data.makers || [])
                setTypes(data.types || [])
            }
            setLoading(false)
        }
        fetchCars()
    }, [searchParams?.toString()])

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header
                onLogin={() => setShowAuth("login")}
                onRegister={() => setShowAuth("register")}
            />

            <main className="flex-1 max-w-7xl mx-auto px-6 py-12">
                <div id="search" className="mb-10 flex items-center justify-between">
                    <SearchForm makers={makers} types={types} />
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

                {loading ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">Loading...</p>
                    </div>
                ) : cars.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-600">Yeah, we don't have that here yet 😞</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {cars.filter(c => c?.id).map((car) => (
                            <div key={car.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Car Image */}
                                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {car.image && car.image.trim() ? (
                                        <img 
                                            src={car.image} 
                                            alt={`${car.maker} ${car.name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-500 font-semibold">
                                            No Image Found
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-green-700">
                                        {car.maker} {car.name}
                                    </h2>
                                    <p className="mt-2 text-gray-600">
                                        <span className="font-semibold text-green-600">
                                            TND {car.monthly}/month
                                        </span>{" "}
                                        <span className="ml-2 text-sm text-gray-500">
                                            {car.mileage.toLocaleString()} km
                                        </span>
                                    </p>
                                    <p className="mt-1 text-gray-600 text-sm">
                                        Insurance:{" "}
                                        <span className="font-semibold text-green-600">
                                            TND {car.insuranceCost}/month
                                        </span>
                                    </p>
                                    <Link
                                        href={`/car-deals/${String(car.id)}`}
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