import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyFlouciPayment } from '@/lib/flouci'

/**
 * GET /api/payments/flouci/callback
 * Flouci callback endpoint after user completes or cancels payment
 * 
 * Query parameters:
 * - order_id: The order ID from Flouci
 * - transaction_id: The Flouci transaction ID (if successful)
 * - status: Payment status (success/failed/cancelled)
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const orderId = url.searchParams.get('order_id')
    const transactionId = url.searchParams.get('transaction_id')
    const status = url.searchParams.get('status')

    console.log('🔔 Flouci callback received:', { orderId, transactionId, status })

    if (!orderId) {
      return NextResponse.redirect(new URL('/profile?error=invalid_callback', request.url))
    }

    // Find payment by order ID
    const payment = await prisma.payment.findUnique({
      where: { flouciOrderId: orderId },
      include: { user: true },
    })

    if (!payment) {
      console.error('❌ Payment not found for order:', orderId)
      return NextResponse.redirect(new URL('/profile?error=payment_not_found', request.url))
    }

    // Verify payment with Flouci
    const verification = await verifyFlouciPayment(orderId, transactionId || undefined)

    if (verification.verified && verification.status === 'completed') {
      // Payment successful - update payment and rental status
      console.log('✅ Payment verified successfully for order:', orderId)

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paymentDate: new Date(),
          flouciTransactionId: transactionId || payment.flouciTransactionId,
        },
      })

      // Update rental status to ACTIVE
      const updatedRental = await prisma.rental.update({
        where: { id: payment.rentalId },
        data: { status: 'ACTIVE' },
      })

      console.log('✅ Rental activated:', updatedRental.id)

      // Redirect to profile with success message
      return NextResponse.redirect(
        new URL(
          `/profile?success=payment_completed&rentalId=${updatedRental.id}&paymentId=${updatedPayment.id}`,
          request.url
        )
      )
    } else {
      // Payment failed
      console.warn('⚠️ Payment verification failed:', verification)

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })

      return NextResponse.redirect(
        new URL(`/profile?error=payment_failed&reason=${verification.error || 'verification_failed'}`, request.url)
      )
    }
  } catch (error) {
    console.error('❌ Error processing Flouci callback:', error)
    return NextResponse.redirect(new URL('/profile?error=callback_processing_failed', request.url))
  }
}

/**
 * POST /api/payments/flouci/callback
 * Alternative POST callback if Flouci sends a server-to-server notification
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, transaction_id, status } = body

    console.log('🔔 Flouci POST callback received:', { order_id, transaction_id, status })

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 })
    }

    // Find payment by order ID
    const payment = await prisma.payment.findUnique({
      where: { flouciOrderId: order_id },
    })

    if (!payment) {
      console.error('❌ Payment not found for order:', order_id)
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Verify payment with Flouci
    const verification = await verifyFlouciPayment(order_id, transaction_id)

    if (verification.verified && verification.status === 'completed') {
      console.log('✅ Payment verified successfully via POST')

      const updatedPayment = await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paymentDate: new Date(),
          flouciTransactionId: transaction_id || payment.flouciTransactionId,
        },
      })

      // Update rental status to ACTIVE
      await prisma.rental.update({
        where: { id: payment.rentalId },
        data: { status: 'ACTIVE' },
      })

      return NextResponse.json(
        { message: 'Payment verified and processed', paymentId: updatedPayment.id },
        { status: 200 }
      )
    } else {
      console.warn('⚠️ Payment verification failed via POST:', verification)

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })

      return NextResponse.json(
        { error: 'Payment verification failed', reason: verification.error },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('❌ Error processing Flouci POST callback:', error)
    return NextResponse.json(
      { error: 'Error processing callback', details: String(error) },
      { status: 500 }
    )
  }
}
