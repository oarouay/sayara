// lib/auth.ts
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export async function getUserFromToken() {
  console.log("🔍 ---- getUserFromToken START ----")
  
  try {
    const cookieStore = await cookies()
    const allCookies = cookieStore.getAll()
    
    console.log("🍪 All cookies:", allCookies.map(c => ({
      name: c.name,
      hasValue: !!c.value,
      valueLength: c.value?.length || 0
    })))
    
    // ✅ FIX: Look for "token" instead of "auth-token"
    const token = cookieStore.get("token")?.value
    
    if (!token) {
      console.log("❌ No 'token' cookie found")
      console.log("🔍 ---- getUserFromToken END (no token) ----")
      return null
    }
    
    console.log("✅ Token found, length:", token.length)
    
    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not defined in environment!")
      console.log("🔍 ---- getUserFromToken END (no secret) ----")
      return null
    }
    
    console.log("✅ JWT_SECRET exists")
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId?: string  // ✅ FIX: Your JWT uses "userId" not "id"
      id?: string
      email?: string
      iat?: number
      exp?: number
    }
    
    console.log("✅ Token verified successfully:", {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
      iat: decoded.iat ? new Date(decoded.iat * 1000).toISOString() : 'N/A',
      exp: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : 'N/A'
    })
    
    console.log("🔍 ---- getUserFromToken END (success) ----")
    
    // ✅ FIX: Return with "id" field mapped from "userId"
    return {
      id: decoded.userId || decoded.id || '',
      email: decoded.email || ''
    }
    
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("❌ JWT verification failed:", error.message)
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("❌ JWT token expired:", error.message)
    } else {
      console.error("❌ Unexpected error:", error)
    }
    
    console.log("🔍 ---- getUserFromToken END (error) ----")
    return null
  }
}