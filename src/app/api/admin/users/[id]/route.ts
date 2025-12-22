import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

// Helper to check admin role
async function checkAdmin() {
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await checkAdmin()
    if (error) return error

    const { id: userId } = await params
    if (!userId) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        nationality: true,
        dateOfBirth: true,
        driverLicenseNumber: true,
        driverLicenseVerified: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ message: 'Failed to fetch user', error: String(error) }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await checkAdmin()
    if (error) return error

    const { id: userId } = await params
    if (!userId) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, email, phone, address, nationality, dateOfBirth, driverLicenseNumber, driverLicenseVerified, idDocumentNumber, idDocumentVerified } = body

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(nationality && { nationality }),
        ...(dateOfBirth && { dateOfBirth: new Date(dateOfBirth) }),
        ...(driverLicenseNumber && { driverLicenseNumber }),
        ...(typeof driverLicenseVerified === 'boolean' && { driverLicenseVerified }),
        ...(idDocumentNumber && { idDocumentNumber }),
        ...(typeof idDocumentVerified === 'boolean' && { idDocumentVerified }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        nationality: true,
        dateOfBirth: true,
        driverLicenseNumber: true,
        driverLicenseVerified: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: 'Failed to update user', error: String(error) }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error } = await checkAdmin()
    if (error) return error

    const { id: userId } = await params
    if (!userId) {
      return NextResponse.json({ message: 'Missing user ID' }, { status: 400 })
    }

    // Delete associated rentals and payments first
    await prisma.rental.deleteMany({ where: { userId } })
    await prisma.payment.deleteMany({ where: { userId } })

    const user = await prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: 'Failed to delete user', error: String(error) }, { status: 500 })
  }
}
