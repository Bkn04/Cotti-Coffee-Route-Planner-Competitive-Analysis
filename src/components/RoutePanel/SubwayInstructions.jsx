import { SUBWAY_LINES } from '../../services/subway';

function SubwayInstructions({ subwayRoutes, isCalculating }) {
  if (isCalculating) {
    return (
      <div className="card">
        <div className="card-header">🚇 地铁路线</div>
        <div className="alert alert-info">
          <span className="loading-spinner"></span>
          <span>计算地铁路线中...</span>
        </div>
      </div>
    );
  }

  if (!subwayRoutes || subwayRoutes.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <div className="card-header">🚇 地铁换乘指引</div>
      <div className="subway-routes">
        {subwayRoutes.map((route, index) => (
          <div key={index} className="subway-route-segment">
            <div className="route-segment-header">
              <strong>→ {route.to}</strong>
              <span className="badge badge-sm" style={{ background: '#6B7280' }}>
                {route.instructions?.totalTime || 0}分钟
              </span>
            </div>

            {route.instructions && (
              <div className="subway-steps">
                {route.instructions.instructions.map((step, stepIndex) => (
                  <div key={stepIndex} className="subway-step">
                    <div className="step-icon">{step.icon}</div>
                    <div className="step-content">
                      <div className="step-text">{step.text}</div>
                      {step.subtext && (
                        <div className="step-subtext">{step.subtext}</div>
                      )}
                      {step.lines && step.lines.length > 0 && (
                        <div className="subway-lines-display">
                          {step.lines.map((line, i) => {
                            const lineInfo = SUBWAY_LINES[line];
                            return (
                              <span
                                key={i}
                                className="subway-line-badge"
                                style={{
                                  backgroundColor: lineInfo?.color || '#6B7280',
                                  color: 'white'
                                }}
                              >
                                {line}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      <div className="step-time">~{step.time}分钟</div>
                    </div>
                  </div>
                ))}

                <div className="route-summary">
                  <div className="summary-item">
                    <span className="summary-label">总时长</span>
                    <span className="summary-value">{route.instructions.totalTime}分钟</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">费用</span>
                    <span className="summary-value">${route.instructions.cost.toFixed(2)}</span>
                  </div>
                  {route.instructions.transfers > 0 && (
                    <div className="summary-item">
                      <span className="summary-label">换乘</span>
                      <span className="summary-value">{route.instructions.transfers}次</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubwayInstructions;
