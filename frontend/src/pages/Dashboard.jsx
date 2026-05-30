import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// ==========================================
// HIGH-FIDELITY SINGLE-LAP CIRCUIT MAPS
// ==========================================
const TRACK_MAPS = {
  '9472': [
    {"x":-408,"y":723},{"x":-382,"y":1237},{"x":-346,"y":2034},{"x":-323,"y":2590},{"x":-290,"y":3303},{"x":-271,"y":3792},{"x":-245,"y":4511},{"x":-227,"y":5035},{"x":-209,"y":5588},{"x":-187,"y":6291},{"x":-172,"y":6859},{"x":-155,"y":7403},{"x":-139,"y":7768},{"x":-120,"y":8016},{"x":-93,"y":8153},{"x":-22,"y":8280},{"x":100,"y":8346},{"x":245,"y":8302},{"x":331,"y":8233},{"x":446,"y":8115},{"x":614,"y":7965},{"x":981,"y":7863},{"x":1346,"y":7918},{"x":1632,"y":8002},{"x":2038,"y":8071},{"x":2612,"y":8026},{"x":3224,"y":7905},{"x":3741,"y":7800},{"x":4524,"y":7642},{"x":5173,"y":7514},{"x":5727,"y":7409},{"x":6186,"y":7325},{"x":6567,"y":7256},{"x":7050,"y":7161},{"x":7355,"y":7019},{"x":7485,"y":6833},{"x":7489,"y":6626},{"x":7428,"y":6435},{"x":7273,"y":6228},{"x":7128,"y":6101},{"x":6866,"y":5914},{"x":6581,"y":5707},{"x":6371,"y":5536},{"x":5972,"y":5090},{"x":5619,"y":4544},{"x":5285,"y":4255},{"x":5038,"y":4190},{"x":4523,"y":4188},{"x":4145,"y":4117},{"x":3883,"y":3990},{"x":3580,"y":3712},{"x":3324,"y":3334},{"x":3131,"y":3007},{"x":2926,"y":2714},{"x":2771,"y":2542},{"x":2590,"y":2460},{"x":2413,"y":2523},{"x":2349,"y":2630},{"x":2298,"y":2796},{"x":2292,"y":3009},{"x":2338,"y":3339},{"x":2410,"y":3675},{"x":2513,"y":4149},{"x":2614,"y":4586},{"x":2708,"y":5090},{"x":2755,"y":5619},{"x":2667,"y":6067},{"x":2508,"y":6356},{"x":2318,"y":6539},{"x":2167,"y":6608},{"x":2012,"y":6585},{"x":1924,"y":6474},{"x":1881,"y":6345},{"x":1852,"y":6198},{"x":1828,"y":6014},{"x":1800,"y":5748},{"x":1780,"y":5510},{"x":1749,"y":5010},{"x":1724,"y":4577},{"x":1704,"y":4153},{"x":1668,"y":3428},{"x":1647,"y":2945},{"x":1626,"y":2461},{"x":1599,"y":1905},{"x":1566,"y":1243},{"x":1539,"y":749},{"x":1518,"y":122},{"x":1569,"y":-227},{"x":1701,"y":-476},{"x":1935,"y":-614},{"x":2116,"y":-663},{"x":2387,"y":-650},{"x":2830,"y":-447},{"x":3149,"y":-112},{"x":3357,"y":292},{"x":3560,"y":777},{"x":3848,"y":1183},{"x":4430,"y":1539},{"x":4870,"y":1615},{"x":5293,"y":1535},{"x":5666,"y":1363},{"x":6221,"y":1091},{"x":6531,"y":852},{"x":6664,"y":491},{"x":6612,"y":208},{"x":6429,"y":-33},{"x":6203,"y":-203},{"x":5824,"y":-410},{"x":5438,"y":-611},{"x":4999,"y":-844},{"x":4572,"y":-1075},{"x":4150,"y":-1308},{"x":3802,"y":-1502},{"x":3411,"y":-1720},{"x":2906,"y":-2001},{"x":2250,"y":-2366},{"x":1836,"y":-2599},{"x":1199,"y":-2962},{"x":791,"y":-3194},{"x":447,"y":-3383},{"x":94,"y":-3495},{"x":-141,"y":-3474},{"x":-322,"y":-3326},{"x":-487,"y":-3044},{"x":-556,"y":-2784},{"x":-577,"y":-2393},{"x":-564,"y":-2093},{"x":-539,"y":-1695},{"x":-511,"y":-1185},{"x":-476,"y":-559},{"x":-454,"y":-143},{"x":-404,"y":796},{"x":-362,"y":1665}
  ],
  '9480': [
    {"x":-1204,"y":-34},{"x":-1319,"y":294},{"x":-1583,"y":1012},{"x":-1783,"y":1558},{"x":-2043,"y":2266},{"x":-2234,"y":2834},{"x":-2349,"y":3266},{"x":-2524,"y":3905},{"x":-2703,"y":4489},{"x":-2831,"y":4701},{"x":-3076,"y":4779},{"x":-3257,"y":4747},{"x":-3456,"y":4823},{"x":-3513,"y":4974},{"x":-3504,"y":5186},{"x":-3466,"y":5437},{"x":-3404,"y":5724},{"x":-3335,"y":6183},{"x":-3357,"y":6662},{"x":-3400,"y":7007},{"x":-3457,"y":7440},{"x":-3544,"y":8112},{"x":-3610,"y":8645},{"x":-3660,"y":9088},{"x":-3855,"y":9272},{"x":-4125,"y":9395},{"x":-4363,"y":9614},{"x":-4548,"y":9991},{"x":-4601,"y":10420},{"x":-4573,"y":10678},{"x":-4295,"y":11287},{"x":-4231,"y":11686},{"x":-4347,"y":12290},{"x":-4569,"y":12684},{"x":-4927,"y":12948},{"x":-5039,"y":13430},{"x":-5041,"y":13723},{"x":-4981,"y":14183},{"x":-4845,"y":14460},{"x":-4628,"y":14664},{"x":-4299,"y":14855},{"x":-4027,"y":15118},{"x":-3912,"y":15487},{"x":-3807,"y":15998},{"x":-3686,"y":16416},{"x":-3576,"y":16893},{"x":-3518,"y":17372},{"x":-3467,"y":18025},{"x":-3463,"y":18620},{"x":-3505,"y":19571},{"x":-3557,"y":20500},{"x":-3627,"y":20987},{"x":-3708,"y":21327},{"x":-3880,"y":21624},{"x":-4274,"y":21796},{"x":-4471,"y":21731},{"x":-4711,"y":21462},{"x":-4793,"y":21168},{"x":-4804,"y":20850},{"x":-4756,"y":20488},{"x":-4543,"y":20019},{"x":-4321,"y":19645},{"x":-4169,"y":19215},{"x":-4102,"y":18641},{"x":-4148,"y":17990},{"x":-4333,"y":17414},{"x":-4670,"y":16579},{"x":-4746,"y":16168},{"x":-4874,"y":15805},{"x":-5223,"y":15623},{"x":-5727,"y":15127},{"x":-5793,"y":14543},{"x":-5776,"y":13898},{"x":-5678,"y":13353},{"x":-5451,"y":12731},{"x":-5246,"y":12239},{"x":-5111,"y":11821},{"x":-4998,"y":11194},{"x":-4967,"y":10560},{"x":-4919,"y":10042},{"x":-4796,"y":9469},{"x":-4433,"y":8691},{"x":-4078,"y":8011},{"x":-3900,"y":7377},{"x":-3816,"y":6754},{"x":-3801,"y":6266},{"x":-3856,"y":5567},{"x":-3934,"y":5020},{"x":-3909,"y":4729},{"x":-3354,"y":4186},{"x":-3121,"y":3720},{"x":-3080,"y":3338},{"x":-3101,"y":2855},{"x":-3224,"y":2428},{"x":-3420,"y":2016},{"x":-3697,"y":1464},{"x":-3904,"y":977},{"x":-4065,"y":243},{"x":-4028,"y":-674},{"x":-3869,"y":-1401},{"x":-3629,"y":-2290},{"x":-3265,"y":-3095},{"x":-2674,"y":-3844},{"x":-2164,"y":-4327},{"x":-1658,"y":-4766},{"x":-1109,"y":-5180},{"x":-807,"y":-5405},{"x":-394,"y":-5640},{"x":-210,"y":-5607},{"x":-61,"y":-5488},{"x":22,"y":-5276},{"x":-3,"y":-5001},{"x":-54,"y":-4772},{"x":-122,"y":-4464},{"x":-247,"y":-3843},{"x":-343,"y":-3412},{"x":-474,"y":-2827},{"x":-592,"y":-2303},{"x":-725,"y":-1689},{"x":-888,"y":-1027},{"x":-1054,"y":-487},{"x":-1279,"y":182}
  ],
  '9488': [
    {"x":-891,"y":-1622},{"x":-1315,"y":-1220},{"x":-1925,"y":-638},{"x":-2402,"y":-186},{"x":-2873,"y":261},{"x":-3181,"y":551},{"x":-3445,"y":816},{"x":-3612,"y":1052},{"x":-3664,"y":1383},{"x":-3605,"y":1658},{"x":-3554,"y":2082},{"x":-3700,"y":2610},{"x":-4006,"y":3000},{"x":-4312,"y":3269},{"x":-4691,"y":3612},{"x":-5071,"y":3986},{"x":-5397,"y":4330},{"x":-5830,"y":4828},{"x":-6066,"y":5122},{"x":-6867,"y":6261},{"x":-7188,"y":6824},{"x":-7208,"y":7018},{"x":-7160,"y":7178},{"x":-6998,"y":7296},{"x":-6789,"y":7335},{"x":-6515,"y":7366},{"x":-6295,"y":7402},{"x":-6028,"y":7529},{"x":-5854,"y":7768},{"x":-5811,"y":8079},{"x":-5849,"y":8410},{"x":-5943,"y":9045},{"x":-5906,"y":9559},{"x":-5733,"y":9929},{"x":-5390,"y":10256},{"x":-4914,"y":10598},{"x":-4710,"y":10722},{"x":-3854,"y":11126},{"x":-3206,"y":11414},{"x":-2727,"y":11673},{"x":-2365,"y":11848},{"x":-1987,"y":11755},{"x":-1548,"y":11474},{"x":-1152,"y":11365},{"x":-816,"y":11299},{"x":-277,"y":11151},{"x":189,"y":10893},{"x":462,"y":10622},{"x":727,"y":10242},{"x":921,"y":9801},{"x":1045,"y":9348},{"x":1155,"y":8733},{"x":1131,"y":7833},{"x":991,"y":7139},{"x":780,"y":6532},{"x":618,"y":6062},{"x":334,"y":5366},{"x":261,"y":4630},{"x":319,"y":4020},{"x":506,"y":3307},{"x":772,"y":2731},{"x":1080,"y":2247},{"x":1555,"y":1736},{"x":2045,"y":1302},{"x":2536,"y":934},{"x":2870,"y":801},{"x":3184,"y":814},{"x":3704,"y":870},{"x":4252,"y":747},{"x":4569,"y":497},{"x":5146,"y":12},{"x":5707,"y":-467},{"x":6216,"y":-1023},{"x":6452,"y":-1406},{"x":6667,"y":-1884},{"x":6819,"y":-2300},{"x":7147,"y":-3300},{"x":7329,"y":-3865},{"x":7414,"y":-4189},{"x":7464,"y":-4460},{"x":7497,"y":-4650},{"x":7448,"y":-4943},{"x":7139,"y":-5094},{"x":6813,"y":-5186},{"x":6455,"y":-5275},{"x":6084,"y":-5367},{"x":5655,"y":-5478},{"x":5324,"y":-5555},{"x":4886,"y":-5482},{"x":4538,"y":-5151},{"x":4333,"y":-4809},{"x":4145,"y":-4423},{"x":3958,"y":-4032},{"x":3860,"y":-3877},{"x":3750,"y":-3728},{"x":3533,"y":-3631},{"x":3328,"y":-3717},{"x":3143,"y":-3961},{"x":2678,"y":-4408},{"x":2355,"y":-4459},{"x":1975,"y":-4341},{"x":1735,"y":-4166},{"x":1396,"y":-3848},{"x":1018,"y":-3477},{"x":530,"y":-2999},{"x":27,"y":-2506},{"x":-307,"y":-2179},{"x":-637,"y":-1864}
  ],
  'latest': [
    {"x":-408,"y":723},{"x":-382,"y":1237},{"x":-346,"y":2034},{"x":-323,"y":2590},{"x":-290,"y":3303},{"x":-271,"y":3792},{"x":-245,"y":4511},{"x":-227,"y":5035},{"x":-209,"y":5588},{"x":-187,"y":6291},{"x":-172,"y":6859},{"x":-155,"y":7403},{"x":-139,"y":7768},{"x":-120,"y":8016},{"x":-93,"y":8153},{"x":-22,"y":8280},{"x":100,"y":8346},{"x":245,"y":8302},{"x":331,"y":8233},{"x":446,"y":8115},{"x":614,"y":7965},{"x":981,"y":7863},{"x":1346,"y":7918},{"x":1632,"y":8002},{"x":2038,"y":8071},{"x":2612,"y":8026},{"x":3224,"y":7905},{"x":3741,"y":7800},{"x":4524,"y":7642},{"x":5173,"y":7514},{"x":5727,"y":7409},{"x":6186,"y":7325},{"x":6567,"y":7256},{"x":7050,"y":7161},{"x":7355,"y":7019},{"x":7485,"y":6833},{"x":7489,"y":6626},{"x":7428,"y":6435},{"x":7273,"y":6228},{"x":7128,"y":6101},{"x":6866,"y":5914},{"x":6581,"y":5707},{"x":6371,"y":5536},{"x":5972,"y":5090},{"x":5619,"y":4544},{"x":5285,"y":4255},{"x":5038,"y":4190},{"x":4523,"y":4188},{"x":4145,"y":4117},{"x":3883,"y":3990},{"x":3580,"y":3712},{"x":3324,"y":3334},{"x":3131,"y":3007},{"x":2926,"y":2714},{"x":2771,"y":2542},{"x":2590,"y":2460},{"x":2413,"y":2523},{"x":2349,"y":2630},{"x":2298,"y":2796},{"x":2292,"y":3009},{"x":2338,"y":3339},{"x":2410,"y":3675},{"x":2513,"y":4149},{"x":2614,"y":4586},{"x":2708,"y":5090},{"x":2755,"y":5619},{"x":2667,"y":6067},{"x":2508,"y":6356},{"x":2318,"y":6539},{"x":2167,"y":6608},{"x":2012,"y":6585},{"x":1924,"y":6474},{"x":1881,"y":6345},{"x":1852,"y":6198},{"x":1828,"y":6014},{"x":1800,"y":5748},{"x":1780,"y":5510},{"x":1749,"y":5010},{"x":1724,"y":4577},{"x":1704,"y":4153},{"x":1668,"y":3428},{"x":1647,"y":2945},{"x":1626,"y":2461},{"x":1599,"y":1905},{"x":1566,"y":1243},{"x":1539,"y":749},{"x":1518,"y":122},{"x":1569,"y":-227},{"x":1701,"y":-476},{"x":1935,"y":-614},{"x":2116,"y":-663},{"x":2387,"y":-650},{"x":2830,"y":-447},{"x":3149,"y":-112},{"x":3357,"y":292},{"x":3560,"y":777},{"x":3848,"y":1183},{"x":4430,"y":1539},{"x":4870,"y":1615},{"x":5293,"y":1535},{"x":5666,"y":1363},{"x":6221,"y":1091},{"x":6531,"y":852},{"x":6664,"y":491},{"x":6612,"y":208},{"x":6429,"y":-33},{"x":6203,"y":-203},{"x":5824,"y":-410},{"x":5438,"y":-611},{"x":4999,"y":-844},{"x":4572,"y":-1075},{"x":4150,"y":-1308},{"x":3802,"y":-1502},{"x":3411,"y":-1720},{"x":2906,"y":-2001},{"x":2250,"y":-2366},{"x":1836,"y":-2599},{"x":1199,"y":-2962},{"x":791,"y":-3194},{"x":447,"y":-3383},{"x":94,"y":-3495},{"x":-141,"y":-3474},{"x":-322,"y":-3326},{"x":-487,"y":-3044},{"x":-556,"y":-2784},{"x":-577,"y":-2393},{"x":-564,"y":-2093},{"x":-539,"y":-1695},{"x":-511,"y":-1185},{"x":-476,"y":-559},{"x":-454,"y":-143},{"x":-404,"y":796},{"x":-362,"y":1665}
  ]
};

