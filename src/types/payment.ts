export type PaymentRecord = {
  id: string
  paymentDate: string
  amount: number
  paymentMethod: string
  status: string
  createdAt: string
  cardLast4?: string | null
  cardBrand?: string | null
}

export type PaymentDetails = {
  cardHolder: string
  cardNumber: string
  expiryDate: string
  cvv: string
  billingAddress: string
}