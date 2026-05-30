import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ==========================================
// HIGH-FIDELITY OFFLINE CIRCUITS PATH DATABASE
// ==========================================
const SAKHIR_PATH = [
  {"x":-408,"y":723},{"x":-382,"y":1237},{"x":-346,"y":2034},{"x":-323,"y":2590},{"x":-290,"y":3303},{"x":-271,"y":3792},{"x":-245,"y":4511},{"x":-227,"y":5035},{"x":-209,"y":5588},{"x":-187,"y":6291},{"x":-172,"y":6859},{"x":-155,"y":7403},{"x":-139,"y":7768},{"x":-120,"y":8016},{"x":-93,"y":8153},{"x":-22,"y":8280},{"x":100,"y":8346},{"x":245,"y":8302},{"x":331,"y":8233},{"x":446,"y":8115},{"x":614,"y":7965},{"x":981,"y":7863},{"x":1346,"y":7918},{"x":1632,"y":8002},{"x":2038,"y":8071},{"x":2612,"y":8026},{"x":3224,"y":7905},{"x":3741,"y":7800},{"x":4524,"y":7642},{"x":5173,"y":7514},{"x":5727,"y":7409},{"x":6186,"y":7325},{"x":6567,"y":7256},{"x":7050,"y":7161},{"x":7355,"y":7019},{"x":7485,"y":6833},{"x":7489,"y":6626},{"x":7428,"y":6435},{"x":7273,"y":6228},{"x":7128,"y":6101},{"x":6866,"y":5914},{"x":6581,"y":5707},{"x":6371,"y":5536},{"x":5972,"y":5090},{"x":5619,"y":4544},{"x":5285,"y":4255},{"x":5038,"y":4190},{"x":4523,"y":4188},{"x":4145,"y":4117},{"x":3883,"y":3990},{"x":3580,"y":3712},{"x":3324,"y":3334},{"x":3131,"y":3007},{"x":2926,"y":2714},{"x":2771,"y":2542},{"x":2590,"y":2460},{"x":2413,"y":2523},{"x":2349,"y":2630},{"x":2298,"y":2796},{"x":2292,"y":3009},{"x":2338,"y":3339},{"x":2410,"y":3675},{"x":2513,"y":4149},{"x":2614,"y":4586},{"x":2708,"y":5090},{"x":2755,"y":5619},{"x":2667,"y":6067},{"x":2508,"y":6356},{"x":2318,"y":6539},{"x":2167,"y":6608},{"x":2012,"y":6585},{"x":1924,"y":6474},{"x":1881,"y":6345},{"x":1852,"y":6198},{"x":1828,"y":6014},{"x":1800,"y":5748},{"x":1780,"y":5510},{"x":1749,"y":5010},{"x":1724,"y":4577},{"x":1704,"y":4153},{"x":1668,"y":3428},{"x":1647,"y":2945},{"x":1626,"y":2461},{"x":1599,"y":1905},{"x":1566,"y":1243},{"x":1539,"y":749},{"x":1518,"y":122},{"x":1569,"y":-227},{"x":1701,"y":-476},{"x":1935,"y":-614},{"x":2116,"y":-663},{"x":2387,"y":-650},{"x":2830,"y":-447},{"x":3149,"y":-112},{"x":3357,"y":292},{"x":3560,"y":777},{"x":3848,"y":1183},{"x":4430,"y":1539},{"x":4870,"y":1615},{"x":5293,"y":1535},{"x":5666,"y":1363},{"x":6221,"y":1091},{"x":6531,"y":852},{"x":6664,"y":491},{"x":6612,"y":208},{"x":6429,"y":-33},{"x":6203,"y":-203},{"x":5824,"y":-410},{"x":5438,"y":-611},{"x":4999,"y":-844},{"x":4572,"y":-1075},{"x":4150,"y":-1308},{"x":3802,"y":-1502},{"x":3411,"y":-1720},{"x":2906,"y":-2001},{"x":2250,"y":-2366},{"x":1836,"y":-2599},{"x":1199,"y":-2962},{"x":791,"y":-3194},{"x":447,"y":-3383},{"x":94,"y":-3495},{"x":-141,"y":-3474},{"x":-322,"y":-3326},{"x":-487,"y":-3044},{"x":-556,"y":-2784},{"x":-577,"y":-2393},{"x":-564,"y":-2093},{"x":-539,"y":-1695},{"x":-511,"y":-1185},{"x":-476,"y":-559},{"x":-454,"y":-143},{"x":-404,"y":796},{"x":-362,"y":1665}
];

const MONACO_PATH = [
  {x: 150, y: 80}, {x: 220, y: 80}, {x: 270, y: 70}, {x: 290, y: 90},
  {x: 270, y: 130}, {x: 240, y: 160}, {x: 210, y: 200}, {x: 190, y: 230},
  {x: 170, y: 260}, {x: 140, y: 270}, {x: 120, y: 250}, {x: 100, y: 220},
  {x: 80, y: 200}, {x: 50, y: 190}, {x: 30, y: 210}, {x: 40, y: 230},
  {x: 60, y: 250}, {x: 80, y: 265}, {x: 105, y: 255}, {x: 140, y: 225},
  {x: 190, y: 185}, {x: 230, y: 145}, {x: 275, y: 100}, {x: 300, y: 65},
  {x: 285, y: 40}, {x: 260, y: 35}, {x: 220, y: 45}, {x: 180, y: 55},
  {x: 140, y: 65}, {x: 110, y: 50}, {x: 80, y: 35}, {x: 60, y: 50},
  {x: 50, y: 75}, {x: 65, y: 95}, {x: 85, y: 105}, {x: 100, y: 92}
];

const SILVERSTONE_PATH = [
  {x: 100, y: 150}, {x: 200, y: 150}, {x: 300, y: 150}, 
  {x: 340, y: 170}, {x: 360, y: 210}, {x: 330, y: 240}, 
  {x: 280, y: 230}, {x: 240, y: 250}, {x: 220, y: 290}, 
  {x: 250, y: 350}, {x: 300, y: 400}, {x: 350, y: 450}, 
  {x: 380, y: 470}, {x: 370, y: 500}, {x: 320, y: 480}, 
  {x: 270, y: 450}, {x: 240, y: 470}, {x: 220, y: 510}, 
  {x: 240, y: 560}, {x: 280, y: 580}, {x: 330, y: 580}, 
  {x: 390, y: 560}, {x: 420, y: 530},                   
  {x: 440, y: 490}, {x: 410, y: 460}, {x: 440, y: 430}, 
  {x: 470, y: 400}, {x: 500, y: 350}, {x: 530, y: 290}, 
  {x: 560, y: 220}, {x: 580, y: 160},                   
  {x: 560, y: 110}, {x: 520, y: 90},  {x: 460, y: 120}, 
  {x: 380, y: 130}, {x: 250, y: 140}
];

const MONZA_PATH = [
  {x: 100, y: 100}, {x: 200, y: 100}, {x: 300, y: 100}, 
  {x: 350, y: 90}, {x: 370, y: 120}, {x: 340, y: 140},  
  {x: 300, y: 160}, {x: 260, y: 200}, {x: 240, y: 260}, 
  {x: 240, y: 320}, {x: 250, y: 360}, {x: 230, y: 390}, 
  {x: 190, y: 380}, {x: 160, y: 400}, {x: 150, y: 430}, 
  {x: 160, y: 470}, {x: 190, y: 480}, {x: 210, y: 510}, 
  {x: 250, y: 490}, {x: 300, y: 450}, {x: 350, y: 400}, 
  {x: 380, y: 370}, {x: 400, y: 390}, {x: 380, y: 410}, 
  {x: 330, y: 420}, {x: 260, y: 430}, {x: 180, y: 440}, 
  {x: 100, y: 440}, {x: 60, y: 390},  {x: 50, y: 310},  
  {x: 60, y: 220},  {x: 80, y: 140}
];

