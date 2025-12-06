"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import AuthWizard from "../../../components/AuthWizard"

// ✅ Import icons for feature categories
// Feature category icons from react-icons/gi
import {
  GiCarWheel,
  GiCarDoor,
  GiCarSeat,
  GiSteeringWheel,
  GiLockedDoor,
  GiBoltShield,
  GiGearStick
} from "react-icons/gi"

import { FaMusic, FaCogs, FaCarSide, FaCarAlt } from "react-icons/fa"
const carDetails = {
  1: {
    name: "Toyota Corolla",
    image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a",
    price: 18000,
    mileage: 25000,
    leasing: { monthly: 289, term: "36 months", mileageLimit: "16,000 km/year" },
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
    name: "BMW 3 Series",
    image: "https://images.unsplash.com/photo-1617814077082-9d2e3f3a9f3a",
    price: 32000,
    mileage: 15000,
    leasing: { monthly: 399, term: "36 months", mileageLimit: "20,000 km/year" },
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
    name: "Mercedes C-Class",
    image: "https://images.unsplash.com/photo-1620057633739-1f9f3f3e9f3a",
    price: 35000,
    mileage: 12000,
    leasing: { monthly: 429, term: "36 months", mileageLimit: "20,000 km/year" },
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
    name: "Ford Mustang",
    image: "https://images.unsplash.com/photo-1605557623739-1f9f3f3e9f3a",
    price: 42000,
    mileage: 8000,
    leasing: { monthly: 499, term: "36 months", mileageLimit: "15,000 km/year" },
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
  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)
  const carId = typeof id === "string" ? parseInt(id, 10) : undefined
  const car = carId ? carDetails[carId as keyof typeof carDetails] : undefined

  if (!car) return <div className="text-center py-20 text-red-600">Car not found</div>

  // ✅ Helper to map category to icon
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Passive Safety": return <GiBoltShield className="inline mr-2 text-green-600" />
    case "Security": return <GiLockedDoor className="inline mr-2 text-green-600" />
    case "Interior Features": return <GiCarSeat className="inline mr-2 text-green-600" />
    case "Exterior Features": return <FaCarSide className="inline mr-2 text-green-600" /> // ✅ actual car icon
    case "Entertainment": return <FaMusic className="inline mr-2 text-green-600" />
    case "Driver Convenience": return <GiSteeringWheel className="inline mr-2 text-green-600" />
    case "Engine/Drivetrain/Suspension": return <FaCogs className="inline mr-2 text-green-600" /> // gears for mechanics
    case "Trim": return <GiCarDoor className="inline mr-2 text-green-600" />
    case "Wheels": return <GiCarWheel className="inline mr-2 text-green-600" />
    default: return null
  }
}

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header onLogin={() => setShowAuth("login")} onRegister={() => setShowAuth("register")} />

      <main className="flex-1 max-w-7xl mx-auto px-10 py-14 space-y-14">
        {/* Top section: image + leasing info side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <img src={car.image} alt={car.name} className="w-full h-[28rem] object-cover rounded-lg shadow" />
          <div className="bg-green-100 p-10 rounded-lg shadow flex flex-col justify-center space-y-4">
            <h1 className="text-4xl font-bold text-green-700">{car.name}</h1>
            <p className="text-gray-800">
              <strong className="text-green-700">${car.leasing.monthly}/month</strong> — {car.leasing.term}
            </p>
            <p className="text-gray-700">Mileage Limit: {car.leasing.mileageLimit}</p>
            <p className="text-gray-700">Price: ${car.price.toLocaleString()}</p>
            <p className="text-gray-700">Mileage: {car.mileage.toLocaleString()} km</p>

            {/* ✅ Book Now button forces login */}
            <button
              onClick={() => setShowAuth("login")}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all duration-300"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Key Information */}
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-6">Key Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(car.keyInfo).map(([label, value]) => (
              <div key={label} className="bg-gray-50 p-5 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-green-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Stats & Performance */}
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-6">Stats & Performance</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(car.stats).map(([label, value]) => (
              <div key={label} className="bg-gray-50 p-5 rounded-md shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-lg font-semibold text-green-700">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vehicle Features with icons */}
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-6">Vehicle Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(car.features).map(([category, items]) => (
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
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ✅ Auth modal appears when Book Now is clicked */}
      {showAuth && (
        <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />
      )}
    </div>
  )
}