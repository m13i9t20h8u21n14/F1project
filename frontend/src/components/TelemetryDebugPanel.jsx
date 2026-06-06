import React from 'react';

/**
 * TELEMETRY SYNCHRONIZATION DIAGNOSTIC PANEL (Requirement 17)
 */
export const TelemetryDebugPanel = ({ state, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="telemetry-debug-panel" style={styles.container}>
        <div style={styles.title}>📡 TELEMETRY ARCHITECTURE DIAGNOSTICS</div>
        <div style={styles.loading}>Ingesting concurrent OpenF1 telemetry streams...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telemetry-debug-panel" style={{ ...styles.container, borderColor: 'var(--neon-red)' }}>
        <div style={styles.title}>📡 TELEMETRY ARCHITECTURE DIAGNOSTICS</div>
        <div style={styles.error}>⚠️ {error}</div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="telemetry-debug-panel" style={styles.container}>
        <div style={styles.title}>📡 TELEMETRY ARCHITECTURE DIAGNOSTICS</div>
        <div style={styles.loading}>Awaiting synchronized baseline timestamp...</div>
      </div>
    );
  }

  return (
    <div className="telemetry-debug-panel" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>📡 TELEMETRY ARCHITECTURE DIAGNOSTICS</div>
        <div style={{
          ...styles.pill,
          backgroundColor: state.isStale ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 211, 238, 0.15)',
          borderColor: state.isStale ? 'var(--neon-red)' : 'var(--neon-cyan)',
          color: state.isStale ? 'var(--neon-red)' : 'var(--neon-cyan)'
        }}>
          {state.isStale ? '⚠️ LATENCY WARNING (>=3s)' : '✅ SYNCED (TEMPORAL ALIGNED)'}
        </div>
      </div>

      <div style={styles.grid}>
        {/* Core Synchronization Metadata */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>⏱️ TEMPORAL SYNC MAPPING</div>
          <div style={styles.row}>
            <span style={styles.label}>Primary Date Source:</span>
            <span style={styles.value}>/v1/car_data</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Synchronized Timestamp:</span>
            <span style={styles.value}>{new Date(state.timestamp).toISOString()}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Sliding Window Age:</span>
            <span style={{
              ...styles.value,
              color: state.isStale ? 'var(--neon-red)' : 'var(--neon-green)'
            }}>{state.latencyMs} ms</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Coordinates Scale:</span>
            <span style={styles.value}>1:10 (Decimeters ➔ Meters)</span>
          </div>
        </div>

        {/* Primary Engine Metrics */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>⚙️ SYNCHRONIZED METRICS SAMPLE</div>
          <div style={styles.row}>
            <span style={styles.label}>Speed:</span>
            <span style={styles.value}>{state.speed} km/h</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Engine RPM:</span>
            <span style={styles.value}>{state.rpm}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Current Gear:</span>
            <span style={styles.value}>{state.gear === 0 ? 'N' : state.gear}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Ingestion Buffer Size:</span>
            <span style={styles.value}>150 circular max</span>
          </div>
        </div>

        {/* Driver Inputs */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>🏎️ DRIVER APPLIED INPUTS</div>
          <div style={styles.inputRow}>
            <span style={styles.label}>Throttle percentage:</span>
            <div style={styles.barContainer}>
              <div style={{ ...styles.throttleBar, width: `${state.throttle}%` }} />
              <span style={styles.barText}>{state.throttle}%</span>
            </div>
          </div>
          <div style={styles.inputRow}>
            <span style={styles.label}>Brake pressure:</span>
            <div style={styles.barContainer}>
              <div style={{ ...styles.brakeBar, width: `${state.brake}%` }} />
              <span style={styles.barText}>{state.brake > 0 ? 'DEPRESSED' : '0%'}</span>
            </div>
          </div>
        </div>

        {/* Global Track State */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>🌐 TRACK & STANDINGS ALIGNMENT</div>
          <div style={styles.row}>
            <span style={styles.label}>Leaderboard Order:</span>
            <span style={{ ...styles.value, color: 'var(--neon-green)' }}>P{state.position || 'N/A'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Gap to Leader:</span>
            <span style={styles.value}>{state.gapToLeader ? `${state.gapToLeader}s` : 'LEADER'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Mapped X-Coordinate:</span>
            <span style={styles.value}>{state.x !== null ? `${state.x.toFixed(2)} m` : 'Calculating...'}</span>
          </div>
          <div style={styles.row}>
            <span style={styles.label}>Mapped Y-Coordinate:</span>
            <span style={styles.value}>{state.y !== null ? `${state.y.toFixed(2)} m` : 'Calculating...'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#090d16',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    fontFamily: 'var(--font-mono, monospace)',
    color: '#e5e7eb',
    marginTop: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1f2937',
    paddingBottom: '12px',
    marginBottom: '16px'
  },
  title: {
    fontSize: '13px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#f9fafb'
  },
  pill: {
    fontSize: '10px',
    fontWeight: '800',
    padding: '4px 8px',
    borderRadius: '6px',
    border: '1px solid'
  },
  loading: {
    fontSize: '11px',
    color: '#9ca3af',
    textAlign: 'center',
    padding: '16px'
  },
  error: {
    fontSize: '11px',
    color: 'var(--neon-red)',
    textAlign: 'center',
    padding: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  card: {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '8px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cardHeader: {
    fontSize: '10px',
    fontWeight: '800',
    color: 'var(--neon-cyan)',
    borderBottom: '1px solid rgba(34, 211, 238, 0.1)',
    paddingBottom: '6px',
    letterSpacing: '0.05em'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px'
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '11px'
  },
  label: {
    color: '#9ca3af'
  },
  value: {
    color: '#f9fafb',
    fontWeight: '700'
  },
  barContainer: {
    height: '16px',
    backgroundColor: '#1f2937',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  throttleBar: {
    height: '100%',
    backgroundColor: 'var(--neon-green, #10b981)',
    transition: 'width 100ms ease'
  },
  brakeBar: {
    height: '100%',
    backgroundColor: 'var(--neon-red, #ef4444)',
    transition: 'width 100ms ease'
  },
  barText: {
    position: 'absolute',
    left: '8px',
    fontSize: '9px',
    fontWeight: '800',
    color: '#ffffff',
    textShadow: '0 1px 2px rgba(0,0,0,0.8)'
  }
};
