import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';
import { cookies } from 'next/headers';

const isValidObjectId = (id?: string) => typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);

const extractIdFromUrl = (url: string) => {
  try {
    const pathname = new URL(url).pathname; // e.g. /api/cars/69482b...
    const parts = pathname.split('/').filter(Boolean);
    // find the segment after 'cars'
    const carsIndex = parts.findIndex(p => p === 'cars');
    if (carsIndex >= 0 && parts.length > carsIndex + 1) return parts[carsIndex + 1];
    // otherwise take last segment
    return parts.length > 0 ? parts[parts.length - 1] : undefined;
  } catch (e) {
    return undefined;
  }
}

// sanitize details values into integers or strings
// sanitize details values and preserve numeric precision (use Number instead of rounding)
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
    if (m) return Number(m[0]);
    return s;
  }
  if (typeof value === 'number') return Number(value);
  return value;
};

const sanitizeDetails = (details: any): any => {
  if (!details || typeof details !== 'object') return details;
  const out: Record<string, any> = {};
  for (const k of Object.keys(details)) out[k] = sanitize(details[k]);
  return out;
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('---- /api/cars/[id] GET START ----');
  console.log('Request URL:', request.url);
  const cookieStore = await cookies();
  console.log('Cookies received:', cookieStore.getAll());

  const { id } = await params
  let routeId = id as string | undefined;
  if (!routeId) {
    routeId = extractIdFromUrl(request.url);
    console.warn('GET /api/cars/[id] falling back to URL extraction. extracted id:', routeId, 'params:', params, 'url:', request.url);
  }

  console.log('Resolved route id for GET:', routeId);

  if (!routeId) {
    return NextResponse.json({ error: 'Missing car id', url: request.url, params }, { status: 400 });
  }

  if (!isValidObjectId(routeId)) {
    console.warn('GET /api/cars/[id] called with invalid ObjectId format:', routeId, 'url:', request.url);
    return NextResponse.json({ error: 'Invalid car id format', url: request.url, params }, { status: 400 });
  }

  try {
    const car = await prisma.car.findUnique({
      where: { id: routeId },
      include: {
        details: true,
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    console.log('Fetched car for GET id:', car.id, 'name:', car.name);
    console.log('---- /api/cars/[id] GET END ----');
    return NextResponse.json(car);
  } catch (error) {
    console.error(`Error fetching car ${routeId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch car', message: String(error) },
      { status: 500 }
    );
  }
} 

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('---- /api/cars/[id] PUT START ----');
  console.log('Request URL:', request.url);
  const cookieStore = await cookies();
  console.log('Cookies received for PUT:', cookieStore.getAll());

  const { id } = await params
  let routeId = id as string | undefined;
  if (!routeId) {
    routeId = extractIdFromUrl(request.url);
    console.warn('PUT /api/cars/[id] falling back to URL extraction. extracted id:', routeId, 'params:', params, 'url:', request.url);
  }

  console.log('Resolved route id for PUT:', routeId);

  if (!routeId) {
    return NextResponse.json({ error: 'Missing car id', url: request.url, params }, { status: 400 });
  }

  if (!isValidObjectId(routeId)) {
    console.warn('PUT /api/cars/[id] called with invalid ObjectId format:', routeId, 'url:', request.url);
    return NextResponse.json({ error: 'Invalid car id format', url: request.url, params }, { status: 400 });
  }

  try {
    // Auth: require admin for updates
    const authUser = await getUserFromToken();
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    // Ensure the car exists so we can return 404 rather than a generic Prisma update error
    const existing = await prisma.car.findUnique({ where: { id: routeId } });
    if (!existing) return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    console.log('Existing car before update:', { id: existing.id, name: existing.name });

    const data = await request.json();
    console.log('PUT raw data:', JSON.stringify(data));
    const { details, ...carData } = data;

    console.log('PUT carData:', JSON.stringify(carData));
    console.log('PUT details:', JSON.stringify(details));

    if (details !== null && details && typeof details !== 'object') {
      return NextResponse.json({ error: 'Invalid details format' }, { status: 400 });
    }

    const sanitizedDetails = details === null ? null : (details ? sanitizeDetails(details) : undefined);
    console.log('Sanitized details for PUT:', JSON.stringify(sanitizedDetails));

    // Only allow updating explicit fields to avoid accidental writes of id/createdAt
    const updatable: any = {};
    const fields = ['maker','name','type','logo','image','monthly','mileage','insuranceCost','price','leasingTerm','leasingMileageLimit'];
    for (const f of fields) {
      if (carData[f] !== undefined) {
        updatable[f] = carData[f];
      }
    }
    console.log('Updatable fields for PUT:', JSON.stringify(updatable));

    // Prepare details payload similar to creation: wrap arbitrary details into keyInfo
    let detailsPayload: any = undefined;
    if (sanitizedDetails === null) {
      detailsPayload = null;
    } else if (sanitizedDetails) {
      const hasKnown = ['keyInfo', 'stats', 'features'].some(k => Object.prototype.hasOwnProperty.call(sanitizedDetails, k));
      detailsPayload = hasKnown ? sanitizedDetails : { keyInfo: sanitizedDetails };
    }
    console.log('Details payload for PUT:', JSON.stringify(detailsPayload));

    const updatedCar = await prisma.car.update({
      where: { id: routeId },
      data: {
        ...updatable,
        ...(detailsPayload === null
          ? { details: { delete: true } }
          : detailsPayload
          ? {
              details: {
                upsert: {
                  create: detailsPayload,
                  update: detailsPayload,
                },
              },
            }
          : {}),
      },
      include: { details: true },
    });

    console.log('---- /api/cars/[id] PUT END ----');
    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error(`Error updating car ${routeId}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: 'Prisma error', message: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update car', message: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('---- /api/cars/[id] DELETE START ----');
  console.log('Request URL:', request.url);
  const cookieStore = await cookies();
  console.log('Cookies received for DELETE:', cookieStore.getAll());

  const { id } = await params
  let routeId = id as string | undefined;
  if (!routeId) {
    routeId = extractIdFromUrl(request.url);
    console.warn('DELETE /api/cars/[id] falling back to URL extraction. extracted id:', routeId, 'params:', params, 'url:', request.url);
  }

  console.log('Resolved route id for DELETE:', routeId);

  if (!routeId) {
    return NextResponse.json({ error: 'Missing car id', url: request.url, params }, { status: 400 });
  }

  if (!isValidObjectId(routeId)) {
    console.warn('DELETE /api/cars/[id] called with invalid ObjectId format:', routeId, 'url:', request.url);
    return NextResponse.json({ error: 'Invalid car id format', url: request.url, params }, { status: 400 });
  }

  try {
    // Auth: require admin for deletes
    const authUser = await getUserFromToken();
    if (!authUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: authUser.id } });
    if (!user || user.role !== 'ADMIN') return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

    const existing = await prisma.car.findUnique({ where: { id: routeId } });
    if (!existing) return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    console.log('Existing car before DELETE:', { id: existing.id, name: existing.name });

    // Delete related details first to be safe
    await prisma.carDetails.deleteMany({ where: { carId: routeId } });

    await prisma.car.delete({ where: { id: routeId } });

    console.log('---- /api/cars/[id] DELETE END ----');
    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Error deleting car ${routeId}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete car', message: String(error) },
      { status: 500 }
    );
  }
}