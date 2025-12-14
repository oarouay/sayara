"use client"

import { useParams } from "next/navigation"
import { useState } from "react"

// ✅ Import icons for feature categories
import {
  GiCarWheel,
  GiCarDoor,
  GiCarSeat,
  GiSteeringWheel,
  GiLockedDoor,
  GiBoltShield,
} from "react-icons/gi"

import { FaMusic, FaCogs, FaCarSide } from "react-icons/fa"

type Car = {
  id: number
  maker: string
  name: string
  image: string
  monthly: number
  mileage: number
  insuranceCost: number
  price: number
  leasingTerm?: string
  leasingMileageLimit?: string
}

type CarDetails = {
  keyInfo?: Record<string, string>
  stats?: Record<string, string>
  features?: Record<string, string[]>
}

// Example data - in production this would come from your API/admin component
const carDatabase: Record<number, Car> = {
  1: { id: 1, maker: "Toyota", name: "Corolla", image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a", monthly: 289, mileage: 25000, insuranceCost: 150, price: 18000, leasingTerm: "36 months", leasingMileageLimit: "16,000 km/year" },
  2: { id: 2, maker: "BMW", name: "3 Series", image: "https://images.unsplash.com/photo-1617814077082-9d2e3f3a9f3a", monthly: 399, mileage: 15000, insuranceCost: 150, price: 32000, leasingTerm: "36 months", leasingMileageLimit: "20,000 km/year" },
  3: { id: 3, maker: "Mercedes", name: "C-Class", image: "https://images.unsplash.com/photo-1620057633739-1f9f3f3e9f3a", monthly: 429, mileage: 12000, insuranceCost: 150, price: 35000, leasingTerm: "36 months", leasingMileageLimit: "20,000 km/year" },
  4: { id: 4, maker: "Ford", name: "Mustang", image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a", monthly: 499, mileage: 8000, insuranceCost: 150, price: 42000, leasingTerm: "36 months", leasingMileageLimit: "15,000 km/year" },
}

const carDetailsDatabase: Record<number, CarDetails> = {
  1: {
    keyInfo: {
      "Engine power": "97 kW (130 hp)",
      Transmission: "Automatic",
      Fuel: "Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "120 g/km",
      "Acceleration (0–100 km/h)": "10.9 seconds",
      "Top speed": "180 km/h",
      Efficiency: "5.2 L/100 km",
      "Boot (seats up)": "361 litres",
      "Safety rating": "★★★★☆",
    },
    features: {
      "Passive Safety": ["Lane Assist", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Heated Seats", "Ambient Lighting"],
      "Exterior Features": ["LED Headlights", "Body-Colored Mirrors"],
      Entertainment: ["Touchscreen Display", "Bluetooth Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Hybrid Assist"],
      Trim: ["Design Pack", "Chrome Accents"],
      Wheels: ['16" Alloy Wheels'],
    },
  },
  2: {
    keyInfo: {
      "Engine power": "135 kW (184 hp)",
      Transmission: "Automatic",
      Fuel: "Petrol",
      Doors: "4",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "140 g/km",
      "Acceleration (0–100 km/h)": "7.1 seconds",
      "Top speed": "235 km/h",
      Efficiency: "6.5 L/100 km",
      "Boot (seats up)": "480 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["ABS", "Airbags"],
      Security: ["Central Locking", "Alarm System"],
      "Interior Features": ["Leather Seats", "Digital Cockpit"],
      "Exterior Features": ["LED Headlights", "Chrome Trim"],
      Entertainment: ["Apple CarPlay", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Rear-Wheel Drive", "Sport Suspension"],
      Trim: ["M Sport Package"],
      Wheels: ['18" Alloy Wheels'],
    },
  },
  3: {
    keyInfo: {
      "Engine power": "150 kW (204 hp)",
      Transmission: "Automatic",
      Fuel: "Diesel",
      Doors: "4",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "135 g/km",
      "Acceleration (0–100 km/h)": "7.5 seconds",
      "Top speed": "230 km/h",
      Efficiency: "5.8 L/100 km",
      "Boot (seats up)": "455 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Blind Spot Assist", "Collision Prevention"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Ambient Lighting", "Heated Steering Wheel"],
      "Exterior Features": ["LED Headlights", "Chrome Trim"],
      Entertainment: ["MBUX Infotainment", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Rear-Wheel Drive", "Comfort Suspension"],
      Trim: ["Avantgarde Package"],
      Wheels: ['17" Alloy Wheels'],
    },
  },
  4: {
    keyInfo: {
      "Engine power": "331 kW (450 hp)",
      Transmission: "Manual",
      Fuel: "Petrol",
      Doors: "2",
      Seats: "4",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "180 g/km",
      "Acceleration (0–100 km/h)": "4.8 seconds",
      "Top speed": "250 km/h",
      Efficiency: "12 L/100 km",
      "Boot (seats up)": "408 litres",
      "Safety rating": "★★★★☆",
    },
    features: {
      "Passive Safety": ["Traction Control", "Airbags"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Sports Seats", "Premium Audio"],
      "Exterior Features": ["LED Headlights", "Sport Styling"],
      Entertainment: ["Apple CarPlay", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Rear-Wheel Drive", "Performance Suspension"],
      Trim: ["GT Package"],
      Wheels: ['19" Alloy Wheels'],
    },
  },
}

export default function CarDetailsPage() {
  const { id } = useParams()
  const carId = typeof id === "string" ? parseInt(id, 10) : undefined
  const car = carId ? carDatabase[carId] : undefined
  const details = carId ? carDetailsDatabase[carId] : undefined

  if (!car || !details) return <div className="text-center py-20 text-red-600">Car not found</div>

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Passive Safety": return <GiBoltShield className="inline mr-2 text-green-600" />
      case "Security": return <GiLockedDoor className="inline mr-2 text-green-600" />
      case "Interior Features": return <GiCarSeat className="inline mr-2 text-green-600" />
      case "Exterior Features": return <FaCarSide className="inline mr-2 text-green-600" />
      case "Entertainment": return <FaMusic className="inline mr-2 text-green-600" />
      case "Driver Convenience": return <GiSteeringWheel className="inline mr-2 text-green-600" />
      case "Engine/Drivetrain/Suspension": return <FaCogs className="inline mr-2 text-green-600" />
      case "Trim": return <GiCarDoor className="inline mr-2 text-green-600" />
      case "Wheels": return <GiCarWheel className="inline mr-2 text-green-600" />
      default: return null
    }
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <header className="bg-green-600 text-white p-6">
        <h1 className="text-3xl font-bold">{car.maker} {car.name}</h1>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-10 py-14 space-y-14">
        {/* Image and Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <img src={car.image} alt={car.name} className="w-full h-[28rem] object-cover rounded-lg shadow" />
          <div className="bg-green-50 p-10 rounded-lg shadow flex flex-col justify-center space-y-4">
            <h2 className="text-2xl font-bold text-green-700">Specifications</h2>
            <p className="text-gray-700"><strong>Monthly Payment:</strong> ${car.monthly}</p>
            <p className="text-gray-700"><strong>Leasing Term:</strong> {car.leasingTerm}</p>
            <p className="text-gray-700"><strong>Mileage Limit:</strong> {car.leasingMileageLimit}</p>
            <p className="text-gray-700"><strong>Mileage:</strong> {car.mileage.toLocaleString()} km</p>
            <p className="text-gray-700"><strong>Insurance:</strong> ${car.insuranceCost}/month</p>
            <button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300">
              Book Now
            </button>
          </div>
        </div>

        {/* Key Information */}
        {details.keyInfo && Object.keys(details.keyInfo).length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Key Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(details.keyInfo).map(([label, value]) => (
                <div key={label} className="bg-gray-50 p-5 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-green-700">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stats & Performance */}
        {details.stats && Object.keys(details.stats).length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Stats & Performance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(details.stats).map(([label, value]) => (
                <div key={label} className="bg-gray-50 p-5 rounded-md shadow-sm">
                  <p className="text-sm text-gray-500">{label}</p>
                  <p className="text-lg font-semibold text-green-700">{value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Vehicle Features */}
        {details.features && Object.keys(details.features).length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold text-green-700 mb-6">Vehicle Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(details.features).map(([category, items]) => (
                items.length > 0 && (
                  <div key={category}>
                    <h3 className="text-green-600 font-bold mb-3 flex items-center">
                      {getCategoryIcon(category)} {category}
                    </h3>
                    <ul className="list-disc pl-6 text-gray-800 space-y-2">
                      {items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-gray-100 p-6 text-center text-gray-600">
        <p>&copy; 2025 Car Rental. All rights reserved.</p>
      </footer>
    </div>
  )
}