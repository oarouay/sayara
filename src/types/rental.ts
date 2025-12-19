export type RentalData = {
  id: string
  carModel: string
  licensePlate: string
  pickupLocation: string
  dropoffLocation: string
  rentalDate: string   // converted from DateTime
  returnDate: string   // converted from DateTime
  dailyRate: number
  totalCost: number
  insurance: boolean
  status: "active" | "completed" | "pending" | "cancelled"

  driverName?: string
  driverPhone?: string
  rentalDays?: number
  additionalServices?: string[]
  notes?: string

  createdAt: string
}