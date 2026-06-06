const mongoose = require('mongoose');

const raceSessionSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  round: { type: Number, required: true },
  meeting_name: { type: String, required: true },
  location: String,
  session_type: { type: String, default: 'Race' },
  session_date: Date,
  
  results: [{
    position: Number,
    driver_number: Number,
    abbreviation: String,
    full_name: String,
    team_name: String,
    team_color: String,
    grid_position: Number,
    status: String,
    time: String,
    points: Number
  }],
  
  laps: [{
    driver_number: Number,
    abbreviation: String,
    lap_number: Number,
    lap_time: String,
    sector_1: String,
    sector_2: String,
    sector_3: String,
    compound: String,
    tyre_life: Number,
    is_pit_out: Boolean,
    is_pit_in: Boolean,
    position: Number,
    stint: Number
  }],
  
  pit_stops: [{
    driver_number: Number,
    abbreviation: String,
    lap: Number,
    duration: Number,
    compound_before: String,
    compound_after: String
  }],
  
  track_path: [{ x: Number, y: Number }],
  
  weather: {
    air_temp: Number,
    track_temp: Number,
    humidity: Number,
    wind_speed: Number,
    rainfall: Number
  },
  
  safety_car_windows: [{
    start_lap: Number,
    end_lap: Number,
    type: { type: String }  // 'SC' or 'VSC'
  }],
  
  drs_zones: [{
    detection: { x: Number, y: Number },
    activation_start: { x: Number, y: Number },
    activation_end: { x: Number, y: Number }
  }],
  
  retirements: [{
    driver_number: Number,
    abbreviation: String,
    lap: Number,
    reason: String
  }],
  
  archived_at: { type: Date, default: Date.now },
  source: { type: String, default: 'fastf1' }
}, { timestamps: true });

raceSessionSchema.index({ year: 1, round: 1, session_type: 1 }, { unique: true });

module.exports = mongoose.model('RaceSession', raceSessionSchema);
