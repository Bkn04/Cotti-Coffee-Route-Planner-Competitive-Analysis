import { useState, useEffect, useCallback } from 'react';
import {
  calculateSubwayRoute,
  formatSubwayInstructions,
  findNearestSubwayStation,
  getAllSubwayStations
} from '../services/subway';

export function useSubway(currentLocation, stores, optimizedRoute) {
  const [subwayRoutes, setSubwayRoutes] = useState([]);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Calculate subway routes when route changes
  useEffect(() => {
    if (currentLocation && optimizedRoute && optimizedRoute.length > 0) {
      calculateRoutes();
    } else {
      setSubwayRoutes([]);
    }
  }, [currentLocation, optimizedRoute]);

  // Find nearby stations when current location changes
  useEffect(() => {
    if (currentLocation) {
      const stations = getAllSubwayStations();
      const nearby = stations
        .map(station => ({
          ...station,
          distance: calculateDistanceSimple(
            currentLocation.coordinates.lat,
            currentLocation.coordinates.lng,
            station.lat,
            station.lng
          )
        }))
        .filter(s => s.distance <= 0.5) // Within 0.5 miles
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);

      setNearbyStations(nearby);
    } else {
      setNearbyStations([]);
    }
  }, [currentLocation]);

  // Calculate subway routes for optimized route
  const calculateRoutes = useCallback(async () => {
    if (!currentLocation || !optimizedRoute || optimizedRoute.length === 0) {
      return;
    }

    setIsCalculating(true);

    try {
      const routes = [];
      let prevLat = currentLocation.coordinates.lat;
      let prevLng = currentLocation.coordinates.lng;

      for (const store of optimizedRoute) {
        const route = calculateSubwayRoute(
          prevLat,
          prevLng,
          store.coordinates.lat,
          store.coordinates.lng
        );

        if (route) {
          const instructions = formatSubwayInstructions(route);
          routes.push({
            from: prevLat === currentLocation.coordinates.lat ? 'Current Location' : 'Previous Store',
            to: store.name,
            route,
            instructions
          });
        }

        prevLat = store.coordinates.lat;
        prevLng = store.coordinates.lng;
      }

      setSubwayRoutes(routes);
    } catch (error) {
      console.error('Error calculating subway routes:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [currentLocation, optimizedRoute]);

  // Get nearest station to a location
  const getNearestStation = useCallback((lat, lng) => {
    return findNearestSubwayStation(lat, lng);
  }, []);

  return {
    subwayRoutes,
    nearbyStations,
    isCalculating,
    calculateRoutes,
    getNearestStation
  };
}

// Simple distance calculation (Haversine)
function calculateDistanceSimple(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
