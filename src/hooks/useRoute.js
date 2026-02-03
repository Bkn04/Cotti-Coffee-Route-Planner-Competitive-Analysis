import { useState, useEffect, useCallback } from 'react';
import { optimizeRouteGreedy, calculateRouteStats } from '../services/optimization';
import { routeStorage } from '../utils/storage';

export function useRoute(currentLocation, stores) {
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [routeStats, setRouteStats] = useState(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Optimize route whenever stores or current location changes
  useEffect(() => {
    if (!currentLocation || !stores || stores.length === 0) {
      setOptimizedRoute([]);
      setRouteStats(null);
      return;
    }

    optimizeRoute();
  }, [currentLocation, stores]);

  // Optimize the route
  const optimizeRoute = useCallback(async () => {
    if (!currentLocation || !stores || stores.length === 0) {
      return;
    }

    setIsOptimizing(true);

    try {
      // Use greedy algorithm for optimization
      const route = optimizeRouteGreedy(currentLocation.coordinates, stores);

      // Calculate route statistics
      const stats = calculateRouteStats(currentLocation.coordinates, route, 'mixed');

      setOptimizedRoute(route);
      setRouteStats(stats);

      // Save to storage
      await routeStorage.set({
        route,
        stats,
        optimizedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error optimizing route:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [currentLocation, stores]);

  // Manually trigger route optimization
  const recalculateRoute = useCallback(() => {
    optimizeRoute();
  }, [optimizeRoute]);

  return {
    optimizedRoute,
    routeStats,
    isOptimizing,
    recalculateRoute
  };
}
