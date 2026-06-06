/**
 * PRODUCTION-QUALITY F1 TELEMETRY SYNCHRONIZATION SERVICE
 * 
 * Coordinates high-frequency OpenF1 API streams (car_data, location, position, intervals)
 * using a sliding-window temporal alignment algorithm.
 */

export class TelemetryStore {
  constructor(maxBufferSize = 150) {
    this.maxBufferSize = maxBufferSize;
    
    // In-memory circular buffers per driver
    this.buffers = {
      carData: new Map(),   // driver_number -> array of { timestamp, speed, rpm, gear, throttle, brake }
      location: new Map(),  // driver_number -> array of { timestamp, x, y, z }
      position: new Map(),  // driver_number -> array of { timestamp, position }
      intervals: new Map()  // driver_number -> array of { timestamp, gapToLeader, interval }
    };

    // Latest ingested timestamps to prevent race conditions & stale overwrites
    this.latestTimestamps = {
      carData: new Map(),
      location: new Map(),
      position: new Map(),
      intervals: new Map()
    };
  }

  /**
   * Ingests a new telemetry sample into the circular buffer
   */
  ingest(endpoint, driverNumber, data) {
    if (!data.date) return;
    
    const timestamp = new Date(data.date).getTime();
    if (isNaN(timestamp)) return;

    const latest = this.latestTimestamps[endpoint].get(driverNumber) || 0;
    
    // Prevent stale data from overwriting newer data (Requirement 12)
    if (timestamp < latest) {
      return; // Skip silently to keep buffer pure and chronologically sorted
    }
    
    this.latestTimestamps[endpoint].set(driverNumber, timestamp);

    let driverMap = this.buffers[endpoint];
    if (!driverMap.has(driverNumber)) {
      driverMap.set(driverNumber, []);
    }

    const buffer = driverMap.get(driverNumber);
    buffer.push({ ...data, _parsedTimestamp: timestamp });

    // Keep buffer within limits
    if (buffer.length > this.maxBufferSize) {
      buffer.shift();
    }
  }

  /**
   * Clears buffers for a clean restart
   */
  clear() {
    Object.keys(this.buffers).forEach(key => this.buffers[key].clear());
    Object.keys(this.latestTimestamps).forEach(key => this.latestTimestamps[key].clear());
  }

  /**
   * Binary search helper to find the sample nearest to targetTimestamp (Requirement 13)
   */
  findNearestSample(samples, targetTimestamp) {
    if (!samples || samples.length === 0) return null;
    if (samples.length === 1) return samples[0];

    let left = 0;
    let right = samples.length - 1;

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (samples[mid]._parsedTimestamp < targetTimestamp) {
        left = mid + 1;
      } else {
        right = mid;
      }
    }

    // Check boundary neighbors to find the absolute closest
    const exact = samples[left];
    const prev = left > 0 ? samples[left - 1] : null;

    if (prev) {
      const diffPrev = Math.abs(prev._parsedTimestamp - targetTimestamp);
      const diffExact = Math.abs(exact._parsedTimestamp - targetTimestamp);
      return diffPrev < diffExact ? prev : exact;
    }

