"use client"

import React, { useState } from "react"

type CarMaker = {
  name: string
  logo: string
}

type Car = {
  _id: string
  maker: string
  name: string
  image: string
  monthly: number
  mileage: number
  insuranceCost: number
  price: number
  leasingTerm: number
  leasingMileageLimit: number
}

type CarDetails = {
  keyInfo?: {
    enginePower?: number
    transmission?: string
    fuel?: string
    doors?: number
    seats?: number
    warranty?: number
  }
  stats?: {
    co2Emissions?: number
    acceleration?: number
    topSpeed?: number
    efficiency?: number
    bootSpace?: number
    safetyRating?: number
  }
  features?: {
    passiveSafety?: string[]
    security?: string[]
    interiorFeatures?: string[]
    exteriorFeatures?: string[]
    entertainment?: string[]
    driverConvenience?: string[]
    engineDrivetrainSuspension?: string[]
    trim?: string[]
    wheels?: string[]
  }
}

type CarWithDetails = Car & { details?: CarDetails }

const makers: CarMaker[] = [
  { name: "Audi", logo: "/data/Audi.svg" },
  { name: "BMW", logo: "/data/BMW.svg" },
]

const cars: CarWithDetails[] = [
  {
    _id: "1",
    maker: "Audi",
    name: "Audi A4",
    image: "/data/audi-a4.jpg",
    monthly: 500,
    mileage: 20000,
    insuranceCost: 120,
    price: 18000,
    leasingTerm: 36,
    leasingMileageLimit: 16000,
    details: {
      keyInfo: {
        enginePower: 190,
        transmission: "Automatic",
        fuel: "Petrol",
        doors: 4,
        seats: 5,
        warranty: 3,
      },
      stats: {
        co2Emissions: 120,
        acceleration: 7.5,
        topSpeed: 240,
        efficiency: 6.5,
        bootSpace: 480,
        safetyRating: 5,
      },
      features: {
        interiorFeatures: ["Leather seats", "Climate control"],
        entertainment: ["Bluetooth", "Apple CarPlay"],
        passiveSafety: ["Airbags", "ABS"],
      },
    },
  },
  {
    _id: "2",
    maker: "BMW",
    name: "BMW 3 Series",
    image: "/data/bmw-3.jpg",
    monthly: 650,
    mileage: 25000,
    insuranceCost: 150,
    price: 23400,
    leasingTerm: 36,
    leasingMileageLimit: 20000,
    details: {
      keyInfo: {
        enginePower: 250,
        transmission: "Automatic",
        fuel: "Diesel",
        doors: 4,
        seats: 5,
        warranty: 4,
      },
      stats: {
        co2Emissions: 140,
        acceleration: 6.8,
        topSpeed: 250,
        efficiency: 7.0,
        bootSpace: 500,
        safetyRating: 5,
      },
      features: {
        interiorFeatures: ["Heated seats", "Ambient lighting"],
        entertainment: ["Android Auto", "Premium sound"],
        security: ["Immobilizer", "Alarm"],
      },
    },
  },
]

export default function AdminCarsTab() {
  const [previewCar, setPreviewCar] = useState<CarWithDetails | null>(null)

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">Manage Cars (Static)</h3>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr className="text-sm font-semibold text-green-700">
              <th className="py-4 px-4">Image</th>
              <th className="py-4 px-4">Maker</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Monthly</th>
              <th className="py-4 px-4">Term</th>
              <th className="py-4 px-4">Mileage Limit</th>
              <th className="py-4 px-4">Mileage</th>
              <th className="py-4 px-4">Insurance</th>
              <th className="py-4 px-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car._id} className="hover:bg-green-50">
                <td className="py-4 px-4">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-20 h-20 object-cover rounded-md cursor-pointer"
                    onClick={() => setPreviewCar(car)}
                  />
                </td>
                <td className="py-4 px-4">
                  <img
                    src={makers.find(m => m.name === car.maker)?.logo || "/data/logo.png"}
                    alt={car.maker}
                    className="w-16 h-16 object-contain"
                  />
                </td>
                <td className="py-4 px-4">{car.name}</td>
                <td className="py-4 px-4">${car.monthly}</td>
                <td className="py-4 px-4">{car.leasingTerm} months</td>
                <td className="py-4 px-4">{car.leasingMileageLimit.toLocaleString()} km/year</td>
                <td className="py-4 px-4">{car.mileage.toLocaleString()} km</td>
                <td className="py-4 px-4">${car.insuranceCost}</td>
                <td className="py-4 px-4">${car.price.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setPreviewCar(null)}></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 z-10 p-6 overflow-y-auto max-h-[90vh]">
            <h4 className="text-xl font-semibold mb-4">{previewCar.maker} {previewCar.name}</h4>
            <img src={previewCar.image} alt={previewCar.name} className="w-full h-64 object-cover rounded-lg mb-6" />

            {/* Key Info */}
            {previewCar.details?.keyInfo && (
              <section className="mb-6">
                <h5 className="text-lg font-bold text-green-700 mb-3">Key Info</h5>
                <ul className="space-y-2 text-gray-700">
                  {Object.entries(previewCar.details.keyInfo).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Stats */}
            {previewCar.details?.stats && (
              <section className="mb-6">
                <h5 className="text-lg font-bold text-green-700 mb-3">Stats</h5>
                <ul className="space-y-2 text-gray-700">
                  {Object.entries(previewCar.details.stats).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Features */}
            {previewCar.details?.features && (
              <section>
                <h5 className="text-lg font-bold text-green-700 mb-3">Features</h5>
                {Object.entries(previewCar.details.features).map(([category, items]) => (
                  <div key={category} className="mb-4">
                    <strong className="block text-green-600">{category}</strong>
                    <ul className="list-disc pl-6 text-gray-700">
                      {items?.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            <button onClick={() => setPreviewCar(null)} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}