import { useState, useEffect, useRef } from 'react';
import { telemetryStore, fetchDriverTelemetry } from '../services/telemetryService';

/**
 * REUSABLE React hook for real-time synchronized telemetry tracking (Requirement 20)
 * 
 * @param {string|number} sessionKey - OpenF1 Session Key
 * @param {string|number} driverNumber - F1 Car Number
 * @param {string|number} sessionStartDate - Baseline starting date ISO string of the GP session
 * @param {number} refreshRateMs - Telemetry sync loop interval
 * @param {number} simSpeed - Playback acceleration factor (e.g. 10)
 */
export const useTelemetry = (sessionKey, driverNumber, sessionStartDate, refreshRateMs = 250, simSpeed = 10) => {
  const [syncedState, setSyncedState] = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]); // Circular buffer for speed graphs (Requirement 14)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // References for interpolation (Requirement 10)
  const lastStateRef = useRef(null);
  const nextStateRef = useRef(null);
  const interpolationTimerRef = useRef(null);
  
  // Keep track of virtual playback date (Bug Fix 1)
  const virtualClockRef = useRef(0);

  useEffect(() => {
    if (!sessionKey || !driverNumber || !sessionStartDate) return;

    setIsLoading(true);
    setError(null);
    telemetryStore.clear();
    
    // Set virtual clock baseline starting date
    virtualClockRef.current = new Date(sessionStartDate).getTime();

    let isSubscribed = true;
    let fetchIntervalId = null;
    let syncIntervalId = null;

    // 1. Concurrent Fetching Loop (Requirement 2 & 3: independent and non-blocking)
    const runFetchCycle = async () => {
      if (!isSubscribed) return;
      
      const success = await fetchDriverTelemetry(sessionKey, driverNumber, virtualClockRef.current, 10000);
      if (!success && isSubscribed) {
        setError('Network error or rate limits encountered on OpenF1 stream.');
      }
      setIsLoading(false);
    };

    runFetchCycle();
    fetchIntervalId = setInterval(runFetchCycle, 2000); // Poll API every 2 seconds

    // 2. High-Frequency Temporal Synchronization Loop (Requirement 13)
    const runSyncCycle = () => {
      if (!isSubscribed) return;

      // Advance the virtual clock by the refresh duration scaled by speed factor (Bug Fix 1)
      virtualClockRef.current += refreshRateMs * simSpeed;

      const freshState = telemetryStore.getSynchronizedState(driverNumber, virtualClockRef.current);
      if (!freshState) return;

      nextStateRef.current = freshState;

      // Handle speed circular buffer for speed chart (Requirement 14)
      setSpeedHistory(prev => {
        // Push unique timestamps to prevent duplicate flat lining
        if (prev.length > 0 && prev[prev.length - 1].time === freshState.timestamp) {
          return prev;
        }
        const nextHist = [...prev, { time: freshState.timestamp, speed: freshState.speed }];
        return nextHist.length > 50 ? nextHist.slice(1) : nextHist;
      });

      // Linear Coordinate Interpolation for smooth motion scaled with simSpeed (Requirement 10)
      if (lastStateRef.current && nextStateRef.current) {
        let step = 0;
        const totalSteps = Math.max(1, Math.floor(refreshRateMs / 30)); // interpolate at 33fps

        if (interpolationTimerRef.current) clearInterval(interpolationTimerRef.current);

        interpolationTimerRef.current = setInterval(() => {
          step++;
          if (step >= totalSteps) {
            clearInterval(interpolationTimerRef.current);
            return;
          }

          const ratio = step / totalSteps;
          const prevLoc = lastStateRef.current;
          const nextLoc = nextStateRef.current;

          if (prevLoc.x !== null && nextLoc.x !== null) {
            const interpolatedX = prevLoc.x + (nextLoc.x - prevLoc.x) * ratio;
            const interpolatedY = prevLoc.y + (nextLoc.y - prevLoc.y) * ratio;
            
            setSyncedState(prev => {
              if (!prev) return null;
              return {
                ...prev,
                x: interpolatedX,
                y: interpolatedY
              };
            });
          }
        }, 30);
      }

      setSyncedState(freshState);
      lastStateRef.current = freshState;
    };

    syncIntervalId = setInterval(runSyncCycle, refreshRateMs);

    return () => {
      isSubscribed = false;
      clearInterval(fetchIntervalId);
      clearInterval(syncIntervalId);
      if (interpolationTimerRef.current) clearInterval(interpolationTimerRef.current);
    };
  }, [sessionKey, driverNumber, sessionStartDate, refreshRateMs, simSpeed]);

  return {
    syncedState,
    speedHistory,
    isLoading,
    error
  };
};
