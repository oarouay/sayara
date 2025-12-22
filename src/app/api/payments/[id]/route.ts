import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { id: paymentId } = await params
    if (!paymentId) {
      return NextResponse.json({ message: 'Missing payment ID' }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ message: 'Payment not found' }, { status: 404 })
    }

    // Check if user can view payment
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })
    if (payment.userId !== authUser.id && user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json({ message: 'Failed to fetch payment', error: String(error) }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can update payments
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { id: paymentId } = await params
    if (!paymentId) {
      return NextResponse.json({ message: 'Missing payment ID' }, { status: 400 })
    }

    const body = await request.json()
    const { status, amount, paymentMethod } = body

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...(status && { status }),
        ...(amount && { amount: Number(amount) }),
        ...(paymentMethod && { paymentMethod }),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error updating payment:', error)
    return NextResponse.json({ message: 'Failed to update payment', error: String(error) }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can delete payments
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const { id: paymentId } = await params
    if (!paymentId) {
      return NextResponse.json({ message: 'Missing payment ID' }, { status: 400 })
    }

    const payment = await prisma.payment.delete({
      where: { id: paymentId },
    })

    return NextResponse.json({ payment })
  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json({ message: 'Failed to delete payment', error: String(error) }, { status: 500 })
  }
}
