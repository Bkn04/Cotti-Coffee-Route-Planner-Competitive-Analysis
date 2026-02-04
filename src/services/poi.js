import axios from 'axios';
import { API_CONFIG } from '../utils/constants';

/**
 * POI Categories for business area analysis
 */
export const POI_CATEGORIES = {
  SHOPPING: {
    name: '商圈/购物中心',
    color: '#FF6B6B',
    icon: '🛍️',
    osmTags: [
      'shop=mall',
      'shop=department_store',
      'shop=supermarket',
      'shop=clothes',
      'shop=shoes',
      'amenity=marketplace'
    ]
  },
  EDUCATION: {
    name: '学校/教育机构',
    color: '#4ECDC4',
    icon: '🎓',
    osmTags: [
      'amenity=school',
      'amenity=university',
      'amenity=college',
      'amenity=library'
    ]
  },
  TRANSPORT: {
    name: '交通枢纽',
    color: '#95E1D3',
    icon: '🚇',
    osmTags: [
      'amenity=bus_station',
      'railway=station',
      'railway=subway_entrance',
      'amenity=ferry_terminal'
    ]
  },
  PARK: {
    name: '公园/绿地',
    color: '#6BCF7F',
    icon: '🌳',
    osmTags: [
      'leisure=park',
      'leisure=garden',
      'leisure=playground',
      'landuse=recreation_ground'
    ]
  },
  OFFICE: {
    name: '写字楼/办公区',
    color: '#4A90E2',
    icon: '🏢',
    osmTags: [
      'office=*',
      'building=office',
      'building=commercial'
    ]
  },
  RESIDENTIAL: {
    name: '住宅区',
    color: '#F7B731',
    icon: '🏘️',
    osmTags: [
      'building=residential',
      'building=apartments',
      'landuse=residential'
    ]
  },
  FOOD: {
    name: '餐饮区',
    color: '#FFA502',
    icon: '🍽️',
    osmTags: [
      'amenity=restaurant',
      'amenity=fast_food',
      'amenity=food_court'
    ]
  },
  ENTERTAINMENT: {
    name: '娱乐场所',
    color: '#A29BFE',
    icon: '🎬',
    osmTags: [
      'amenity=cinema',
      'amenity=theatre',
      'leisure=fitness_centre',
      'leisure=sports_centre'
    ]
  }
};

/**
 * Fetch POI data around a location using Overpass API
 */
