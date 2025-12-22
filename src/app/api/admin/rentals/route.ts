import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

// Helper to check admin role
async function checkAdmin(request: Request) {
  const authUser = await getUserFromToken()
  if (!authUser) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }), isAdmin: false }
  }

  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  if (!user || user.role !== 'ADMIN') {
    return { error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }), isAdmin: false }
  }

  return { error: null, isAdmin: true }
}

export async function GET(request: Request) {
  try {
    const { error } = await checkAdmin(request)
    if (error) return error

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const userId = searchParams.get('userId')

    let where: any = {}
    if (status) where.status = status.toUpperCase()
    if (userId) where.userId = userId

    const rentals = await prisma.rental.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { rentalDate: 'desc' },
    })

    return NextResponse.json({ rentals })
  } catch (error) {
    console.error('Error fetching rentals:', error)
    return NextResponse.json({ message: 'Failed to fetch rentals', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await checkAdmin(request)
    if (error) return error

    const body = await request.json()
    const {
      userId,
      carId,
      carModel,
      licensePlate,
      pickupLocation,
      dropoffLocation,
      rentalDate,
      returnDate,
      dailyRate,
      totalCost,
      insurance,
      status,
    } = body

    if (!userId || !carId || !rentalDate || !returnDate || !dailyRate) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    const rental = await prisma.rental.create({
      data: {
        userId,
        carId,
        carModel: carModel || '',
        licensePlate: licensePlate || '',
        pickupLocation: pickupLocation || '',
        dropoffLocation: dropoffLocation || '',
        rentalDate: new Date(rentalDate),
        returnDate: new Date(returnDate),
        dailyRate,
        totalCost: totalCost || 0,
        insurance: insurance || false,
        status: status || 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    return NextResponse.json({ rental }, { status: 201 })
  } catch (error) {
    console.error('Error creating rental:', error)
    return NextResponse.json({ message: 'Failed to create rental', error: String(error) }, { status: 500 })
  }
}
