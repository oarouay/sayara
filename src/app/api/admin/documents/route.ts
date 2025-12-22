import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"

export async function GET() {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden - Admin only" }, { status: 403 })
    }

    // Get all users with pending or verified documents
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { driverLicenseDocument: { not: null } },
          { idDocumentContent: { not: null } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        driverLicenseDocument: true,
        driverLicenseVerified: true,
        driverLicenseNumber: true,
        idDocumentContent: true,
        idDocumentVerified: true,
        idDocumentNumber: true,
        createdAt: true,
      }
    })

    // Transform to document format for frontend
    const documents = users.flatMap(user => {
      const docs = []
      
      if (user.driverLicenseDocument) {
        docs.push({
          id: `${user.id}-license`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          type: 'license' as const,
          url: user.driverLicenseDocument,
          verified: user.driverLicenseVerified,
          licenseNumber: user.driverLicenseNumber,
          submittedAt: user.createdAt,
        })
      }

      if (user.idDocumentContent) {
        docs.push({
          id: `${user.id}-nationalId`,
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          type: 'nationalId' as const,
          url: user.idDocumentContent,
          verified: user.idDocumentVerified,
          idNumber: user.idDocumentNumber,
          submittedAt: user.createdAt,
        })
      }

      return docs
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ message: "Failed to fetch documents", error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: { role: true }
    })

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden - Admin only" }, { status: 403 })
    }

    const { userId, docType, licenseNumber, idNumber, verified } = await request.json()

    if (!userId || !docType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const updateData: any = {}

    if (docType === 'license') {
      if (licenseNumber !== undefined) {
        updateData.driverLicenseNumber = licenseNumber
      }
      if (verified !== undefined) {
        updateData.driverLicenseVerified = verified
      }
    } else if (docType === 'id') {
      if (idNumber !== undefined) {
        updateData.idDocumentNumber = idNumber
      }
      if (verified !== undefined) {
        updateData.idDocumentVerified = verified
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        driverLicenseNumber: true,
        driverLicenseVerified: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating document verification:", error)
    return NextResponse.json({ message: "Failed to update document", error: String(error) }, { status: 500 })
  }
}