// ==========================================
// FALLBACK/MOCK DRIVERS LIST
// ==========================================
const MOCK_DRIVERS = [
  { driver_number: 1, name_acronym: 'VER', broadcast_name: 'M VERSTAPPEN', team_name: 'Red Bull Racing', team_colour: '3671c6', last_lap: '1:36.128', interval: 'LEADER', tyre: '🔴 Soft', tyre_age: 4, pos: 1 },
  { driver_number: 44, name_acronym: 'HAM', broadcast_name: 'L HAMILTON', team_name: 'Mercedes', team_colour: '27f4d2', last_lap: '1:36.524', interval: '+3.425', tyre: '🟡 Medium', tyre_age: 12, pos: 2 },
  { driver_number: 16, name_acronym: 'LEC', broadcast_name: 'C LECLERC', team_name: 'Ferrari', team_colour: 'e80020', last_lap: '1:36.852', interval: '+5.109', tyre: '🟡 Medium', tyre_age: 14, pos: 3 },
  { driver_number: 4, name_acronym: 'NOR', broadcast_name: 'L NORRIS', team_name: 'McLaren', team_colour: 'ff8000', last_lap: '1:36.319', interval: '+7.882', tyre: '⚪ Hard', tyre_age: 8, pos: 4 },
  { driver_number: 63, name_acronym: 'RUS', broadcast_name: 'G RUSSELL', team_name: 'Mercedes', team_colour: '27f4d2', last_lap: '1:37.112', interval: '+9.510', tyre: '🔴 Soft', tyre_age: 5, pos: 5 },
  { driver_number: 55, name_acronym: 'SAI', broadcast_name: 'C SAINZ', team_name: 'Ferrari', team_colour: 'e80020', last_lap: '1:36.910', interval: '+11.238', tyre: '⚪ Hard', tyre_age: 18, pos: 6 },
  { driver_number: 11, name_acronym: 'PER', broadcast_name: 'S PEREZ', team_name: 'Red Bull Racing', team_colour: '3671c6', last_lap: '1:37.240', interval: '+14.992', tyre: '🟡 Medium', tyre_age: 15, pos: 7 },
  { driver_number: 81, name_acronym: 'PIA', broadcast_name: 'O PIASTRI', team_name: 'McLaren', team_colour: 'ff8000', last_lap: '1:37.380', interval: '+16.540', tyre: '⚪ Hard', tyre_age: 9, pos: 8 }
];