const SPA_PATH = [
  {x: 100, y: 100}, {x: 120, y: 130}, {x: 110, y: 160}, 
  {x: 80, y: 180},  {x: 90, y: 220},  {x: 120, y: 250}, 
  {x: 150, y: 260}, {x: 190, y: 240},                   
  {x: 240, y: 220}, {x: 300, y: 200}, {x: 360, y: 180}, 
  {x: 400, y: 170}, {x: 420, y: 190}, {x: 390, y: 210}, 
  {x: 350, y: 230}, {x: 330, y: 260}, {x: 340, y: 290}, 
  {x: 370, y: 310}, {x: 400, y: 320}, {x: 410, y: 350}, 
  {x: 380, y: 390}, {x: 330, y: 410}, {x: 270, y: 400}, 
  {x: 220, y: 380}, {x: 190, y: 390}, {x: 170, y: 420}, 
  {x: 180, y: 460}, {x: 210, y: 470}, {x: 240, y: 490}, 
  {x: 280, y: 470}, {x: 320, y: 430}, {x: 360, y: 420}, 
  {x: 400, y: 430}, {x: 420, y: 400}, {x: 430, y: 340}, 
  {x: 410, y: 280}, {x: 380, y: 240},                   
  {x: 330, y: 250}, {x: 250, y: 220}, {x: 180, y: 160},
  {x: 120, y: 110}
];

const getOfflineTrackPath = (meetingName = '', location = '') => {
  const name = `${meetingName || ''} ${location || ''}`.toLowerCase();
  if (name.includes('monaco')) return MONACO_PATH;
  if (name.includes('silverstone') || name.includes('british') || name.includes('great britain')) return SILVERSTONE_PATH;
  if (name.includes('monza') || name.includes('italy') || name.includes('italian')) return MONZA_PATH;
  if (name.includes('spa') || name.includes('belgian') || name.includes('belgium')) return SPA_PATH;
  return SAKHIR_PATH;
};

// ==========================================
// OFFLINE SEASON CALENDARS (2021 & 2022)
// ==========================================
const MOCK_MEETINGS_2022 = [
  { meeting_key: '202201', meeting_name: 'Bahrain Grand Prix', location: 'Sakhir' },
  { meeting_key: '202202', meeting_name: 'Saudi Arabian Grand Prix', location: 'Jeddah' },
  { meeting_key: '202203', meeting_name: 'Australian Grand Prix', location: 'Melbourne' },
  { meeting_key: '202204', meeting_name: 'Emilia Romagna Grand Prix', location: 'Imola' },
  { meeting_key: '202205', meeting_name: 'Miami Grand Prix', location: 'Miami' },
  { meeting_key: '202206', meeting_name: 'Spanish Grand Prix', location: 'Barcelona' },
  { meeting_key: '202207', meeting_name: 'Monaco Grand Prix', location: 'Monaco' },
  { meeting_key: '202208', meeting_name: 'Canadian Grand Prix', location: 'Montreal' },
  { meeting_key: '202209', meeting_name: 'British Grand Prix', location: 'Silverstone' },
  { meeting_key: '202210', meeting_name: 'Austrian Grand Prix', location: 'Spielberg' },
  { meeting_key: '202211', meeting_name: 'Belgian Grand Prix', location: 'Spa-Francorchamps' },
  { meeting_key: '202212', meeting_name: 'Dutch Grand Prix', location: 'Zandvoort' },
  { meeting_key: '202213', meeting_name: 'Italian Grand Prix', location: 'Monza' },
  { meeting_key: '202214', meeting_name: 'Singapore Grand Prix', location: 'Marina Bay' },
  { meeting_key: '202215', meeting_name: 'Japanese Grand Prix', location: 'Suzuka' },
  { meeting_key: '202216', meeting_name: 'United States Grand Prix', location: 'Austin' },
  { meeting_key: '202217', meeting_name: 'Mexico City Grand Prix', location: 'Mexico City' },
  { meeting_key: '202218', meeting_name: 'Sao Paulo Grand Prix', location: 'Interlagos' },
  { meeting_key: '202219', meeting_name: 'Abu Dhabi Grand Prix', location: 'Yas Marina' }
];

const MOCK_MEETINGS_2021 = [
  { meeting_key: '202101', meeting_name: 'Bahrain Grand Prix', location: 'Sakhir' },
  { meeting_key: '202102', meeting_name: 'Emilia Romagna Grand Prix', location: 'Imola' },
  { meeting_key: '202103', meeting_name: 'Portuguese Grand Prix', location: 'Portimão' },
  { meeting_key: '202104', meeting_name: 'Spanish Grand Prix', location: 'Barcelona' },
  { meeting_key: '202105', meeting_name: 'Monaco Grand Prix', location: 'Monaco' },
  { meeting_key: '202106', meeting_name: 'Azerbaijan Grand Prix', location: 'Baku' },
  { meeting_key: '202107', meeting_name: 'French Grand Prix', location: 'Paul Ricard' },
  { meeting_key: '202108', meeting_name: 'Styrian Grand Prix', location: 'Spielberg' },
  { meeting_key: '202109', meeting_name: 'Austrian Grand Prix', location: 'Spielberg' },
  { meeting_key: '202110', meeting_name: 'British Grand Prix', location: 'Silverstone' },
  { meeting_key: '202111', meeting_name: 'Hungarian Grand Prix', location: 'Budapest' },
  { meeting_key: '202112', meeting_name: 'Belgian Grand Prix', location: 'Spa-Francorchamps' },
  { meeting_key: '202113', meeting_name: 'Dutch Grand Prix', location: 'Zandvoort' },
  { meeting_key: '202114', meeting_name: 'Italian Grand Prix', location: 'Monza' },
  { meeting_key: '202115', meeting_name: 'Russian Grand Prix', location: 'Sochi' },
  { meeting_key: '202116', meeting_name: 'Turkish Grand Prix', location: 'Istanbul' },
  { meeting_key: '202117', meeting_name: 'United States Grand Prix', location: 'Austin' },
  { meeting_key: '202118', meeting_name: 'Mexico City Grand Prix', location: 'Mexico City' },
  { meeting_key: '202119', meeting_name: 'São Paulo Grand Prix', location: 'Interlagos' },
  { meeting_key: '202120', meeting_name: 'Qatar Grand Prix', location: 'Losail' },
  { meeting_key: '202121', meeting_name: 'Saudi Arabian Grand Prix', location: 'Jeddah' },
  { meeting_key: '202122', meeting_name: 'Abu Dhabi Grand Prix', location: 'Yas Marina' }
];

