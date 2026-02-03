import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { getBrandInfo } from '../../services/competitors';

function CompetitorMarker({ competitor }) {
  const brandInfo = getBrandInfo(competitor.brand);

  // Create custom icon for competitor
  const competitorIcon = L.divIcon({
    className: 'custom-competitor-icon',
    html: `
      <div style="
        background-color: ${brandInfo.color};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        border: 2px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        opacity: 0.85;
      ">
        ${brandInfo.icon}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  return (
    <Marker
      position={[competitor.coordinates.lat, competitor.coordinates.lng]}
      icon={competitorIcon}
    >
      <Popup>
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '18px' }}>{brandInfo.icon}</span>
            <strong style={{ color: brandInfo.color }}>{competitor.name}</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#6B7280' }}>
            {brandInfo.name}
          </div>
          {competitor.address && (
            <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
              {competitor.address}
            </div>
          )}
          <div style={{
            fontSize: '10px',
            color: '#D1D5DB',
            marginTop: '6px',
            borderTop: '1px solid #E5E7EB',
            paddingTop: '4px'
          }}>
            竞品位置
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default CompetitorMarker;
