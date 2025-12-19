import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

function sanitize(user: { password: string; [key: string]: string | number | boolean | Date | null } | null) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone, nationality, dateOfBirth, address } = body

    if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

    // Log non-sensitive incoming data for debugging
    console.log('Register attempt for:', { email, name, phone, nationality, dateOfBirth })
    console.log('DATABASE_URL present:', Boolean(process.env.DATABASE_URL))

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'User exists' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 10)

    let user
    try {
      user = await prisma.user.create({
        data: {
          name: name || '',
          email,
          password: hashed,
          phone: phone || '',
          nationality: nationality || '',
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
          address: address || '',
        },
      })
    } catch (dbErr) {
      console.error('Prisma create error:', dbErr)
      throw dbErr
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' })

    const res = NextResponse.json({ user: sanitize(user) })
    res.headers.set('Set-Cookie', `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`)
    return res
  } catch (err) {
    // Log error for debugging
    console.error('Register error:', err)
    const message = (err as Error)?.message || 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