const MOCK_DRIVERS = [
  { driver_number: 1, name_acronym: 'VER', broadcast_name: 'M VERSTAPPEN', team_name: 'Red Bull Racing', team_colour: '3671c6', last_lap: '1:34.128', interval: 'LEADER', tyre: '🔴 Soft', tyre_age: 4, pos: 1, progress: 120, lap: 3, speedFactor: 1.03, speed: 280 },
  { driver_number: 44, name_acronym: 'HAM', broadcast_name: 'L HAMILTON', team_name: 'Mercedes', team_colour: '27f4d2', last_lap: '1:34.524', interval: '+1.850', tyre: '🟡 Medium', tyre_age: 12, pos: 2, progress: 110, lap: 3, speedFactor: 1.01, speed: 275 },
  { driver_number: 16, name_acronym: 'LEC', broadcast_name: 'C LECLERC', team_name: 'Ferrari', team_colour: 'e80020', last_lap: '1:34.852', interval: '+3.700', tyre: '🟡 Medium', tyre_age: 14, pos: 3, progress: 100, lap: 3, speedFactor: 1.01, speed: 272 },
  { driver_number: 4, name_acronym: 'NOR', broadcast_name: 'L NORRIS', team_name: 'McLaren', team_colour: 'ff8000', last_lap: '1:34.319', interval: '+5.550', tyre: '⚪ Hard', tyre_age: 8, pos: 4, progress: 90, lap: 3, speedFactor: 1.00, speed: 270 },
  { driver_number: 63, name_acronym: 'RUS', broadcast_name: 'G RUSSELL', team_name: 'Mercedes', team_colour: '27f4d2', last_lap: '1:35.112', interval: '+7.400', tyre: '🔴 Soft', tyre_age: 5, pos: 5, progress: 80, lap: 3, speedFactor: 0.99, speed: 268 },
  { driver_number: 55, name_acronym: 'SAI', broadcast_name: 'C SAINZ', team_name: 'Ferrari', team_colour: 'e80020', last_lap: '1:34.910', interval: '+9.250', tyre: '⚪ Hard', tyre_age: 18, pos: 6, progress: 70, lap: 3, speedFactor: 0.99, speed: 265 },
  { driver_number: 11, name_acronym: 'PER', broadcast_name: 'S PEREZ', team_name: 'Red Bull Racing', team_colour: '3671c6', last_lap: '1:35.240', interval: '+11.100', tyre: '🟡 Medium', tyre_age: 15, pos: 7, progress: 60, lap: 3, speedFactor: 0.98, speed: 262 },
  { driver_number: 81, name_acronym: 'PIA', broadcast_name: 'O PIASTRI', team_name: 'McLaren', team_colour: 'ff8000', last_lap: '1:35.380', interval: '+12.950', tyre: '⚪ Hard', tyre_age: 9, pos: 8, progress: 50, lap: 3, speedFactor: 0.98, speed: 260 },
  { driver_number: 14, name_acronym: 'ALO', broadcast_name: 'F ALONSO', team_name: 'Aston Martin', team_colour: '229971', last_lap: '1:35.510', interval: '+14.800', tyre: '🟡 Medium', tyre_age: 11, pos: 9, progress: 40, lap: 3, speedFactor: 0.98, speed: 258 },
  { driver_number: 10, name_acronym: 'GAS', broadcast_name: 'P GASLY', team_name: 'Alpine', team_colour: 'ff66c4', last_lap: '1:35.750', interval: '+16.650', tyre: '🔴 Soft', tyre_age: 6, pos: 10, progress: 30, lap: 3, speedFactor: 0.97, speed: 255 }
];

const MOCK_RACE_CONTROL = [
  "FIA: DRS ENABLED IN SECTOR 1 AND SECTOR 3",
  "RACE DIRECTOR: CAR 4 (NOR) UNDER INVESTIGATION - TRACK LIMITS TURN 4",
  "MERCEDES PIT: Hamilton, we suspect Verstappen is running out of tyre life. Push now.",
  "RED BULL PIT: Max, wind has shifted to a tailwind on main straight. Adjust differential.",
  "FIA: GREEN FLAG - ALL SECTORS CLEAR",
  "FERRARI PIT: Leclerc, plan B, plan B. Monitor track temp, it is climbing."
];

