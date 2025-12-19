import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  console.log("---- /api/profile DEBUG START ----")

  // ✅ 1. Check what cookies are actually received
  const cookieStore = await cookies()
  console.log("Cookies received:", cookieStore.getAll())

  // ✅ 2. Check what getUserFromToken() returns
  const authUser = await getUserFromToken()
  console.log("Decoded authUser:", authUser)

  if (!authUser) {
    console.log("❌ No authUser → returning 401")
    console.log("---- /api/profile DEBUG END ----")
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // ✅ 3. Check the ID being used in Prisma
  console.log("Looking up user with ID:", authUser.id)

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    include: {
      payments: true,
      rentals: true,
    },
  })

  console.log("Prisma user result:", user)
  console.log("---- /api/profile DEBUG END ----")

  return NextResponse.json({ user })
}