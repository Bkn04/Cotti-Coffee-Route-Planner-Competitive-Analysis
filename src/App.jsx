import { useState } from 'react';
import MapView from './components/Map/MapView';
import AddressInput from './components/Controls/AddressInput';
import StoreList from './components/Controls/StoreList';
import RouteSummary from './components/RoutePanel/RouteSummary';
import { useStores } from './hooks/useStores';
import { useRoute } from './hooks/useRoute';
import { useCompetitors } from './hooks/useCompetitors';

function App() {
  const {
    stores,
    currentLocation,
    isLoading,
    error,
    addStore,
    removeStore,
    updateCurrentLocation,
    getCurrentPosition
  } = useStores();

  const {
    optimizedRoute,
    routeStats,
    isOptimizing,
    recalculateRoute
  } = useRoute(currentLocation, stores);

  const [showCompetitors, setShowCompetitors] = useState(false);

  const {
    competitors,
    isLoading: competitorsLoading,
    refreshCompetitors
  } = useCompetitors(stores, showCompetitors);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>库迪咖啡路线规划</h1>
          <p>Cudi Coffee Route Planner - NYC</p>
        </div>

        <div className="sidebar-content">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Current Location Input */}
          <div className="card">
            <div className="card-header">📍 当前位置</div>
            <AddressInput
              placeholder="输入您的当前位置"
              buttonText="设置位置"
              onSubmit={updateCurrentLocation}
              isLoading={isLoading}
            />
            <button
              className="btn btn-secondary btn-sm btn-block mt-1"
              onClick={getCurrentPosition}
              disabled={isLoading}
            >
              {isLoading ? '定位中...' : '使用我的位置'}
            </button>
            {currentLocation && (
              <div className="alert alert-success mt-1">
                <small>当前位置: {currentLocation.displayAddress || currentLocation.address}</small>
              </div>
            )}
          </div>

          {/* Add Store */}
          <div className="card">
            <div className="card-header">🏪 添加店铺</div>
            <AddressInput
              placeholder="输入店铺地址"
              buttonText="添加店铺"
              onSubmit={(address) => addStore(address)}
              isLoading={isLoading}
              disabled={!currentLocation}
            />
            {!currentLocation && (
              <div className="alert alert-warning mt-1">
                <small>请先设置当前位置</small>
              </div>
            )}
          </div>

          {/* Route Summary */}
          {routeStats && optimizedRoute.length > 0 && (
            <RouteSummary
              routeStats={routeStats}
              isOptimizing={isOptimizing}
              onRecalculate={recalculateRoute}
            />
          )}

          {/* Store List */}
          {stores.length > 0 && (
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <span>📋 店铺列表 ({stores.length})</span>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setShowCompetitors(!showCompetitors)}
                  disabled={competitorsLoading}
                >
                  {competitorsLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>加载中...</span>
                    </>
                  ) : (
                    showCompetitors ? '隐藏竞品' : '显示竞品'
                  )}
                </button>
              </div>
              <StoreList
                stores={optimizedRoute.length > 0 ? optimizedRoute : stores}
                onRemoveStore={removeStore}
                showOrder={optimizedRoute.length > 0}
              />
            </div>
          )}

          {/* Empty State */}
          {stores.length === 0 && currentLocation && (
            <div className="alert alert-info">
              <p><strong>开始使用：</strong></p>
              <ol style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                <li>在上方输入店铺地址</li>
                <li>点击"添加店铺"</li>
                <li>系统会自动优化路线</li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <MapView
          currentLocation={currentLocation}
          stores={stores}
          optimizedRoute={optimizedRoute}
          showCompetitors={showCompetitors}
          competitors={competitors}
        />

        {/* Competitor Info Overlay */}
        {showCompetitors && competitors.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            background: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            fontSize: '14px',
            zIndex: 1000
          }}>
            <strong>竞品统计</strong>
            <div style={{ marginTop: '8px', fontSize: '12px' }}>
              发现 <strong style={{ color: '#2563EB' }}>{competitors.length}</strong> 家竞品咖啡店
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