const MOCK_RACE_CONTROL = [
  "FIA: DRS ENABLED IN SECTOR 1 AND SECTOR 3",
  "RACE DIRECTOR: CAR 4 (NOR) UNDER INVESTIGATION - TRACK LIMITS TURN 4",
  "MERCEDES PIT: Hamilton, we suspect Verstappen is running out of tyre life. Push now.",
  "RED BULL PIT: Max, wind has shifted to a tailwind on main straight. Adjust differential.",
  "FIA: GREEN FLAG - ALL SECTORS CLEAR",
  "FERRARI PIT: Leclerc, plan B, plan B. Monitor track temp, it is climbing."
];

// ==========================================
// SYSTEM SESSIONS DROPDOWN
// ==========================================
const SESSIONS_LIST = [
  { key: '9472', name: '🇧🇭 Bahrain Grand Prix 2024', circuit: 'Sakhir', year: 2024 },
  { key: '9480', name: '🇸🇦 Saudi Arabian Grand Prix 2024', circuit: 'Jeddah', year: 2024 },
  { key: '9488', name: '🇦🇺 Australian Grand Prix 2024', circuit: 'Melbourne', year: 2024 },
  { key: 'latest', name: '🟢 Active Live Session (Dynamic)', circuit: 'Current Track', year: 2026 }
];

