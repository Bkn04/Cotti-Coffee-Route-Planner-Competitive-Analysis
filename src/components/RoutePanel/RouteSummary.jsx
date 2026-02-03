function RouteSummary({ routeStats, isOptimizing, onRecalculate }) {
  if (!routeStats) {
    return null;
  }

  const { totalDistance, totalTime, totalCost, stops } = routeStats;

  return (
    <div className="route-summary">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>🚇 优化路线</h3>
        <button
          className="btn btn-sm"
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
          onClick={onRecalculate}
          disabled={isOptimizing}
        >
          {isOptimizing ? (
            <>
              <span className="loading-spinner"></span>
              <span>优化中...</span>
            </>
          ) : (
            '重新优化'
          )}
        </button>
      </div>

      <div className="route-stats">
        <div className="route-stat">
          <span className="route-stat-value">{stops}</span>
          <span className="route-stat-label">店铺数</span>
        </div>
        <div className="route-stat">
          <span className="route-stat-value">{totalDistance.toFixed(1)}</span>
          <span className="route-stat-label">英里</span>
        </div>
        <div className="route-stat">
          <span className="route-stat-value">{totalTime}</span>
          <span className="route-stat-label">分钟</span>
        </div>
        <div className="route-stat">
          <span className="route-stat-value">${totalCost.toFixed(2)}</span>
          <span className="route-stat-label">预估费用</span>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.875rem', opacity: 0.9 }}>
        <p style={{ margin: 0 }}>
          ✨ 已为您优化访问顺序，按照最短路径规划
        </p>
      </div>
    </div>
  );
}

export default RouteSummary;
