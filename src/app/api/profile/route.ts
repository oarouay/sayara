import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getUserFromToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET() {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
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
        driverLicenseDocument: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
        idDocumentContent: true,
        paymentMethod: true,
        cardHolderName: true,
        cardNumber: true,
        cardExpiryDate: true,
        cardBrand: true,
        billingAddress: true,
        role: true,
        createdAt: true,
        rentals: {
          select: {
            id: true,
            carModel: true,
            licensePlate: true,
            pickupLocation: true,
            dropoffLocation: true,
            rentalDate: true,
            returnDate: true,
            totalCost: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' as const },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paymentMethod: true,
            status: true,
            paymentDate: true,
            cardLast4: true,
            cardBrand: true,
            createdAt: true,
            rental: {
              select: {
                id: true,
                carModel: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' as const },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ message: "Failed to fetch profile", error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const authUser = await getUserFromToken()
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      email,
      phone,
      address,
      nationality,
      dateOfBirth,
      driverLicenseNumber,
      idDocumentNumber,
      cardHolderName,
      cardNumber,
      cardExpiryDate,
      cardBrand,
      billingAddress,
      paymentMethod,
      driverLicenseDocument,
      idDocumentContent,
    } = body

    // Build update data object - check if field exists in body, not if it's truthy
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (address !== undefined) updateData.address = address
    if (nationality !== undefined) updateData.nationality = nationality
    if (dateOfBirth !== undefined) updateData.dateOfBirth = new Date(dateOfBirth)
    if (driverLicenseNumber !== undefined) updateData.driverLicenseNumber = driverLicenseNumber
    if (driverLicenseDocument !== undefined) updateData.driverLicenseDocument = driverLicenseDocument
    if (idDocumentNumber !== undefined) updateData.idDocumentNumber = idDocumentNumber
    if (idDocumentContent !== undefined) updateData.idDocumentContent = idDocumentContent
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    if (cardHolderName !== undefined) updateData.cardHolderName = cardHolderName
    if (cardNumber !== undefined) updateData.cardNumber = cardNumber
    if (cardExpiryDate !== undefined) updateData.cardExpiryDate = cardExpiryDate
    if (cardBrand !== undefined) updateData.cardBrand = cardBrand
    if (billingAddress !== undefined) updateData.billingAddress = billingAddress

    const user = await prisma.user.update({
      where: { id: authUser.id },
      data: updateData,
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
        driverLicenseDocument: true,
        idDocumentNumber: true,
        idDocumentVerified: true,
        idDocumentContent: true,
        paymentMethod: true,
        cardHolderName: true,
        cardNumber: true,
        cardExpiryDate: true,
        cardBrand: true,
        billingAddress: true,
        role: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ user, message: "Profile updated successfully" })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ message: "Failed to update profile", error: String(error) }, { status: 500 })
  }
}