const Dashboard = () => {
  const { user, logout, accessToken } = useAuth();
  const [activeTab, setActiveTab] = useState('pitwall'); // pitwall, diagnostics
  
  // Dashboard states
  const [sessionKey, setSessionKey] = useState('9472');
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [selectedDriver, setSelectedDriver] = useState(44); // Hamilton
  const [compareDriver, setCompareDriver] = useState(null); // Optional side-by-side
  const [weather, setWeather] = useState({ air_temp: 18.9, track_temp: 26.5, humidity: 46, wind_speed: 1.2, rainfall: 0 });
  const [flagStatus, setFlagStatus] = useState('GREEN'); // GREEN, YELLOW, RED, SAFETY CAR
  const [raceControl, setRaceControl] = useState(MOCK_RACE_CONTROL);
  const [newControlMsg, setNewControlMsg] = useState('');

  // Replay states
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [trackPath, setTrackPath] = useState(TRACK_MAPS['9472']);
  const [loading, setLoading] = useState(false);

  // Playback Telemetry history for rolling line graph
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [compareHistory, setCompareHistory] = useState([]);
  const timerRef = useRef(null);

  // Derive driver details
  const activeDriverInfo = drivers.find(d => d.driver_number === selectedDriver) || MOCK_DRIVERS[1];
  const compareDriverInfo = compareDriver ? drivers.find(d => d.driver_number === compareDriver) : null;

  // Track map dimensions and scaling limits
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

  // Scale (X, Y) layout dynamically to fit SVG boundary viewport
  const scaleX = (x) => padding + ((x - minX) / dx) * (svgW - 2 * padding);
  const scaleY = (y) => padding + (1 - (y - minY) / dy) * (svgH - 2 * padding); // Inverted Y

  // ==========================================
  // FETCH ACTIVE API DATA FROM OPENF1
  // ==========================================
  const loadSessionData = useCallback(async (key) => {
    setLoading(true);
    try {
      // 1. Fetch Drivers in this session
      const driversRes = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${key === 'latest' ? 9472 : key}`);
      if (driversRes.data && driversRes.data.length > 0) {
        // Map OpenF1 schemas to our unified dashboard format
        const mapped = driversRes.data.slice(0, 10).map((d, index) => ({
          driver_number: d.driver_number,
          name_acronym: d.name_acronym,
          broadcast_name: d.broadcast_name,
          team_name: d.team_name,
          team_colour: d.team_colour || 'cccccc',
          last_lap: index === 0 ? '1:36.128' : `1:36.${500 + index * 12}`,
          interval: index === 0 ? 'LEADER' : `+${(index * 1.624).toFixed(3)}`,
          tyre: index % 3 === 0 ? '🔴 Soft' : index % 3 === 1 ? '🟡 Medium' : '⚪ Hard',
          tyre_age: 4 + index * 2,
          pos: index + 1
        }));
        setDrivers(mapped);
        
        // Auto-select a valid driver number if Hamilton doesn't exist in new list
        const exists = mapped.find(m => m.driver_number === selectedDriver);
        if (!exists) {
          setSelectedDriver(mapped[0].driver_number);
        }
      }

      // 2. Load Track location path from static high-fidelity database
      const cleanPath = TRACK_MAPS[key] || TRACK_MAPS['9472'];
      setTrackPath(cleanPath);
      setPlaybackIndex(0);

      // 3. Fetch Session Weather from OpenF1
      const weatherRes = await axios.get(`https://api.openf1.org/v1/weather?session_key=${key === 'latest' ? 9472 : key}`);
      if (weatherRes.data && weatherRes.data.length > 0) {
        const latest = weatherRes.data[weatherRes.data.length - 1];
        setWeather({
          air_temp: latest.air_temperature || 19,
          track_temp: latest.track_temperature || 26.5,
          humidity: latest.humidity || 45,
          wind_speed: latest.wind_speed || 1.1,
          rainfall: latest.rainfall || 0
        });
      }
    } catch (err) {
      console.warn("OpenF1 API network offline. Seamlessly utilizing Sakhir simulator fallback database.", err);
      setDrivers(MOCK_DRIVERS);
      setTrackPath(SAKHIR_TRACK_COORDS);
    } finally {
      setLoading(false);
    }
  }, [selectedDriver]);

  useEffect(() => {
    loadSessionData(sessionKey);
  }, [sessionKey, loadSessionData]);

  // ==========================================
  // PLAYBACK SIMULATOR ENGINE (TILL CORNERS)
  // ==========================================
  useEffect(() => {
    if (!isPlaying || trackPath.length === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setPlaybackIndex(prev => {
        const nextIndex = prev + 1 >= trackPath.length ? 0 : prev + 1;
        return nextIndex;
      });
    }, 250); // updates telemetry segment every 250ms

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, trackPath]);

  // Dynamic Telemetry generator based on active path geometry (speed dials rise on straight, drops on sharp corners)
  const getDynamicTelemetry = (index, driverNum) => {
    if (!trackPath || trackPath.length === 0) return { speed: 0, rpm: 0, throttle: 0, brake: 0, gear: 'N', drs: 0 };
    
    // Bahrain GP physics model
    const totalPoints = trackPath.length;
    const ratio = index / totalPoints;

    // Simulate corners at specific coordinates
    let throttle = 100;
    let brake = 0;
    let speed = 280;
    let gear = 7;
    let drs = 0;

    // Bahrain Turn 1-2 tight hairpin (bottom left corners)
    if (ratio >= 0.08 && ratio <= 0.18) {
      throttle = 15;
      brake = 85;
      speed = 85;
      gear = 2;
    }
    // Bahrain Turn 4 right-hander
    else if (ratio >= 0.28 && ratio <= 0.35) {
      throttle = 30;
      brake = 60;
      speed = 135;
      gear = 3;
    }
    // Turn 8 Hairpin (middle track)
    else if (ratio >= 0.52 && ratio <= 0.60) {
      throttle = 10;
      brake = 90;
      speed = 70;
      gear = 1;
    }
    // Turn 9-10 heavy locking left-hander
    else if (ratio >= 0.65 && ratio <= 0.72) {
      throttle = 20;
      brake = 75;
      speed = 110;
      gear = 3;
    }
    // Final Turn 14-15 entry onto Main Straight (Max Speed straight)
    else if (ratio >= 0.88 || ratio <= 0.05) {
      throttle = 100;
      brake = 0;
      speed = 328;
      gear = 8;
      drs = 1;
    }

    // Driver specific adjustments (e.g. Verstappen pushes harder on straights)
    if (driverNum === 1) {
      speed = Math.min(340, Math.floor(speed * 1.03));
      if (throttle === 100) throttle = 100;
    } else {
      speed = Math.floor(speed * 0.98);
    }

    // Add high-frequency sensor noise (+/- 3 km/h)
    speed = Math.max(0, speed + (index % 5) - 2);
    const rpm = speed === 0 ? 0 : Math.floor(6000 + (speed / 340) * 6500 + (index % 3) * 200);

    return { speed, rpm, throttle, brake, gear, drs };
  };

  const currentTelemetry = getDynamicTelemetry(playbackIndex, selectedDriver);
  const compareTelemetry = compareDriver ? getDynamicTelemetry(playbackIndex, compareDriver) : null;

  // Maintain telemetry historical tracks for graph path creation
  useEffect(() => {
    setTelemetryHistory(prev => {
      const updated = [...prev, currentTelemetry];
      if (updated.length > 30) updated.shift();
      return updated;
    });

    if (compareDriver) {
      setCompareHistory(prev => {
        const updated = [...prev, compareTelemetry];
        if (updated.length > 30) updated.shift();
        return updated;
      });
    } else {
      setCompareHistory([]);
    }
  }, [playbackIndex, selectedDriver, compareDriver]);

  // Construct SVG Polyline path dynamically
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
      {/* SIDEBAR: Aegis Corporate Brand & Control */}
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
              <select
                value={sessionKey}
                onChange={(e) => setSessionKey(e.target.value)}
                style={{
                  backgroundColor: '#111827', color: '#f9fafb', border: '1px solid #1f2937', borderRadius: '6px', fontSize: '12px', padding: '4px 10px', outline: 'none', cursor: 'pointer', fontFamily: 'var(--font-heading)', fontWeight: '600'
                }}
              >
                {SESSIONS_LIST.map(s => (
                  <option key={s.key} value={s.key}>{s.name}</option>
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
            Hydrating F1 telemetry coordinate data streams from OpenF1 server...
          </div>
        )}

        {activeTab === 'pitwall' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* GRID LAYER 1: Circuit Map & Active Telemetry meters */}
            <div className="dashboard-grid" style={{ marginTop: '0px' }}>
              
              {/* PANEL 1.1: HTML5 SVG Circuit Map (6 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 6', padding: '24px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ color: '#f9fafb', fontSize: '15px' }}>Circuit Live Positioning ({SESSIONS_LIST.find(s=>s.key===sessionKey)?.circuit || 'Sakhir'})</h3>
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
                      {/* Grid overlay for radar effect */}
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
                      <circle cx={scaleX(trackPath[0].x)} cy={scaleY(trackPath[0].y)} r="5" fill="#f59e0b" title="Start/Finish Line" />
                      <text x={scaleX(trackPath[0].x) + 8} y={scaleY(trackPath[0].y) - 8} fill="#f59e0b" fontSize="8" fontWeight="800">START</text>

                      {/* Primary Driver Indicator Dot */}
                      {trackPath[playbackIndex] && (
                        <g>
                          <circle
                            cx={scaleX(trackPath[playbackIndex].x)}
                            cy={scaleY(trackPath[playbackIndex].y)}
                            r="12"
                            fill={`rgba(${activeDriverInfo.team_name.includes('Ferrari') ? '232,0,32' : activeDriverInfo.team_name.includes('Red Bull') ? '54,113,198' : '39,244,210'}, 0.25)`}
                          >
                            <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
                          </circle>
                          <circle
                            cx={scaleX(trackPath[playbackIndex].x)}
                            cy={scaleY(trackPath[playbackIndex].y)}
                            r="6"
                            fill={`#${activeDriverInfo.team_colour}`}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                          <text
                            x={scaleX(trackPath[playbackIndex].x) + 10}
                            y={scaleY(trackPath[playbackIndex].y) + 4}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="800"
                            style={{ textShadow: '0 0 5px rgba(0,0,0,0.8)' }}
                          >
                            {activeDriverInfo.name_acronym}
                          </text>
                        </g>
                      )}

                      {/* Comparative Driver Indicator Dot */}
                      {compareDriver && trackPath[(playbackIndex + 10) % trackPath.length] && (
                        <g>
                          <circle
                            cx={scaleX(trackPath[(playbackIndex + 10) % trackPath.length].x)}
                            cy={scaleY(trackPath[(playbackIndex + 10) % trackPath.length].y)}
                            r="5"
                            fill={`#${compareDriverInfo?.team_colour || 'ffffff'}`}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                          <text
                            x={scaleX(trackPath[(playbackIndex + 10) % trackPath.length].x) - 18}
                            y={scaleY(trackPath[(playbackIndex + 10) % trackPath.length].y) - 6}
                            fill="#9ca3af"
                            fontSize="8"
                            fontWeight="700"
                          >
                            {compareDriverInfo?.name_acronym}
                          </text>
                        </g>
                      )}
                    </svg>
                  ) : (
                    <span style={{ color: '#475569' }}>Formatting Track Coordinate Data...</span>
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
                  {/* Grid lines */}
                  <line x1="0" y1="10" x2="400" y2="10" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="0.5" />
                  <line x1="0" y1="110" x2="400" y2="110" stroke="rgba(31, 41, 55, 0.4)" strokeWidth="0.5" />

                  {/* Cyan line for active driver speed */}
                  <path
                    d={generateChartPath(telemetryHistory, 'speed', 360)}
                    fill="none"
                    stroke="var(--neon-cyan)"
                    strokeWidth="2.5"
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {/* Green line for active driver throttle */}
                  <path
                    d={generateChartPath(telemetryHistory, 'throttle', 100)}
                    fill="none"
                    stroke="rgba(16, 185, 129, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="2,2"
                    style={{ transition: 'all 0.15s ease' }}
                  />

                  {/* Orange line for compare driver speed (if active) */}
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
              
              {/* Leaderboard Table (8 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 8', padding: '24px' }}>
                <h3 style={{ color: '#f9fafb', fontSize: '15px', marginBottom: '16px' }}>Grand Prix Lap Leaderboard</h3>
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
