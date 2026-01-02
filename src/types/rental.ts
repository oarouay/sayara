export type RentalData = {
  id: string
  carModel: string
  licensePlate: string
  pickupLocation: string
  dropoffLocation: string
  rentalDate: string   // converted from DateTime (ISO)
  returnDate: string   // converted from DateTime (ISO)
  dailyRate: number
  totalCost: number
  insurance: boolean
  status: "ACTIVE" | "COMPLETED" | "PENDING" | "CANCELLED"

  driverName?: string
  driverPhone?: string
  rentalDays?: number
  additionalServices?: string[]
  notes?: string

  createdAt: string
}