const Dashboard = () => {
  const { user, logout, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('pitwall'); // pitwall, diagnostics

  // Dynamic Year & Grand Prix selection
  const [selectedYear, setSelectedYear] = useState('2024');
  const [meetings, setMeetings] = useState([{ meeting_key: 1229, meeting_name: 'Bahrain Grand Prix', location: 'Sakhir' }]);
  const [selectedMeetingKey, setSelectedMeetingKey] = useState('1229');
  const [sessionKey, setSessionKey] = useState('9472');

  // Main UI states
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState(1); // Verstappen
  const [compareDriver, setCompareDriver] = useState(null); // Optional overlay
  const [weather, setWeather] = useState({ air_temp: 18.9, track_temp: 26.5, humidity: 46, wind_speed: 1.2, rainfall: 0 });
  const [flagStatus, setFlagStatus] = useState('GREEN'); // GREEN, YELLOW, RED, SAFETY CAR
  const [raceControl, setRaceControl] = useState(MOCK_RACE_CONTROL);
  const [newControlMsg, setNewControlMsg] = useState('');

  // Replay states
  const [isPlaying, setIsPlaying] = useState(true);
  const [trackPath, setTrackPath] = useState(SAKHIR_PATH);
  const [loading, setLoading] = useState(false);

  // Playback Telemetry history for rolling line graph
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [compareHistory, setCompareHistory] = useState([]);
  const timerRef = useRef(null);

  // Active driver details helper
  const activeDriverInfo = drivers.find(d => d.driver_number === selectedDriver) || MOCK_DRIVERS[0];
  const compareDriverInfo = compareDriver ? drivers.find(d => d.driver_number === compareDriver) : null;

  // Track map dynamic bounds calculation
  const xCoords = trackPath.map(p => p.x);
  const yCoords = trackPath.map(p => p.y);
  const minX = xCoords.length ? Math.min(...xCoords) : -1000;
  const maxX = xCoords.length ? Math.max(...xCoords) : 8000;
  const minY = yCoords.length ? Math.min(...yCoords) : -4000;
  const maxY = yCoords.length ? Math.max(...yCoords) : 9000;

  const dx = maxX - minX || 1;
  const dy = maxY - minY || 1;
  const padding = 15;
  const svgW = 400;
  const svgH = 260;

  // Map coordinate bounds dynamically to fits SVG viewBox
  const scaleX = (x) => padding + ((x - minX) / dx) * (svgW - 2 * padding);
  const scaleY = (y) => padding + (1 - (y - minY) / dy) * (svgH - 2 * padding); // Inverted Y

  const getInterpolatedCoords = (progress) => {
    if (!trackPath || trackPath.length === 0) return { x: 0, y: 0 };
    const i = Math.floor(progress) % trackPath.length;
    const nextIdx = (i + 1) % trackPath.length;
    const t = progress - Math.floor(progress);
    
    const p1 = trackPath[i];
    const p2 = trackPath[nextIdx];
    
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t
    };
  };

  const activeDriverObj = drivers.find(d => d.driver_number === selectedDriver);
  const compareDriverObj = compareDriver ? drivers.find(d => d.driver_number === compareDriver) : null;

  const activeCoords = activeDriverObj ? getInterpolatedCoords(activeDriverObj.progress) : (trackPath[0] || { x: 0, y: 0 });
  const compareCoords = compareDriverObj ? getInterpolatedCoords(compareDriverObj.progress) : null;

  // ==========================================
  // FETCH 1: DYNAMIC MEETING LIST ON YEAR SELECTION
  // ==========================================
  const loadMeetingsForYear = useCallback(async (year) => {
    if (year === '2022') {
      setMeetings(MOCK_MEETINGS_2022);
      setSelectedMeetingKey(MOCK_MEETINGS_2022[0].meeting_key.toString());
      return;
    }
    if (year === '2021') {
      setMeetings(MOCK_MEETINGS_2021);
      setSelectedMeetingKey(MOCK_MEETINGS_2021[0].meeting_key.toString());
      return;
    }
    try {
      const res = await axios.get(`https://api.openf1.org/v1/meetings?year=${year}`);
      if (res.data && res.data.length > 0) {
        const filtered = res.data.filter(m => !m.meeting_name.includes('Testing') && !m.is_cancelled);
        setMeetings(filtered);
        // Auto-select the first Grand Prix of the year
        setSelectedMeetingKey(filtered[0].meeting_key.toString());
      }
    } catch (err) {
      console.warn("Failed to fetch meetings. Offline fallback active.", err);
      setMeetings(MOCK_MEETINGS_2022);
      setSelectedMeetingKey(MOCK_MEETINGS_2022[0].meeting_key.toString());
    }
  }, []);

  useEffect(() => {
    loadMeetingsForYear(selectedYear);
  }, [selectedYear, loadMeetingsForYear]);

  // ==========================================
  // FETCH 2: DYNAMIC DATA LOAD ON GRAND PRIX SELECTION
  // ==========================================
  const loadGrandPrixData = useCallback(async (meetingKey) => {
    setLoading(true);
    try {
      const selectedM = meetings.find(m => m.meeting_key.toString() === meetingKey.toString());
      const isOfflineYear = selectedYear === '2021' || selectedYear === '2022';
      
      let activeSessionKey = 'offline';
      let driversData = [];
      let weatherData = null;
      let pathData = null;

      if (!isOfflineYear) {
        try {
          // 1. Fetch Session Key for the Grand Prix race
          const sessionRes = await axios.get(`https://api.openf1.org/v1/sessions?meeting_key=${meetingKey}&session_name=Race`);
          if (sessionRes.data && sessionRes.data.length > 0) {
            activeSessionKey = sessionRes.data[0].session_key;
            setSessionKey(activeSessionKey.toString());

            // 2. Fetch Drivers list
            const driversRes = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${activeSessionKey}`);
            if (driversRes.data && driversRes.data.length > 0) {
              driversData = driversRes.data.slice(0, 10);
            }

            // 3. Dynamic Circuit Map: Fetch exactly one clean racing lap dynamically
            const leadDriverNum = driversData.length > 0 ? driversData[0].driver_number : 1;
            const lapsRes = await axios.get(`https://api.openf1.org/v1/laps?session_key=${activeSessionKey}&driver_number=${leadDriverNum}`);
            if (lapsRes.data && lapsRes.data.length > 5) {
              const lap3 = lapsRes.data.find(l => l.lap_number === 3);
              const lap4 = lapsRes.data.find(l => l.lap_number === 4);
              if (lap3 && lap4) {
                const locRes = await axios.get(`https://api.openf1.org/v1/location?session_key=${activeSessionKey}&driver_number=${leadDriverNum}&date>=${lap3.date_start}&date<=${lap4.date_start}`);
                if (locRes.data && locRes.data.length > 5) {
                  const downsampled = [];
                  const skip = Math.max(1, Math.floor(locRes.data.length / 120));
                  for (let i = 0; i < locRes.data.length; i += skip) {
                    downsampled.push({ x: locRes.data[i].x, y: locRes.data[i].y });
                  }
                  if (downsampled.length > 10) {
                    pathData = downsampled;
                  }
                }
              }
            }

            // 4. Fetch Weather metrics
            const weatherRes = await axios.get(`https://api.openf1.org/v1/weather?session_key=${activeSessionKey}`);
            if (weatherRes.data && weatherRes.data.length > 0) {
              const latest = weatherRes.data[weatherRes.data.length - 1];
              weatherData = {
                air_temp: latest.air_temperature || 19,
                track_temp: latest.track_temperature || 26.5,
                humidity: latest.humidity || 45,
                wind_speed: latest.wind_speed || 1.1,
                rainfall: latest.rainfall || 0
              };
            }
          }
        } catch (apiErr) {
          console.warn("OpenF1 API call failed, falling back to local simulation.", apiErr);
        }
      }

      // If we don't have drivers data, populate with mock drivers
      if (driversData.length === 0) {
        driversData = [
          { driver_number: 1, name_acronym: 'VER', broadcast_name: 'M VERSTAPPEN', team_name: 'Red Bull Racing', team_colour: '3671c6' },
          { driver_number: 44, name_acronym: 'HAM', broadcast_name: 'L HAMILTON', team_name: 'Mercedes', team_colour: '27f4d2' },
          { driver_number: 16, name_acronym: 'LEC', broadcast_name: 'C LECLERC', team_name: 'Ferrari', team_colour: 'e80020' },
          { driver_number: 4, name_acronym: 'NOR', broadcast_name: 'L NORRIS', team_name: 'McLaren', team_colour: 'ff8000' },
          { driver_number: 63, name_acronym: 'RUS', broadcast_name: 'G RUSSELL', team_name: 'Mercedes', team_colour: '27f4d2' },
          { driver_number: 55, name_acronym: 'SAI', broadcast_name: 'C SAINZ', team_name: 'Ferrari', team_colour: 'e80020' },
          { driver_number: 11, name_acronym: 'PER', broadcast_name: 'S PEREZ', team_name: 'Red Bull Racing', team_colour: '3671c6' },
          { driver_number: 81, name_acronym: 'PIA', broadcast_name: 'O PIASTRI', team_name: 'McLaren', team_colour: 'ff8000' },
          { driver_number: 14, name_acronym: 'ALO', broadcast_name: 'F ALONSO', team_name: 'Aston Martin', team_colour: '229971' },
          { driver_number: 10, name_acronym: 'GAS', broadcast_name: 'P GASLY', team_name: 'Alpine', team_colour: 'ff66c4' }
        ];
      }

      // Resolve Track path from DB or fallback
      const resolvedPath = pathData || getOfflineTrackPath(selectedM?.meeting_name, selectedM?.location);
      setTrackPath(resolvedPath);

      // Map dynamic drivers simulation state
      const mappedDrivers = driversData.map((d, index) => {
        const startProgress = Math.max(0, resolvedPath.length - index * (resolvedPath.length / driversData.length));
        return {
          driver_number: d.driver_number,
          name_acronym: d.name_acronym,
          broadcast_name: d.broadcast_name,
          team_name: d.team_name,
          team_colour: d.team_colour || 'cccccc',
          last_lap: index === 0 ? '1:34.128' : `1:34.${500 + index * 24}`,
          interval: index === 0 ? 'LEADER' : `+${(index * 1.85).toFixed(3)}`,
          tyre: index % 3 === 0 ? '🔴 Soft' : index % 3 === 1 ? '🟡 Medium' : '⚪ Hard',
          tyre_age: 4 + index * 2,
          pos: index + 1,
          lap: 3,
          progress: startProgress,
          speedFactor: 1.0 + (driversData.length - index) * 0.003,
          speed: 250
        };
      });

      setDrivers(mappedDrivers);
      setSelectedDriver(mappedDrivers[0].driver_number);
      setCompareDriver(null);

      // Weather fallback
      if (!weatherData) {
        weatherData = { air_temp: 21.2, track_temp: 31.4, humidity: 38, wind_speed: 1.8, rainfall: 0 };
      }
      setWeather(weatherData);

    } catch (err) {
      console.error("Critical error in loadGrandPrixData", err);
    } finally {
      setLoading(false);
    }
  }, [meetings, selectedYear]);

  useEffect(() => {
    if (selectedMeetingKey) {
      loadGrandPrixData(selectedMeetingKey);
    }
  }, [selectedMeetingKey, loadGrandPrixData]);

  // Dynamic Telemetry Generator
  const getDynamicTelemetry = (index, driverNum) => {
    if (!trackPath || trackPath.length === 0) return { speed: 0, rpm: 0, throttle: 0, brake: 0, gear: 'N', drs: 0 };
    
    const totalPoints = trackPath.length;
    const ratio = index / totalPoints;

    let throttle = 100;
    let brake = 0;
    let speed = 280;
    let gear = 7;
    let drs = 0;

    // Corner 1: Heavy braking
    if (ratio >= 0.08 && ratio <= 0.18) {
      throttle = 15;
      brake = 85;
      speed = 85;
      gear = 2;
    }
    // Corner 2: Medium sweeper
    else if (ratio >= 0.28 && ratio <= 0.35) {
      throttle = 30;
      brake = 60;
      speed = 135;
      gear = 3;
    }
    // Corner 3: Hairpin
    else if (ratio >= 0.52 && ratio <= 0.60) {
      throttle = 10;
      brake = 90;
      speed = 70;
      gear = 1;
    }
    // Corner 4: Downhill sweep
    else if (ratio >= 0.65 && ratio <= 0.72) {
      throttle = 20;
      brake = 75;
      speed = 110;
      gear = 3;
    }
    // Straights
    else if (ratio >= 0.88 || ratio <= 0.05) {
      throttle = 100;
      brake = 0;
      speed = 328;
      gear = 8;
      drs = 1;
    }

    if (driverNum === 1) {
      speed = Math.min(340, Math.floor(speed * 1.02));
    } else {
      speed = Math.floor(speed * 0.98);
    }

    speed = Math.max(0, speed + (index % 5) - 2);
    const rpm = speed === 0 ? 0 : Math.floor(6000 + (speed / 340) * 6500 + (index % 3) * 200);

    return { speed, rpm, throttle, brake, gear, drs };
  };

  // ==========================================
  // PLAYBACK REPLAY ENGINE & DYNAMIC LEADERBOARD
  // ==========================================
  useEffect(() => {
    if (!isPlaying || trackPath.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const parseLapTimeToSeconds = (str) => {
      if (!str || typeof str !== 'string') return 90;
      const parts = str.split(':');
      if (parts.length < 2) return parseFloat(str) || 90;
      const mins = parseInt(parts[0], 10);
      const secs = parseFloat(parts[1]);
      return mins * 60 + secs;
    };

    timerRef.current = setInterval(() => {
      // Step 1: Update progress and physics for all drivers!
      setDrivers(prevDrivers => {
        const nextDrivers = prevDrivers.map(d => {
          const idx = Math.floor(d.progress) % trackPath.length;
          const tel = getDynamicTelemetry(idx, d.driver_number);
          let baseSpeed = tel.speed;
          
          // Driver speed delta + random noise + DRS boost
          const randomFactor = 1.0 + (Math.random() * 0.04 - 0.02);
          let drsBoost = 1.0;
          if (tel.drs === 1) {
            drsBoost = 1.05; // 5% boost in DRS zone
          }
          
          const speed = baseSpeed * (d.speedFactor || 1.0) * randomFactor * drsBoost;
          
          // Exact time-calibrated physical step delta:
          const lapSeconds = parseLapTimeToSeconds(d.last_lap);
          const dt = 0.06; // 60ms interval is 0.06s
          const stepDelta = trackPath.length * (dt / lapSeconds) * (speed / 220);
          
          let nextProgress = d.progress + stepDelta;
          let nextLap = d.lap || 3;
          let nextTyreAge = d.tyre_age || 4;
          let nextLastLap = d.last_lap || '1:34.250';

          if (nextProgress >= trackPath.length) {
            nextProgress = nextProgress % trackPath.length;
            nextLap += 1;
            nextTyreAge += 1;
            
            // Generate a realistic new lap time!
            const lapBaseSecs = 90 + (10 - d.pos) * 0.15 + Math.random() * 0.5;
            const mins = Math.floor(lapBaseSecs / 60);
            const secs = Math.floor(lapBaseSecs % 60);
            const ms = Math.floor((lapBaseSecs % 1) * 1000);
            nextLastLap = `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
          }

          return {
            ...d,
            progress: nextProgress,
            lap: nextLap,
            tyre_age: nextTyreAge,
            last_lap: nextLastLap,
            speed: Math.round(speed)
          };
        });

        // Step 2: Sort leaderboard based on total completed distance
        const sorted = [...nextDrivers].sort((a, b) => {
          const distA = (a.lap || 3) * trackPath.length + a.progress;
          const distB = (b.lap || 3) * trackPath.length + b.progress;
          return distB - distA;
        });

        // Step 3: Recalculate gaps relative to the leader
        const leader = sorted[0];
        const leaderDist = (leader.lap || 3) * trackPath.length + leader.progress;

        const updatedWithPositions = sorted.map((d, index) => {
          let interval = 'LEADER';
          if (index > 0) {
            const distDiff = leaderDist - ((d.lap || 3) * trackPath.length + d.progress);
            const gapSecs = (distDiff / trackPath.length) * 94; // assume ~94s lap time
            interval = `+${gapSecs.toFixed(3)}`;
          }

          return {
            ...d,
            pos: index + 1,
            interval
          };
        });

        // Step 4: Keep high-frequency telemetry historical tracks in sync
        const activeDrv = updatedWithPositions.find(d => d.driver_number === selectedDriver) || updatedWithPositions[0];
        const activeTel = activeDrv
          ? {
              ...getDynamicTelemetry(Math.floor(activeDrv.progress) % trackPath.length, activeDrv.driver_number),
              speed: activeDrv.speed
            }
          : { speed: 0, rpm: 0, throttle: 0, brake: 0, gear: 'N', drs: 0 };
        
        setTelemetryHistory(prev => {
          const updated = [...prev, activeTel];
          if (updated.length > 30) updated.shift();
          return updated;
        });

        if (compareDriver) {
          const compDrv = updatedWithPositions.find(d => d.driver_number === compareDriver);
          const compTel = compDrv
            ? {
                ...getDynamicTelemetry(Math.floor(compDrv.progress) % trackPath.length, compDrv.driver_number),
                speed: compDrv.speed
              }
            : { speed: 0, rpm: 0, throttle: 0, brake: 0, gear: 'N', drs: 0 };

          setCompareHistory(prev => {
            const updated = [...prev, compTel];
            if (updated.length > 30) updated.shift();
            return updated;
          });
        } else {
          setCompareHistory([]);
        }

        return updatedWithPositions;
      });
    }, 60);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, trackPath, selectedDriver, compareDriver]);

  // Construct SVG line charts
  const generateChartPath = (history, field, maxVal) => {
    if (history.length < 2) return '';
    const w = 400;
    const h = 120;
    const padding = 10;
    
    return history.map((val, i) => {
      const x = padding + (i / (history.length - 1)) * (w - 2 * padding);
      const ratio = Math.min(1, Math.max(0, val[field] / maxVal));
      const y = h - padding - ratio * (h - 2 * padding);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const addRaceControlMsg = (e) => {
    e.preventDefault();
    if (!newControlMsg.trim()) return;
    setRaceControl(prev => [`USER CONTROL: ${newControlMsg.toUpperCase()}`, ...prev.slice(0, 5)]);
    setNewControlMsg('');
  };

  return (
    <div className="dashboard-container f1-dark-theme" style={{ backgroundColor: '#0b0f19' }}>
      {/* SIDEBAR: Aegis Controls */}
      <aside className="sidebar" style={{ backgroundColor: '#111827', borderRight: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--neon-cyan) 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'black' }}>A</span>
          </div>
          <div>
            <h3 style={{ fontSize: '15px', color: '#f9fafb', fontWeight: '700', lineHeight: '1.2' }}>Aegis Portal</h3>
            <span style={{ fontSize: '10px', color: 'var(--neon-cyan)', fontWeight: '700', letterSpacing: '0.05em' }}>TELEMETRY OK</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <button
            onClick={() => setActiveTab('pitwall')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '13px', fontWeight: '600',
              background: activeTab === 'pitwall' ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
              color: activeTab === 'pitwall' ? 'var(--neon-cyan)' : '#9ca3af',
              borderLeft: activeTab === 'pitwall' ? '3px solid var(--neon-cyan)' : '3px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"></rect>
              <rect x="14" y="3" width="7" height="5"></rect>
              <rect x="14" y="12" width="7" height="9"></rect>
              <rect x="3" y="16" width="7" height="5"></rect>
            </svg>
            Pit Wall console
          </button>
          
          <button
            onClick={() => setActiveTab('diagnostics')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', outline: 'none', fontSize: '13px', fontWeight: '600',
              background: activeTab === 'diagnostics' ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
              color: activeTab === 'diagnostics' ? 'var(--neon-cyan)' : '#9ca3af',
              borderLeft: activeTab === 'diagnostics' ? '3px solid var(--neon-cyan)' : '3px solid transparent',
              transition: 'all 0.15s'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Server Status
          </button>
        </nav>

        {/* User security Profile Footer */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--neon-cyan) 0%, #0369a1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: 'black' }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h5 style={{ color: '#f9fafb', fontSize: '13px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: '600' }}>{user?.name}</h5>
            <span style={{ color: '#9ca3af', fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', display: 'block' }}>{user?.email}</span>
          </div>
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', color: 'var(--neon-red)', cursor: 'pointer', outline: 'none', padding: '4px', borderRadius: '6px' }}
            title="Safe sign out session"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--neon-red)'}}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </aside>

      {/* MAIN PIT-WALL HUB PANEL */}
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* TOP PANEL BAR: Session Controls & Flag Alert Status */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ color: 'var(--neon-cyan)', fontSize: '11px', fontWeight: '800', letterSpacing: '0.1em' }}>LIVE PIT WALL FEED</span>
              
              {/* Year Selector */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  backgroundColor: '#111827', color: '#f9fafb', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '11px', padding: '4px 10px', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: '600'
                }}
              >
                <option value="2025">2025 Season</option>
                <option value="2024">2024 Season</option>
                <option value="2023">2023 Season</option>
                <option value="2022">2022 Season</option>
                <option value="2021">2021 Season</option>
              </select>

              {/* Dynamic Grand Prix Selector */}
              <select
                value={selectedMeetingKey}
                onChange={(e) => setSelectedMeetingKey(e.target.value)}
                style={{
                  backgroundColor: '#111827', color: '#f9fafb', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '11px', padding: '4px 10px', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: '600'
                }}
              >
                {meetings.map(m => (
                  <option key={m.meeting_key} value={m.meeting_key}>{m.meeting_name} ({m.location})</option>
                ))}
              </select>
            </div>
            <h1 style={{ fontSize: '24px', color: '#f9fafb', marginTop: '6px' }}>Telemetry Control Center</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <select
              value={flagStatus}
              onChange={(e) => setFlagStatus(e.target.value)}
              style={{
                backgroundColor: '#111827', color: '#f9fafb', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '11px', padding: '4px 10px', outline: 'none', cursor: 'pointer', fontWeight: '700'
              }}
            >
              <option value="GREEN">🟢 TRACK GREEN</option>
              <option value="YELLOW">🟡 YELLOW SECTOR</option>
              <option value="SAFETY CAR">⚫ SAFETY CAR</option>
              <option value="RED">🔴 SESSION RED</option>
            </select>

            <span
              className={`neon-glow-${flagStatus === 'GREEN' ? 'green' : flagStatus === 'RED' ? 'red' : 'cyan'}`}
              style={{
                fontSize: '11px',
                background: flagStatus === 'GREEN' ? 'rgba(16, 185, 129, 0.15)' : flagStatus === 'RED' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(249, 115, 22, 0.15)',
                color: flagStatus === 'GREEN' ? 'var(--neon-green)' : flagStatus === 'RED' ? 'var(--neon-red)' : 'var(--neon-orange)',
                border: flagStatus === 'GREEN' ? '1px solid rgba(16, 185, 129, 0.3)' : flagStatus === 'RED' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(249, 115, 22, 0.3)',
                padding: '6px 14px', borderRadius: '30px', fontWeight: '800', letterSpacing: '0.05em', transition: 'all 0.3s'
              }}
            >
              ● SESSION {flagStatus}
            </span>
          </div>
        </header>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.15)', borderRadius: '8px', color: 'var(--neon-cyan)', marginBottom: '16px', fontSize: '13px', fontWeight: '600' }}>
            <div className="spinner" style={{ borderTopColor: 'var(--neon-cyan)' }}></div>
            Dynamically compiling high-fidelity lap coordinates and drivers roster from OpenF1 server...
          </div>
        )}

        {activeTab === 'pitwall' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* GRID LAYER 1: Circuit Map & Active Telemetry meters */}
            <div className="dashboard-grid" style={{ marginTop: '0px' }}>
              
              {/* PANEL 1.1: HTML5 SVG Circuit Map (6 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 6', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f9fafb', fontSize: '15px' }}>Circuit Live Positioning ({meetings.find(m => m.meeting_key.toString() === selectedMeetingKey)?.location || 'Sakhir'})</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="glass-btn"
                      style={{
                        padding: '4px 12px', width: 'auto', fontSize: '11px', height: '28px', borderRadius: '6px', background: isPlaying ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', borderColor: isPlaying ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        color: isPlaying ? 'var(--neon-red)' : 'var(--neon-green)', fontWeight: '700'
                      }}
                    >
                      {isPlaying ? '⏸ PAUSE FEED' : '▶ PLAY REPLAY'}
                    </button>
                    <button
                      onClick={() => setPlaybackIndex(0)}
                      className="glass-btn"
                      style={{
                        padding: '4px 12px', width: 'auto', fontSize: '11px', height: '28px', borderRadius: '6px', background: '#1f2937', borderColor: '#374151', color: '#9ca3af', fontWeight: '700'
                      }}
                    >
                      🔄 RESET
                    </button>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px', backgroundColor: '#090d16', borderRadius: '8px', border: '1px solid #1f2937', padding: '10px' }}>
                  {trackPath.length > 0 ? (
                    <svg width="100%" height="260" viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible' }}>
                      <defs>
                        <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 211, 238, 0.03)" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#radarGrid)" />

                      {/* Dynamic Track outline */}
                      <path
                        d={trackPath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ') + ' Z'}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d={trackPath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${scaleX(p.x)} ${scaleY(p.y)}`).join(' ') + ' Z'}
                        fill="none"
                        stroke="rgba(34, 211, 238, 0.4)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Sector markings */}
                      <circle cx={scaleX(trackPath[0].x)} cy={scaleY(trackPath[0].y)} r="5" fill="#f59e0b" />
                      <text x={scaleX(trackPath[0].x) + 8} y={scaleY(trackPath[0].y) - 8} fill="#f59e0b" fontSize="8" fontWeight="800">START</text>

                      {/* Primary Driver Indicator Dot with Smooth CSS transitions */}
                      {activeCoords && (
                        <g>
                          <circle
                            cx={scaleX(activeCoords.x)}
                            cy={scaleY(activeCoords.y)}
                            r="12"
                            fill={`rgba(${activeDriverInfo.team_name.includes('Ferrari') ? '232,0,32' : activeDriverInfo.team_name.includes('Red Bull') ? '54,113,198' : '39,244,210'}, 0.25)`}
                            style={{ transition: 'cx 0.08s linear, cy 0.08s linear' }}
                          >
                            <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                          <circle
                            cx={scaleX(activeCoords.x)}
                            cy={scaleY(activeCoords.y)}
                            r="6"
                            fill={`#${activeDriverInfo.team_colour}`}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            style={{ transition: 'cx 0.08s linear, cy 0.08s linear' }}
                          />
                          <text
                            x={scaleX(activeCoords.x) + 10}
                            y={scaleY(activeCoords.y) + 4}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="800"
                            style={{ textShadow: '0 0 5px rgba(0,0,0,0.8)', transition: 'x 0.08s linear, y 0.08s linear' }}
                          >
                            {activeDriverInfo.name_acronym}
                          </text>
                        </g>
                      )}

                      {/* Comparative Driver Indicator Dot */}
                      {compareDriver && compareCoords && (
                        <g>
                          <circle
                            cx={scaleX(compareCoords.x)}
                            cy={scaleY(compareCoords.y)}
                            r="5"
                            fill={`#${compareDriverInfo?.team_colour || 'ffffff'}`}
                            stroke="#ffffff"
                            strokeWidth="1"
                            style={{ transition: 'cx 0.08s linear, cy 0.08s linear' }}
                          />
                          <text
                            x={scaleX(compareCoords.x) - 18}
                            y={scaleY(compareCoords.y) - 6}
                            fill="#9ca3af"
                            fontSize="8"
                            fontWeight="700"
                            style={{ transition: 'x 0.08s linear, y 0.08s linear' }}
                          >
                            {compareDriverInfo?.name_acronym}
                          </text>
                        </g>
                      )}
                    </svg>
                  ) : (
                    <span style={{ color: '#475569' }}>Hydrating Track Coordinates Layout...</span>
                  )}
                </div>
              </div>

              {/* PANEL 1.2: Interactive Telemetry HUD (6 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 6', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: '#f9fafb', fontSize: '15px', marginBottom: '16px' }}>Telemetry cockpit (Driver: {activeDriverInfo.name_acronym})</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  
                  {/* Gauge 1: Speedometer */}
                  <div style={{ background: '#090d16', border: '1px solid #1f2937', borderRadius: '8px', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800', letterSpacing: '0.05em' }}>SPEED</span>
                    <div style={{ position: 'relative', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '6px' }}>
                      <svg width="70" height="70" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="32" fill="none" stroke="#1f2937" strokeWidth="4" />
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          fill="none"
                          stroke="var(--neon-cyan)"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 32}
                          strokeDashoffset={2 * Math.PI * 32 * (1 - currentTelemetry.speed / 360)}
                          strokeLinecap="round"
                          transform="rotate(-90 40 40)"
                          style={{ transition: 'stroke-dashoffset 0.15s ease' }}
                        />
                      </svg>
                      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', color: '#ffffff', fontWeight: '800', fontFamily: 'monospace' }}>{currentTelemetry.speed}</span>
                        <span style={{ fontSize: '7px', color: '#9ca3af', fontWeight: '600' }}>KM/H</span>
                      </div>
                    </div>
                  </div>

                  {/* Gauge 2: Gear Indicator */}
                  <div style={{ background: '#090d16', border: '1px solid #1f2937', borderRadius: '8px', padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800', letterSpacing: '0.05em' }}>GEAR</span>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', border: '2px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(34, 211, 238, 0.03)', marginTop: '12px', boxShadow: '0 0 10px rgba(34,211,238,0.05)' }}>
                      <span style={{ fontSize: '28px', color: 'var(--neon-cyan)', fontWeight: '900', fontFamily: 'monospace' }}>{currentTelemetry.gear}</span>
                    </div>
                  </div>

                  {/* Gauge 3: Gas/Brake Pedals */}
                  <div style={{ background: '#090d16', border: '1px solid #1f2937', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', justifyItems: 'center', alignItems: 'center', gridColumn: 'span 2' }}>
                    <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800', letterSpacing: '0.05em', marginBottom: '8px' }}>PEDAL INPUTS</span>
                    <div style={{ display: 'flex', gap: '20px', width: '100%', flex: 1, padding: '0 10px' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: '600', color: '#9ca3af' }}>
                          <span>GAS</span>
                          <span style={{ color: 'var(--neon-green)' }}>{currentTelemetry.throttle}%</span>
                        </div>
                        <div className="f1-led-segment">
                          <div className="f1-led-fill" style={{ width: `${currentTelemetry.throttle}%`, backgroundColor: 'var(--neon-green)' }}></div>
                        </div>
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', fontWeight: '600', color: '#9ca3af' }}>
                          <span>BRK</span>
                          <span style={{ color: 'var(--neon-red)' }}>{currentTelemetry.brake}%</span>
                        </div>
                        <div className="f1-led-segment">
                          <div className="f1-led-fill" style={{ width: `${currentTelemetry.brake}%`, backgroundColor: 'var(--neon-red)' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LED Segment Bar: RPM Bar */}
                <div style={{ background: '#090d16', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: '800', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '6px' }}>
                    <span>ENGINE REV METRICS</span>
                    <span style={{ fontFamily: 'monospace', color: currentTelemetry.rpm > 11500 ? 'var(--neon-red)' : '#ffffff' }}>{currentTelemetry.rpm} RPM</span>
                  </div>
                  <div className="f1-led-segment" style={{ height: '10px' }}>
                    <div
                      className="f1-led-fill"
                      style={{
                        width: `${Math.min(100, (currentTelemetry.rpm / 13000) * 100)}%`,
                        background: currentTelemetry.rpm > 11500
                          ? 'linear-gradient(90deg, var(--neon-green) 0%, var(--neon-orange) 70%, var(--neon-red) 100%)'
                          : 'linear-gradient(90deg, var(--neon-green) 0%, var(--neon-cyan) 85%)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* DRS Activation Badge Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16', border: '1px solid #1f2937', borderRadius: '8px', padding: '10px 14px' }}>
                  <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800', letterSpacing: '0.05em' }}>DRS (WING REDUCTION SECTOR)</span>
                  <span
                    style={{
                      fontSize: '9px',
                      background: currentTelemetry.drs ? 'rgba(16, 185, 129, 0.15)' : '#1f2937',
                      color: currentTelemetry.drs ? 'var(--neon-green)' : '#475569',
                      border: currentTelemetry.drs ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid transparent',
                      padding: '3px 10px', borderRadius: '4px', fontWeight: '800'
                    }}
                  >
                    {currentTelemetry.drs ? '● DRS ACTIVE' : 'DRS INACTIVE'}
                  </span>
                </div>
              </div>
            </div>

            {/* GRID LAYER 2: Dual Telemetry Rolling Chart Panel */}
            <div className="pitwall-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ color: '#f9fafb', fontSize: '15px' }}>High-Frequency Rolling Telemetry Graph</h3>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>Speed comparison track. Real-time active data feeds.</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--neon-cyan)', fontWeight: '600' }}>● Speed (360 km/h max)</span>
                  <span style={{ fontSize: '11px', color: 'var(--neon-green)', fontWeight: '600' }}>● Throttle (100% max)</span>
                  
                  {/* Driver Comparison selector */}
                  <select
                    value={compareDriver || ''}
                    onChange={(e) => setCompareDriver(e.target.value ? parseInt(e.target.value) : null)}
                    style={{
                      backgroundColor: '#111827', color: '#9ca3af', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '11px', padding: '3px 8px', outline: 'none', cursor: 'pointer', marginLeft: '10px'
                    }}
                  >
                    <option value="">Compare with Driver...</option>
                    {drivers.filter(d => d.driver_number !== selectedDriver).map(d => (
                      <option key={d.driver_number} value={d.driver_number}>Compare to {d.name_acronym} ({d.team_name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ width: '100%', height: '130px', backgroundColor: '#090d16', borderRadius: '8px', border: '1px solid #1f2937', overflow: 'hidden', padding: '5px' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 120" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <line x1="0" y1="10" x2="400" y2="10" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="0.5" />
                  <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="0.5" />

                  <path
                    d={generateChartPath(telemetryHistory, 'speed', 360)}
                    fill="none"
                    stroke="var(--neon-cyan)"
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  <path
                    d={generateChartPath(telemetryHistory, 'throttle', 100)}
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {compareDriver && compareHistory.length > 0 && (
                    <path
                      d={generateChartPath(compareHistory, 'speed', 360)}
                      fill="none"
                      stroke="var(--neon-orange)"
                      strokeWidth="2"
                      style={{ transition: 'all 0.15s ease' }}
                    />
                  )}
                </svg>
              </div>
            </div>

            {/* GRID LAYER 3: Leaderboard (8 cols) & Pit Strategy/Weather (4 cols) */}
            <div className="dashboard-grid" style={{ marginTop: '0px' }}>
              
              {/* Dynamic Leaderboard Table (8 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 8', padding: '24px' }}>
                <h3 style={{ color: '#f9fafb', fontSize: '15px', marginBottom: '16px' }}>Grand Prix Lap Leaderboard (Dynamic gaps)</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#9ca3af', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1f2937', textAlign: 'left' }}>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>POS</th>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>DRIVER</th>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>TEAM</th>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>TYRE</th>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>AGE</th>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>LAST LAP</th>
                        <th style={{ padding: '8px', color: '#f9fafb', fontWeight: '800' }}>GAP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers.map(d => (
                        <tr
                          key={d.driver_number}
                          onClick={() => setSelectedDriver(d.driver_number)}
                          style={{
                            borderBottom: '1px solid #111827',
                            cursor: 'pointer',
                            backgroundColor: selectedDriver === d.driver_number ? 'rgba(34, 211, 238, 0.05)' : 'transparent',
                            color: selectedDriver === d.driver_number ? '#ffffff' : '#9ca3af',
                            transition: 'background-color 0.15s'
                          }}
                          className="leaderboard-row"
                        >
                          <td style={{ padding: '10px 8px', fontWeight: '800' }}>{d.pos}</td>
                          <td style={{ padding: '10px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: '3px', height: '14px', backgroundColor: `#${d.team_colour}`, display: 'inline-block' }}></span>
                            <span style={{ fontWeight: '700' }}>{d.name_acronym}</span>
                          </td>
                          <td style={{ padding: '10px 8px' }}>{d.team_name}</td>
                          <td style={{ padding: '10px 8px' }}>{d.tyre}</td>
                          <td style={{ padding: '10px 8px' }}>{d.tyre_age} L</td>
                          <td style={{ padding: '10px 8px', fontFamily: 'monospace' }}>{d.last_lap}</td>
                          <td style={{ padding: '10px 8px', fontFamily: 'monospace', color: d.interval.includes('LEADER') ? 'var(--neon-green)' : '#9ca3af' }}>{d.interval}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Weather & Strategy feed (4 columns) */}
              <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Weather card */}
                <div className="pitwall-card" style={{ padding: '20px' }}>
                  <h4 style={{ color: '#f9fafb', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '12px' }}>Track Weather Matrix</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>AIR TEMP</span>
                      <p style={{ fontSize: '16px', color: '#f9fafb', fontWeight: '800' }}>{weather.air_temp}°C</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>TRACK TEMP</span>
                      <p style={{ fontSize: '16px', color: 'var(--neon-orange)', fontWeight: '800' }}>{weather.track_temp}°C</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>HUMIDITY</span>
                      <p style={{ fontSize: '14px', color: '#f9fafb', fontWeight: '700' }}>{weather.humidity}%</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', color: '#9ca3af' }}>RAIN RISK</span>
                      <p style={{ fontSize: '14px', color: 'var(--neon-cyan)', fontWeight: '700' }}>{weather.rainfall === 0 ? '0% (DRY)' : 'RAIN ACTIVE'}</p>
                    </div>
                  </div>
                </div>

                {/* Team Radio / Race Control Messages feed */}
                <div className="pitwall-card" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ color: '#f9fafb', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '10px' }}>Team Communications</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, maxHeight: '140px', overflowY: 'auto', marginBottom: '12px' }}>
                    {raceControl.map((msg, i) => (
                      <div key={i} style={{ fontSize: '10px', padding: '6px 8px', backgroundColor: '#090d16', borderRadius: '4px', borderLeft: `3px solid ${msg.includes('FIA') || msg.includes('DIRECTOR') ? 'var(--neon-red)' : 'var(--neon-cyan)'}`, color: '#e5e7eb', lineHeight: '1.4' }}>
                        {msg}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={addRaceControlMsg} style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                    <input
                      type="text"
                      placeholder="Transmit radio patch..."
                      value={newControlMsg}
                      onChange={(e) => setNewControlMsg(e.target.value)}
                      style={{
                        flex: 1, backgroundColor: '#090d16', color: '#ffffff', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '11px', padding: '6px 10px', outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: 'var(--neon-cyan)', border: 'none', color: '#000000', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', outline: 'none'
                      }}
                    >
                      TX
                    </button>
                  </form>
                </div>

              </div>
            </div>

          </div>
        ) : (
          /* DIAGNOSTICS & SYSTEM STATUS TAB */
          <div className="pitwall-card" style={{ padding: '36px' }}>
            <h3 style={{ color: '#f9fafb', fontSize: '20px', marginBottom: '8px' }}>Security Diagnostic Matrix</h3>
            <span style={{ fontSize: '12px', color: '#9ca3af', display: 'block', marginBottom: '24px' }}>System session leases and security layers details.</span>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#9ca3af', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2937', textAlign: 'left' }}>
                  <th style={{ padding: '12px 8px', color: '#f9fafb', fontWeight: '800' }}>Security Domain</th>
                  <th style={{ padding: '12px 8px', color: '#f9fafb', fontWeight: '800' }}>Protocol</th>
                  <th style={{ padding: '12px 8px', color: '#f9fafb', fontWeight: '800' }}>Security Level</th>
                  <th style={{ padding: '12px 8px', color: '#f9fafb', fontWeight: '800' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '14px 8px', color: '#ffffff', fontWeight: '600' }}>Access Credentials</td>
                  <td style={{ padding: '14px 8px' }}>JWT Bearer Token</td>
                  <td style={{ padding: '14px 8px', color: 'var(--neon-cyan)', fontWeight: '600' }}>Short Lived (15m) / Memory Stored</td>
                  <td style={{ padding: '14px 8px', color: 'var(--neon-green)', fontWeight: '800' }}>● SECURE ACTIVE</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '14px 8px', color: '#ffffff', fontWeight: '600' }}>Refresh Lease</td>
                  <td style={{ padding: '14px 8px' }}>httpOnly Secure Cookie (SameSite=None)</td>
                  <td style={{ padding: '14px 8px', color: 'var(--neon-cyan)', fontWeight: '600' }}>Cross-Site Enabled / Automated Rotation</td>
                  <td style={{ padding: '14px 8px', color: 'var(--neon-green)', fontWeight: '800' }}>● SECURE ACTIVE</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '14px 8px', color: '#ffffff', fontWeight: '600' }}>Session Abuse Mitigation</td>
                  <td style={{ padding: '14px 8px' }}>Refresh Token Rotation (RTR)</td>
                  <td style={{ padding: '14px 8px', color: 'var(--neon-red)', fontWeight: '600' }}>Automated Session Wipe on Reuse</td>
                  <td style={{ padding: '14px 8px', color: 'var(--neon-green)', fontWeight: '800' }}>● ACTIVE GUARD</td>
                </tr>
              </tbody>
            </table>

            <div style={{ marginTop: '36px', borderTop: '1px solid #1f2937', paddingTop: '24px' }}>
              <h4 style={{ color: '#f9fafb', fontSize: '14px', marginBottom: '12px' }}>Security Diagnostic Credentials</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', background: '#090d16', borderRadius: '8px', padding: '20px', border: '1px solid #1f2937' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>SECURE ACCESS TOKEN</span>
                  <p style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--neon-cyan)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {accessToken ? `Bearer ${accessToken}` : 'NONE'}
                  </p>
                </div>
                <div>
                  <span style={{ fontSize: '10px', color: '#9ca3af' }}>PROFILE REFERENCE ID</span>
                  <p style={{ fontSize: '12px', fontFamily: 'monospace', color: '#ffffff', marginTop: '4px' }}>
                    {user?.id || 'NO_ID'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
