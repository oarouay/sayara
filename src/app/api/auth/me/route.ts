import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string, id?: string }
      
      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId || decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          // Don't send password
        }
      })

      if (!user) {
        return NextResponse.json({ user: null }, { status: 401 })
      }

      return NextResponse.json({ user })
    } catch (verifyError) {
      console.error('JWT verification failed:', verifyError)
      return NextResponse.json({ user: null }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}