import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MAP_CONFIG, NYC_BOUNDS } from '../../utils/constants';
import { calculateCenter } from '../../utils/distance';
import CompetitorMarker from './CompetitorMarker';
import SubwayStationMarker from './SubwayStationMarker';
import POIZone from './POIZone';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons
const createNumberedIcon = (number) => {
  return L.divIcon({
    className: 'custom-numbered-icon',
    html: `
      <div style="
        background-color: ${MAP_CONFIG.STORE_COLOR};
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        ${number}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const currentLocationIcon = L.divIcon({
  className: 'custom-current-location-icon',
  html: `
    <div style="
      background-color: ${MAP_CONFIG.CURRENT_LOCATION_COLOR};
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      border: 4px solid white;
      box-shadow: 0 2px 12px rgba(0,0,0,0.4);
      animation: pulse 2s infinite;
    ">
      📍
    </div>
    <style>
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    </style>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Map controller to auto-fit bounds
function MapController({ currentLocation, stores }) {
  const map = useMap();

  useEffect(() => {
    if (!currentLocation && stores.length === 0) {
      // Default to NYC center
      map.setView([NYC_BOUNDS.center.lat, NYC_BOUNDS.center.lng], MAP_CONFIG.DEFAULT_ZOOM);
      return;
    }

    // Calculate bounds that include all markers
    const bounds = [];

    if (currentLocation) {
      bounds.push([currentLocation.coordinates.lat, currentLocation.coordinates.lng]);
    }

    stores.forEach(store => {
      bounds.push([store.coordinates.lat, store.coordinates.lng]);
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [currentLocation, stores, map]);

  return null;
}

function MapView({
  currentLocation,
  stores,
  optimizedRoute,
  showCompetitors,
  competitors = [],
  showSubway = false,
  nearbyStations = [],
  showPOIZones = false,
  poiAnalysisByStore = {},
  showHeatmap = false,
  heatmapData = []
}) {
  // Calculate route path
  const routePath = [];
  if (currentLocation && optimizedRoute.length > 0) {
    routePath.push([currentLocation.coordinates.lat, currentLocation.coordinates.lng]);
    optimizedRoute.forEach(store => {
      routePath.push([store.coordinates.lat, store.coordinates.lng]);
    });
  }

  return (
    <MapContainer
      center={[NYC_BOUNDS.center.lat, NYC_BOUNDS.center.lng]}
      zoom={MAP_CONFIG.DEFAULT_ZOOM}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution={MAP_CONFIG.ATTRIBUTION}
        url={MAP_CONFIG.TILE_LAYER}
      />

      <MapController currentLocation={currentLocation} stores={stores} />

      {/* Current Location Marker */}
      {currentLocation && (
        <Marker
          position={[currentLocation.coordinates.lat, currentLocation.coordinates.lng]}
          icon={currentLocationIcon}
        >
          <Popup>
            <div>
              <strong>当前位置</strong>
              <br />
              <small>{currentLocation.displayAddress || currentLocation.address}</small>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Store Markers */}
      {stores.map((store, index) => {
        // Find store's position in optimized route
        const routeIndex = optimizedRoute.findIndex(s => s.id === store.id);
        const displayNumber = routeIndex >= 0 ? routeIndex + 1 : index + 1;
        const isInRoute = routeIndex >= 0;

        return (
          <Marker
            key={store.id}
            position={[store.coordinates.lat, store.coordinates.lng]}
            icon={createNumberedIcon(displayNumber)}
            opacity={isInRoute || optimizedRoute.length === 0 ? 1 : 0.5}
          >
            <Popup>
              <div>
                <strong>{store.name}</strong>
                <br />
                <small>{store.displayAddress || store.address}</small>
                {isInRoute && (
                  <>
                    <br />
                    <span style={{ color: MAP_CONFIG.STORE_COLOR, fontWeight: 'bold' }}>
                      访问顺序: #{displayNumber}
                    </span>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Route Line */}
      {routePath.length > 1 && (
        <Polyline
          positions={routePath}
          color={MAP_CONFIG.ROUTE_COLOR}
          weight={4}
          opacity={0.7}
          dashArray="10, 10"
        />
      )}

      {/* Competitor Markers */}
      {showCompetitors && competitors.map(competitor => (
        <CompetitorMarker
          key={competitor.id}
          competitor={competitor}
        />
      ))}

      {/* Subway Station Markers */}
      {showSubway && nearbyStations.map(station => (
        <SubwayStationMarker
          key={station.id}
          station={station}
        />
      ))}

      {/* POI Zones (500m circles) */}
      {showPOIZones && stores.map(store => {
        const analysis = poiAnalysisByStore[store.id];
        if (analysis) {
          return (
            <POIZone
              key={`poi-zone-${store.id}`}
              store={store}
              poiAnalysis={analysis}
            />
          );
        }
        return null;
      })}

      {/* Heatmap visualization */}
      {showHeatmap && heatmapData.length > 0 && heatmapData.map((point, index) => (
        <Circle
          key={`heatmap-${index}`}
          center={[point.lat, point.lng]}
          radius={50}
          pathOptions={{
            fillColor: getHeatmapColor(point.intensity),
            fillOpacity: point.intensity * 0.6,
            stroke: false
          }}
        />
      ))}
    </MapContainer>
  );
}

// Helper function to get heatmap color based on intensity
function getHeatmapColor(intensity) {
  if (intensity > 0.7) return '#DC2626'; // Red - Very high
  if (intensity > 0.5) return '#F59E0B'; // Orange - High
  if (intensity > 0.3) return '#FBBF24'; // Yellow - Medium
  if (intensity > 0.1) return '#10B981'; // Green - Low
  return '#6EE7B7'; // Light green - Very low
}

export default MapView;
