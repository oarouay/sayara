import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in environment. Using fallback dev-secret.')
}

function sanitize(user: { password: string; [key: string]: unknown } | null) {
  if (!user) return null
  const { password, ...rest } = user
  return rest
}

export async function POST(req: Request) {
  console.log('Login request received');
  try {
    const body = await req.json();
    console.log('Request body parsed:', body);
    const { email, password } = body;

    if (!email || !password) {
      console.log('Missing credentials');
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    console.log(`Searching for user with email: ${email}`);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log('User found');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log('Password comparison failed');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log('Password comparison successful');

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    console.log('JWT signed with userId:', user.id);

    const res = NextResponse.json({ user: sanitize(user) });
    
    // Use Next.js cookies API to set the cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    console.log('Login successful, cookie set');
    return res;
  } catch (err) {
    console.error('An error occurred in the login route:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
