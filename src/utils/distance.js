/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in miles
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert miles to kilometers
 */
export function milesToKm(miles) {
  return miles * 1.60934;
}

/**
 * Convert kilometers to miles
 */
export function kmToMiles(km) {
  return km / 1.60934;
}

/**
 * Estimate walking time in minutes based on distance in miles
 * Average walking speed: 3 mph
 */
export function estimateWalkingTime(distanceMiles) {
  const walkingSpeedMph = 3;
  return (distanceMiles / walkingSpeedMph) * 60;
}

/**
 * Estimate subway time based on number of stops
 * Average: 2 minutes per stop + 3 minutes waiting
 */
export function estimateSubwayTime(numStops) {
  return numStops * 2 + 3;
}

/**
 * Calculate the center point of multiple coordinates
 */
export function calculateCenter(coordinates) {
  if (!coordinates || coordinates.length === 0) {
    return { lat: 40.7589, lng: -73.9851 }; // Default to Times Square
  }

  const sumLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0);
  const sumLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0);

  return {
    lat: sumLat / coordinates.length,
    lng: sumLng / coordinates.length
  };
}
