import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  console.log('---- /api/cars GET START ----');
  try {
    const cookieStore = await cookies();
    console.log('Cookies received for /api/cars GET:', cookieStore.getAll());

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Basic filters from query parameters
    const where: any = {};
    const maker = searchParams.get('maker');
    const type = searchParams.get('type');
    const availability = searchParams.get('availability');
    const location = searchParams.get('location') || null;
    const minPriceParam = searchParams.get('minPrice')
    const maxPriceParam = searchParams.get('maxPrice')

    if (maker && maker !== 'all') where.maker = maker;
    if (type && type !== 'all') where.type = type;

    // monthly price range filter (from SearchForm)
    if (minPriceParam || maxPriceParam) {
      const minP = minPriceParam ? Number(minPriceParam) : undefined
      const maxP = maxPriceParam ? Number(maxPriceParam) : undefined
      const monthlyFilter: any = {}
      if (!isNaN(Number(minP)) && minP !== undefined) monthlyFilter.gte = minP
      if (!isNaN(Number(maxP)) && maxP !== undefined) monthlyFilter.lte = maxP
      if (Object.keys(monthlyFilter).length > 0) where.monthly = monthlyFilter
    }

    // We'll handle availability filtering below by checking rentals
    // availability may be 'AVAILABLE' or 'UNAVAILABLE' (maps to rental statuses)
    // if location query provided, we'll filter cars that have rentals with that pickup location (simple heuristic)

    // First get matching cars (details only)
    const cars = await prisma.car.findMany({
      where,
      include: { details: true },
    });

    // If availability filter was requested, compute it from rentals
    const av = availability ? String(availability).toUpperCase() : null;

    // get rental records for these cars (if needed) to compute availability
    let availabilityMap: Record<string,string> = {};
    let filteredByLocationCarIds: string[] | null = null;

    if (location) {
      // find rentals that have this pickupLocation and take their carIds
      const locRows = await prisma.rental.findMany({ where: { pickupLocation: String(location) }, select: { carId: true } })
      filteredByLocationCarIds = Array.from(new Set(locRows.map(r => r.carId).filter((v): v is string => Boolean(v))))
    }

    // determine date window to check availability (optional pickupDate/dropoffDate query params)
    const pickupParam = searchParams.get('pickupDate');
    const dropoffParam = searchParams.get('dropoffDate');
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    if (pickupParam) {
      const d = new Date(pickupParam);
      if (!isNaN(d.getTime())) startDate = d;
    }
    if (dropoffParam) {
      const d = new Date(dropoffParam);
      if (!isNaN(d.getTime())) endDate = d;
    }
    if (!startDate || !endDate) {
      const today = new Date();
      const s = new Date(today); s.setHours(0,0,0,0);
      const e = new Date(today); e.setHours(23,59,59,999);
      if (!startDate) startDate = s;
      if (!endDate) endDate = e;
    }

    if (av || cars.length > 0 || filteredByLocationCarIds) {
      const carIds = cars.map(c => c.id);
      const rentals = await prisma.rental.findMany({
        where: {
          carId: { in: carIds },
          OR: [
            { status: 'ACTIVE' },
            {
              AND: [
                { status: 'PENDING' },
                { rentalDate: { lte: endDate } },
                { returnDate: { gte: startDate } },
              ],
            },
          ],
        },
        select: { carId: true, status: true, rentalDate: true, returnDate: true },
      });

      // build map: for each car, highest-priority status (ACTIVE > PENDING > otherwise)
      const map: Record<string,string[]> = {};
      for (const r of rentals) {
        const id = r.carId;
        if (!id) continue;
        if (!map[id]) map[id] = [];
        map[id].push(r.status);
      }
      for (const c of cars) {
        const sts = map[c.id] || [];
        if (sts.includes('ACTIVE')) availabilityMap[c.id] = 'RENTED';
        else if (sts.includes('PENDING')) availabilityMap[c.id] = 'UNAVAILABLE';
        else availabilityMap[c.id] = 'AVAILABLE';
      }
    }

    // If a filter was requested, filter the cars array by computed availability and optional location
    let filteredCars = cars;
    if (av) {
      if (av === 'AVAILABLE') filteredCars = cars.filter(c => availabilityMap[c.id] === 'AVAILABLE');
      else if (av === 'UNAVAILABLE' || av === 'RENTED') filteredCars = cars.filter(c => availabilityMap[c.id] === 'UNAVAILABLE' || availabilityMap[c.id] === 'RENTED');
    }

    if (filteredByLocationCarIds) {
      filteredCars = filteredCars.filter(c => filteredByLocationCarIds!.includes(c.id));
    }

    // attach availability property to each car returned
    const carsWithAvailability = filteredCars.map(c => ({ ...c, availability: availabilityMap[c.id] || 'AVAILABLE' }));

    // Derive available makers and types (full set, not just filtered)
    const all = await prisma.car.findMany({ select: { maker: true, type: true } });
    const makers = Array.from(new Set(all.map(a => a.maker))).filter(Boolean);
    const types = Array.from(new Set(all.map(a => a.type))).filter(Boolean);

    console.log('---- /api/cars GET END ----');

    return NextResponse.json({ cars: carsWithAvailability, makers, types });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars', message: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('---- /api/cars POST START ----');
  try {
    // Auth: require admin
    const authUser = await getUserFromToken();
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const { details, ...carData } = await request.json();

    // ignore availability from client; availability is computed from rentals
    if (carData.availability) delete carData.availability;

    const sanitize = (value: any): any => {
      if (value === null || value === undefined) return value;
      if (Array.isArray(value)) return value.map((v: any) => sanitize(v));
      if (typeof value === 'object') {
        const out: Record<string, any> = {};
        for (const k of Object.keys(value)) out[k] = sanitize((value as Record<string, any>)[k]);
        return out;
      }
      if (typeof value === 'string') {
        const s = value.trim();
        const m = s.match(/-?\d+(?:\.\d+)?/);
        if (m) return Math.round(Number(m[0]));
        return s;
      }
      if (typeof value === 'number') return Math.round(value);
      return value;
    };

    const sanitizeDetails = (details: any): any => {
      if (!details || typeof details !== 'object') return details;
      const out: Record<string, any> = {};
      for (const k of Object.keys(details)) out[k] = sanitize(details[k]);
      return out;
    };

    const sanitizedDetails = details ? sanitizeDetails(details) : undefined;

    const newCar = await prisma.car.create({
      data: {
        ...carData,
        details: sanitizedDetails ? { create: sanitizedDetails } : undefined,
      },
      include: {
        details: true,
      },
    });

    console.log('---- /api/cars POST END ----');
    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json(
      { error: 'Failed to create car', message: String(error) },
      { status: 500 }
    );
  }
}