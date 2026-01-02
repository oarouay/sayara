const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialCars = [
  { id: 1, maker: "Toyota", name: "Corolla", type: "Sedan", logo: "/data/toyota.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg/1200px-2019_Toyota_Corolla_Icon_Tech_VVT-i_Hybrid_1.8.jpg", monthly: 289, mileage: 25000, insuranceCost: 150, price: 18000, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 2, maker: "BMW", name: "3 Series", type: "Sedan", logo: "/data/BMW.svg", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1000", monthly: 399, mileage: 15000, insuranceCost: 150, price: 32000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 3, maker: "Mercedes", name: "C-Class", type: "Sedan", logo: "/data/mercedes.svg", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1000", monthly: 429, mileage: 12000, insuranceCost: 150, price: 35000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 4, maker: "Ford", name: "Mustang", type: "Sports Car", logo: "/data/Ford.svg", image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&q=80&w=1000", monthly: 499, mileage: 8000, insuranceCost: 150, price: 42000, leasingTerm: 36, leasingMileageLimit: 15000 },
  { id: 5, maker: "Hyundai", name: "Elantra", type: "Sedan", logo: "/data/hyundai.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2021_Hyundai_Elantra_SEL_Front_View.jpg/1200px-2021_Hyundai_Elantra_SEL_Front_View.jpg", monthly: 279, mileage: 30000, insuranceCost: 140, price: 17000, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 6, maker: "Kia", name: "Optima", type: "Sedan", logo: "/data/kia.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/2016_Kia_Optima_SX_Turbo_front_11.23.19.jpg/1200px-2016_Kia_Optima_SX_Turbo_front_11.23.19.jpg", monthly: 299, mileage: 28000, insuranceCost: 145, price: 19000, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 7, maker: "Audi", name: "A4", type: "Sedan", logo: "/data/audi.svg", image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&q=80&w=1000", monthly: 449, mileage: 10000, insuranceCost: 180, price: 38000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 8, maker: "Renault", name: "Megane", type: "Hatchback", logo: "/data/Renault.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Renault_M%C3%A9gane_E-Tech_Plug-in_Hybrid_160_Techno_front_view.jpg/1200px-Renault_M%C3%A9gane_E-Tech_Plug-in_Hybrid_160_Techno_front_view.jpg", monthly: 259, mileage: 35000, insuranceCost: 130, price: 16000, leasingTerm: 36, leasingMileageLimit: 15000 },
  { id: 9, maker: "Volkswagen", name: "Golf", type: "Hatchback", logo: "/data/vw.svg", image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000", monthly: 319, mileage: 20000, insuranceCost: 155, price: 22000, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 10, maker: "Honda", name: "Civic", type: "Sedan", logo: "/data/honda.svg", image: "https://images.unsplash.com/photo-1594070319944-7c0c63146b77?auto=format&fit=crop&q=80&w=1000", monthly: 295, mileage: 22000, insuranceCost: 145, price: 19500, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 11, maker: "Toyota", name: "RAV4", type: "SUV", logo: "/data/toyota.svg", image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=1000", monthly: 379, mileage: 18000, insuranceCost: 165, price: 28000, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 12, maker: "Honda", name: "CR-V", type: "SUV", logo: "/data/honda.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/2017_Honda_CR-V_VTi-L_wagon_%282018-10-29%29_01.jpg/1200px-2017_Honda_CR-V_VTi-L_wagon_%282018-10-29%29_01.jpg", monthly: 359, mileage: 20000, insuranceCost: 160, price: 26500, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 13, maker: "Mazda", name: "CX-5", type: "SUV", logo: "/data/mazda.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/2017_Mazda_CX-5_%28KF%29_Maxx_2WD_wagon_%282018-09-03%29_01.jpg/1200px-2017_Mazda_CX-5_%28KF%29_Maxx_2WD_wagon_%282018-09-03%29_01.jpg", monthly: 349, mileage: 19000, insuranceCost: 155, price: 25500, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 14, maker: "Nissan", name: "Altima", type: "Sedan", logo: "/data/nissan.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/2019_Nissan_Altima_2.5_Platinum%2C_front_right.jpg/1200px-2019_Nissan_Altima_2.5_Platinum%2C_front_right.jpg", monthly: 285, mileage: 24000, insuranceCost: 145, price: 18500, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 15, maker: "Chevrolet", name: "Malibu", type: "Sedan", logo: "/data/chevrolet.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/2016_Chevrolet_Malibu_LT_Front.jpg/1200px-2016_Chevrolet_Malibu_LT_Front.jpg", monthly: 275, mileage: 26000, insuranceCost: 140, price: 17500, leasingTerm: 36, leasingMileageLimit: 16000 },
  { id: 16, maker: "Ford", name: "Explorer", type: "SUV", logo: "/data/Ford.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/2020_Ford_Explorer_Limited_4WD%2C_front_left_7-15-20.jpg/1200px-2020_Ford_Explorer_Limited_4WD%2C_front_left_7-15-20.jpg", monthly: 429, mileage: 14000, insuranceCost: 175, price: 34000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 17, maker: "Jeep", name: "Grand Cherokee", type: "SUV", logo: "/data/jeep.svg", image: "https://images.unsplash.com/photo-1626245914652-3069c9b6851b?auto=format&fit=crop&q=80&w=1000", monthly: 459, mileage: 12000, insuranceCost: 185, price: 37000, leasingTerm: 36, leasingMileageLimit: 20000 },
  { id: 18, maker: "Subaru", name: "Outback", type: "SUV", logo: "/data/subaru.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/2020_Subaru_Outback_Limited_XT_front_5.24.20.jpg/1200px-2020_Subaru_Outback_Limited_XT_front_5.24.20.jpg", monthly: 369, mileage: 17000, insuranceCost: 160, price: 27500, leasingTerm: 36, leasingMileageLimit: 18000 },
  { id: 19, maker: "Volkswagen", name: "Tiguan", type: "SUV", logo: "/data/vw.svg", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/2018_Volkswagen_Tiguan_SEL_Premium_4Motion_2.0L_front_3.28.18.jpg/1200px-2018_Volkswagen_Tiguan_SEL_Premium_4Motion_2.0L_front_3.28.18.jpg", monthly: 339, mileage: 21000, insuranceCost: 155, price: 24500, leasingTerm: 36, leasingMileageLimit: 18000 },
];

const carDetailsDatabase = {
    1: {
    keyInfo: { "Engine power": 97, Transmission: "Automatic", Fuel: "Petrol", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 120, "Acceleration (0–100 km/h)": 10.9, "Top speed": 180, Efficiency: 5.2, "Boot (seats up)": 361, "Safety rating": 4 },
    features: { "Passive Safety": ["Lane Assist", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Heated Seats", "Ambient Lighting"], "Exterior Features": ["LED Headlights", "Body-Colored Mirrors"], Entertainment: ["Touchscreen Display", "Bluetooth Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Hybrid Assist"], Trim: ["Design Pack", "Chrome Accents"], Wheels: [16] },
  },
  2: {
    keyInfo: { "Engine power": 135, Transmission: "Automatic", Fuel: "Petrol", Doors: 4, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 140, "Acceleration (0–100 km/h)": 7.1, "Top speed": 235, Efficiency: 6.5, "Boot (seats up)": 480, "Safety rating": 5 },
    features: { "Passive Safety": ["ABS", "Airbags"], Security: ["Central Locking", "Alarm System"], "Interior Features": ["Leather Seats", "Digital Cockpit"], "Exterior Features": ["LED Headlights", "Chrome Trim"], Entertainment: ["Apple CarPlay", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Rear-Wheel Drive", "Sport Suspension"], Trim: ["M Sport Package"], Wheels: [18] },
  },
  3: {
    keyInfo: { "Engine power": 150, Transmission: "Automatic", Fuel: "Diesel", Doors: 4, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 135, "Acceleration (0–100 km/h)": 7.5, "Top speed": 230, Efficiency: 5.8, "Boot (seats up)": 455, "Safety rating": 5 },
    features: { "Passive Safety": ["Blind Spot Assist", "Collision Prevention"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Ambient Lighting", "Heated Steering Wheel"], "Exterior Features": ["LED Headlights", "Chrome Trim"], Entertainment: ["MBUX Infotainment", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Rear-Wheel Drive", "Comfort Suspension"], Trim: ["Avantgarde Package"], Wheels: [17] },
  },
  4: {
    keyInfo: { "Engine power": 331, Transmission: "Manual", Fuel: "Petrol", Doors: 2, Seats: 4, Warranty: 3 },
    stats: { "CO2 emissions": 180, "Acceleration (0–100 km/h)": 4.8, "Top speed": 250, Efficiency: 12, "Boot (seats up)": 408, "Safety rating": 4 },
    features: { "Passive Safety": ["Traction Control", "Airbags"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Sports Seats", "Premium Audio"], "Exterior Features": ["LED Headlights", "Sport Styling"], Entertainment: ["Apple CarPlay", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Rear-Wheel Drive", "Performance Suspension"], Trim: ["GT Package"], Wheels: [19] },
  },
  5: {
    keyInfo: { "Engine power": 112, Transmission: "Automatic", Fuel: "Petrol", Doors: 4, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 128, "Acceleration (0–100 km/h)": 8.1, "Top speed": 210, Efficiency: 6.2, "Boot (seats up)": 440, "Safety rating": 5 },
    features: { "Passive Safety": ["Emergency Braking", "Lane Assist"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Ventilated Seats", "Wireless Charging"], "Exterior Features": ["LED Headlights", "Chrome Trim"], Entertainment: ["8-inch Touchscreen", "Apple CarPlay"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Comfort Suspension"], Trim: ["BlueLink Connected Tech"], Wheels: [17] },
  },
  6: {
    keyInfo: { "Engine power": 125, Transmission: "Automatic", Fuel: "Diesel", Doors: 4, Seats: 5, Warranty: 7 },
    stats: { "CO2 emissions": 115, "Acceleration (0–100 km/h)": 9.2, "Top speed": 205, Efficiency: 4.8, "Boot (seats up)": 505, "Safety rating": 5 },
    features: { "Passive Safety": ["ABS", "Airbags"], Security: ["Central Locking", "Alarm System"], "Interior Features": ["Dual Zone Climate Control", "Leather Seats"], "Exterior Features": ["LED Headlights", "Chrome Trim"], Entertainment: ["7-inch Touchscreen", "Navigation"], "Driver Convenience": ["Reversing Camera", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Standard Suspension"], Trim: ["Premium Package"], Wheels: [17] },
  },
  7: {
    keyInfo: { "Engine power": 140, Transmission: "Automatic", Fuel: "Diesel", Doors: 4, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 128, "Acceleration (0–100 km/h)": 7.3, "Top speed": 240, Efficiency: 4.5, "Boot (seats up)": 460, "Safety rating": 5 },
    features: { "Passive Safety": ["Emergency Braking", "Lane Assist"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Virtual Cockpit", "Ambient Lighting"], "Exterior Features": ["Matrix LED Headlights", "Chrome Trim"], Entertainment: ["10-inch Touchscreen", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Sport Suspension"], Trim: ["S Line Package"], Wheels: [19] },
  },
  8: {
    keyInfo: { "Engine power": 103, Transmission: "Manual", Fuel: "Petrol", Doors: 5, Seats: 5, Warranty: 5 },
    stats: { "CO2 emissions": 125, "Acceleration (0–100 km/h)": 9.5, "Top speed": 200, Efficiency: 5.8, "Boot (seats up)": 384, "Safety rating": 5 },
    features: { "Passive Safety": ["ABS", "Airbags"], Security: ["Central Locking", "Alarm System"], "Interior Features": ["Climate Control", "Heated Seats"], "Exterior Features": ["LED Headlights", "Body-Colored Mirrors"], Entertainment: ["7-inch Touchscreen", "Bluetooth"], "Driver Convenience": ["Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Comfort Suspension"], Trim: ["Standard Package"], Wheels: [16] },
  },
  9: {
    keyInfo: { "Engine power": 110, Transmission: "Automatic", Fuel: "Petrol", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 132, "Acceleration (0–100 km/h)": 8.5, "Top speed": 220, Efficiency: 5.5, "Boot (seats up)": 381, "Safety rating": 5 },
    features: { "Passive Safety": ["Emergency Braking", "Lane Assist"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Digital Cockpit", "Ambient Lighting"], "Exterior Features": ["LED Headlights", "Chrome Trim"], Entertainment: ["8-inch Touchscreen", "Apple CarPlay"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Sport Suspension"], Trim: ["R-Line Package"], Wheels: [17] },
  },
  10: {
    keyInfo: { "Engine power": 150, Transmission: "CVT Automatic", Fuel: "Petrol / Hybrid", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 105, "Acceleration (0–100 km/h)": 8.1, "Top speed": 210, Efficiency: 4.8, "Boot (seats up)": 409, "Safety rating": 5 },
    features: { "Passive Safety": ["Collision Mitigation Braking", "Lane Keeping Assist"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Heated Seats", "Digital Cockpit"], "Exterior Features": ["LED Headlights", "Moonroof (Sport Touring)"], Entertainment: ["Touchscreen", "Apple CarPlay/Android Auto"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Hybrid Assist"], Trim: ["LX", "Sport", "Sport Touring"], Wheels: [16] },
  },
  11: {
    keyInfo: { "Engine power": 218, Transmission: "Automatic", Fuel: "Hybrid Petrol", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 105, "Acceleration (0–100 km/h)": 8.1, "Top speed": 180, Efficiency: 5.0, "Boot (seats up)": 580, "Safety rating": 5 },
    features: { "Passive Safety": ["Lane Assist", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Leather Seats", "Ambient Lighting"], "Exterior Features": ["LED Headlights", "Roof Rails"], Entertainment: ["Touchscreen", "Bluetooth Audio"], "Driver Convenience": ["Adaptive Cruise Control", "360° Camera"], "Engine/Drivetrain/Suspension": ["AWD Hybrid System"], Trim: ["Excel", "Dynamic"], Wheels: [18] },
  },
  12: {
    keyInfo: { "Engine power": 184, Transmission: "Automatic", Fuel: "Hybrid Petrol", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 120, "Acceleration (0–100 km/h)": 9.0, "Top speed": 190, Efficiency: 5.8, "Boot (seats up)": 617, "Safety rating": 5 },
    features: { "Passive Safety": ["Collision Mitigation Braking", "Lane Assist"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Panoramic Roof", "Heated Seats"], "Exterior Features": ["LED Headlights", "Chrome Grille"], Entertainment: ["Touchscreen", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["AWD Hybrid Assist"], Trim: ["Elegance", "Sport"], Wheels: [18] },
  },
  13: {
    keyInfo: { "Engine power": 165, Transmission: "Automatic", Fuel: "Petrol/Diesel", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 150, "Acceleration (0–100 km/h)": 9.2, "Top speed": 200, Efficiency: 6.0, "Boot (seats up)": 522, "Safety rating": 4 },
    features: { "Passive Safety": ["Blind Spot Monitoring", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Leather Seats", "Ambient Lighting"], "Exterior Features": ["LED Headlights", "Roof Rails"], Entertainment: ["Touchscreen", "Apple CarPlay"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["AWD Option"], Trim: ["Sport", "Touring"], Wheels: [17] },
  },
  14: {
    keyInfo: { "Engine power": 188, Transmission: "CVT Automatic", Fuel: "Petrol", Doors: 4, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 160, "Acceleration (0–100 km/h)": 8.5, "Top speed": 210, Efficiency: 6.5, "Boot (seats up)": 436, "Safety rating": 4 },
    features: { "Passive Safety": ["Forward Collision Warning", "Lane Departure Warning"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Cloth/Leather Seats", "Heated Steering Wheel"], "Exterior Features": ["LED Headlights", "Chrome Trim"], Entertainment: ["Touchscreen", "Bluetooth Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Rearview Camera"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive"], Trim: ["S", "SV", "SL"], Wheels: [17] },
  },
  15: {
    keyInfo: { "Engine power": 160, Transmission: "Automatic", Fuel: "Petrol", Doors: 4, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 155, "Acceleration (0–100 km/h)": 8.8, "Top speed": 200, Efficiency: 6.3, "Boot (seats up)": 445, "Safety rating": 4 },
    features: { "Passive Safety": ["Lane Assist", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Heated Seats", "Ambient Lighting"], "Exterior Features": ["LED Headlights", "Body-Colored Mirrors"], Entertainment: ["Touchscreen", "Apple CarPlay/Android Auto"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive"], Trim: ["LS", "LT", "Premier"], Wheels: [16] },
  },
  16: {
    keyInfo: { "Engine power": 300, Transmission: "10-speed Automatic", Fuel: "Petrol", Doors: 5, Seats: 7, Warranty: 3 },
    stats: { "CO2 emissions": 200, "Acceleration (0–100 km/h)": 6.5, "Top speed": 230, Efficiency: 8.5, "Boot (seats up)": 515, "Safety rating": 5 },
    features: { "Passive Safety": ["Blind Spot Monitoring", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Leather Seats", "Tri-Zone Climate Control"], "Exterior Features": ["LED Headlights", "Roof Rails"], Entertainment: ["Touchscreen", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "360° Camera"], "Engine/Drivetrain/Suspension": ["AWD", "Terrain Management System"], Trim: ["XLT", "Limited", "Platinum"], Wheels: [18] },
  },
  17: {
    keyInfo: { "Engine power": 293, Transmission: "8-speed Automatic", Fuel: "Petrol / Plug-in Hybrid", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 180, "Acceleration (0–100 km/h)": 6.5, "Top speed": 210, Efficiency: 7.5, "Boot (seats up)": 487, "Safety rating": 5 },
    features: { "Passive Safety": ["Blind Spot Monitoring", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Leather Seats", "Panoramic Sunroof"], "Exterior Features": ["LED Headlights", "Roof Rails"], Entertainment: ["Touchscreen", "Premium Audio"], "Driver Convenience": ["Adaptive Cruise Control", "360° Camera"], "Engine/Drivetrain/Suspension": ["AWD", "Terrain Management System"], Trim: ["Limited", "Overland", "Summit"], Wheels: [18] },
  },
  18: {
    keyInfo: { "Engine power": 182, Transmission: "CVT Automatic", Fuel: "Petrol", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 160, "Acceleration (0–100 km/h)": 8.7, "Top speed": 210, Efficiency: 7.0, "Boot (seats up)": 522, "Safety rating": 5 },
    features: { "Passive Safety": ["EyeSight Driver Assist", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Heated Seats", "Panoramic Roof"], "Exterior Features": ["LED Headlights", "Roof Rails"], Entertainment: ["Touchscreen", "Apple CarPlay/Android Auto"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Symmetrical AWD"], Trim: ["Base", "Premium", "Limited"], Wheels: [17] },
  },
  19: {
    keyInfo: { "Engine power": 184, Transmission: "Automatic DSG", Fuel: "Petrol", Doors: 5, Seats: 5, Warranty: 3 },
    stats: { "CO2 emissions": 150, "Acceleration (0–100 km/h)": 9.2, "Top speed": 200, Efficiency: 6.5, "Boot (seats up)": 520, "Safety rating": 5 },
    features: { "Passive Safety": ["Lane Assist", "Emergency Braking"], Security: ["Immobilizer", "Alarm System"], "Interior Features": ["Leather Seats", "Ambient Lighting"], "Exterior Features": ["LED Headlights", "Roof Rails"], Entertainment: ["Touchscreen", "Bluetooth Audio"], "Driver Convenience": ["Adaptive Cruise Control", "Parking Sensors"], "Engine/Drivetrain/Suspension": ["Front-Wheel Drive", "Optional AWD"], Trim: ["Life", "Elegance", "R-Line"], Wheels: [17] },
  },
};

async function main() {
    console.log(`Start seeding ...`);

    // Clear existing data
    await prisma.carDetails.deleteMany();
    await prisma.car.deleteMany();
    console.log('Cleared existing data.');

    for (const carData of initialCars) {
        const { id, ...restOfCarData } = carData;
        const details = carDetailsDatabase[id];

        const sanitize = (value) => {
            if (value === null || value === undefined) return value;
            if (Array.isArray(value)) return value.map(v => sanitize(v));
            if (typeof value === 'object') {
                const out = {};
                for (const k of Object.keys(value)) out[k] = sanitize(value[k]);
                return out;
            }
            if (typeof value === 'string') {
                const s = value.trim();
                // try extract a first number from string
                const m = s.match(/-?\d+(?:\.\d+)?/);
                if (m) {
                    // convert to integer as requested
                    return Math.round(Number(m[0]));
                }
                return s;
            }
            if (typeof value === 'number') return Math.round(value);
            return value;
        }

        const sanitizedDetails = details ? (() => {
            const out = {};
            for (const k of Object.keys(details)) {
                out[k] = sanitize(details[k]);
            }
            return out;
        })() : undefined;

        const car = await prisma.car.create({
            data: {
                ...restOfCarData,
                details: sanitizedDetails ? {
                    create: sanitizedDetails,
                } : undefined,
            },
        });
        console.log(`Created car with id: ${car.id} (original id: ${id})`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });