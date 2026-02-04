import { POI_CATEGORIES } from '../../services/poi';

function POIAnalysis({ analysis, insights, footTrafficScore, isLoading }) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header">📊 业态分析</div>
        <div className="alert alert-info">
          <span className="loading-spinner"></span>
          <span>分析周边业态中...</span>
        </div>
      </div>
    );
  }

  if (!analysis || !analysis.distribution) {
    return null;
  }

  const { distribution, total, dominantCategoryInfo } = analysis;

  return (
    <div className="card">
      <div className="card-header">📊 周边业态分布（500m）</div>

      {/* Foot Traffic Score */}
      {footTrafficScore !== undefined && (
        <div className="foot-traffic-score">
          <div className="score-header">
            <span>人流量评分</span>
            <span className="score-value" style={{
              color: footTrafficScore >= 70 ? '#10B981' :
                     footTrafficScore >= 50 ? '#3B82F6' :
                     footTrafficScore >= 30 ? '#F59E0B' : '#EF4444'
            }}>
              {footTrafficScore}/100
            </span>
          </div>
          <div className="score-bar">
            <div
              className="score-fill"
              style={{
                width: `${footTrafficScore}%`,
                backgroundColor: footTrafficScore >= 70 ? '#10B981' :
                                footTrafficScore >= 50 ? '#3B82F6' :
                                footTrafficScore >= 30 ? '#F59E0B' : '#EF4444'
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Dominant Category */}
      {dominantCategoryInfo && (
        <div className="alert" style={{
          backgroundColor: `${dominantCategoryInfo.color}15`,
          borderColor: dominantCategoryInfo.color
        }}>
          <strong>{dominantCategoryInfo.icon} 主要业态：{dominantCategoryInfo.name}</strong>
          <div style={{ fontSize: '12px', marginTop: '4px' }}>
            共发现 {total} 个关键设施
          </div>
        </div>
      )}

      {/* Distribution Chart */}
      <div className="poi-distribution">
        {Object.entries(distribution).map(([category, data]) => (
          <div key={category} className="distribution-item">
            <div className="distribution-header">
              <span className="distribution-icon">{data.icon}</span>
              <span className="distribution-name">{data.name}</span>
              <span className="distribution-count">×{data.count}</span>
            </div>
            <div className="distribution-bar-container">
              <div
                className="distribution-bar"
                style={{
                  width: `${data.percentage}%`,
                  backgroundColor: data.color
                }}
              >
                <span className="distribution-percentage">{data.percentage}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Business Insights */}
      {insights && insights.length > 0 && (
        <div className="business-insights">
          <div className="insights-header">💡 商业洞察</div>
          {insights.map((insight, index) => (
            <div
              key={index}
              className="insight-item"
              style={{
                borderLeftColor: insight.type === 'opportunity' ? '#10B981' :
                                insight.type === 'warning' ? '#F59E0B' : '#6B7280'
              }}
            >
              <div className="insight-icon">{insight.icon}</div>
              <div className="insight-content">
                <div className="insight-title">{insight.title}</div>
                <div className="insight-description">{insight.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default POIAnalysis;
