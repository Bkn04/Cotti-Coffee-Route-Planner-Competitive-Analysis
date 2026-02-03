import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storeStorage, locationStorage } from '../utils/storage';
import { geocodeAddress } from '../services/geocoding';

export function useStores() {
  const [stores, setStores] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load stores and current location from storage on mount
  useEffect(() => {
    async function loadData() {
      try {
        const savedStores = await storeStorage.get();
        const savedLocation = await locationStorage.get();

        setStores(savedStores);
        setCurrentLocation(savedLocation);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load saved data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Add a new store
  const addStore = useCallback(async (address, name = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // Geocode the address
      const geocodeResult = await geocodeAddress(address);

      if (!geocodeResult.success) {
        setError(geocodeResult.error);
        setIsLoading(false);
        return { success: false, error: geocodeResult.error };
      }

      // Create new store object
      const newStore = {
        id: uuidv4(),
        name: name || `店铺 ${stores.length + 1}`,
        address: address,
        displayAddress: geocodeResult.displayName,
        coordinates: {
          lat: geocodeResult.lat,
          lng: geocodeResult.lng
        },
        addedAt: new Date().toISOString()
      };

      // Update stores
      const updatedStores = [...stores, newStore];
      setStores(updatedStores);

      // Save to storage
      await storeStorage.set(updatedStores);

      setIsLoading(false);
      return { success: true, store: newStore };
    } catch (err) {
      console.error('Error adding store:', err);
      setError(err.message);
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }, [stores]);

  // Remove a store
  const removeStore = useCallback(async (storeId) => {
    try {
      const updatedStores = stores.filter(s => s.id !== storeId);
      setStores(updatedStores);
      await storeStorage.set(updatedStores);
      return { success: true };
    } catch (err) {
      console.error('Error removing store:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [stores]);

  // Update a store
  const updateStore = useCallback(async (storeId, updates) => {
    try {
      const updatedStores = stores.map(store =>
        store.id === storeId ? { ...store, ...updates } : store
      );
      setStores(updatedStores);
      await storeStorage.set(updatedStores);
      return { success: true };
    } catch (err) {
      console.error('Error updating store:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, [stores]);

  // Clear all stores
  const clearStores = useCallback(async () => {
    try {
      setStores([]);
      await storeStorage.clear();
      return { success: true };
    } catch (err) {
      console.error('Error clearing stores:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  // Set current location
  const updateCurrentLocation = useCallback(async (address, coordinates = null) => {
    setIsLoading(true);
    setError(null);

    try {
      let location;

      if (coordinates) {
        // Use provided coordinates
        location = {
          address,
          coordinates
        };
      } else {
        // Geocode the address
        const geocodeResult = await geocodeAddress(address);

        if (!geocodeResult.success) {
          setError(geocodeResult.error);
          setIsLoading(false);
          return { success: false, error: geocodeResult.error };
        }

        location = {
          address: address,
          displayAddress: geocodeResult.displayName,
          coordinates: {
            lat: geocodeResult.lat,
            lng: geocodeResult.lng
          }
        };
      }

      setCurrentLocation(location);
      await locationStorage.set(location);

      setIsLoading(false);
      return { success: true, location };
    } catch (err) {
      console.error('Error setting current location:', err);
      setError(err.message);
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  }, []);

  // Get current location using browser geolocation API
  const getCurrentPosition = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const result = await updateCurrentLocation('Current Location', coordinates);
          if (result.success) {
            resolve(result.location);
          } else {
            reject(new Error(result.error));
          }
        },
        (error) => {
          reject(error);
        }
      );
    });
  }, [updateCurrentLocation]);

  return {
    stores,
    currentLocation,
    isLoading,
    error,
    addStore,
    removeStore,
    updateStore,
    clearStores,
    updateCurrentLocation,
    getCurrentPosition
  };
}
