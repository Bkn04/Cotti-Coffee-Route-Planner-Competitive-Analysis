/**
 * Heatmap service for foot traffic visualization
 * Uses POI density + simulated traffic data as MVP
 */

import { calculateDistance } from '../utils/distance';

/**
 * Time-based traffic multipliers
 */
const TRAFFIC_MULTIPLIERS = {
  WEEKDAY: {
    '00-06': 0.2,  // Late night
    '06-09': 0.8,  // Morning rush
    '09-12': 0.6,  // Mid-morning
    '12-14': 0.9,  // Lunch rush
    '14-17': 0.7,  // Afternoon
    '17-20': 0.9,  // Evening rush
    '20-24': 0.5   // Evening
  },
  WEEKEND: {
    '00-06': 0.1,
    '06-09': 0.3,
    '09-12': 0.7,
    '12-14': 0.9,
    '14-17': 0.95, // Weekend peak
    '17-20': 0.8,
    '20-24': 0.6
  }
};

/**
 * Category traffic weights
 */
const CATEGORY_WEIGHTS = {
  SHOPPING: 1.5,
  TRANSPORT: 2.0,
  OFFICE: 1.3,
  EDUCATION: 1.2,
  FOOD: 1.4,
  ENTERTAINMENT: 1.1,
  PARK: 0.8,
  RESIDENTIAL: 0.6
};

/**
 * Generate heatmap data points around a location
 */
export function generateHeatmapData(centerLat, centerLng, pois = [], radiusMeters = 500) {
  const heatmapPoints = [];
  const gridSize = 10; // 10x10 grid
  const radiusMiles = radiusMeters / 1609.34;
  const step = (radiusMiles * 2) / gridSize;

  // Get current time multiplier
  const timeMultiplier = getCurrentTimeMultiplier();

  // Generate grid points
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const latOffset = (i - gridSize / 2) * step / 69; // ~69 miles per degree latitude
      const lngOffset = (j - gridSize / 2) * step / 54.6; // ~54.6 miles per degree longitude at NYC

      const pointLat = centerLat + latOffset;
      const pointLng = centerLng + lngOffset;

      // Calculate intensity based on nearby POIs
      const intensity = calculatePointIntensity(pointLat, pointLng, pois, radiusMeters) * timeMultiplier;

      if (intensity > 0) {
        heatmapPoints.push({
          lat: pointLat,
          lng: pointLng,
          intensity
        });
      }
    }
  }

  return heatmapPoints;
}

/**
 * Calculate intensity at a specific point based on nearby POIs
 */
function calculatePointIntensity(lat, lng, pois, maxDistance) {
  let totalIntensity = 0;

  pois.forEach(poi => {
    const distance = calculateDistance(
      lat, lng,
      poi.coordinates.lat, poi.coordinates.lng
    );

    if (distance <= maxDistance / 1609.34) { // Convert meters to miles
      // Intensity decreases with distance (inverse square law)
      const weight = CATEGORY_WEIGHTS[poi.category] || 1.0;
      const distanceFactor = Math.max(0, 1 - (distance / (maxDistance / 1609.34)));
      totalIntensity += weight * distanceFactor * distanceFactor;
    }
  });

  // Normalize to 0-1 range
  return Math.min(1, totalIntensity / 5);
}

/**
 * Get traffic multiplier for current time
 */
function getCurrentTimeMultiplier() {
  const now = new Date();
  const hour = now.getHours();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  const multipliers = isWeekend ? TRAFFIC_MULTIPLIERS.WEEKEND : TRAFFIC_MULTIPLIERS.WEEKDAY;

  // Find matching time range
  for (const [range, multiplier] of Object.entries(multipliers)) {
    const [start, end] = range.split('-').map(Number);
    if (hour >= start && hour < end) {
      return multiplier;
    }
  }

  return 0.5; // Default
}

/**
 * Calculate foot traffic score (0-100)
 */
export function calculateFootTrafficScore(pois, centerLat, centerLng) {
  if (!pois || pois.length === 0) return 0;

  let score = 0;

  // POI count contribution (max 40 points)
  const poiScore = Math.min(40, pois.length * 2);
  score += poiScore;

  // Category diversity (max 20 points)
  const uniqueCategories = new Set(pois.map(p => p.category)).size;
  const diversityScore = Math.min(20, uniqueCategories * 3);
  score += diversityScore;

  // High-value category bonus (max 25 points)
  const highValuePOIs = pois.filter(p =>
    ['SHOPPING', 'TRANSPORT', 'OFFICE'].includes(p.category)
  );
  const categoryScore = Math.min(25, highValuePOIs.length * 3);
  score += categoryScore;

  // Time multiplier (max 15 points)
  const timeScore = getCurrentTimeMultiplier() * 15;
  score += timeScore;

  return Math.round(Math.min(100, score));
}

/**
 * Get traffic level description
 */
export function getTrafficLevel(score) {
  if (score >= 80) {
    return {
      level: 'high',
      label: '高人流',
      color: '#10B981',
      icon: '🔥',
      description: '优秀的选址，预计日均客流量充足'
    };
  } else if (score >= 60) {
    return {
      level: 'medium-high',
      label: '中高人流',
      color: '#3B82F6',
      icon: '📈',
      description: '良好的选址，客流量稳定'
    };
  } else if (score >= 40) {
    return {
      level: 'medium',
      label: '中等人流',
      color: '#F59E0B',
      icon: '➡️',
      description: '一般选址，需关注营销策略'
    };
  } else if (score >= 20) {
    return {
      level: 'low',
      label: '低人流',
      color: '#EF4444',
      icon: '⚠️',
      description: '人流量较低，谨慎投资'
    };
  } else {
    return {
      level: 'very-low',
      label: '极低人流',
      color: '#DC2626',
      icon: '❌',
      description: '不建议选址'
    };
  }
}

/**
 * Estimate daily customer volume
 */
export function estimateDailyCustomers(footTrafficScore, competitorCount = 0) {
  // Base customers from foot traffic
  let baseCustomers = footTrafficScore * 5; // Max ~500 customers/day at score 100

  // Competition penalty
  const competitionPenalty = competitorCount * 20;
  baseCustomers = Math.max(0, baseCustomers - competitionPenalty);

  // Add some randomness (±20%)
  const variance = baseCustomers * 0.2;
  const randomFactor = 1 + (Math.random() - 0.5) * 0.4;

  return Math.round(baseCustomers * randomFactor);
}

/**
 * Generate hourly traffic distribution
 */
export function generateHourlyDistribution(isWeekend = false) {
  const hours = [];
  const multipliers = isWeekend ? TRAFFIC_MULTIPLIERS.WEEKEND : TRAFFIC_MULTIPLIERS.WEEKDAY;

  for (let hour = 0; hour < 24; hour++) {
    const range = Object.keys(multipliers).find(r => {
      const [start, end] = r.split('-').map(Number);
      return hour >= start && hour < end;
    });

    const multiplier = multipliers[range] || 0.5;

    hours.push({
      hour: `${hour}:00`,
      traffic: multiplier,
      label: getHourLabel(hour)
    });
  }

  return hours;
}

/**
 * Get hour label
 */
function getHourLabel(hour) {
  if (hour >= 6 && hour < 9) return '早高峰';
  if (hour >= 12 && hour < 14) return '午餐时段';
  if (hour >= 17 && hour < 20) return '晚高峰';
  if (hour >= 20 && hour < 24) return '晚间';
  if (hour >= 0 && hour < 6) return '深夜';
  return '日间';
}
