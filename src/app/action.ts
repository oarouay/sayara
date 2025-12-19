import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

function sanitize(user: unknown) {
  if (!user) return null
  const { password, ...rest } = user as Record<string, unknown>
  return rest
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, nationality, dateOfBirth, address } = body

    // Validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    if (!name || !phone || !nationality || !dateOfBirth) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, phone, nationality, dateOfBirth' 
      }, { status: 400 })
    }

    console.log('Register attempt for:', { email, name, phone, nationality, dateOfBirth })
    console.log('DATABASE_URL present:', Boolean(process.env.DATABASE_URL))

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Parse date properly
    let parsedDate: Date
    try {
      parsedDate = new Date(dateOfBirth)
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
      }
    } catch (err) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Create user
    let user
    try {
      user = await prisma.user.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: hashed,
          phone: phone.trim(),
          nationality: nationality.trim(),
          dateOfBirth: parsedDate,
          address: address?.trim() || '', // Use empty string if not provided
        },
      })
      console.log('User created successfully:', user.id)
    } catch (dbErr: unknown) {
      console.error('Prisma create error:', dbErr)
      
      // Handle specific Prisma errors
      if ((dbErr as Record<string, unknown>).code === 'P2002') {
        return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
      }
      
      return NextResponse.json({ 
        error: 'Database error: ' + ((dbErr as Record<string, unknown>).message || 'Could not create user') 
      }, { status: 500 })
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    // Set cookie and return response
    const res = NextResponse.json({ 
      success: true,
      user: sanitize(user) 
    })
    
    const cookieValue = `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`
    res.headers.set('Set-Cookie', cookieValue)
    
    return res
    
  } catch (err: unknown) {
    console.error('Register error:', err)
    return NextResponse.json({ 
      error: (err as Error)?.message || 'Internal server error' 
    }, { status: 500 })
  }
}