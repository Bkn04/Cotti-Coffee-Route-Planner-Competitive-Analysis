import { Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { SUBWAY_LINES } from '../../services/subway';

function SubwayStationMarker({ station }) {
  // Create custom icon for subway station
  const stationIcon = L.divIcon({
    className: 'custom-subway-icon',
    html: `
      <div style="
        background-color: #1F2937;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        opacity: 0.9;
      ">
        M
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <>
      <Marker
        position={[station.lat, station.lng]}
        icon={stationIcon}
      >
        <Popup>
          <div>
            <div style={{
              fontWeight: 'bold',
              fontSize: '14px',
              marginBottom: '8px'
            }}>
              🚇 {station.name}
            </div>

            {/* Subway Lines */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '4px',
              marginTop: '8px'
            }}>
              {station.lines.map((line, index) => {
                const lineInfo = SUBWAY_LINES[line];
                return (
                  <span
                    key={index}
                    style={{
                      backgroundColor: lineInfo?.color || '#6B7280',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: '28px',
                      textAlign: 'center'
                    }}
                  >
                    {line}
                  </span>
                );
              })}
            </div>

            {station.distance !== undefined && (
              <div style={{
                fontSize: '11px',
                color: '#6B7280',
                marginTop: '8px'
              }}>
                距离: {(station.distance * 5280).toFixed(0)} 英尺
              </div>
            )}
          </div>
        </Popup>
      </Marker>

      {/* Walking radius circle (0.1 mile ~ 160m) */}
      <Circle
        center={[station.lat, station.lng]}
        radius={160}
        pathOptions={{
          color: '#1F2937',
          fillColor: '#1F2937',
          fillOpacity: 0.05,
          weight: 1,
          opacity: 0.3
        }}
      />
    </>
  );
}

export default SubwayStationMarker;
