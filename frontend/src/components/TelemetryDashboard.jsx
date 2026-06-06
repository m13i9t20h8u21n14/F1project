import React from 'react';
import { useTelemetry } from '../hooks/useTelemetry';
import { TelemetryDebugPanel } from './TelemetryDebugPanel';

/**
 * PRODUCTION-READY DEMONSTRATION F1 TELEMETRY DASHBOARD
 */
export const TelemetryDashboard = ({ 
  sessionKey = '9161', 
  driverNumber = '1', 
  sessionStartDate = '2024-03-02T15:00:00Z', 
  simSpeed = 10 
}) => {
  const { syncedState, speedHistory, isLoading, error } = useTelemetry(sessionKey, driverNumber, sessionStartDate, 250, simSpeed);

  // Helper to draw SVG speed chart dynamically (Requirement 14)
  const renderSpeedChart = () => {
    if (speedHistory.length < 2) {
      return <div style={styles.emptyChart}>Awaiting speed data stream...</div>;
    }

    const width = 360;
    const height = 110;
    const padding = 10;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;

    const maxSpeed = 350; // Max F1 speed scaling
    const points = speedHistory.map((s, idx) => {
      const x = padding + (idx / (speedHistory.length - 1)) * chartW;
      const y = padding + chartH - (s.speed / maxSpeed) * chartH;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={styles.svgChart}>
        {/* Horizontal grid lines */}
        {[100, 200, 300].map(val => {
          const y = padding + chartH - (val / maxSpeed) * chartH;
          return (
            <line
              key={val}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="rgba(34, 211, 238, 0.08)"
              strokeDasharray="4,4"
            />
          );
        })}

        {/* Core speed path line */}
        <polyline
          fill="none"
          stroke="var(--neon-cyan, #22d3ee)"
          strokeWidth="2.5"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Speed Label */}
        <text x={padding + 5} y={padding + 15} fill="rgba(34, 211, 238, 0.4)" fontSize="9" fontWeight="800">
          SPEED HISTORICAL (km/h)
        </text>
      </svg>
    );
  };

  return (
    <div className="telemetry-dashboard" style={styles.container}>
      <h2 style={styles.mainTitle}>🏎️ F1 SYNCHRONIZED TELEMETRY CONSOLE</h2>

      <div style={styles.grid}>
        {/* PANEL 1: ENGINE METRIC DIALS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>⚙️ HIGH-SPEED DIALS</div>
          <div style={styles.dialsRow}>
            {/* Speed Dial */}
            <div style={styles.dialCard}>
              <span style={styles.dialLabel}>SPEED</span>
              <span style={{ ...styles.dialValue, color: 'var(--neon-cyan)' }}>
                {syncedState ? syncedState.speed : 0}
              </span>
              <span style={styles.dialSubText}>KM/H</span>
            </div>

            {/* Gear Dial */}
            <div style={styles.dialCard}>
              <span style={styles.dialLabel}>GEAR</span>
              <span style={{ ...styles.dialValue, color: 'var(--neon-green)' }}>
                {syncedState ? (syncedState.gear === 0 ? 'N' : syncedState.gear) : '-'}
              </span>
              <span style={styles.dialSubText}>RANGE 1-8</span>
            </div>

            {/* RPM Dial */}
            <div style={styles.dialCard}>
              <span style={styles.dialLabel}>RPM</span>
              <span style={{ ...styles.dialValue, color: '#f59e0b' }}>
                {syncedState ? syncedState.rpm : 0}
              </span>
              <span style={styles.dialSubText}>REVS/MIN</span>
            </div>
          </div>

          {/* DRIVER THROTTLE/BRAKE PEDAL INPUT METERS */}
          <div style={styles.meterSection}>
            <div style={styles.meterContainer}>
              <span style={styles.meterLabel}>THROTTLE:</span>
              <div style={styles.meterBar}>
                <div style={{ ...styles.throttleFill, width: syncedState ? `${syncedState.throttle}%` : '0%' }} />
                <span style={styles.meterText}>{syncedState ? `${syncedState.throttle}%` : '0%'}</span>
              </div>
            </div>

            <div style={styles.meterContainer}>
              <span style={styles.meterLabel}>BRAKE:</span>
              <div style={styles.meterBar}>
                <div style={{ ...styles.brakeFill, width: syncedState ? `${syncedState.brake}%` : '0%' }} />
                <span style={styles.meterText}>{syncedState && syncedState.brake > 0 ? 'ACTIVE (100%)' : '0%'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* PANEL 2: SPEED GRAPH AND CLASSIFICATIONS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📊 TEMPORALLY ALIGNED SPEED CHART</div>
          <div style={styles.chartContainer}>
            {renderSpeedChart()}
          </div>
          
          <div style={styles.infoRow}>
            <div style={styles.infoBox}>
              <span style={styles.infoTitle}>LAP POSITION</span>
              <span style={styles.infoVal}>P{syncedState ? syncedState.position || 'N/A' : '-'}</span>
            </div>
            <div style={styles.infoBox}>
              <span style={styles.infoTitle}>GAP TO LEADER</span>
              <span style={styles.infoVal}>
                {syncedState ? (syncedState.gapToLeader ? `+${syncedState.gapToLeader}s` : 'LEADER') : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* COMPONENT 3: VISUAL DEBUG ARCHITECTURE PANEL */}
      <TelemetryDebugPanel state={syncedState} isLoading={isLoading} error={error} />
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#0c0f1d',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #1f2937',
    color: '#f3f4f6',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
    fontFamily: 'var(--font-heading), sans-serif'
  },
  mainTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#ffffff',
    margin: '0 0 20px 0',
    letterSpacing: '0.04em',
    borderBottom: '1px solid #1f2937',
    paddingBottom: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '20px'
  },
  panel: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  panelTitle: {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--neon-cyan)',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(34, 211, 238, 0.1)',
    paddingBottom: '6px'
  },
  dialsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px'
  },
  dialCard: {
    backgroundColor: '#1f2937',
    borderRadius: '8px',
    border: '1px solid #374151',
    flex: 1,
    padding: '12px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '90px'
  },
  dialLabel: {
    fontSize: '8px',
    fontWeight: '800',
    color: '#9ca3af',
    letterSpacing: '0.05em'
  },
  dialValue: {
    fontSize: '22px',
    fontWeight: '900',
    margin: '4px 0',
    letterSpacing: '-0.02em'
  },
  dialSubText: {
    fontSize: '7px',
    fontWeight: '700',
    color: '#6b7280'
  },
  meterSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '6px'
  },
  meterContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  meterLabel: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#9ca3af'
  },
  meterBar: {
    height: '14px',
    backgroundColor: '#1f2937',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  throttleFill: {
    height: '100%',
    backgroundColor: 'var(--neon-green, #10b981)',
    transition: 'width 100ms ease'
  },
  brakeFill: {
    height: '100%',
    backgroundColor: 'var(--neon-red, #ef4444)',
    transition: 'width 100ms ease'
  },
  meterText: {
    position: 'absolute',
    left: '8px',
    fontSize: '8px',
    fontWeight: '800',
    color: '#ffffff'
  },
  chartContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#090d16',
    borderRadius: '8px',
    border: '1px solid #1f2937',
    padding: '8px',
    minHeight: '110px'
  },
  emptyChart: {
    fontSize: '10px',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  svgChart: {
    overflow: 'visible'
  },
  infoRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '6px'
  },
  infoBox: {
    backgroundColor: '#1f2937',
    borderRadius: '6px',
    border: '1px solid #374151',
    flex: 1,
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoTitle: {
    fontSize: '9px',
    fontWeight: '800',
    color: '#9ca3af'
  },
  infoVal: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#ffffff'
  }
};
