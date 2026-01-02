export type CarDetailsData = {
  keyInfo?: Record<string, unknown>
  stats?: Record<string, unknown>
  features?: Record<string, unknown>
}

export type CarData = {
  id: string
  maker: string
  name: string
  type: string
  logo?: string | null
  image?: string | null
  monthly: number
  mileage: number
  insuranceCost: number
  price: number
  leasingTerm?: number | null
  leasingMileageLimit?: number | null
  location?: string | null
  latitude?: number | null
  longitude?: number | null
  details?: CarDetailsData | null
  createdAt: string
  updatedAt?: string | null
  availability?: 'AVAILABLE' | 'UNAVAILABLE' | 'RENTED'
}

export default CarData
