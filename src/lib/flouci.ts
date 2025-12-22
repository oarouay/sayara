/**
 * Flouci Payment API Integration
 * Flouci is a Tunisian payment gateway supporting online payments
 * 
 * Environment variables required:
 * - FLOUCI_APP_ID: Your Flouci application ID
 * - FLOUCI_APP_SECRET: Your Flouci application secret
 * - FLOUCI_API_URL: Base URL for Flouci API (defaults to https://app.flouci.com)
 */

const FLOUCI_APP_ID = process.env.FLOUCI_APP_ID
const FLOUCI_APP_SECRET = process.env.FLOUCI_APP_SECRET
const FLOUCI_API_URL = process.env.FLOUCI_API_URL || 'https://app.flouci.com'

interface FlouciPaymentRequest {
  amount: number // Amount in TND (smallest currency unit)
  rentalId: string
  userId: string
  orderId: string
  description: string
  customerEmail?: string
  customerPhone?: string
  callbackUrl: string
  errorUrl: string
}

interface FlouciPaymentResponse {
  success: boolean
  link?: string
  paymentUrl?: string
  transactionId?: string
  error?: string
}

/**
 * Generate a unique order ID for the transaction
 */
export function generateOrderId(rentalId: string): string {
  return `RENTAL-${rentalId}-${Date.now()}`
}

/**
 * Create a payment link for Flouci
 * Returns a payment URL that user should be redirected to
 */
export async function createFlouciPayment(
  params: FlouciPaymentRequest
): Promise<FlouciPaymentResponse> {
  try {
    if (!FLOUCI_APP_ID || !FLOUCI_APP_SECRET) {
      throw new Error('Flouci credentials not configured')
    }

    const payload = {
      app_id: FLOUCI_APP_ID,
      app_secret: FLOUCI_APP_SECRET,
      amount: Math.round(params.amount * 1000), // Convert to the smallest unit
      order_id: params.orderId,
      description: params.description,
      customer_email: params.customerEmail || 'customer@example.com',
      customer_phone: params.customerPhone || '',
      callback_url: params.callbackUrl,
      error_url: params.errorUrl,
      success_url: `${params.callbackUrl}?status=success`,
    }

    const response = await fetch(`${FLOUCI_API_URL}/api/v1/payments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(`Flouci API error: ${response.status} - ${JSON.stringify(error)}`)
    }

    const data = await response.json()

    if (data.result === false || data.data?.link === null) {
      throw new Error(`Flouci returned error: ${data.message || 'Unknown error'}`)
    }

    return {
      success: true,
      link: data.data?.link,
      paymentUrl: data.data?.link,
      transactionId: data.data?.transaction_id || params.orderId,
    }
  } catch (error) {
    console.error('Flouci payment creation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment creation failed',
    }
  }
}

/**
 * Verify a Flouci payment callback
 * Should be called when user is redirected back from Flouci
 */
export async function verifyFlouciPayment(
  orderId: string,
  transactionId?: string
): Promise<{ verified: boolean; status?: string; error?: string }> {
  try {
    if (!FLOUCI_APP_ID || !FLOUCI_APP_SECRET) {
      throw new Error('Flouci credentials not configured')
    }

    const payload = {
      app_id: FLOUCI_APP_ID,
      app_secret: FLOUCI_APP_SECRET,
      order_id: orderId,
      transaction_id: transactionId || '',
    }

    const response = await fetch(`${FLOUCI_API_URL}/api/v1/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Flouci API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if payment was successful
    const isSuccess = data.result === true && 
      (data.data?.status === 'completed' || data.data?.status === 'success')

    return {
      verified: isSuccess,
      status: data.data?.status || 'unknown',
    }
  } catch (error) {
    console.error('Flouci payment verification failed:', error)
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    }
  }
}

/**
 * Check payment status from Flouci
 */
export async function getPaymentStatus(
  orderId: string
): Promise<{ status?: string; amount?: number; error?: string }> {
  try {
    if (!FLOUCI_APP_ID || !FLOUCI_APP_SECRET) {
      throw new Error('Flouci credentials not configured')
    }

    const payload = {
      app_id: FLOUCI_APP_ID,
      app_secret: FLOUCI_APP_SECRET,
      order_id: orderId,
    }

    const response = await fetch(`${FLOUCI_API_URL}/api/v1/payments/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`Flouci API error: ${response.status}`)
    }

    const data = await response.json()

    return {
      status: data.data?.status || 'unknown',
      amount: data.data?.amount ? data.data.amount / 1000 : undefined,
    }
  } catch (error) {
    console.error('Flouci payment status check failed:', error)
    return {
      error: error instanceof Error ? error.message : 'Status check failed',
    }
  }
}

/**
 * Format amount for Flouci (handles decimal to smallest unit conversion)
 */
export function formatAmountForFlouci(amount: number): number {
  return Math.round(amount * 1000)
}

/**
 * Parse Flouci amount back to TND
 */
export function parseFlouciAmount(flouciAmount: number): number {
  return flouciAmount / 1000
}
