import type { RentalData } from "./rental"
import type { PaymentRecord, PaymentDetails } from "./payment"

export type PublicUser = {
  id: string
  name: string
  email: string
  phone: string
  nationality: string
  dateOfBirth: string
  address: string
  city: string
  role: "USER" | "ADMIN"

  driverLicenseNumber?: string | null
  driverLicenseVerified: boolean

  idDocumentNumber?: string | null
  idDocumentVerified: boolean

  createdAt: string
  updatedAt: string

  rentals: RentalData[]

  // ✅ Saved card info (optional)
  paymentDetails?: PaymentDetails | null

  // ✅ Payment history from backend
  payments: PaymentRecord[]
}