export async function fetchPOIsNearLocation(lat, lng, radiusMeters = 500) {
  try {
    // Build Overpass QL query for all categories
    const queries = [];

    // Shopping
    queries.push(`
      node["shop"="mall"](around:${radiusMeters},${lat},${lng});
      node["shop"="department_store"](around:${radiusMeters},${lat},${lng});
      node["shop"="supermarket"](around:${radiusMeters},${lat},${lng});
      way["shop"="mall"](around:${radiusMeters},${lat},${lng});
    `);

    // Education
    queries.push(`
      node["amenity"="school"](around:${radiusMeters},${lat},${lng});
      node["amenity"="university"](around:${radiusMeters},${lat},${lng});
      way["amenity"="school"](around:${radiusMeters},${lat},${lng});
      way["amenity"="university"](around:${radiusMeters},${lat},${lng});
    `);

    // Transport
    queries.push(`
      node["railway"="station"](around:${radiusMeters},${lat},${lng});
      node["railway"="subway_entrance"](around:${radiusMeters},${lat},${lng});
      node["amenity"="bus_station"](around:${radiusMeters},${lat},${lng});
    `);

    // Parks
    queries.push(`
      node["leisure"="park"](around:${radiusMeters},${lat},${lng});
      way["leisure"="park"](around:${radiusMeters},${lat},${lng});
    `);

    // Offices
    queries.push(`
      node["building"="office"](around:${radiusMeters},${lat},${lng});
      way["building"="office"](around:${radiusMeters},${lat},${lng});
    `);

    // Restaurants
    queries.push(`
      node["amenity"="restaurant"](around:${radiusMeters},${lat},${lng});
      node["amenity"="fast_food"](around:${radiusMeters},${lat},${lng});
    `);

    const query = `
      [out:json][timeout:25];
      (
        ${queries.join('\n')}
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
      const pois = response.data.elements
        .filter(element => element.lat && element.lon)
        .map(element => ({
          id: element.id,
          type: element.type,
          name: element.tags?.name || 'Unnamed',
          category: categorizePOI(element.tags),
          coordinates: {
            lat: element.lat || element.center?.lat,
            lng: element.lon || element.center?.lon
          },
          tags: element.tags
        }))
        .filter(poi => poi.category !== null);

      return pois;
    }

    return [];
  } catch (error) {
    console.error('Error fetching POIs from Overpass:', error);
    // Return mock data as fallback
    return getMockPOIs(lat, lng, radiusMeters);
  }
}

/**
 * Categorize POI based on OSM tags
 */
function categorizePOI(tags) {
  if (!tags) return null;

  // Shopping
  if (tags.shop === 'mall' || tags.shop === 'department_store' || tags.shop === 'supermarket') {
    return 'SHOPPING';
  }

  // Education
  if (tags.amenity === 'school' || tags.amenity === 'university' || tags.amenity === 'college') {
    return 'EDUCATION';
  }

  // Transport
  if (tags.railway === 'station' || tags.railway === 'subway_entrance' || tags.amenity === 'bus_station') {
    return 'TRANSPORT';
  }

  // Park
  if (tags.leisure === 'park' || tags.leisure === 'garden') {
    return 'PARK';
  }

  // Office
  if (tags.office || tags.building === 'office' || tags.building === 'commercial') {
    return 'OFFICE';
  }

  // Residential
  if (tags.building === 'residential' || tags.building === 'apartments' || tags.landuse === 'residential') {
    return 'RESIDENTIAL';
  }

  // Food
  if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food' || tags.amenity === 'food_court') {
    return 'FOOD';
  }

  // Entertainment
  if (tags.amenity === 'cinema' || tags.amenity === 'theatre' || tags.leisure === 'fitness_centre') {
    return 'ENTERTAINMENT';
  }

  return null;
}

/**
 * Analyze POI distribution around a location
 */
export function analyzePOIDistribution(pois) {
  const distribution = {};
  const categoryCounts = {};

  // Count POIs by category
  pois.forEach(poi => {
    if (poi.category) {
      categoryCounts[poi.category] = (categoryCounts[poi.category] || 0) + 1;
    }
  });

  // Calculate percentages and create distribution summary
  const total = pois.length;
  Object.entries(categoryCounts).forEach(([category, count]) => {
    const categoryInfo = POI_CATEGORIES[category];
    if (categoryInfo) {
      distribution[category] = {
        name: categoryInfo.name,
        color: categoryInfo.color,
        icon: categoryInfo.icon,
        count,
        percentage: ((count / total) * 100).toFixed(1)
      };
    }
  });

  // Determine dominant category
  let dominantCategory = null;
  let maxCount = 0;
  Object.entries(categoryCounts).forEach(([category, count]) => {
    if (count > maxCount) {
      maxCount = count;
      dominantCategory = category;
    }
  });

  return {
    distribution,
    total,
    dominantCategory,
    dominantCategoryInfo: dominantCategory ? POI_CATEGORIES[dominantCategory] : null
  };
}

/**
 * Get mock POI data as fallback
 */
function getMockPOIs(centerLat, centerLng, radiusMeters) {
  const mockData = [
    { category: 'SHOPPING', name: 'Shopping Mall', lat: centerLat + 0.002, lng: centerLng + 0.001 },
    { category: 'OFFICE', name: 'Office Building 1', lat: centerLat - 0.001, lng: centerLng + 0.002 },
    { category: 'OFFICE', name: 'Office Building 2', lat: centerLat + 0.001, lng: centerLng - 0.001 },
    { category: 'FOOD', name: 'Restaurant Area', lat: centerLat + 0.001, lng: centerLng + 0.001 },
    { category: 'TRANSPORT', name: 'Subway Station', lat: centerLat - 0.002, lng: centerLng - 0.001 },
    { category: 'PARK', name: 'City Park', lat: centerLat + 0.003, lng: centerLng - 0.002 },
  ];

  return mockData.map((poi, index) => ({
    id: `mock-poi-${index}`,
    name: poi.name,
    category: poi.category,
    coordinates: { lat: poi.lat, lng: poi.lng },
    tags: {}
  }));
}

/**
 * Generate business insights from POI analysis
 */
export function generateBusinessInsights(analysis) {
  const insights = [];
  const { distribution, dominantCategory, dominantCategoryInfo } = analysis;

  // Dominant category insight
  if (dominantCategoryInfo) {
    insights.push({
      type: 'dominant',
      icon: dominantCategoryInfo.icon,
      title: `主要业态：${dominantCategoryInfo.name}`,
      description: `该区域以${dominantCategoryInfo.name}为主，占比${distribution[dominantCategory].percentage}%`
    });
  }

  // Office area insight
  if (distribution.OFFICE && parseInt(distribution.OFFICE.percentage) > 30) {
    insights.push({
      type: 'opportunity',
      icon: '💼',
      title: '高办公区密度',
      description: '适合早餐和午餐时段经营，工作日客流稳定'
    });
  }

  // Shopping area insight
  if (distribution.SHOPPING && parseInt(distribution.SHOPPING.percentage) > 25) {
    insights.push({
      type: 'opportunity',
      icon: '🛒',
      title: '商圈位置',
      description: '周末和节假日客流量大，适合全时段经营'
    });
  }

  // Transport hub insight
  if (distribution.TRANSPORT && parseInt(distribution.TRANSPORT.percentage) > 15) {
    insights.push({
      type: 'opportunity',
      icon: '🚉',
      title: '交通枢纽',
      description: '人流量大，适合快速外带业务'
    });
  }

  // Residential area insight
  if (distribution.RESIDENTIAL && parseInt(distribution.RESIDENTIAL.percentage) > 40) {
    insights.push({
      type: 'warning',
      icon: '🏠',
      title: '住宅区为主',
      description: '客流可能有限，建议关注周边配套设施'
    });
  }

  // Education insight
  if (distribution.EDUCATION) {
    insights.push({
      type: 'opportunity',
      icon: '📚',
      title: '学校周边',
      description: '学生客群稳定，适合推出学生优惠活动'
    });
  }

  return insights;
}
