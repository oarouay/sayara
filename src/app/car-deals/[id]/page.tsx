
"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import AuthWizard from "../../../components/AuthWizard"

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

type CarDetails = {
  keyInfo?: Record<string, string>
  stats?: Record<string, string>
  features?: Record<string, string[]>
}

// ✅ Static data - now with both logo AND car image (add your own car images)
const carDatabase: Record<number, Car> = {
  1: { id: 1, maker: "Toyota", name: "Corolla", type: "Sedan", logo: "/data/toyota.svg", image: "", monthly: 289, mileage: 25000, insuranceCost: 150, price: 18000, leasingTerm: 36, leasingMileageLimit: 16000 },
  2: { id: 2, maker: "BMW", name: "3 Series", type: "Sedan", logo: "/data/BMW.svg", image: "", monthly: 399, mileage: 15000, insuranceCost: 150, price: 32000, leasingTerm: 36, leasingMileageLimit: 20000 },
  3: { id: 3, maker: "Mercedes", name: "C-Class", type: "Sedan", logo: "/data/mercedes.svg", image: "", monthly: 429, mileage: 12000, insuranceCost: 150, price: 35000, leasingTerm: 36, leasingMileageLimit: 20000 },
  4: { id: 4, maker: "Ford", name: "Mustang", type: "Sports Car", logo: "/data/Ford.svg", image: "", monthly: 499, mileage: 8000, insuranceCost: 150, price: 42000, leasingTerm: 36, leasingMileageLimit: 15000 },
  5: { id: 5, maker: "Hyundai", name: "Elantra", type: "Sedan", logo: "/data/hyundai.svg", image: "", monthly: 279, mileage: 30000, insuranceCost: 140, price: 17000, leasingTerm: 36, leasingMileageLimit: 16000 },
  6: { id: 6, maker: "KIA", name: "Optima", type: "Sedan", logo: "/data/KIA.svg", image: "", monthly: 299, mileage: 28000, insuranceCost: 145, price: 19000, leasingTerm: 36, leasingMileageLimit: 16000 },
  7: { id: 7, maker: "Audi", name: "A4", type: "Sedan", logo: "/data/Audi.svg", image: "", monthly: 449, mileage: 10000, insuranceCost: 180, price: 38000, leasingTerm: 36, leasingMileageLimit: 20000 },
  8: { id: 8, maker: "Renault", name: "Megane", type: "Hatchback", logo: "/data/Renault.svg", image: "", monthly: 259, mileage: 35000, insuranceCost: 130, price: 16000, leasingTerm: 36, leasingMileageLimit: 15000 },
  9: { id: 9, maker: "VW", name: "Golf", type: "Hatchback", logo: "/data/vw.svg", image: "", monthly: 319, mileage: 20000, insuranceCost: 155, price: 22000, leasingTerm: 36, leasingMileageLimit: 18000 },
  10: { id: 10, maker: "Honda", name: "Civic", type: "Sedan", logo: "/data/honda.svg", image: "", monthly: 295, mileage: 22000, insuranceCost: 145, price: 19500, leasingTerm: 36, leasingMileageLimit: 16000 },
  11: { id: 11, maker: "Toyota", name: "RAV4", type: "SUV", logo: "/data/toyota.svg", image: "", monthly: 379, mileage: 18000, insuranceCost: 165, price: 28000, leasingTerm: 36, leasingMileageLimit: 18000 },
  12: { id: 12, maker: "Honda", name: "CR-V", type: "SUV", logo: "/data/honda.svg", image: "", monthly: 359, mileage: 20000, insuranceCost: 160, price: 26500, leasingTerm: 36, leasingMileageLimit: 18000 },
  13: { id: 13, maker: "Mazda", name: "CX-5", type: "SUV", logo: "/data/mazda.svg", image: "", monthly: 349, mileage: 19000, insuranceCost: 155, price: 25500, leasingTerm: 36, leasingMileageLimit: 18000 },
  14: { id: 14, maker: "Nissan", name: "Altima", type: "Sedan", logo: "/data/nissan.svg", image: "", monthly: 285, mileage: 24000, insuranceCost: 145, price: 18500, leasingTerm: 36, leasingMileageLimit: 16000 },
  15: { id: 15, maker: "Chevrolet", name: "Malibu", type: "Sedan", logo: "/data/chevrolet.svg", image: "", monthly: 275, mileage: 26000, insuranceCost: 140, price: 17500, leasingTerm: 36, leasingMileageLimit: 16000 },
  16: { id: 16, maker: "Ford", name: "Explorer", type: "SUV", logo: "/data/Ford.svg", image: "", monthly: 429, mileage: 14000, insuranceCost: 175, price: 34000, leasingTerm: 36, leasingMileageLimit: 20000 },
  17: { id: 17, maker: "Jeep", name: "Grand Cherokee", type: "SUV", logo: "/data/jeep.svg", image: "", monthly: 459, mileage: 12000, insuranceCost: 185, price: 37000, leasingTerm: 36, leasingMileageLimit: 20000 },
  18: { id: 18, maker: "Subaru", name: "Outback", type: "SUV", logo: "/data/subaru.svg", image: "", monthly: 369, mileage: 17000, insuranceCost: 160, price: 27500, leasingTerm: 36, leasingMileageLimit: 18000 },
  19: { id: 20, maker: "Volkswagen", name: "Tiguan", type: "SUV", logo: "/data/vw.svg", image: "", monthly: 339, mileage: 21000, insuranceCost: 155, price: 24500, leasingTerm: 36, leasingMileageLimit: 18000 },

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
  5: {
    keyInfo: {
      "Engine power": "112 kW (152 hp)",
      Transmission: "Automatic",
      Fuel: "Petrol",
      Doors: "4",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "128 g/km",
      "Acceleration (0–100 km/h)": "8.1 seconds",
      "Top speed": "210 km/h",
      Efficiency: "6.2 L/100 km",
      "Boot (seats up)": "440 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Emergency Braking", "Lane Assist"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Ventilated Seats", "Wireless Charging"],
      "Exterior Features": ["LED Headlights", "Chrome Trim"],
      Entertainment: ["8-inch Touchscreen", "Apple CarPlay"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Comfort Suspension"],
      Trim: ["BlueLink Connected Tech"],
      Wheels: ['17" Alloy Wheels'],
    },
  },
  6: {
    keyInfo: {
      "Engine power": "125 kW (168 hp)",
      Transmission: "Automatic",
      Fuel: "Diesel",
      Doors: "4",
      Seats: "5",
      Warranty: "7 years or 150,000 km",
    },
    stats: {
      "CO2 emissions": "115 g/km",
      "Acceleration (0–100 km/h)": "9.2 seconds",
      "Top speed": "205 km/h",
      Efficiency: "4.8 L/100 km",
      "Boot (seats up)": "505 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["ABS", "Airbags"],
      Security: ["Central Locking", "Alarm System"],
      "Interior Features": ["Dual Zone Climate Control", "Leather Seats"],
      "Exterior Features": ["LED Headlights", "Chrome Trim"],
      Entertainment: ["7-inch Touchscreen", "Navigation"],
      "Driver Convenience": ["Reversing Camera", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Standard Suspension"],
      Trim: ["Premium Package"],
      Wheels: ['17" Alloy Wheels'],
    },
  },
  7: {
    keyInfo: {
      "Engine power": "140 kW (190 hp)",
      Transmission: "Automatic",
      Fuel: "Diesel",
      Doors: "4",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "128 g/km",
      "Acceleration (0–100 km/h)": "7.3 seconds",
      "Top speed": "240 km/h",
      Efficiency: "4.5 L/100 km",
      "Boot (seats up)": "460 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Emergency Braking", "Lane Assist"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Virtual Cockpit", "Ambient Lighting"],
      "Exterior Features": ["Matrix LED Headlights", "Chrome Trim"],
      Entertainment: ["10-inch Touchscreen", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Sport Suspension"],
      Trim: ["S Line Package"],
      Wheels: ['19" Alloy Wheels'],
    },
  },
  8: {
    keyInfo: {
      "Engine power": "103 kW (140 hp)",
      Transmission: "Manual",
      Fuel: "Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "5 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "125 g/km",
      "Acceleration (0–100 km/h)": "9.5 seconds",
      "Top speed": "200 km/h",
      Efficiency: "5.8 L/100 km",
      "Boot (seats up)": "384 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["ABS", "Airbags"],
      Security: ["Central Locking", "Alarm System"],
      "Interior Features": ["Climate Control", "Heated Seats"],
      "Exterior Features": ["LED Headlights", "Body-Colored Mirrors"],
      Entertainment: ["7-inch Touchscreen", "Bluetooth"],
      "Driver Convenience": ["Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Comfort Suspension"],
      Trim: ["Standard Package"],
      Wheels: ['16" Alloy Wheels'],
    },
  },
  9: {
    keyInfo: {
      "Engine power": "110 kW (150 hp)",
      Transmission: "Automatic",
      Fuel: "Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "132 g/km",
      "Acceleration (0–100 km/h)": "8.5 seconds",
      "Top speed": "220 km/h",
      Efficiency: "5.5 L/100 km",
      "Boot (seats up)": "381 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Emergency Braking", "Lane Assist"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Digital Cockpit", "Ambient Lighting"],
      "Exterior Features": ["LED Headlights", "Chrome Trim"],
      Entertainment: ["8-inch Touchscreen", "Apple CarPlay"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Sport Suspension"],
      Trim: ["R-Line Package"],
      Wheels: ['17" Alloy Wheels'],
    },
  },
  10: {
    keyInfo: {
      "Engine power": "150 hp (2.0L I4) / 200 hp Hybrid",
      Transmission: "CVT Automatic",
      Fuel: "Petrol / Hybrid",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "105–135 g/km",
      "Acceleration (0–100 km/h)": "8.1–10.9 seconds",
      "Top speed": "210 km/h",
      Efficiency: "4.8–6.0 L/100 km",
      "Boot (seats up)": "409 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Collision Mitigation Braking", "Lane Keeping Assist"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Heated Seats", "Digital Cockpit"],
      "Exterior Features": ["LED Headlights", "Moonroof (Sport Touring)"],
      Entertainment: ["Touchscreen", "Apple CarPlay/Android Auto"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Hybrid Assist"],
      Trim: ["LX", "Sport", "Sport Touring"],
      Wheels: ['16"–18" Alloy Wheels'],
    },
  },
  11: {
    keyInfo: {
      "Engine power": "218 hp (Hybrid)",
      Transmission: "Automatic",
      Fuel: "Hybrid Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "105 g/km",
      "Acceleration (0–100 km/h)": "8.1 seconds",
      "Top speed": "180 km/h",
      Efficiency: "5.0 L/100 km",
      "Boot (seats up)": "580 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Lane Assist", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Leather Seats", "Ambient Lighting"],
      "Exterior Features": ["LED Headlights", "Roof Rails"],
      Entertainment: ["Touchscreen", "Bluetooth Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "360° Camera"],
      "Engine/Drivetrain/Suspension": ["AWD Hybrid System"],
      Trim: ["Excel", "Dynamic"],
      Wheels: ['18" Alloy Wheels'],
    },
  },
  12: {
    keyInfo: {
      "Engine power": "184 hp",
      Transmission: "Automatic",
      Fuel: "Hybrid Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "120 g/km",
      "Acceleration (0–100 km/h)": "9.0 seconds",
      "Top speed": "190 km/h",
      Efficiency: "5.8 L/100 km",
      "Boot (seats up)": "617 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Collision Mitigation Braking", "Lane Assist"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Panoramic Roof", "Heated Seats"],
      "Exterior Features": ["LED Headlights", "Chrome Grille"],
      Entertainment: ["Touchscreen", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["AWD Hybrid Assist"],
      Trim: ["Elegance", "Sport"],
      Wheels: ['18" Alloy Wheels'],
    },
  },
  13: {
    keyInfo: {
      "Engine power": "165 hp",
      Transmission: "Automatic",
      Fuel: "Petrol/Diesel",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "150 g/km",
      "Acceleration (0–100 km/h)": "9.2 seconds",
      "Top speed": "200 km/h",
      Efficiency: "6.0 L/100 km",
      "Boot (seats up)": "522 litres",
      "Safety rating": "★★★★☆",
    },
    features: {
      "Passive Safety": ["Blind Spot Monitoring", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Leather Seats", "Ambient Lighting"],
      "Exterior Features": ["LED Headlights", "Roof Rails"],
      Entertainment: ["Touchscreen", "Apple CarPlay"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["AWD Option"],
      Trim: ["Sport", "Touring"],
      Wheels: ['17" Alloy Wheels'],
    },
  },
  14: {
    keyInfo: {
      "Engine power": "188 hp (2.5L I4)",
      Transmission: "CVT Automatic",
      Fuel: "Petrol",
      Doors: "4",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "160 g/km",
      "Acceleration (0–100 km/h)": "8.5 seconds",
      "Top speed": "210 km/h",
      Efficiency: "6.5 L/100 km",
      "Boot (seats up)": "436 litres",
      "Safety rating": "★★★★☆",
    },
    features: {
      "Passive Safety": ["Forward Collision Warning", "Lane Departure Warning"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Cloth/Leather Seats", "Heated Steering Wheel"],
      "Exterior Features": ["LED Headlights", "Chrome Trim"],
      Entertainment: ["Touchscreen", "Bluetooth Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Rearview Camera"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive"],
      Trim: ["S", "SV", "SL"],
      Wheels: ['17" Alloy Wheels'],
    },
  },
  15: {
    keyInfo: {
      "Engine power": "160 hp (1.5L Turbo I4)",
      Transmission: "Automatic",
      Fuel: "Petrol",
      Doors: "4",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "155 g/km",
      "Acceleration (0–100 km/h)": "8.8 seconds",
      "Top speed": "200 km/h",
      Efficiency: "6.3 L/100 km",
      "Boot (seats up)": "445 litres",
      "Safety rating": "★★★★☆",
    },
    features: {
      "Passive Safety": ["Lane Assist", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Heated Seats", "Ambient Lighting"],
      "Exterior Features": ["LED Headlights", "Body-Colored Mirrors"],
      Entertainment: ["Touchscreen", "Apple CarPlay/Android Auto"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive"],
      Trim: ["LS", "LT", "Premier"],
      Wheels: ['16"–18" Alloy Wheels'],
    },
  },
  16: {
    keyInfo: {
      "Engine power": "300 hp (2.3L EcoBoost I4) / 400 hp V6",
      Transmission: "10-speed Automatic",
      Fuel: "Petrol",
      Doors: "5",
      Seats: "7",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "200–250 g/km",
      "Acceleration (0–100 km/h)": "6.5–7.5 seconds",
      "Top speed": "230 km/h",
      Efficiency: "8.5–10.0 L/100 km",
      "Boot (seats up)": "515 litres (expandable to 2,100)",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Blind Spot Monitoring", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Leather Seats", "Tri-Zone Climate Control"],
      "Exterior Features": ["LED Headlights", "Roof Rails"],
      Entertainment: ["Touchscreen", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "360° Camera"],
      "Engine/Drivetrain/Suspension": ["AWD", "Terrain Management System"],
      Trim: ["XLT", "Limited", "Platinum"],
      Wheels: ['18"–20" Alloy Wheels'],
    },
  },
  17: {
    keyInfo: {
      "Engine power": "293 hp (3.6L V6) / 375 hp Plug-in Hybrid",
      Transmission: "8-speed Automatic",
      Fuel: "Petrol / Plug-in Hybrid",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "180–250 g/km",
      "Acceleration (0–100 km/h)": "6.5–7.5 seconds",
      "Top speed": "210 km/h",
      Efficiency: "7.5–9.5 L/100 km (Hybrid ~3.5 L/100 km equivalent)",
      "Boot (seats up)": "487 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Blind Spot Monitoring", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Leather Seats", "Panoramic Sunroof"],
      "Exterior Features": ["LED Headlights", "Roof Rails"],
      Entertainment: ["Touchscreen", "Premium Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "360° Camera"],
      "Engine/Drivetrain/Suspension": ["AWD", "Terrain Management System"],
      Trim: ["Limited", "Overland", "Summit"],
      Wheels: ['18"–20" Alloy Wheels'],
    },
  },
  18: {
    keyInfo: {
      "Engine power": "182 hp (2.5L Boxer I4)",
      Transmission: "CVT Automatic",
      Fuel: "Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "160 g/km",
      "Acceleration (0–100 km/h)": "8.7 seconds",
      "Top speed": "210 km/h",
      Efficiency: "7.0 L/100 km",
      "Boot (seats up)": "522 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["EyeSight Driver Assist", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Heated Seats", "Panoramic Roof"],
      "Exterior Features": ["LED Headlights", "Roof Rails"],
      Entertainment: ["Touchscreen", "Apple CarPlay/Android Auto"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Symmetrical AWD"],
      Trim: ["Base", "Premium", "Limited"],
      Wheels: ['17"–18" Alloy Wheels'],
    },
  },
  19: {
    keyInfo: {
      "Engine power": "184 hp (2.0L TSI Petrol)",
      Transmission: "Automatic DSG",
      Fuel: "Petrol",
      Doors: "5",
      Seats: "5",
      Warranty: "3 years or 100,000 km",
    },
    stats: {
      "CO2 emissions": "150 g/km",
      "Acceleration (0–100 km/h)": "9.2 seconds",
      "Top speed": "200 km/h",
      Efficiency: "6.5 L/100 km",
      "Boot (seats up)": "520 litres",
      "Safety rating": "★★★★★",
    },
    features: {
      "Passive Safety": ["Lane Assist", "Emergency Braking"],
      Security: ["Immobilizer", "Alarm System"],
      "Interior Features": ["Leather Seats", "Ambient Lighting"],
      "Exterior Features": ["LED Headlights", "Roof Rails"],
      Entertainment: ["Touchscreen", "Bluetooth Audio"],
      "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"],
      "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Optional AWD"],
      Trim: ["Life", "Elegance", "R-Line"],
      Wheels: ['17"–19" Alloy Wheels'],
    },
  },
}

export default function CarDetailsPage() {
  const { id } = useParams()
  const carId = typeof id === "string" ? parseInt(id, 10) : undefined
  const car = carId ? carDatabase[carId] : undefined
  const details = carId ? carDetailsDatabase[carId] : undefined

  const [showAuth, setShowAuth] = useState<"login" | "register" | null>(null)

  if (!car || !details) {
    return (
      <div className="bg-white min-h-screen flex flex-col">
        <Header
          onLogin={() => setShowAuth("login")}
          onRegister={() => setShowAuth("register")}
        />
        <main className="flex-1 max-w-7xl mx-auto px-10 py-14">
          <p className="text-center py-20 text-red-600">Car not found</p>
        </main>
        <Footer />
        {showAuth && (
          <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />
        )}
      </div>
    )
  }

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
const backButtonTexts = [
  "Back to the real deal",
  "See other deals",
  "Browse all cars",
  "Return to deals",
  "Back to car deals",
  "View all offers",
  "More cars await"
]

const backButtonText = backButtonTexts[Math.floor(Math.random() * backButtonTexts.length)]
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Header
        onLogin={() => setShowAuth("login")}
        onRegister={() => setShowAuth("register")}
      />

    <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-12">
      <div className="flex items-center justify-between">
        <a
            href="/car-deals"
            className="inline-flex items-center gap-2 bg-white border-2 border-green-600 text-green-700 px-5 py-2 rounded-lg transition-all duration-300 hover:bg-green-50">
          <span>←</span>
          <span>{backButtonText}</span>
          </a>
        <h1 className="text-3xl font-bold text-gray-900">
          {car.maker} {car.name}
        </h1>
        </div>

        {/* Image and Basic Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {car.image ? (
              <img
                src={car.image}
                alt={`${car.maker} ${car.name}`}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-2xl shadow-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg">
            {/* Car Logo and Name Header */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b-2 border-green-200">
            <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center p-3">
              <img
                src={car.logo}
                alt={car.maker}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700">
                {car.maker} {car.name}
              </h2>
              <p className="text-base font-medium tracking-wide text-green-1200 uppercase">
                {car.type}
              </p>
            </div>
          </div>


            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Monthly Payment</span>
                <span className="text-2xl font-bold text-green-600">${car.monthly}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Leasing Term</span>
                <span className="text-lg font-semibold text-gray-800">{car.leasingTerm} months</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Mileage Limit</span>
                <span className="text-lg font-semibold text-gray-800">{car.leasingMileageLimit?.toLocaleString()} km/year</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Current Mileage</span>
                <span className="text-lg font-semibold text-gray-800">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-green-200">
                <span className="text-gray-700 font-medium">Insurance Cost</span>
                <span className="text-lg font-semibold text-gray-800">${car.insuranceCost}/month</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-700 font-bold text-lg">Total Price</span>
                <span className="text-2xl font-bold text-gray-900">${car.price.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => setShowAuth("login")}
              className="mt-8 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>

        {/* Key Information */}
        {details.keyInfo && (
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
        {details.stats && (
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
        {details.features && (
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

      <Footer />

      {showAuth && (
        <AuthWizard type={showAuth} onClose={() => setShowAuth(null)} />
      )}
    </div>
  )
}