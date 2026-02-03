import { useState, useEffect, useCallback } from 'react';
import { fetchCompetitorsForStores } from '../services/competitors';
import { competitorStorage } from '../utils/storage';
import { CACHE_TTL } from '../utils/constants';

export function useCompetitors(stores, enabled = false) {
  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load competitors when enabled
  useEffect(() => {
    if (enabled && stores && stores.length > 0) {
      loadCompetitors();
    } else {
      setCompetitors([]);
    }
  }, [enabled, stores]);

  // Load competitors from cache or API
  const loadCompetitors = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to load from cache first
      const cached = await competitorStorage.get();

      if (cached && cached.competitors) {
        setCompetitors(cached.competitors);
        setIsLoading(false);
        return;
      }

      // Fetch from API
      const freshCompetitors = await fetchCompetitorsForStores(stores, 804); // 0.5 miles = 804 meters

      setCompetitors(freshCompetitors);

      // Save to cache
      await competitorStorage.set(freshCompetitors, CACHE_TTL.COMPETITORS);
    } catch (err) {
      console.error('Error loading competitors:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [stores]);

  // Refresh competitors
  const refreshCompetitors = useCallback(async () => {
    // Clear cache and reload
    await competitorStorage.clear();
    await loadCompetitors();
  }, [loadCompetitors]);

  // Get competitors near a specific store
  const getCompetitorsNearStore = useCallback((storeId) => {
    return competitors.filter(comp =>
      comp.nearStores && comp.nearStores.includes(storeId)
    );
  }, [competitors]);

  return {
    competitors,
    isLoading,
    error,
    refreshCompetitors,
    getCompetitorsNearStore
  };
}
