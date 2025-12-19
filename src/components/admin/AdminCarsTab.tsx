"use client"

import React, { useState } from 'react'

type CarMaker = {
  name: string
  logo: string
}

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
  leasingTerm: number
  leasingMileageLimit: number
}

type CarDetails = {
  keyInfo?: Record<string, string>
  stats?: Record<string, string>
  features?: Record<string, string[]>
}

const carMakers: CarMaker[] = [
  { name: "Toyota", logo: "/data/toyota.svg" },
  { name: "BMW", logo: "/data/BMW.svg" },
  { name: "Mercedes", logo: "/data/mercedes.svg" },
  { name: "Audi", logo: "/data/audi.svg" },
  { name: "Ford", logo: "/data/ford.svg" },
  { name: "Peugeot", logo: "/data/peugeot.svg" },
  { name: "Renault", logo: "/data/Renault.svg" },
  { name: "Kia", logo: "/data/kia.svg" },
  { name: "Hyundai", logo: "/data/hyundai.svg" },
  { name: "Volkswagen", logo: "/data/vw.svg" },
  { name: "Honda", logo: "/data/honda.svg" },
  { name: "Mazda", logo: "/data/mazda.svg" },
  { name: "Nissan", logo: "/data/nissan.svg" },
  { name: "Chevrolet", logo: "/data/chevrolet.svg" },
  { name: "Jeep", logo: "/data/jeep.svg" },
  { name: "Subaru", logo: "/data/subaru.svg" },
  { name: "Mazda", logo: "/data/mazda.svg" },
]

const keyInfoFields = ["Engine power", "Transmission", "Fuel", "Doors", "Seats", "Warranty"]
const statsFields = ["CO2 emissions", "Acceleration (0–100 km/h)", "Top speed", "Efficiency", "Boot (seats up)", "Safety rating"]
const featureCategories = ["Passive Safety", "Security", "Interior Features", "Exterior Features", "Entertainment", "Driver Convenience", "Engine/Drivetrain/Suspension", "Trim", "Wheels"]

const initialCars: Car[] = [
  { id: 1, maker: "Toyota", name: "Corolla", type: "Sedan", logo: "/data/toyota.svg", image: "", monthly: 289, mileage: 25000, insuranceCost: 150, price: 18000, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 2, maker: "BMW", name: "3 Series", type: "Sedan", logo: "/data/BMW.svg", image: "", monthly: 399, mileage: 15000, insuranceCost: 150, price: 32000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 3, maker: "Mercedes", name: "C-Class", type: "Sedan", logo: "/data/mercedes.svg", image: "", monthly: 429, mileage: 12000, insuranceCost: 150, price: 35000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 4, maker: "Ford", name: "Mustang", type: "Sports Car", logo: "/data/Ford.svg", image: "", monthly: 499, mileage: 8000, insuranceCost: 150, price: 42000, leasingTerm: 36, leasingMileageLimit: 15000 },
  { id: 5, maker: "Hyundai", name: "Elantra", type: "Sedan", logo: "/data/hyundai.svg", image: "", monthly: 279, mileage: 30000, insuranceCost: 140, price: 17000, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 6, maker: "Kia", name: "Optima", type: "Sedan", logo: "/data/kia.svg", image: "", monthly: 299, mileage: 28000, insuranceCost: 145, price: 19000, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 7, maker: "Audi", name: "A4", type: "Sedan", logo: "/data/audi.svg", image: "", monthly: 449, mileage: 10000, insuranceCost: 180, price: 38000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 8, maker: "Renault", name: "Megane", type: "Hatchback", logo: "/data/Renault.svg", image: "", monthly: 259, mileage: 35000, insuranceCost: 130, price: 16000, leasingTerm: 36, leasingMileageLimit: 15000 },
  { id: 9, maker: "Volkswagen", name: "Golf", type: "Hatchback", logo: "/data/vw.svg", image: "", monthly: 319, mileage: 20000, insuranceCost: 155, price: 22000, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 10, maker: "Honda", name: "Civic", type: "Sedan", logo: "/data/honda.svg", image: "", monthly: 295, mileage: 22000, insuranceCost: 145, price: 19500, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 11, maker: "Toyota", name: "RAV4", type: "SUV", logo: "/data/toyota.svg", image: "", monthly: 379, mileage: 18000, insuranceCost: 165, price: 28000, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 12, maker: "Honda", name: "CR-V", type: "SUV", logo: "/data/honda.svg", image: "", monthly: 359, mileage: 20000, insuranceCost: 160, price: 26500, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 13, maker: "Mazda", name: "CX-5", type: "SUV", logo: "/data/mazda.svg", image: "", monthly: 349, mileage: 19000, insuranceCost: 155, price: 25500, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 14, maker: "Nissan", name: "Altima", type: "Sedan", logo: "/data/nissan.svg", image: "", monthly: 285, mileage: 24000, insuranceCost: 145, price: 18500, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 15, maker: "Chevrolet", name: "Malibu", type: "Sedan", logo: "/data/chevrolet.svg", image: "", monthly: 275, mileage: 26000, insuranceCost: 140, price: 17500, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 16, maker: "Ford", name: "Explorer", type: "SUV", logo: "/data/Ford.svg", image: "", monthly: 429, mileage: 14000, insuranceCost: 175, price: 34000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 17, maker: "Jeep", name: "Grand Cherokee", type: "SUV", logo: "/data/jeep.svg", image: "", monthly: 459, mileage: 12000, insuranceCost: 185, price: 37000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 18, maker: "Subaru", name: "Outback", type: "SUV", logo: "/data/subaru.svg", image: "", monthly: 369, mileage: 17000, insuranceCost: 160, price: 27500, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 19, maker: "Volkswagen", name: "Tiguan", type: "SUV", logo: "/data/vw.svg", image: "", monthly: 339, mileage: 21000, insuranceCost: 155, price: 24500, leasingTerm: 36, leasingMileageLimit: 18000 },
]

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

