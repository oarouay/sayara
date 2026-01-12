import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

const isValidObjectId = (id?: string) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)

export async function GET(request: Request) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })

    // Optionally filter by rentalId query param
    const url = new URL(request.url)
    const rentalId = url.searchParams.get('rentalId')
    if (rentalId && !isValidObjectId(rentalId)) {
      return NextResponse.json({ message: 'Invalid rental id' }, { status: 400 })
    }

    let payments
    if (user?.role === 'ADMIN') {
      // Admin: get all payments (optionally filter by rentalId)
      const where = rentalId ? { rentalId } : undefined
      payments = await prisma.payment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: { paymentDate: 'desc' },
      })
    } else {
      // User: get only their payments (optionally filter by rentalId if provided)
      let where: any = { userId: authUser.id }
      
      // If rentalId is provided, verify it belongs to this user
      if (rentalId) {
        const rental = await prisma.rental.findUnique({ where: { id: rentalId } })
        if (!rental || rental.userId !== authUser.id) {
          return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
        }
        where.rentalId = rentalId
      }
      
      payments = await prisma.payment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: { paymentDate: 'desc' },
      })
    }

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ message: 'Failed to fetch payments', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { rentalId, amount, paymentMethod, cardLast4, cardBrand } = body

    if (!rentalId || !amount || !paymentMethod) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Validate paymentMethod
    const allowedMethods = ['CASH', 'CARD']
    if (!allowedMethods.includes(paymentMethod)) {
      return NextResponse.json({ message: 'Invalid payment method' }, { status: 400 })
    }

    // Verify rental exists and user owns it
    const rental = await prisma.rental.findUnique({
      where: { id: rentalId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    if (!rental) {
      return NextResponse.json({ message: 'Rental not found' }, { status: 404 })
    }

    // Check if user can create payment for this rental (own or admin)
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (rental.userId !== authUser.id && user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Handle CASH and CARD payments
    let paymentCardLast4 = cardLast4 || null
    let paymentCardBrand = cardBrand || null

    // For CARD payment, fetch saved card details from user profile
    if (paymentMethod === 'CARD') {
      const userWithCard = await prisma.user.findUnique({
        where: { id: authUser.id },
      }) as any

      if (!userWithCard || !userWithCard.cardNumber) {
        return NextResponse.json(
          { message: 'No saved card found. Please save a card before using this payment method.' },
          { status: 400 }
        )
      }

      // Extract last 4 digits from saved card
      paymentCardLast4 = (userWithCard.cardNumber as string).slice(-4)
      paymentCardBrand = (userWithCard.cardBrand as string) || 'Unknown'
    }

    const payment = await prisma.payment.create({
      data: {
        amount: Number(amount),
        paymentMethod,
        status: 'PENDING',
        cardLast4: paymentCardLast4,
        cardBrand: paymentCardBrand,
        userId: authUser.id,
        rentalId: rentalId,
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      }
    })

    // Update rental status to ACTIVE for both CASH and CARD payments
    // CASH: Payment is pending but rental can start (will be verified upon payment)
    // CARD: Payment is verified via saved card
    await prisma.rental.update({
      where: { id: rentalId },
      data: { status: 'ACTIVE' },
    })

    return NextResponse.json({ payment }, { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json({ message: 'Failed to create payment', error: String(error) }, { status: 500 })
  }
}
