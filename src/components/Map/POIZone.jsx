import { Circle, Popup } from 'react-leaflet';
import { POI_CATEGORIES } from '../../services/poi';

function POIZone({ store, poiAnalysis }) {
  if (!poiAnalysis || !poiAnalysis.distribution) {
    return null;
  }

  const { dominantCategory, dominantCategoryInfo } = poiAnalysis;
  const categoryColor = dominantCategoryInfo?.color || '#EF4444';

  return (
    <>
      {/* 500m zone circle */}
      <Circle
        center={[store.coordinates.lat, store.coordinates.lng]}
        radius={500}
        pathOptions={{
          color: categoryColor,
          fillColor: categoryColor,
          fillOpacity: 0.08,
          weight: 2,
          opacity: 0.6,
          dashArray: '5, 10'
        }}
      >
        <Popup>
          <div>
            <div style={{
              fontWeight: 'bold',
              marginBottom: '8px',
              color: categoryColor
            }}>
              📍 {store.name} - 业态分析区
            </div>

            <div style={{ fontSize: '12px', color: '#6B7280' }}>
              <strong>500米范围</strong>
            </div>

            {dominantCategoryInfo && (
              <div style={{
                marginTop: '8px',
                padding: '8px',
                backgroundColor: `${categoryColor}15`,
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                <div>{dominantCategoryInfo.icon} <strong>{dominantCategoryInfo.name}</strong></div>
                <div style={{ fontSize: '11px', marginTop: '4px', color: '#6B7280' }}>
                  主要业态
                </div>
              </div>
            )}

            {poiAnalysis.distribution && (
              <div style={{ marginTop: '8px', fontSize: '11px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>设施分布:</div>
                {Object.entries(poiAnalysis.distribution).slice(0, 3).map(([cat, data]) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>{POI_CATEGORIES[cat]?.icon} {data.name}</span>
                    <span style={{ color: '#6B7280' }}>{data.count}个</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Popup>
      </Circle>
    </>
  );
}

export default POIZone;
