const RaceSession = require('../models/RaceSession');

const FASTF1_SERVICE_URL = process.env.FASTF1_SERVICE_URL || 'http://localhost:5001';

// 1. List all archived seasons with race counts
const listSeasons = async (req, res) => {
  try {
    const seasons = await RaceSession.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    res.json(seasons.map(s => ({ year: s._id, count: s.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. List all sessions for a specific year (summarized format for list views)
const listSessions = async (req, res) => {
  const { year } = req.query;
  try {
    const filter = year ? { year: parseInt(year) } : {};
    const sessions = await RaceSession.find(filter)
      .select('year round meeting_name location session_type session_date results.position results.abbreviation results.team_name')
      .sort({ round: 1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get full archived session by MongoDB ID
const getSession = async (req, res) => {
  const { id } = req.params;
  try {
    const session = await RaceSession.findById(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Check if a session is archived in DB
const archiveStatus = async (req, res) => {
  const { year, round, session_type } = req.query;
  try {
    if (!year || !round) {
      return res.status(400).json({ error: 'year and round are required' });
    }
    const session = await RaceSession.findOne({
      year: parseInt(year),
      round: parseInt(round),
      session_type: session_type || 'Race'
    }).select('_id');
    
    res.json({
      archived: !!session,
      sessionId: session ? session._id : null
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Trigger FastF1 fetch and MongoDB upsert
const archiveSession = async (req, res) => {
  const { year, round, session_type = 'Race' } = req.body;
  if (!year || !round) {
    return res.status(400).json({ error: 'Year and round are required' });
  }

  try {
    const params = `year=${year}&round=${round}&session=${session_type}`;
    console.log(`[F1Controller] Archiving session: ${year} Round ${round} (${session_type})`);
    
    // Fetch from Flask python microservice endpoints
    // 1. Session & results
    const sessionRes = await fetch(`${FASTF1_SERVICE_URL}/api/f1/session?${params}`);
    if (!sessionRes.ok) {
      throw new Error(`FastF1 service returned status ${sessionRes.status} for session`);
    }
    const sessionData = await sessionRes.json();
    if (sessionData.error) throw new Error(sessionData.error);

    // 2. Laps
    console.log(`[F1Controller] Fetching laps...`);
    const lapsRes = await fetch(`${FASTF1_SERVICE_URL}/api/f1/laps?${params}`);
    const lapsData = lapsRes.ok ? await lapsRes.json() : [];

    // 3. Track path
    console.log(`[F1Controller] Fetching track layout...`);
    const trackRes = await fetch(`${FASTF1_SERVICE_URL}/api/f1/track?${params}`);
    const trackData = trackRes.ok ? await trackRes.json() : { track: [] };

    // 4. Safety Car
    console.log(`[F1Controller] Fetching safety car periods...`);
    const scRes = await fetch(`${FASTF1_SERVICE_URL}/api/f1/safety-car?${params}`);
    const scData = scRes.ok ? await scRes.json() : { safety_car_periods: [] };

    // 5. Pit stops
    console.log(`[F1Controller] Fetching pit stops...`);
    const pitRes = await fetch(`${FASTF1_SERVICE_URL}/api/f1/pit-stops?${params}`);
    const pitData = pitRes.ok ? await pitRes.json() : { pit_stops: [] };

    // 6. DRS zones
    console.log(`[F1Controller] Fetching DRS zones...`);
    const drsRes = await fetch(`${FASTF1_SERVICE_URL}/api/f1/drs-zones?${params}`);
    const drsData = drsRes.ok ? await drsRes.json() : { drs_zones: [], corners: [] };

    // Process and format results
    const results = (sessionData.results || []).map(r => ({
      position: r.position,
      driver_number: r.driver_number,
      abbreviation: r.abbreviation,
      full_name: r.full_name,
      team_name: r.team_name,
      team_color: r.team_color,
      grid_position: r.grid_position,
      status: r.status,
      time: r.time,
      points: r.points
    }));

    // Process and format laps
    const laps = (Array.isArray(lapsData) ? lapsData : []).map(l => ({
      driver_number: l.driver_number,
      abbreviation: l.abbreviation,
      lap_number: l.lap_number,
      lap_time: l.lap_time,
      sector_1: l.sector_1_time,
      sector_2: l.sector_2_time,
      sector_3: l.sector_3_time,
      compound: l.compound,
      tyre_life: l.tyre_life,
      is_pit_out: l.is_pit_out_lap,
      is_pit_in: l.is_pit_in_lap,
      position: l.position,
      stint: l.stint
    }));

    // Process track layout coordinates
    const track_path = (trackData.track || []).map(p => ({ x: p.x, y: p.y }));

    // Process weather
    const weather = sessionData.weather || {
      air_temp: null,
      track_temp: null,
      humidity: null,
      wind_speed: null,
      rainfall: null
    };

    // Process safety car
    const safety_car_windows = (scData.safety_car_periods || []).map(p => ({
      start_lap: p.start_lap,
      end_lap: p.end_lap,
      type: p.type
    }));

    // Process DRS zones (using letter for detection and activation labels or default coordinates)
    const drs_zones = (drsData.drs_zones || []).map((z, idx) => ({
      detection: { x: z.distance || (idx * 500), y: 0 },
      activation_start: { x: (z.distance || 0) + 100, y: 0 },
      activation_end: { x: (z.distance || 0) + 400, y: 0 }
    }));

    // Retirements can be computed from results that didn't finish
    const retirements = [];
    results.forEach(r => {
      if (r.status && r.status !== 'Finished' && !r.status.startsWith('+')) {
        const driverLaps = laps.filter(l => l.driver_number === r.driver_number);
        retirements.push({
          driver_number: r.driver_number,
          abbreviation: r.abbreviation,
          lap: driverLaps.length > 0 ? driverLaps[driverLaps.length - 1].lap_number : null,
          reason: r.status
        });
      }
    });

    const pit_stops = (pitData.pit_stops || []).map(p => {
      let durSecs = null;
      if (p.pit_duration) {
        const parts = p.pit_duration.split(':');
        durSecs = parseFloat(parts[parts.length - 1]) || null;
      }
      return {
        driver_number: p.driver_number,
        abbreviation: p.abbreviation,
        lap: p.lap,
        duration: durSecs,
        compound_before: p.compound_before,
        compound_after: p.compound_after
      };
    });

    // Upsert into MongoDB
    const filter = { year: parseInt(year), round: parseInt(round), session_type };
    const update = {
      meeting_name: sessionData.event_name || `Round ${round}`,
      location: sessionData.event_name || '',
      session_date: sessionData.date ? new Date(sessionData.date) : new Date(),
      results,
      laps,
      pit_stops,
      track_path,
      weather,
      safety_car_windows,
      drs_zones,
      retirements,
      source: 'fastf1',
      archived_at: new Date()
    };

    const savedSession = await RaceSession.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    });

    console.log(`[F1Controller] Session successfully archived in DB: ID ${savedSession._id}`);
    res.json(savedSession);
  } catch (err) {
    console.error(`[F1Controller] Archival failed:`, err);
    res.status(500).json({ error: `Archival failed: ${err.message}` });
  }
};

module.exports = {
  listSeasons,
  listSessions,
  getSession,
  archiveStatus,
  archiveSession
};
