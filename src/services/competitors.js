import axios from 'axios';
import { API_CONFIG, COMPETITORS } from '../utils/constants';

/**
 * Fetch competitor coffee shops near a location using Overpass API
 */
export async function fetchCompetitorsNearLocation(lat, lng, radiusMeters = 500) {
  try {
    // Build Overpass QL query
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="cafe"]["brand"="Starbucks"](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"]["name"~"Starbucks",i](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"]["name"~"Luckin",i](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"]["name"~"Blank Street",i](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"]["name"~"Dunkin",i](around:${radiusMeters},${lat},${lng});
        node["amenity"="cafe"]["brand"="Dunkin'"](around:${radiusMeters},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await axios.post(
      API_CONFIG.OVERPASS_BASE_URL,
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.elements) {
      return response.data.elements
        .filter(element => element.type === 'node' && element.lat && element.lon)
        .map(element => ({
          id: element.id,
          name: element.tags?.name || element.tags?.brand || 'Unknown Cafe',
          brand: detectBrand(element.tags),
          coordinates: {
            lat: element.lat,
            lng: element.lon
          },
          address: element.tags?.['addr:street'] || '',
          tags: element.tags
        }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching competitors from Overpass:', error);
    // Return mock data as fallback
    return getMockCompetitors(lat, lng, radiusMeters);
  }
}

/**
 * Fetch competitors for multiple locations
 */
export async function fetchCompetitorsForStores(stores, radiusMeters = 500) {
  const allCompetitors = new Map();

  for (const store of stores) {
    try {
      // Add delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 500));

      const competitors = await fetchCompetitorsNearLocation(
        store.coordinates.lat,
        store.coordinates.lng,
        radiusMeters
      );

      // Deduplicate competitors by ID
      competitors.forEach(competitor => {
        if (!allCompetitors.has(competitor.id)) {
          allCompetitors.set(competitor.id, {
            ...competitor,
            nearStores: [store.id]
          });
        } else {
          const existing = allCompetitors.get(competitor.id);
          existing.nearStores.push(store.id);
        }
      });
    } catch (error) {
      console.error(`Error fetching competitors for store ${store.id}:`, error);
    }
  }

  return Array.from(allCompetitors.values());
}

/**
 * Detect brand from OSM tags
 */
function detectBrand(tags) {
  if (!tags) return 'UNKNOWN';

  const name = (tags.name || '').toLowerCase();
  const brand = (tags.brand || '').toLowerCase();

  if (brand.includes('starbucks') || name.includes('starbucks')) {
    return 'STARBUCKS';
  }
  if (brand.includes('luckin') || name.includes('luckin')) {
    return 'LUCKIN';
  }
  if (brand.includes('blank street') || name.includes('blank street')) {
    return 'BLANK_STREET';
  }
  if (brand.includes('dunkin') || name.includes('dunkin')) {
    return 'DUNKIN';
  }

  return 'OTHER';
}

/**
 * Get mock competitor data as fallback
 */
function getMockCompetitors(centerLat, centerLng, radiusMeters) {
  // Generate some realistic NYC coffee shop locations
  const mockData = [
    {
      id: 'mock-1',
      name: 'Starbucks',
      brand: 'STARBUCKS',
      coordinates: {
        lat: centerLat + 0.002,
        lng: centerLng + 0.001
      },
      address: 'Sample Location 1'
    },
    {
      id: 'mock-2',
      name: 'Dunkin\'',
      brand: 'DUNKIN',
      coordinates: {
        lat: centerLat - 0.001,
        lng: centerLng + 0.002
      },
      address: 'Sample Location 2'
    },
    {
      id: 'mock-3',
      name: 'Starbucks',
      brand: 'STARBUCKS',
      coordinates: {
        lat: centerLat + 0.001,
        lng: centerLng - 0.002
      },
      address: 'Sample Location 3'
    },
    {
      id: 'mock-4',
      name: 'Blank Street Coffee',
      brand: 'BLANK_STREET',
      coordinates: {
        lat: centerLat - 0.002,
        lng: centerLng - 0.001
      },
      address: 'Sample Location 4'
    }
  ];

  // Filter to rough radius (very approximate)
  const radiusDegrees = radiusMeters / 111000; // rough conversion
  return mockData.filter(competitor => {
    const distance = Math.sqrt(
      Math.pow(competitor.coordinates.lat - centerLat, 2) +
      Math.pow(competitor.coordinates.lng - centerLng, 2)
    );
    return distance <= radiusDegrees;
  });
}

/**
 * Get brand info (color, icon, etc.)
 */
export function getBrandInfo(brandKey) {
  return COMPETITORS[brandKey] || {
    name: 'Other Cafe',
    color: '#6B7280',
    icon: '☕'
  };
}

/**
 * Calculate competitor density around stores
 */
export function analyzeCompetitorDensity(stores, competitors) {
  const analysis = stores.map(store => {
    const nearby = competitors.filter(comp =>
      comp.nearStores && comp.nearStores.includes(store.id)
    );

    const byBrand = nearby.reduce((acc, comp) => {
      acc[comp.brand] = (acc[comp.brand] || 0) + 1;
      return acc;
    }, {});

    return {
      storeId: store.id,
      storeName: store.name,
      totalCompetitors: nearby.length,
      byBrand,
      competitorsPerSquareMile: calculateDensity(nearby.length, 500) // 500m radius
    };
  });

  return analysis;
}

/**
 * Calculate density per square mile
 */
function calculateDensity(count, radiusMeters) {
  const radiusMiles = radiusMeters / 1609.34;
  const areaSqMiles = Math.PI * radiusMiles * radiusMiles;
  return (count / areaSqMiles).toFixed(2);
}
