// Main Store coordinates for delivery fee calculation
const MAIN_STORE_COORDS = {
  latitude: 36.8178547692,
  longitude: 10.1796510816,
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in meters
 */
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Calculate delivery fee based on distance from dropoff location to Main Store
 * Rate: 10 Tunisian Dinar per 500 meters
 */
export function calculateDeliveryFee(
  dropoffLatitude: number,
  dropoffLongitude: number
): number {
  const distanceInMeters = calculateHaversineDistance(
    dropoffLatitude,
    dropoffLongitude,
    MAIN_STORE_COORDS.latitude,
    MAIN_STORE_COORDS.longitude
  )

  // 10 Tunisian Dinar per 500 meters
  const deliveryFee = Math.ceil((distanceInMeters / 500) * 10)
  return deliveryFee
}

/**
 * Get the distance in kilometers from dropoff to Main Store
 */
export function getDeliveryDistance(
  dropoffLatitude: number,
  dropoffLongitude: number
): number {
  const distanceInMeters = calculateHaversineDistance(
    dropoffLatitude,
    dropoffLongitude,
    MAIN_STORE_COORDS.latitude,
    MAIN_STORE_COORDS.longitude
  )
  return distanceInMeters / 1000
}