    return exact;
  }

  /**
   * Performs high-performance temporal synchronization across all streams for a specific driver (Requirement 13 & 16)
   */
  getSynchronizedState(driverNumber, targetTimestamp) {
    const carSamples = this.buffers.carData.get(driverNumber) || [];
    const locSamples = this.buffers.location.get(driverNumber) || [];
    const posSamples = this.buffers.position.get(driverNumber) || [];
    const intSamples = this.buffers.intervals.get(driverNumber) || [];

    if (carSamples.length === 0) return null;

    // Primary source: car_data sample nearest to the target timestamp
    const primarySample = this.findNearestSample(carSamples, targetTimestamp);
    if (!primarySample) return null;

    // Use the primary sample's exact timestamp to align location, position and gaps
    const syncTime = primarySample._parsedTimestamp;

    const locSample = this.findNearestSample(locSamples, syncTime);
    const posSample = this.findNearestSample(posSamples, syncTime);
    const intSample = this.findNearestSample(intSamples, syncTime);

    // Calculate relative latency/staleness relative to the virtual targetTimestamp (Bug Fix 2)
    const dataAge = Math.abs(targetTimestamp - syncTime);
    const isStale = dataAge > 3000; // 3 seconds threshold
    if (isStale) {
      console.warn(`[TelemetrySync] Warning: Synced sample for driver ${driverNumber} is older than 3 seconds (${(dataAge / 1000).toFixed(1)}s ago).`);
    }

    // Scale coordinates (OpenF1 location is in decimeters, scale to meters!)
    const scaleFactor = 0.1; 
    let x = null, y = null, z = null;
    if (locSample) {
      x = locSample.x * scaleFactor;
      y = locSample.y * scaleFactor;
      z = (locSample.z !== undefined ? locSample.z : 0) * scaleFactor;
    }

    // Core synchronized state structure (Requirement 16 & Optional Decoupling Optimization)
    return {
      driverNumber,
      timestamp: syncTime,
      latencyMs: dataAge,
      isStale,
      
      // Car engine metrics from the SAME primary sample (coupled metrics guarantee)
      speed: primarySample.speed !== undefined ? primarySample.speed : 0,
      rpm: primarySample.rpm !== undefined ? primarySample.rpm : 0,
      gear: primarySample.gear !== undefined ? primarySample.gear : 0,
      throttle: primarySample.throttle !== undefined ? primarySample.throttle : 0,
      brake: (primarySample.brake === 100 || primarySample.brake === 1) ? 100 : 0, // standardize binary mappings
      
      // Decoupled location coordinates for track mapping
      x,
      y,
      z,

      // Standings and timing gaps
      position: posSample ? posSample.position : null,
      gapToLeader: intSample ? intSample.gap_to_leader : null,
      interval: intSample ? intSample.interval : null
    };
  }
}

export const telemetryStore = new TelemetryStore(150);

/**
 * Clean Async Fetcher Service with Virtual Playback Date Window filters (Bug Fix 1)
 */
export const fetchDriverTelemetry = async (sessionKey, driverNumber, playbackAnchorDate, timestampWindowMs = 8000) => {
  const baseUrl = 'https://api.openf1.org/v1';
  
  // Calculate relative window timestamps using the virtual playback clock rather than local system clock!
  const end = new Date(playbackAnchorDate);
  const start = new Date(end.getTime() - timestampWindowMs);
  
  const dateFilter = `date>=${start.toISOString()}&date<=${end.toISOString()}`;

  // Fire all requests concurrently (Requirement 3: non-blocking rendering)
  try {
    const [carDataRes, locRes, posRes, intRes] = await Promise.all([
      fetch(`${baseUrl}/car_data?session_key=${sessionKey}&driver_number=${driverNumber}&${dateFilter}`).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}/location?session_key=${sessionKey}&driver_number=${driverNumber}&${dateFilter}`).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}/position?session_key=${sessionKey}&driver_number=${driverNumber}&${dateFilter}`).then(r => r.json()).catch(() => []),
      fetch(`${baseUrl}/intervals?session_key=${sessionKey}&driver_number=${driverNumber}&${dateFilter}`).then(r => r.json()).catch(() => [])
    ]);

    // Ingest all samples
    if (Array.isArray(carDataRes)) carDataRes.forEach(s => telemetryStore.ingest('carData', driverNumber, s));
    if (Array.isArray(locRes)) locRes.forEach(s => telemetryStore.ingest('location', driverNumber, s));
    if (Array.isArray(posRes)) posRes.forEach(s => telemetryStore.ingest('position', driverNumber, s));
    if (Array.isArray(intRes)) intRes.forEach(s => telemetryStore.ingest('intervals', driverNumber, s));

    return true;
  } catch (err) {
    console.error('[TelemetryService] Ingestion fetch cycle encountered an error', err);
    return false;
  }
};
