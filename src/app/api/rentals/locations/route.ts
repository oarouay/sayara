import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch all rentals with location data
    const rentals = await (prisma.rental as any).findMany({
      select: {
        pickupLocation: true,
        pickupLatitude: true,
        pickupLongitude: true,
        dropoffLocation: true,
        dropoffLatitude: true,
        dropoffLongitude: true,
      },
    })

    // Combine and deduplicate locations (map by name to avoid duplicates)
    const locationsMap = new Map<string, { name: string; latitude?: number; longitude?: number }>()

    rentals.forEach((rental: any) => {
      // Add pickup location
      if (rental.pickupLocation && !locationsMap.has(rental.pickupLocation)) {
        locationsMap.set(rental.pickupLocation, {
          name: rental.pickupLocation,
          latitude: rental.pickupLatitude || undefined,
          longitude: rental.pickupLongitude || undefined,
        })
      }

      // Add dropoff location
      if (rental.dropoffLocation && !locationsMap.has(rental.dropoffLocation)) {
        locationsMap.set(rental.dropoffLocation, {
          name: rental.dropoffLocation,
          latitude: rental.dropoffLatitude || undefined,
          longitude: rental.dropoffLongitude || undefined,
        })
      }
    })

    const locations = Array.from(locationsMap.values())

    return NextResponse.json({ locations })
  } catch (error) {
    console.error('Error fetching rental locations:', error)
    return NextResponse.json({ error: 'Failed to fetch locations', details: String(error) }, { status: 500 })
  }
}