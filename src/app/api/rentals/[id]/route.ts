import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'

const isValidObjectId = (id?: string) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) return NextResponse.json({ message: 'Missing rental id' }, { status: 400 })
  if (!isValidObjectId(id)) return NextResponse.json({ message: 'Invalid rental id' }, { status: 400 })

  const rental = await prisma.rental.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      car: true,
    },
  })
  if (!rental) return NextResponse.json({ message: 'Rental not found' }, { status: 404 })

  return NextResponse.json(rental)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!id) return NextResponse.json({ message: 'Missing rental id' }, { status: 400 })
  if (!isValidObjectId(id)) return NextResponse.json({ message: 'Invalid rental id' }, { status: 400 })

  const authUser = await getUserFromToken()
  if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const rental = await prisma.rental.findUnique({ where: { id } })
  if (!rental) return NextResponse.json({ message: 'Rental not found' }, { status: 404 })

  const body = await request.json().catch(() => ({}))
  const { status, pickupLocation, dropoffLocation, licensePlate, rentalDate, returnDate } = body

  // role check
  const user = await prisma.user.findUnique({ where: { id: authUser.id } })
  const isAdmin = user?.role === 'ADMIN'

  // Non-admin users may only cancel their own pending bookings
  if (!isAdmin) {
    if (rental.userId !== authUser.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    if (status && status !== 'CANCELLED') {
      return NextResponse.json({ message: 'Users may only cancel bookings' }, { status: 403 })
    }
    if (status === 'CANCELLED' && rental.status !== 'PENDING') {
      return NextResponse.json({ message: 'Only pending bookings can be cancelled' }, { status: 400 })
    }
  }

  const updates: any = {}
  if (status) {
    if (isAdmin) {
      const allowed = ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']
      if (!allowed.includes(status)) return NextResponse.json({ message: 'Invalid status' }, { status: 400 })
      updates.status = status
    } else if (status === 'CANCELLED' && rental.status === 'PENDING') {
      updates.status = status
    }
  }

  // allow both admin and owner to update contact fields while pending
  if (pickupLocation && rental.status === 'PENDING') updates.pickupLocation = String(pickupLocation)
  if (dropoffLocation && rental.status === 'PENDING') updates.dropoffLocation = String(dropoffLocation)
  if (licensePlate && rental.status === 'PENDING') updates.licensePlate = String(licensePlate)

  if ((rentalDate || returnDate) && rental.status === 'PENDING') {
    const start = rentalDate ? new Date(rentalDate) : rental.rentalDate
    const end = returnDate ? new Date(returnDate) : rental.returnDate
    if (isNaN(+start) || isNaN(+end) || end <= start) return NextResponse.json({ message: 'Invalid date range' }, { status: 400 })
    updates.rentalDate = start
    updates.returnDate = end

    // recompute totals conservatively if dates changed
    const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24))
    const dailyRate = rental.dailyRate
    const insuranceDaily = rental.insurance ? (Number(rental.dailyRate || 0) * 0) : 0 // keep same daily/insurance policy as existing
    updates.totalCost = Number(((dailyRate + insuranceDaily) * days).toFixed(2))
  }

  if (Object.keys(updates).length === 0) return NextResponse.json({ message: 'No updates provided or not allowed' }, { status: 400 })

  const updated = await prisma.rental.update({ where: { id }, data: updates })
  return NextResponse.json(updated)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: routeId } = await params
    if (!routeId) return NextResponse.json({ message: 'Missing rental id' }, { status: 400 })
    if (!isValidObjectId(routeId)) return NextResponse.json({ message: 'Invalid rental id' }, { status: 400 })

    const authUser = await getUserFromToken()
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    const user = await prisma.user.findUnique({ where: { id: authUser.id } })
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

    const rental = await prisma.rental.findUnique({ where: { id: routeId } })
    if (!rental) return NextResponse.json({ message: 'Rental not found' }, { status: 404 })

    await prisma.rental.delete({ where: { id: routeId } })
    return NextResponse.json({ message: 'Deleted' }, { status: 204 })
  } catch (error) {
    console.error('Error deleting rental:', error)
    return NextResponse.json({ message: 'Failed to delete rental', error: String(error) }, { status: 500 })
  }
}
