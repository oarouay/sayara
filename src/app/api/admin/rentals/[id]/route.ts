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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await checkAdmin(request)
    if (error) return error

    const { id } = await params

    const rental = await prisma.rental.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    if (!rental) {
      return NextResponse.json({ message: 'Rental not found' }, { status: 404 })
    }

    return NextResponse.json({ rental })
  } catch (error) {
    console.error('Error fetching rental:', error)
    return NextResponse.json({ message: 'Failed to fetch rental', error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await checkAdmin(request)
    if (error) return error

    const { id } = await params
    const body = await request.json()
    const { status, carModel, licensePlate, pickupLocation, dropoffLocation, rentalDate, returnDate, dailyRate, totalCost, insurance } = body

    // Validate status transition if status is being updated
    if (status) {
      const validStatuses = ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']
      if (!validStatuses.includes(status.toUpperCase())) {
        return NextResponse.json(
          { message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Enforce basic allowed transitions to avoid invalid jumps
    if (status) {
      const allowed: Record<string, string[]> = {
        PENDING: ['ACTIVE','CANCELLED'],
        ACTIVE: ['COMPLETED','CANCELLED'],
        COMPLETED: [],
        CANCELLED: [],
      }
      const desired = status.toUpperCase()
      // fetch existing status to validate transition
      const existing = await prisma.rental.findUnique({ where: { id }, select: { status: true } })
      if (existing && desired !== existing.status) {
        const allowedForExisting = allowed[existing.status] || []
        if (!allowedForExisting.includes(desired)) {
          return NextResponse.json({ message: `Invalid status transition from ${existing.status} to ${desired}` }, { status: 400 })
        }
      }
    }

    const updateData: any = {}
    if (status !== undefined) updateData.status = status.toUpperCase()
    if (carModel !== undefined) updateData.carModel = carModel
    if (licensePlate !== undefined) updateData.licensePlate = licensePlate
    if (pickupLocation !== undefined) updateData.pickupLocation = pickupLocation
    if (dropoffLocation !== undefined) updateData.dropoffLocation = dropoffLocation
    if (rentalDate !== undefined) updateData.rentalDate = new Date(rentalDate)
    if (returnDate !== undefined) updateData.returnDate = new Date(returnDate)
    if (dailyRate !== undefined) updateData.dailyRate = dailyRate
    if (totalCost !== undefined) updateData.totalCost = totalCost
    if (insurance !== undefined) updateData.insurance = insurance

    const rental = await prisma.rental.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    return NextResponse.json({ rental })
  } catch (error) {
    console.error('Error updating rental:', error)
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json({ message: 'Rental not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to update rental', error: String(error) }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { error } = await checkAdmin(request)
    if (error) return error

    const { id } = await params

    await prisma.rental.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Rental deleted successfully' })
  } catch (error) {
    console.error('Error deleting rental:', error)
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json({ message: 'Rental not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Failed to delete rental', error: String(error) }, { status: 500 })
  }
}
