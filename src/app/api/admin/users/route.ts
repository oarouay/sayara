import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getUserFromToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

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

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        nationality: true,
        driverLicenseNumber: true,
        driverLicenseVerified: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'Failed to fetch users', error: String(error) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { error } = await checkAdmin(request)
    if (error) return error

    const body = await request.json()
    const { name, email, phone, address, nationality, dateOfBirth, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || '',
        address: address || '',
        nationality: nationality || 'Unknown',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
        password: hashedPassword,
        role: 'USER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        nationality: true,
        driverLicenseNumber: true,
        driverLicenseVerified: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ message: 'Failed to create user', error: String(error) }, { status: 500 })
  }
}
