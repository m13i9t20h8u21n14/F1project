/**
 * F1 DATA SERVICE
 * 
 * API client for the backend F1 data endpoints.
 * Handles communication with the Express backend which proxies to FastF1 microservice.
 * Provides: archive status checks, historical session fetching, archival triggers.
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const F1_API = `${API_BASE}/api/f1`;

/**
 * Check if a specific race session has been archived in MongoDB
 * @param {number} year - Season year
 * @param {number} round - Round number
 * @param {string} sessionType - 'Race', 'Qualifying', 'Sprint'
 * @returns {{ archived: boolean, sessionId: string|null }}
 */
export const checkArchiveStatus = async (year, round, sessionType = 'Race') => {
  try {
    const res = await axios.get(`${F1_API}/archive/status`, {
      params: { year, round, session_type: sessionType }
    });
    return res.data;
  } catch (err) {
    console.warn('[F1DataService] Archive status check failed:', err.message);
    return { archived: false, sessionId: null };
  }
};

/**
 * Fetch a full archived session from MongoDB by ID
 * @param {string} sessionId - MongoDB document ID
 * @returns {Object} Full session data (results, laps, pit_stops, track_path, weather, etc.)
 */
export const fetchArchivedSession = async (sessionId) => {
  try {
    const res = await axios.get(`${F1_API}/session/${sessionId}`);
    return res.data;
  } catch (err) {
    console.error('[F1DataService] Failed to fetch archived session:', err.message);
    return null;
  }
};

/**
 * Trigger archival of a race session via FastF1
 * This calls the backend which calls the FastF1 Python microservice.
 * May take 30-60 seconds as FastF1 downloads and processes data.
 * 
 * @param {number} year
 * @param {number} round
 * @param {string} sessionType
 * @returns {Object} The newly archived session document
 */
export const triggerArchival = async (year, round, sessionType = 'Race') => {
  try {
    const res = await axios.post(`${F1_API}/archive`, {
      year,
      round,
      session_type: sessionType
    }, {
      timeout: 120000 // 2 minute timeout for FastF1 data download
    });
    return res.data;
  } catch (err) {
    console.error('[F1DataService] Archival failed:', err.message);
    throw err;
  }
};

/**
 * List all archived seasons with race counts
 * @returns {Array<{ year: number, count: number }>}
 */
export const listArchivedSeasons = async () => {
  try {
    const res = await axios.get(`${F1_API}/seasons`);
    return res.data;
  } catch (err) {
    console.warn('[F1DataService] Failed to list seasons:', err.message);
    return [];
  }
};

/**
 * List all archived sessions for a specific year
 * @param {number} year
 * @returns {Array} Session summaries
 */
export const listArchivedSessions = async (year) => {
  try {
    const res = await axios.get(`${F1_API}/sessions`, {
      params: { year }
    });
    return res.data;
  } catch (err) {
    console.warn('[F1DataService] Failed to list sessions:', err.message);
    return [];
  }
};

/**
 * Map archived session data to the format expected by Dashboard.jsx
 * Converts FastF1/MongoDB data to match the existing driver/race state shape.
 */
export const mapArchivedSessionToDrivers = (session) => {
  if (!session || !session.results) return [];

  const mapped = session.results.map((r, index) => {
    // Find actual Lap 1 time for this driver if available
    const lap1 = session.laps ? session.laps.find(l => String(l.driver_number) === String(r.driver_number) && l.lap_number === 1) : null;
    const defaultLastLap = lap1 && lap1.lap_time ? lap1.lap_time : '1:35.000';

    return {
      driver_number: r.driver_number,
      name_acronym: r.abbreviation,
      broadcast_name: r.full_name,
      team_name: r.team_name,
      team_colour: (r.team_color || 'cccccc').replace('#', ''),
      last_lap: defaultLastLap,
      interval: index === 0 ? 'LEADER' : `+${(index * 1.5).toFixed(3)}`,
      tyre: '🟡 Medium', // Will be overridden by lap data
      tyre_age: 0,
      pos: r.position,
      grid_pos: r.grid_position,
      lap: 1,
      progress: 0,
      speedFactor: 1.0 - (index * 0.003),
      speed: 250,
      status: r.status || 'Finished'
    };
  });

  return mapped.sort((a, b) => (a.grid_pos || 99) - (b.grid_pos || 99));
};

/**
 * Extract pit stop strategy from archived laps data for display
 */
export const extractPitStrategy = (laps, driverNumber) => {
  if (!laps) return [];
  
  const driverLaps = laps.filter(l => l.driver_number === driverNumber);
  const pitStops = [];
  
  let currentCompound = null;
  let stintStart = 1;
  
  for (const lap of driverLaps) {
    if (lap.compound && lap.compound !== currentCompound) {
      if (currentCompound !== null) {
        pitStops.push({
          lap: lap.lap_number,
          from: currentCompound,
          to: lap.compound,
          stint_length: lap.lap_number - stintStart
        });
      }
      currentCompound = lap.compound;
      stintStart = lap.lap_number;
    }
  }
  
  return pitStops;
};

/**
 * Get safety car windows for rendering on the progress bar
 */
export const getSafetyCarWindows = (session) => {
  if (!session || !session.safety_car_windows) return [];
  return session.safety_car_windows;
};

/**
 * Get retired drivers from archived session
 */
export const getRetiredDrivers = (session) => {
  if (!session) return new Set();
  
  const retired = new Set();
  
  // Check results for non-finished drivers
  if (session.results) {
    session.results.forEach(r => {
      if (r.status && r.status !== 'Finished' && !r.status.startsWith('+')) {
        retired.add(r.driver_number);
      }
    });
  }
  
  // Also check explicit retirements
  if (session.retirements) {
    session.retirements.forEach(r => retired.add(r.driver_number));
  }
  
  return retired;
};