export default function AdminCarsTab() {
  const [makers, setMakers] = useState<CarMaker[]>(carMakers)
  const [cars, setCars] = useState<Car[]>(initialCars)
  const [carDetails, setCarDetails] = useState<Record<number, CarDetails>>(carDetailsDatabase)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showMakerModal, setShowMakerModal] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewName, setPreviewName] = useState<string>('')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsEditingId, setDetailsEditingId] = useState<number | null>(null)
  const [detailsSection, setDetailsSection] = useState<'keyinfo' | 'stats' | 'features'>('keyinfo')
  const [newMaker, setNewMaker] = useState({ name: '', logo: '' })
  
  const [form, setForm] = useState({
    maker: 'Toyota',
    name: '',
    type: 'Sedan',
    logo: '',
    image: '',
    monthly: 0,
    mileage: 0,
    insuranceCost: 0,
    price: 0,
    leasingTerm: 36,
    leasingMileageLimit: 16000,
  })

  const [detailsForm, setDetailsForm] = useState<CarDetails>({
    keyInfo: {},
    stats: {},
    features: {},
  })

  const startCreate = () => {
    setEditingId(null)
    setForm({ maker: 'Toyota', name: '', type: 'Sedan', logo: '/data/toyota.svg', image: '', monthly: 0, mileage: 0, insuranceCost: 0, price: 0, leasingTerm: 36, leasingMileageLimit: 16000 })
    setShowModal(true)
  }

  const startEdit = (car: Car) => {
    setEditingId(car.id)
    setForm({ maker: car.maker, name: car.name, type: car.type, logo: car.logo, image: car.image, monthly: car.monthly, mileage: car.mileage, insuranceCost: car.insuranceCost, price: car.price, leasingTerm: car.leasingTerm, leasingMileageLimit: car.leasingMileageLimit })
    setShowModal(true)
  }

  const save = () => {
    if (!form.name || !form.maker) return alert('Car name and maker required')
    const calculatedPrice = form.monthly * form.leasingTerm
    if (editingId) {
      setCars(prev => prev.map(c => c.id === editingId ? { ...c, maker: form.maker, name: form.name, type: form.type, logo: form.logo, image: form.image, monthly: form.monthly, mileage: form.mileage, insuranceCost: form.insuranceCost, price: calculatedPrice, leasingTerm: form.leasingTerm, leasingMileageLimit: form.leasingMileageLimit } : c))
    } else {
      const id = Math.max(...cars.map(c => c.id), 0) + 1
      setCars(prev => [{ id, maker: form.maker, name: form.name, type: form.type, logo: form.logo, image: form.image, monthly: form.monthly, mileage: form.mileage, insuranceCost: form.insuranceCost, price: calculatedPrice, leasingTerm: form.leasingTerm, leasingMileageLimit: form.leasingMileageLimit }, ...prev])
    }
    setShowModal(false)
    setForm({ maker: 'Toyota', name: '', type: 'Sedan', logo: '/data/toyota.svg', image: '', monthly: 0, mileage: 0, insuranceCost: 0, price: 0, leasingTerm: 36, leasingMileageLimit: 16000 })
  }

  const remove = (id: number) => {
    if (!confirm('Delete car?')) return
    setCars(prev => prev.filter(c => c.id !== id))
    setCarDetails(prev => {
      const newDetails = { ...prev }
      delete newDetails[id]
      return newDetails
    })
  }

  const getMakerLogo = (makerName: string) => {
    return makers.find(m => m.name === makerName)?.logo || ''
  }

  const addMaker = () => {
    if (!newMaker.name) return alert('Maker name required')
    const makerExists = makers.some(m => m.name.toLowerCase() === newMaker.name.toLowerCase())
    if (makerExists) return alert('This maker already exists')
    setMakers(prev => [...prev, { name: newMaker.name, logo: newMaker.logo }])
    setForm(prev => ({ ...prev, maker: newMaker.name, logo: newMaker.logo }))
    setNewMaker({ name: '', logo: '' })
    setShowMakerModal(false)
  }

  const startEditDetails = (carId: number) => {
    setDetailsEditingId(carId)
    setDetailsForm(carDetails[carId] || { keyInfo: {}, stats: {}, features: {} })
    setDetailsSection('keyinfo')
    setShowDetailsModal(true)
  }

  const saveDetails = () => {
    if (!detailsEditingId) return
    setCarDetails(prev => ({ ...prev, [detailsEditingId]: detailsForm }))
    setShowDetailsModal(false)
  }

  const updateKeyInfo = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, keyInfo: { ...prev.keyInfo, [field]: value } }))
  }

  const updateStat = (field: string, value: string) => {
    setDetailsForm(prev => ({ ...prev, stats: { ...prev.stats, [field]: value } }))
  }

  const updateFeature = (category: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item)
    setDetailsForm(prev => ({ ...prev, features: { ...prev.features, [category]: items } }))
  }

  const hasDetails = (carId: number) => {
    const details = carDetails[carId]
    return details && (Object.keys(details.keyInfo || {}).length > 0 || Object.keys(details.stats || {}).length > 0 || Object.keys(details.features || {}).length > 0)
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Manage Cars</h3>
        <button onClick={startCreate} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow-sm hover:shadow-md transition-shadow">Add Car</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-auto">
        <table className="w-full text-left divide-y divide-gray-200">
          <thead className="bg-green-50">
            <tr className="text-sm font-semibold text-green-700">
              <th className="py-4 px-4">Image</th>
              <th className="py-4 px-4">Maker</th>
              <th className="py-4 px-4">Name</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Monthly</th>
              <th className="py-4 px-4">Term</th>
              <th className="py-4 px-4">Mileage Limit</th>
              <th className="py-4 px-4">Mileage</th>
              <th className="py-4 px-4">Insurance</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id} className="hover:bg-green-50">
                <td className="py-4 px-4">
                  {car.image ? (
                    <img src={car.image} alt={car.name} className="w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity" onClick={() => { setPreviewImage(car.image); setPreviewName(car.name) }} />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs">No Image</div>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="relative group inline-flex items-center">
                    <img src={car.logo} alt={car.maker} className="w-16 h-16 object-contain cursor-help" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{car.maker}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">{car.name}</td>
                <td className="py-4 px-4 text-gray-700 text-sm">{car.type}</td>
                <td className="py-4 px-4 text-gray-900">${car.monthly}</td>
                <td className="py-4 px-4 text-gray-900 text-sm">{car.leasingTerm} month(s)</td>
                <td className="py-4 px-4 text-gray-900 text-sm">{car.leasingMileageLimit.toLocaleString()} km/year</td>
                <td className="py-4 px-4 text-gray-900">{car.mileage.toLocaleString()} km</td>
                <td className="py-4 px-4 text-gray-900">${car.insuranceCost}</td>
                <td className="py-4 px-4 text-gray-900">${car.price.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(car)} className="text-sm px-3 py-1 bg-white border text-green-700 rounded-md hover:bg-green-50">Edit</button>
                    <button onClick={(e) => { e.stopPropagation(); startEditDetails(car.id); }} className={`text-sm px-3 py-1 rounded-md ${hasDetails(car.id) ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}>{hasDetails(car.id) ? 'Details' : 'Add Details'}</button>
                    <button onClick={() => remove(car.id)} className="text-sm px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto z-10">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 sticky top-0 z-10">
              <h4 className="text-xl font-semibold">{editingId ? 'Edit Car' : 'Add New Car'}</h4>
              <p className="text-sm text-green-100 mt-1">Fill in all car details</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maker *</label>
                  <select value={form.maker} onChange={(e) => { 
                    if (e.target.value === '__add_new__') { 
                      setShowMakerModal(true) 
                    } else { 
                      const selectedMaker = makers.find(m => m.name === e.target.value)
                      setForm(prev => ({ ...prev, maker: e.target.value, logo: selectedMaker?.logo || '' })) 
                    } 
                  }} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <optgroup label="Available Makers">
                      {makers.map(maker => (
                        <option key={maker.name} value={maker.name}>{maker.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Add New">
                      <option value="__add_new__">+ Add New Maker</option>
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Car Name *</label>
                  <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Corolla" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select value={form.type} onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sports Car">Sports Car</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input value={form.image} onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly ($) *</label>
                  <input type="number" value={form.monthly} onChange={(e) => setForm(prev => ({ ...prev, monthly: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leasing Term (months) *</label>
                  <input type="number" value={form.leasingTerm} onChange={(e) => setForm(prev => ({ ...prev, leasingTerm: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <p className="text-xs text-gray-500 mt-1">Or auto-calculated: Monthly × Term = ${form.monthly * form.leasingTerm}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage Limit (km/year)</label>
                  <input type="number" value={form.leasingMileageLimit} onChange={(e) => setForm(prev => ({ ...prev, leasingMileageLimit: Number(e.target.value) }))} placeholder="16000" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                  <input type="number" value={form.mileage} onChange={(e) => setForm(prev => ({ ...prev, mileage: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Insurance ($) *</label>
                  <input type="number" value={form.insuranceCost} onChange={(e) => setForm(prev => ({ ...prev, insuranceCost: Number(e.target.value) }))} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              {form.image && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                  <img src={form.image} alt="Preview" className="w-full h-48 object-cover rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={save} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">
                  {editingId ? 'Update Car' : 'Add Car'}
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMakerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 z-10">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-lg">
              <h4 className="text-xl font-semibold">Add Car Maker</h4>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maker Name *</label>
                <input value={newMaker.name} onChange={(e) => setNewMaker(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g., Tesla" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input value={newMaker.logo} onChange={(e) => setNewMaker(prev => ({ ...prev, logo: e.target.value }))} placeholder="https://..." className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
              </div>
              {newMaker.logo && (
                <div className="p-3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img src={newMaker.logo} alt="Preview" className="h-12 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={addMaker} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">Add Maker</button>
                <button onClick={() => { setShowMakerModal(false); setNewMaker({ name: '', logo: '' }) }} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDetailsModal(false)}>
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col z-10" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 flex-shrink-0">
              <h4 className="text-xl font-semibold">Car Specifications</h4>
            </div>
            
            <div className="flex border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <button onClick={() => setDetailsSection('keyinfo')} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${detailsSection === 'keyinfo' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Key Info</button>
              <button onClick={() => setDetailsSection('stats')} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${detailsSection === 'stats' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Stats</button>
              <button onClick={() => setDetailsSection('features')} className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${detailsSection === 'features' ? 'border-green-600 text-green-700 bg-white' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>Features</button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              {detailsSection === 'keyinfo' && (
                <div className="space-y-4">
                  {keyInfoFields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                      <input value={detailsForm.keyInfo?.[field] || ''} onChange={(e) => updateKeyInfo(field, e.target.value)} placeholder={`Enter ${field}`} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {detailsSection === 'stats' && (
                <div className="space-y-4">
                  {statsFields.map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{field}</label>
                      <input value={detailsForm.stats?.[field] || ''} onChange={(e) => updateStat(field, e.target.value)} placeholder={`Enter ${field}`} className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}

              {detailsSection === 'features' && (
                <div className="space-y-4">
                  {featureCategories.map(category => (
                    <div key={category}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{category}</label>
                      <input value={(detailsForm.features?.[category] || []).join(', ')} onChange={(e) => updateFeature(category, e.target.value)} placeholder="Enter features separated by commas" className="w-full p-3 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t flex-shrink-0">
              <button onClick={saveDetails} className="flex-1 px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md shadow hover:shadow-md transition-shadow">
                Save Details
              </button>
              <button onClick={() => setShowDetailsModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setPreviewImage(null)}>
          <div className="absolute inset-0 backdrop-blur-sm bg-black/40"></div>
          <div className="relative max-w-4xl max-h-[90vh] z-10" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt={previewName} className="w-full h-full object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  )
}