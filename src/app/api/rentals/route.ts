import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import { calculateDeliveryFee } from '@/lib/deliveryFee'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const carIdParam = url.searchParams.get('carId')

    // If carId is provided, return rentals for that car (public endpoint)
    if (carIdParam) {
      const rentals = await prisma.rental.findMany({
        where: { carId: String(carIdParam) },
        select: {
          id: true,
          status: true,
          rentalDate: true,
          returnDate: true,
        },
        orderBy: { returnDate: 'desc' }
      })
      return NextResponse.json(rentals)
    }

    // Otherwise, require authentication for user's rentals
    const authUser = await getUserFromToken()
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })

    let rentals: any[] = []
    try {
      if (user.role === 'ADMIN') {
        // Admin: get all rentals
        console.log('🔍 Fetching all rentals for admin...')
        rentals = (await (prisma.rental as any).findMany({
          select: {
            id: true,
            carModel: true,
            rentalDate: true,
            returnDate: true,
            status: true,
            totalCost: true,
            deliveryFee: true,
            pickupLocation: true,
            pickupLatitude: true,
            pickupLongitude: true,
            dropoffLocation: true,
            dropoffLatitude: true,
            dropoffLongitude: true,
            licensePlate: true,
            dailyRate: true,
            insurance: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true, phone: true } },
            car: {
              select: {
                id: true,
                maker: true,
                name: true,
                type: true,
                image: true,
                logo: true,
                price: true,
                monthly: true,
                insuranceCost: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' }
        })) as any
        console.log('✅ Admin rentals fetched:', rentals.length)
      } else {
        // Regular user: get only their rentals
        console.log('🔍 Fetching rentals for user:', authUser.id)
        rentals = (await (prisma.rental as any).findMany({
          where: { userId: authUser.id },
          select: {
            id: true,
            carModel: true,
            rentalDate: true,
            returnDate: true,
            status: true,
            totalCost: true,
            deliveryFee: true,
            pickupLocation: true,
            pickupLatitude: true,
            pickupLongitude: true,
            dropoffLocation: true,
            dropoffLatitude: true,
            dropoffLongitude: true,
            licensePlate: true,
            dailyRate: true,
            insurance: true,
            createdAt: true,
            user: { select: { id: true, name: true, email: true, phone: true } },
            car: {
              select: {
                id: true,
                maker: true,
                name: true,
                type: true,
                image: true,
                logo: true,
                price: true,
                monthly: true,
                insuranceCost: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' }
        })) as any
        console.log('✅ User rentals fetched:', rentals.length)
      }
    } catch (dbError) {
      console.error('❌ Database query error:', dbError)
      throw dbError
    }

    return NextResponse.json({ rentals })
  } catch (error) {
    console.error('❌ Error listing rentals:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ message: 'Failed to list rentals', error: errorMessage }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      console.error('❌ No authenticated user')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('✅ Authenticated user:', authUser.id)

    const body = await request.json()
    const {
      carId,
      carModel,
      rentalDate,
      returnDate,
      pickupLocation,
      pickupLatitude,
      pickupLongitude,
      dropoffLocation,
      dropoffLatitude,
      dropoffLongitude,
      licensePlate,
      dailyRate,
      totalCost,
      insurance,
      paymentMethod
    } = body

    console.log('📝 Rental POST body received:', {
      carId,
      carModel,
      rentalDate,
      returnDate,
      pickupLocation,
      dropoffLocation,
      licensePlate,
      paymentMethod,
      userId: authUser.id,
    })

    if ((!carId && !carModel) || !rentalDate || !returnDate || !pickupLocation || !dropoffLocation || !licensePlate) {
      console.error('❌ Missing required fields:', { carId, carModel, rentalDate, returnDate, pickupLocation, dropoffLocation, licensePlate })
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Validate paymentMethod if provided
    const validPaymentMethods = ['CASH', 'CARD', 'ONLINE']
    if (paymentMethod && !validPaymentMethods.includes(paymentMethod)) {
      console.error('❌ Invalid payment method:', paymentMethod)
      return NextResponse.json({ message: 'Invalid payment method', error: `Must be one of: ${validPaymentMethods.join(', ')}` }, { status: 400 })
    }

    // validate car exists: prefer carId, otherwise try to locate by carModel
    let car = null
    if (carId) {
      car = await prisma.car.findUnique({ where: { id: String(carId) } })
    }
    if (!car && carModel) {
      // try exact match on maker + name (client sends `${maker} ${name}`), or fallback to name
      const parts = String(carModel).split(' ')
      const maybeMaker = parts[0]
      const maybeName = parts.slice(1).join(' ')

      car = await prisma.car.findFirst({ where: { OR: [{ name: carModel }, { name: maybeName, maker: maybeMaker as any }] } })
    }

    if (!car) return NextResponse.json({ message: 'Car not found' }, { status: 404 })

    const start = new Date(rentalDate)
    const end = new Date(returnDate)

    if (isNaN(+start) || isNaN(+end) || end <= start) return NextResponse.json({ message: 'Invalid date range' }, { status: 400 })

    const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24))

    const computedDaily = typeof dailyRate === 'number' ? Number(dailyRate) : (car.monthly ? Number(car.monthly) / 30 : Number(car.price ?? 0) / 30)
    const computedInsuranceDaily = insurance ? (Number(car.insuranceCost ?? 0) / 30) : 0
    
    // Calculate delivery fee if dropoff coordinates are provided
    let computedDeliveryFee = 0
    if (dropoffLatitude && dropoffLongitude) {
      computedDeliveryFee = calculateDeliveryFee(Number(dropoffLatitude), Number(dropoffLongitude))
    }
    
    const computedTotal = typeof totalCost === 'number' ? Number(totalCost) : Number(((computedDaily + computedInsuranceDaily) * days + computedDeliveryFee).toFixed(2))

    // prevent overlapping bookings for same car (PENDING/ACTIVE)
    const overlapping = await prisma.rental.findFirst({
      where: ({
        carId: car.id,
        status: { in: ['PENDING','ACTIVE'] },
        AND: [
          { rentalDate: { lte: end } },
          { returnDate: { gte: start } },
        ],
      } as any),
    })
    if (overlapping) return NextResponse.json({ message: 'Car not available for the selected dates' }, { status: 409 })

    console.log('✅ Creating rental with data:', {
      carId: car.id,
      carModel: carModel || `${car.maker} ${car.name}`,
      userId: authUser.id,
      rentalDate: start,
      returnDate: end,
    })

    try {
      const rental = await prisma.rental.create({
        data: ({
          carId: car.id,
          carModel: carModel || `${car.maker} ${car.name}`,
          licensePlate: String(licensePlate),
          pickupLocation: String(pickupLocation),
          pickupLatitude: pickupLatitude ? Number(pickupLatitude) : undefined,
          pickupLongitude: pickupLongitude ? Number(pickupLongitude) : undefined,
          dropoffLocation: String(dropoffLocation),
          dropoffLatitude: dropoffLatitude ? Number(dropoffLatitude) : undefined,
          dropoffLongitude: dropoffLongitude ? Number(dropoffLongitude) : undefined,
          rentalDate: start,
          returnDate: end,
          dailyRate: Number(computedDaily),
          totalCost: Number(computedTotal),
          deliveryFee: Number(computedDeliveryFee),
          insurance: !!insurance,
          status: 'PENDING',
          userId: authUser.id,
        } as any),
      })

      console.log('✅ Rental created successfully:', rental.id)
      
      // Return a clean response with serialized dates
      return NextResponse.json({
        id: rental.id,
        carId: rental.carId,
        carModel: rental.carModel,
        licensePlate: rental.licensePlate,
        pickupLocation: rental.pickupLocation,
        pickupLatitude: rental.pickupLatitude,
        pickupLongitude: rental.pickupLongitude,
        dropoffLocation: rental.dropoffLocation,
        dropoffLatitude: rental.dropoffLatitude,
        dropoffLongitude: rental.dropoffLongitude,
        rentalDate: rental.rentalDate.toISOString(),
        returnDate: rental.returnDate.toISOString(),
        dailyRate: rental.dailyRate,
        totalCost: rental.totalCost,
        deliveryFee: rental.deliveryFee,
        insurance: rental.insurance,
        status: rental.status,
        userId: rental.userId,
        createdAt: rental.createdAt.toISOString(),
      }, { status: 201 })
    } catch (dbError) {
      console.error('❌ Database error during rental creation:', dbError)
      const dbErrorMsg = dbError instanceof Error ? dbError.message : String(dbError)
      const dbErrorType = dbError instanceof Error ? dbError.constructor.name : typeof dbError
      const dbErrorCode = (dbError as any)?.code
      console.error('❌ Database error message:', dbErrorMsg)
      console.error('❌ Database error type:', dbErrorType)
      if (dbErrorCode) console.error('❌ Database error code:', dbErrorCode)
      console.error('❌ Database error details:', JSON.stringify(dbError, Object.getOwnPropertyNames(dbError as object)))
      
      // Return proper error response instead of re-throwing
      return NextResponse.json({ 
        message: 'Database error during rental creation', 
        error: dbErrorMsg,
        errorType: dbErrorType,
        errorCode: dbErrorCode
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Error creating rental:', error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    const errorType = error instanceof Error ? error.constructor.name : typeof error
    console.error('❌ Error details:', errorMsg)
    console.error('❌ Error type:', errorType)
    console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    
    // Always return proper JSON error response
    try {
      return NextResponse.json({ 
        message: 'Failed to create rental', 
        error: errorMsg,
        errorType: errorType,
        details: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : {}
      }, { status: 500 })
    } catch (responseErr) {
      console.error('❌ Failed to create error response:', responseErr)
      // Fallback error response
      return new NextResponse(JSON.stringify({ 
        message: 'Failed to create rental', 
        error: 'Internal server error'
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}
