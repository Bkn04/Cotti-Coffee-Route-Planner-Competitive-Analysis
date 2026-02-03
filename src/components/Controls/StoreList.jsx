function StoreList({ stores, onRemoveStore, showOrder = false }) {
  if (!stores || stores.length === 0) {
    return (
      <div className="alert alert-info">
        <small>还没有添加店铺</small>
      </div>
    );
  }

  return (
    <ul className="store-list">
      {stores.map((store, index) => (
        <li key={store.id} className="store-item">
          <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
            {showOrder && (
              <span className="store-item-number">{index + 1}</span>
            )}
            <div className="store-item-info">
              <div className="store-item-name">{store.name}</div>
              <div className="store-item-address">
                {store.displayAddress || store.address}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>
                坐标: {store.coordinates.lat.toFixed(4)}, {store.coordinates.lng.toFixed(4)}
              </div>
            </div>
          </div>
          <div className="store-item-actions">
            <button
              className="btn btn-danger btn-sm"
              onClick={() => onRemoveStore(store.id)}
              title="删除店铺"
            >
              ×
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default StoreList;
