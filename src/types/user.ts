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
  driverLicenseDocument?: string | null

  idDocumentNumber?: string | null
  idDocumentVerified: boolean
  idDocumentContent?: string | null

  createdAt: string
  updatedAt: string

  rentals: RentalData[]

  // ✅ Saved card info (optional)
  cardHolderName?: string | null
  cardLastFour?: string | null
  cardBrand?: string | null
  billingAddress?: string | null
  expiryDate?: string | null

  // ✅ Payment history from backend
  payments: PaymentRecord[]
}