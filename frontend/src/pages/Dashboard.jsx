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
  { driver_number: 1, name_acronym: 'VER', broadcast_name: 'M VERSTAPPEN', team_name: 'Red Bull Racing', team_colour: '3671c6', last_lap: '1:34.128', interval: 'LEADER', tyre: '🔴 Soft', tyre_age: 4, pos: 1, progress: 200, lap: 3, speedFactor: 1.04, speed: 280 },
  { driver_number: 11, name_acronym: 'PER', broadcast_name: 'S PEREZ', team_name: 'Red Bull Racing', team_colour: '3671c6', last_lap: '1:34.620', interval: '+1.850', tyre: '🟡 Medium', tyre_age: 8, pos: 2, progress: 190, lap: 3, speedFactor: 1.02, speed: 275 },
  { driver_number: 16, name_acronym: 'LEC', broadcast_name: 'C LECLERC', team_name: 'Ferrari', team_colour: 'e80020', last_lap: '1:34.668', interval: '+3.700', tyre: '🟡 Medium', tyre_age: 9, pos: 3, progress: 180, lap: 3, speedFactor: 1.03, speed: 272 },
  { driver_number: 55, name_acronym: 'SAI', broadcast_name: 'C SAINZ', team_name: 'Ferrari', team_colour: 'e80020', last_lap: '1:34.910', interval: '+5.550', tyre: '⚪ Hard', tyre_age: 12, pos: 4, progress: 170, lap: 3, speedFactor: 1.01, speed: 268 },
  { driver_number: 4, name_acronym: 'NOR', broadcast_name: 'L NORRIS', team_name: 'McLaren', team_colour: 'ff8000', last_lap: '1:34.572', interval: '+7.400', tyre: '🟡 Medium', tyre_age: 7, pos: 5, progress: 160, lap: 3, speedFactor: 1.025, speed: 270 },
  { driver_number: 81, name_acronym: 'PIA', broadcast_name: 'O PIASTRI', team_name: 'McLaren', team_colour: 'ff8000', last_lap: '1:35.380', interval: '+9.250', tyre: '⚪ Hard', tyre_age: 9, pos: 6, progress: 150, lap: 3, speedFactor: 1.015, speed: 265 },
  { driver_number: 44, name_acronym: 'HAM', broadcast_name: 'L HAMILTON', team_name: 'Mercedes', team_colour: '27f4d2', last_lap: '1:35.240', interval: '+11.100', tyre: '🔴 Soft', tyre_age: 5, pos: 7, progress: 140, lap: 3, speedFactor: 1.01, speed: 267 },
  { driver_number: 63, name_acronym: 'RUS', broadcast_name: 'G RUSSELL', team_name: 'Mercedes', team_colour: '27f4d2', last_lap: '1:35.112', interval: '+12.950', tyre: '🟡 Medium', tyre_age: 6, pos: 8, progress: 130, lap: 3, speedFactor: 1.005, speed: 266 },
  { driver_number: 14, name_acronym: 'ALO', broadcast_name: 'F ALONSO', team_name: 'Aston Martin', team_colour: '229971', last_lap: '1:34.644', interval: '+14.800', tyre: '🟡 Medium', tyre_age: 11, pos: 9, progress: 120, lap: 3, speedFactor: 1.00, speed: 260 },
  { driver_number: 18, name_acronym: 'STR', broadcast_name: 'L STROLL', team_name: 'Aston Martin', team_colour: '229971', last_lap: '1:34.692', interval: '+16.650', tyre: '⚪ Hard', tyre_age: 14, pos: 10, progress: 110, lap: 3, speedFactor: 0.99, speed: 258 },
  { driver_number: 10, name_acronym: 'GAS', broadcast_name: 'P GASLY', team_name: 'Alpine', team_colour: 'ff66c4', last_lap: '1:34.596', interval: '+18.500', tyre: '🔴 Soft', tyre_age: 6, pos: 11, progress: 100, lap: 3, speedFactor: 0.985, speed: 255 },
  { driver_number: 31, name_acronym: 'OCO', broadcast_name: 'E OCON', team_name: 'Alpine', team_colour: 'ff66c4', last_lap: '1:35.750', interval: '+20.350', tyre: '🟡 Medium', tyre_age: 9, pos: 12, progress: 90, lap: 3, speedFactor: 0.98, speed: 254 },
  { driver_number: 23, name_acronym: 'ALB', broadcast_name: 'A ALBON', team_name: 'Williams', team_colour: '37bedd', last_lap: '1:34.820', interval: '+22.200', tyre: '⚪ Hard', tyre_age: 15, pos: 13, progress: 80, lap: 3, speedFactor: 0.985, speed: 256 },
  { driver_number: 2, name_acronym: 'SAR', broadcast_name: 'L SARGEANT', team_name: 'Williams', team_colour: '37bedd', last_lap: '1:34.524', interval: '+24.050', tyre: '🟡 Medium', tyre_age: 10, pos: 14, progress: 70, lap: 3, speedFactor: 0.97, speed: 252 },
  { driver_number: 22, name_acronym: 'TSU', broadcast_name: 'Y TSUNODA', team_name: 'RB', team_colour: '6692ff', last_lap: '1:35.010', interval: '+25.900', tyre: '🔴 Soft', tyre_age: 4, pos: 15, progress: 60, lap: 3, speedFactor: 0.98, speed: 253 },
  { driver_number: 3, name_acronym: 'RIC', broadcast_name: 'D RICCIARDO', team_name: 'RB', team_colour: '6692ff', last_lap: '1:34.548', interval: '+27.750', tyre: '🟡 Medium', tyre_age: 8, pos: 16, progress: 50, lap: 3, speedFactor: 0.975, speed: 251 },
  { driver_number: 77, name_acronym: 'BOT', broadcast_name: 'V BOTTAS', team_name: 'Kick Sauber', team_colour: '52e21e', last_lap: '1:35.610', interval: '+29.600', tyre: '⚪ Hard', tyre_age: 16, pos: 17, progress: 40, lap: 3, speedFactor: 0.97, speed: 250 },
  { driver_number: 24, name_acronym: 'ZHO', broadcast_name: 'G ZHOU', team_name: 'Kick Sauber', team_colour: '52e21e', last_lap: '1:35.820', interval: '+31.450', tyre: '🟡 Medium', tyre_age: 11, pos: 18, progress: 30, lap: 3, speedFactor: 0.965, speed: 248 },
  { driver_number: 27, name_acronym: 'HUL', broadcast_name: 'N HULKENBERG', team_name: 'Haas F1 Team', team_colour: 'b6babd', last_lap: '1:35.120', interval: '+33.300', tyre: '🔴 Soft', tyre_age: 5, pos: 19, progress: 20, lap: 3, speedFactor: 0.98, speed: 252 },
  { driver_number: 20, name_acronym: 'MAG', broadcast_name: 'K MAGNUSSEN', team_name: 'Haas F1 Team', team_colour: 'b6babd', last_lap: '1:34.716', interval: '+35.150', tyre: '🟡 Medium', tyre_age: 12, pos: 20, progress: 10, lap: 3, speedFactor: 0.97, speed: 250 }
];

const MOCK_DRIVERS_2021 = [
  { driver_number: 33, name_acronym: 'VER', broadcast_name: 'M VERSTAPPEN', team_name: 'Red Bull Racing', team_colour: '3671c6' },
  { driver_number: 44, name_acronym: 'HAM', broadcast_name: 'L HAMILTON', team_name: 'Mercedes', team_colour: '27f4d2' },
  { driver_number: 77, name_acronym: 'BOT', broadcast_name: 'V BOTTAS', team_name: 'Mercedes', team_colour: '27f4d2' },
  { driver_number: 11, name_acronym: 'PER', broadcast_name: 'S PEREZ', team_name: 'Red Bull Racing', team_colour: '3671c6' },
  { driver_number: 4, name_acronym: 'NOR', broadcast_name: 'L NORRIS', team_name: 'McLaren', team_colour: 'ff8000' },
  { driver_number: 3, name_acronym: 'RIC', broadcast_name: 'D RICCIARDO', team_name: 'McLaren', team_colour: 'ff8000' },
  { driver_number: 55, name_acronym: 'SAI', broadcast_name: 'C SAINZ', team_name: 'Ferrari', team_colour: 'e80020' },
  { driver_number: 16, name_acronym: 'LEC', broadcast_name: 'C LECLERC', team_name: 'Ferrari', team_colour: 'e80020' },
  { driver_number: 10, name_acronym: 'GAS', broadcast_name: 'P GASLY', team_name: 'AlphaTauri', team_colour: '4e7c9b' },
  { driver_number: 5, name_acronym: 'VET', broadcast_name: 'S VETTEL', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 14, name_acronym: 'ALO', broadcast_name: 'F ALONSO', team_name: 'Alpine', team_colour: 'ff66c4' },
  { driver_number: 31, name_acronym: 'OCO', broadcast_name: 'E OCON', team_name: 'Alpine', team_colour: 'ff66c4' },
  { driver_number: 18, name_acronym: 'STR', broadcast_name: 'L STROLL', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 22, name_acronym: 'TSU', broadcast_name: 'Y TSUNODA', team_name: 'AlphaTauri', team_colour: '4e7c9b' },
  { driver_number: 63, name_acronym: 'RUS', broadcast_name: 'G RUSSELL', team_name: 'Williams', team_colour: '37bedd' },
  { driver_number: 7, name_acronym: 'RAI', broadcast_name: 'K RAIKKONEN', team_name: 'Alfa Romeo', team_colour: '900000' },
  { driver_number: 99, name_acronym: 'GIO', broadcast_name: 'A GIOVINAZZI', team_name: 'Alfa Romeo', team_colour: '900000' },
  { driver_number: 47, name_acronym: 'MSC', broadcast_name: 'M SCHUMACHER', team_name: 'Haas F1 Team', team_colour: 'b6babd' },
  { driver_number: 9, name_acronym: 'MAZ', broadcast_name: 'N MAZEPIN', team_name: 'Haas F1 Team', team_colour: 'b6babd' },
  { driver_number: 6, name_acronym: 'LAT', broadcast_name: 'N LATIFI', team_name: 'Williams', team_colour: '37bedd' }
];

const MOCK_DRIVERS_2022 = [
  { driver_number: 1, name_acronym: 'VER', broadcast_name: 'M VERSTAPPEN', team_name: 'Red Bull Racing', team_colour: '3671c6' },
  { driver_number: 16, name_acronym: 'LEC', broadcast_name: 'C LECLERC', team_name: 'Ferrari', team_colour: 'e80020' },
  { driver_number: 11, name_acronym: 'PER', broadcast_name: 'S PEREZ', team_name: 'Red Bull Racing', team_colour: '3671c6' },
  { driver_number: 63, name_acronym: 'RUS', broadcast_name: 'G RUSSELL', team_name: 'Mercedes', team_colour: '27f4d2' },
  { driver_number: 55, name_acronym: 'SAI', broadcast_name: 'C SAINZ', team_name: 'Ferrari', team_colour: 'e80020' },
  { driver_number: 44, name_acronym: 'HAM', broadcast_name: 'L HAMILTON', team_name: 'Mercedes', team_colour: '27f4d2' },
  { driver_number: 4, name_acronym: 'NOR', broadcast_name: 'L NORRIS', team_name: 'McLaren', team_colour: 'ff8000' },
  { driver_number: 31, name_acronym: 'OCO', broadcast_name: 'E OCON', team_name: 'Alpine', team_colour: 'ff66c4' },
  { driver_number: 14, name_acronym: 'ALO', broadcast_name: 'F ALONSO', team_name: 'Alpine', team_colour: 'ff66c4' },
  { driver_number: 77, name_acronym: 'BOT', broadcast_name: 'V BOTTAS', team_name: 'Alfa Romeo', team_colour: '900000' },
  { driver_number: 5, name_acronym: 'VET', broadcast_name: 'S VETTEL', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 3, name_acronym: 'RIC', broadcast_name: 'D RICCIARDO', team_name: 'McLaren', team_colour: 'ff8000' },
  { driver_number: 20, name_acronym: 'MAG', broadcast_name: 'K MAGNUSSEN', team_name: 'Haas F1 Team', team_colour: 'b6babd' },
  { driver_number: 10, name_acronym: 'GAS', broadcast_name: 'P GASLY', team_name: 'AlphaTauri', team_colour: '4e7c9b' },
  { driver_number: 18, name_acronym: 'STR', broadcast_name: 'L STROLL', team_name: 'Aston Martin', team_colour: '229971' },
  { driver_number: 47, name_acronym: 'MSC', broadcast_name: 'M SCHUMACHER', team_name: 'Haas F1 Team', team_colour: 'b6babd' },
  { driver_number: 22, name_acronym: 'TSU', broadcast_name: 'Y TSUNODA', team_name: 'AlphaTauri', team_colour: '4e7c9b' },
  { driver_number: 24, name_acronym: 'ZHO', broadcast_name: 'G ZHOU', team_name: 'Alfa Romeo', team_colour: '900000' },
  { driver_number: 23, name_acronym: 'ALB', broadcast_name: 'A ALBON', team_name: 'Williams', team_colour: '37bedd' },
  { driver_number: 6, name_acronym: 'LAT', broadcast_name: 'N LATIFI', team_name: 'Williams', team_colour: '37bedd' }
];

const getGPPerformance = (acronym, meetingName = '', location = '', year = '2024') => {
  const gp = `${meetingName || ''} ${location || ''}`.toLowerCase();
  
  // Default values
  let pace = 1.0;
  let tyre = '🟡 Medium';
  let tyreAge = 8;

  if (gp.includes('monaco')) {
    if (acronym === 'LEC') { pace = 1.04; tyre = '🔴 Soft'; tyreAge = 3; }
    else if (acronym === 'PIA') { pace = 1.03; tyre = '🔴 Soft'; tyreAge = 4; }
    else if (acronym === 'SAI') { pace = 1.025; tyre = '🟡 Medium'; tyreAge = 6; }
    else if (acronym === 'NOR') { pace = 1.02; tyre = '🟡 Medium'; tyreAge = 7; }
    else if (acronym === 'VER') { pace = 1.015; tyre = '⚪ Hard'; tyreAge = 12; }
    else if (acronym === 'HAM') { pace = 1.01; tyre = '⚪ Hard'; tyreAge = 14; }
    else if (acronym === 'VET') { pace = 1.02; tyre = '🟡 Medium'; tyreAge = 8; } // 2021 Monaco specialty
  } else if (gp.includes('silverstone') || gp.includes('british')) {
    if (acronym === 'HAM') { pace = 1.04; tyre = '🔴 Soft'; tyreAge = 2; }
    else if (acronym === 'VER') { pace = 1.035; tyre = '🟡 Medium'; tyreAge = 5; }
    else if (acronym === 'NOR') { pace = 1.025; tyre = '🔴 Soft'; tyreAge = 4; }
    else if (acronym === 'LEC') { pace = 1.015; tyre = '⚪ Hard'; tyreAge = 10; }
  } else if (gp.includes('monza') || gp.includes('italy')) {
    if (year === '2021') {
      if (acronym === 'RIC') { pace = 1.04; tyre = '🟡 Medium'; tyreAge = 5; }
      else if (acronym === 'NOR') { pace = 1.035; tyre = '🟡 Medium'; tyreAge = 4; }
      else if (acronym === 'BOT') { pace = 1.03; tyre = '🔴 Soft'; tyreAge = 3; }
      else if (acronym === 'LEC') { pace = 1.02; tyre = '⚪ Hard'; tyreAge = 12; }
      else if (acronym === 'VER') { pace = 1.01; tyre = '⚪ Hard'; tyreAge = 15; }
    } else {
      if (acronym === 'VER') { pace = 1.04; tyre = '🟡 Medium'; tyreAge = 5; }
      else if (acronym === 'SAI') { pace = 1.035; tyre = '🔴 Soft'; tyreAge = 3; }
      else if (acronym === 'LEC') { pace = 1.03; tyre = '🔴 Soft'; tyreAge = 4; }
    }
  } else if (gp.includes('spa') || gp.includes('belgian')) {
    if (acronym === 'VER') { pace = 1.045; tyre = '🟡 Medium'; tyreAge = 6; }
    else if (acronym === 'HAM') { pace = 1.025; tyre = '⚪ Hard'; tyreAge = 10; }
    else if (acronym === 'LEC') { pace = 1.02; tyre = '🔴 Soft'; tyreAge = 3; }
  } else {
    // Sakhir / Bahrain
    if (acronym === 'VER') { pace = 1.04; tyre = '🔴 Soft'; tyreAge = 4; }
    else if (acronym === 'PER') { pace = 1.03; tyre = '🟡 Medium'; tyreAge = 8; }
    else if (acronym === 'SAI') { pace = 1.025; tyre = '⚪ Hard'; tyreAge = 12; }
    else if (acronym === 'LEC') { pace = 1.02; tyre = '🟡 Medium'; tyreAge = 9; }
    else if (acronym === 'HAM') { pace = 1.035; tyre = '🔴 Soft'; tyreAge = 5; } // 2021 Bahrain winner
  }

  pace += Math.random() * 0.005;
  return { pace, tyre, tyreAge };
};


const MOCK_RACE_CONTROL = [
  "FIA: DRS ENABLED IN SECTOR 1 AND SECTOR 3",
  "RACE DIRECTOR: CAR 4 (NOR) UNDER INVESTIGATION - TRACK LIMITS TURN 4",
  "MERCEDES PIT: Hamilton, we suspect Verstappen is running out of tyre life. Push now.",
  "RED BULL PIT: Max, wind has shifted to a tailwind on main straight. Adjust differential.",
  "FIA: GREEN FLAG - ALL SECTORS CLEAR",
  "FERRARI PIT: Leclerc, plan B, plan B. Monitor track temp, it is climbing."
];

// ==========================================
// HIGH-FIDELITY TEAM LOGO & TYRE BADGE COMPONENTS (F1 BROADCAST LAYOUT)
// ==========================================
const TeamLogo = ({ teamName, size = 16 }) => {
  const name = (teamName || '').toLowerCase();
  
  if (name.includes('red bull')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <circle cx="8" cy="8" r="4.5" fill="#facc15" opacity="0.25" />
        <path d="M 2 10 C 4 9 5 6 9 6 C 11 6 13 8 15 7 C 13 5 10 4 7 5 C 4 6 3 8 2 10 Z" fill="#facc15" />
        <path d="M 1 12 C 3 11 4 8 8 8 C 10 8 12 10 14 9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('ferrari')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <path d="M 3 2 L 13 2 L 14 8 C 14 11 11 14 8 15 C 5 14 2 11 2 8 Z" fill="#facc15" stroke="#1f2937" strokeWidth="0.5" />
        <path d="M 5 5 C 6 4 7 4 8 8 L 9 10" stroke="#000000" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <rect x="3" y="1" width="10" height="1.2" fill="#22c55e" />
      </svg>
    );
  }
  if (name.includes('mercedes')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <circle cx="8" cy="8" r="6.5" stroke="#94a3b8" strokeWidth="1.2" fill="none" />
        <line x1="8" y1="1.5" x2="8" y2="8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="8" x2="3" y2="11" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="8" y1="8" x2="13" y2="11" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('mclaren')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <path d="M 2 11 C 6 11 11 8 13 3 C 10 6 6 7 2 11 Z" fill="#ff8000" />
      </svg>
    );
  }
  if (name.includes('aston martin')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <path d="M 1 7 C 4 7 6 5 8 8 C 10 5 12 7 15 7 C 12 9 10 9 8 8 C 6 9 4 9 1 7 Z" fill="#065f46" stroke="#cbd5e1" strokeWidth="0.5" />
        <line x1="8" y1="4" x2="8" y2="9" stroke="#cbd5e1" strokeWidth="0.8" />
      </svg>
    );
  }
  if (name.includes('alpine')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <path d="M 3 13 L 8 2 L 13 13 M 4.5 10 L 11.5 10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 8 7 L 11 10" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    );
  }
  if (name.includes('williams')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <path d="M 2 4 L 5 12 L 8 6 L 11 12 L 14 4" stroke="#005aff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    );
  }
  if (name.includes('haas')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <circle cx="8" cy="8" r="6.5" stroke="#cbd5e1" strokeWidth="1" fill="none" />
        <path d="M 5 4 L 5 12 M 11 4 L 11 12 M 5 8 L 11 8" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="8" cy="8" r="4.5" stroke="#ef4444" strokeWidth="0.8" fill="none" strokeDasharray="1,1" />
      </svg>
    );
  }
  if (name.includes('sauber') || name.includes('stake') || name.includes('alfa romeo')) {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
        <path d="M 8 1.5 L 8 14.5 M 1.5 8 L 14.5 8" stroke="#52e21e" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="8" cy="8" r="3.2" fill="none" stroke="#090d16" strokeWidth="1" />
      </svg>
    );
  }
  // Generic Fallback crest for other teams (e.g. RB / AlphaTauri)
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ verticalAlign: 'middle' }}>
      <path d="M 3 2 L 13 2 L 14 8 C 14 11 11 14 8 15 C 5 14 2 11 2 8 Z" fill="#3b82f6" stroke="#475569" strokeWidth="0.8" />
      <polygon points="8,4 9.5,7 13,7.5 10.5,10 11,13.5 8,11.5 5,13.5 5.5,10 3,7.5 6.5,7" fill="#facc15" />
    </svg>
  );
};

const renderTyreBadge = (tyreString) => {
  const ts = (tyreString || '').toLowerCase();
  let bg = '#ef4444'; // Red
  let color = '#ffffff'; // White
  let char = 'S';
  
  if (ts.includes('medium')) {
    bg = '#f59e0b'; // Yellow/Gold
    color = '#000000'; // Black
    char = 'M';
  } else if (ts.includes('hard')) {
    bg = '#ffffff'; // White
    color = '#000000'; // Black
    char = 'H';
  } else if (ts.includes('inter')) {
    bg = '#10b981'; // Green
    color = '#ffffff'; // White
    char = 'I';
  } else if (ts.includes('wet')) {
    bg = '#3b82f6'; // Blue
    color = '#ffffff'; // White
    char = 'W';
  }

  return (
    <div
      style={{
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        backgroundColor: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '9px',
        fontWeight: '900',
        fontFamily: 'monospace',
        boxShadow: '0 0 4px rgba(0,0,0,0.5)',
        border: '1px solid rgba(0,0,0,0.2)'
      }}
    >
      {char}
    </div>
  );
};

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

  // Active driver telemetry HUD state
  const currentTelemetry = activeDriverObj
    ? {
        ...getDynamicTelemetry(Math.floor(activeDriverObj.progress) % trackPath.length, activeDriverObj.driver_number),
        speed: activeDriverObj.speed || 250
      }
    : { speed: 0, rpm: 0, throttle: 0, brake: 0, gear: 'N', drs: 0 };

  const getTyreColor = (temp, isRear = false) => {
    if (isRear) {
      if (temp > 110) return '#ef4444'; // Red (hot)
      return '#10b981';                  // Green (optimal)
    } else {
      if (temp > 110) return '#ef4444'; // Red (hot)
      if (temp > 98) return '#f97316';  // Orange (warm)
      return '#10b981';                  // Green (optimal)
    }
  };

  // Compute reactive tyre and brake thermal metrics based on telemetry inputs
  const speedVal = currentTelemetry.speed || 0;
  const throttleVal = currentTelemetry.throttle || 0;
  const brakeVal = currentTelemetry.brake || 0;
  const progressVal = activeDriverObj?.progress || 0;

  // Brake temperature calculations (heat up under braking, cool down on straights)
  const flBrakeTemp = Math.round(380 + (brakeVal * 4.2) + (speedVal * 0.05) + (progressVal % 7) * 0.8);
  const frBrakeTemp = Math.round(375 + (brakeVal * 4.0) + (speedVal * 0.04) + (progressVal % 5) * 0.9);
  const rlBrakeTemp = Math.round(340 + (brakeVal * 3.5) + (speedVal * 0.03) + (progressVal % 6) * 0.7);
  const rrBrakeTemp = Math.round(335 + (brakeVal * 3.4) + (speedVal * 0.03) + (progressVal % 4) * 0.8);

  // Tyre temperature calculations (heat up at high speed and cornering load)
  const isCornering = brakeVal > 15 || speedVal < 160;
  const flTyreTemp = Math.round(92 + (speedVal * 0.06) + (isCornering ? 12 : 0) + (progressVal % 3) * 0.4);
  const frTyreTemp = Math.round(91 + (speedVal * 0.06) + (isCornering ? 11 : 0) + (progressVal % 4) * 0.3);
  const rlTyreTemp = Math.round(95 + (speedVal * 0.05) + (isCornering ? 8 : 0) + (progressVal % 2) * 0.5);
  const rrTyreTemp = Math.round(94 + (speedVal * 0.05) + (isCornering ? 9 : 0) + (progressVal % 5) * 0.3);

  // Tyre pressure calculations (ideal gas law: rises with temperature)
  const flTyrePress = (1.1 + (flTyreTemp - 90) * 0.004).toFixed(1);
  const frTyrePress = (1.1 + (frTyreTemp - 90) * 0.004).toFixed(1);
  const rlTyrePress = (1.2 + (rlTyreTemp - 90) * 0.004).toFixed(1);
  const rrTyrePress = (1.2 + (rrTyreTemp - 90) * 0.004).toFixed(1);

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
              driversData = driversRes.data;
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

      // If we don't have drivers data, populate with mock drivers based on the selected year
      if (driversData.length === 0) {
        if (selectedYear === '2021') {
          driversData = MOCK_DRIVERS_2021;
        } else if (selectedYear === '2022') {
          driversData = MOCK_DRIVERS_2022;
        } else {
          driversData = MOCK_DRIVERS;
        }
      }

      // Resolve Track path from DB or fallback
      const resolvedPath = pathData || getOfflineTrackPath(selectedM?.meeting_name, selectedM?.location);
      setTrackPath(resolvedPath);

      // Map dynamic drivers simulation state
      const mappedDrivers = driversData.map((d, index) => {
        const perf = getGPPerformance(d.name_acronym, selectedM?.meeting_name, selectedM?.location, selectedYear);
        return {
          driver_number: d.driver_number,
          name_acronym: d.name_acronym,
          broadcast_name: d.broadcast_name,
          team_name: d.team_name,
          team_colour: d.team_colour || 'cccccc',
          last_lap: index === 0 ? '1:34.128' : `1:34.${500 + index * 24}`,
          interval: index === 0 ? 'LEADER' : `+${(index * 1.85).toFixed(3)}`,
          tyre: perf.tyre,
          tyre_age: perf.tyreAge,
          pos: index + 1,
          lap: 3,
          progress: 0,
          speedFactor: perf.pace,
          speed: 250
        };
      })
      // Sort drivers by speedFactor descending to set qualifying grid position realistically
      .sort((a, b) => b.speedFactor - a.speedFactor)
      // Map initial positions and progress coordinates along the grid
      .map((d, index) => {
        const startProgress = Math.max(0, resolvedPath.length - index * (resolvedPath.length / driversData.length));
        return {
          ...d,
          pos: index + 1,
          progress: startProgress,
          interval: index === 0 ? 'LEADER' : `+${(index * 1.85).toFixed(3)}`
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
          const stepDelta = trackPath.length * (dt / lapSeconds) * (speed / 280);
          
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
            speed: Math.min(340, Math.round(speed))
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

  const handleReset = () => {
    setDrivers(prevDrivers => {
      return prevDrivers.map((d, index) => {
        const startProgress = Math.max(0, trackPath.length - index * (trackPath.length / prevDrivers.length));
        return {
          ...d,
          progress: startProgress,
          lap: 3,
          interval: index === 0 ? 'LEADER' : `+${(index * 1.85).toFixed(3)}`
        };
      });
    });
  };

  return (
    <div className="dashboard-container f1-dark-theme" style={{ backgroundColor: '#0b0f19' }}>
      {/* SIDEBAR: Aegis Controls */}
      <aside className="sidebar" style={{ backgroundColor: '#090d16', borderRight: '1px solid #1f2937', padding: '12px 10px' }}>

        {/* Sidebar menu removed according to user request */}

        {/* ==========================================
            F1 TV BROADCAST LEADERS BOARD (SIDEBAR)
            ========================================== */}
        <div 
          style={{
            margin: '12px 0',
            borderRadius: '6px',
            backgroundColor: 'rgba(10, 15, 23, 0.75)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: 1,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            minHeight: '260px'
          }}
        >
          {/* F1 Broadcast Header Banner */}
          <div 
            style={{
              background: '#0a0f1d',
              padding: '8px 12px',
              borderBottom: '2.5px solid #e10600',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <svg width="42" height="10" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '6px' }}>
                  <path d="M0 30H17.2L22.5 12H48.3L45.7 0H21.2C10.6 0 0 10.6 0 21.2V30ZM53 30H70.2L83.4 0H66.2L53 30ZM76.7 30H93.9L107.1 0H89.9L76.7 30Z" fill="#e10600" />
                </svg>
                <span style={{ fontSize: '8px', color: '#9ca3af', fontWeight: '800', letterSpacing: '0.05em' }}>LIVE FEED</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--neon-green)', display: 'inline-block', boxShadow: '0 0 6px var(--neon-green)' }}></span>
                <span style={{ fontSize: '8px', color: 'var(--neon-green)', fontWeight: '800', letterSpacing: '0.05em' }}>RACE</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '2px' }}>
              <h4 style={{ fontSize: '11px', color: '#ffffff', fontWeight: '800', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '130px' }}>
                {meetings.find(m => m.meeting_key.toString() === selectedMeetingKey)?.location || 'Sakhir'} GP
              </h4>
              <span style={{ fontSize: '9px', color: 'var(--neon-cyan)', fontWeight: '800', fontFamily: 'monospace' }}>
                LAP {drivers[0]?.lap || 1}/50
              </span>
            </div>
          </div>

          {/* Leaderboard Drivers List */}
          <div 
            className="sidebar-leaderboard-list"
            style={{ 
              overflowY: 'auto', 
              flex: 1, 
              padding: '2px 0' 
            }}
          >
            {drivers.map((d, index) => {
              const isSelected = selectedDriver === d.driver_number;
              return (
                <div
                  key={d.driver_number}
                  onClick={() => setSelectedDriver(d.driver_number)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'rgba(34, 211, 238, 0.12)' : 'transparent',
                    borderLeft: `3px solid #${d.team_colour}`,
                    borderBottom: '1px solid rgba(31, 41, 55, 0.25)',
                    transition: 'all 0.15s'
                  }}
                  className="leaderboard-sidebar-row font-medium"
                >
                  {/* Position Column */}
                  <span style={{ width: '16px', fontSize: '10px', fontWeight: '800', color: isSelected ? '#ffffff' : '#9ca3af', fontFamily: 'monospace' }}>
                    {index + 1}
                  </span>

                  {/* Team Logo */}
                  <div style={{ width: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '6px' }}>
                    <TeamLogo teamName={d.team_name} size={14} />
                  </div>

                  {/* Driver Acronym */}
                  <span style={{ flex: 1, fontSize: '11px', fontWeight: '800', color: isSelected ? '#ffffff' : '#e2e8f0', letterSpacing: '0.02em' }}>
                    {d.name_acronym}
                  </span>

                  {/* Gap / Interval */}
                  <span style={{ fontSize: '9px', fontWeight: '700', color: index === 0 ? 'var(--neon-green)' : '#9ca3af', fontFamily: 'monospace', marginRight: '8px' }}>
                    {index === 0 ? 'Leader' : d.interval}
                  </span>

                  {/* Tyre Badge */}
                  <div>
                    {renderTyreBadge(d.tyre)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                      onClick={handleReset}
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

                      {/* Live Racing Field Dots (all drivers circulating) */}
                      {drivers.map((d, index) => {
                        if (d.driver_number === selectedDriver || (compareDriver && d.driver_number === compareDriver)) return null;
                        const coords = getInterpolatedCoords(d.progress);
                        if (!coords) return null;
                        return (
                          <circle
                            key={d.driver_number}
                            cx={scaleX(coords.x)}
                            cy={scaleY(coords.y)}
                            r="3.5"
                            fill={`#${d.team_colour}`}
                            stroke="#000000"
                            strokeWidth="0.5"
                            style={{ transition: 'cx 0.08s linear, cy 0.08s linear' }}
                          />
                        );
                      })}

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
                          strokeDashoffset={2 * Math.PI * 32 * (1 - Math.min(currentTelemetry.speed, 360) / 360)}
                          strokeLinecap="round"
                          transform="rotate(-90 40 40)"
                          style={{ transition: 'stroke-dashoffset 0.05s linear' }}
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

            {/* GRID LAYER 3: Active Car Thermal Matrix (8 cols) & Track Weather Matrix (4 cols) */}
            <div className="dashboard-grid" style={{ marginTop: '0px' }}>
              
              {/* Active Car Thermal Telemetry Matrix (8 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 8', padding: '24px 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '340px' }}>
                <h4 style={{ color: '#f9fafb', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '4px', width: '100%' }}>Active Car Thermal Matrix</h4>
                <span style={{ fontSize: '10px', color: 'var(--neon-cyan)', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '24px', display: 'block', width: '100%', textTransform: 'uppercase' }}>
                  Live Sensors: {activeDriverInfo.broadcast_name}
                </span>
                
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', position: 'relative', flex: 1 }}>
                  
                  {/* Left Side: Front-Left & Rear-Left Sensors */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '35%' }}>
                    {/* FL TIRE */}
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>FL TIRE</span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>
                        <span>🟧 Temp</span>
                        <span>🟩 Press</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '1px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '14px', color: getTyreColor(flTyreTemp, false), fontWeight: '800', fontFamily: 'monospace' }}>{flTyreTemp}°C</span>
                        <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700', fontFamily: 'monospace' }}>{flTyrePress} bar</span>
                      </div>
                    </div>

                    {/* FL BRAKES */}
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>FL BRAKES</span>
                      <div style={{ fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>🟧 Temp</div>
                      <p style={{ fontSize: '14px', color: flBrakeTemp > 650 ? 'var(--neon-red)' : flBrakeTemp > 500 ? 'var(--neon-orange)' : '#ffffff', fontWeight: '800', fontFamily: 'monospace', marginTop: '1px' }}>{flBrakeTemp}°C</p>
                    </div>

                    {/* RL TIRE */}
                    <div style={{ textAlign: 'left', marginTop: '8px' }}>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>RL TIRE</span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>
                        <span>🟥 Temp</span>
                        <span>🟩 Press</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '1px', alignItems: 'baseline' }}>
                        <span style={{ fontSize: '14px', color: getTyreColor(rlTyreTemp, true), fontWeight: '800', fontFamily: 'monospace' }}>{rlTyreTemp}°C</span>
                        <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700', fontFamily: 'monospace' }}>{rlTyrePress} bar</span>
                      </div>
                    </div>

                    {/* RL BRAKES */}
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>RL BRAKES</span>
                      <div style={{ fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>🟧 Temp</div>
                      <p style={{ fontSize: '14px', color: rlBrakeTemp > 650 ? 'var(--neon-red)' : '#ffffff', fontWeight: '800', fontFamily: 'monospace', marginTop: '1px' }}>{rlBrakeTemp}°C</p>
                    </div>
                  </div>

                  {/* Center: SVG Wireframe F1 Car outline */}
                  <div style={{ display: 'flex', justifyContent: 'center', width: '30%', position: 'relative' }}>
                    <svg width="100" height="220" viewBox="0 0 140 220" style={{ overflow: 'visible' }}>
                      <defs>
                        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#080c14" />
                          <stop offset="35%" stopColor="#1e293b" />
                          <stop offset="50%" stopColor="#334155" />
                          <stop offset="65%" stopColor="#1e293b" />
                          <stop offset="100%" stopColor="#080c14" />
                        </linearGradient>
                        <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#64748b" />
                          <stop offset="50%" stopColor="#1e293b" />
                          <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                      </defs>

                      {/* FL Wheel with Detailed Treads & Wheel Hub */}
                      <g>
                        <rect x="8" y="30" width="18" height="32" rx="4" fill={getTyreColor(flTyreTemp, false)} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                        <rect x="8" y="30" width="3" height="32" fill="rgba(0,0,0,0.3)" />
                        <rect x="23" y="30" width="3" height="32" fill="rgba(0,0,0,0.3)" />
                        <line x1="8" y1="36" x2="13" y2="39" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="13" y1="33" x2="18" y2="36" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="8" y1="44" x2="13" y2="47" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="13" y1="41" x2="18" y2="44" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="8" y1="52" x2="13" y2="55" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="13" y1="49" x2="18" y2="52" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <rect x="12" y="35" width="10" height="22" rx="2" fill="url(#rimGrad)" stroke="#475569" strokeWidth="0.8" />
                        <circle cx="17" cy="46" r="2" fill="#f87171" stroke="#000000" strokeWidth="0.5" />
                      </g>

                      {/* FR Wheel with Detailed Treads & Wheel Hub */}
                      <g>
                        <rect x="114" y="30" width="18" height="32" rx="4" fill={getTyreColor(frTyreTemp, false)} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                        <rect x="114" y="30" width="3" height="32" fill="rgba(0,0,0,0.3)" />
                        <rect x="129" y="30" width="3" height="32" fill="rgba(0,0,0,0.3)" />
                        <line x1="124" y1="36" x2="129" y2="39" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="119" y1="33" x2="124" y2="36" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="124" y1="44" x2="129" y2="47" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="119" y1="41" x2="124" y2="44" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="124" y1="52" x2="129" y2="55" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="119" y1="49" x2="124" y2="52" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <rect x="118" y="35" width="10" height="22" rx="2" fill="url(#rimGrad)" stroke="#475569" strokeWidth="0.8" />
                        <circle cx="123" cy="46" r="2" fill="#60a5fa" stroke="#000000" strokeWidth="0.5" />
                      </g>

                      {/* RL Wheel with Detailed Treads & Wheel Hub */}
                      <g>
                        <rect x="6" y="145" width="22" height="38" rx="5" fill={getTyreColor(rlTyreTemp, true)} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                        <rect x="6" y="145" width="3.5" height="38" fill="rgba(0,0,0,0.3)" />
                        <rect x="24.5" y="145" width="3.5" height="38" fill="rgba(0,0,0,0.3)" />
                        <line x1="6" y1="152" x2="12" y2="155" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="12" y1="148" x2="18" y2="151" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="6" y1="162" x2="12" y2="165" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="12" y1="158" x2="18" y2="161" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="6" y1="172" x2="12" y2="175" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="12" y1="168" x2="18" y2="171" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <rect x="11" y="151" width="12" height="26" rx="2" fill="url(#rimGrad)" stroke="#475569" strokeWidth="0.8" />
                        <circle cx="17" cy="164" r="2.2" fill="#f87171" stroke="#000000" strokeWidth="0.5" />
                      </g>

                      {/* RR Wheel with Detailed Treads & Wheel Hub */}
                      <g>
                        <rect x="112" y="145" width="22" height="38" rx="5" fill={getTyreColor(rrTyreTemp, true)} stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
                        <rect x="112" y="145" width="3.5" height="38" fill="rgba(0,0,0,0.3)" />
                        <rect x="130.5" y="145" width="3.5" height="38" fill="rgba(0,0,0,0.3)" />
                        <line x1="122" y1="152" x2="128" y2="155" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="116" y1="148" x2="122" y2="151" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="122" y1="162" x2="128" y2="165" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="116" y1="158" x2="122" y2="161" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="122" y1="172" x2="128" y2="175" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <line x1="116" y1="168" x2="122" y2="171" stroke="#000000" strokeWidth="1.2" opacity="0.65" />
                        <rect x="117" y="151" width="12" height="26" rx="2" fill="url(#rimGrad)" stroke="#475569" strokeWidth="0.8" />
                        <circle cx="123" cy="164" r="2.2" fill="#60a5fa" stroke="#000000" strokeWidth="0.5" />
                      </g>

                      {/* Suspension Wishbones - Highly Detailed Mechanical Triangle Layout */}
                      {/* Front Left Double Wishbones & Steering Linkage */}
                      <g opacity="0.8">
                        <polygon points="63,40 26,35 26,45" fill="none" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" />
                        <polygon points="63,52 26,47 26,53" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
                        <line x1="63" y1="46" x2="26" y2="46" stroke="rgba(243, 244, 246, 0.5)" strokeWidth="1" />
                      </g>

                      {/* Front Right Double Wishbones & Steering Linkage */}
                      <g opacity="0.8">
                        <polygon points="77,40 114,35 114,45" fill="none" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" />
                        <polygon points="77,52 114,47 114,53" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
                        <line x1="77" y1="46" x2="114" y2="46" stroke="rgba(243, 244, 246, 0.5)" strokeWidth="1" />
                      </g>

                      {/* Rear Left Double Wishbones */}
                      <g opacity="0.8">
                        <polygon points="56,150 28,155 28,168" fill="none" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" />
                        <line x1="56" y1="168" x2="28" y2="162" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
                      </g>
                      
                      {/* Rear Right Double Wishbones */}
                      <g opacity="0.8">
                        <polygon points="84,150 112,155 112,168" fill="none" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="1" />
                        <line x1="84" y1="168" x2="112" y2="162" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" />
                      </g>

                      {/* Aerodynamic Front Wing Assembly - Sweeping Modern Elements */}
                      <g>
                        {/* Symmetrical sweeping main plane */}
                        <path d="M 8 18 C 25 18 45 25 70 25 C 95 25 115 18 132 18 L 132 21 C 115 21 95 27 70 27 C 45 27 25 21 8 21 Z" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="1" />
                        {/* Symmetrical sweeping upper flap plane */}
                        <path d="M 10 14 C 25 14 45 21 70 21 C 95 21 115 14 130 14 L 130 16 C 115 16 95 23 70 23 C 45 23 25 16 10 16 Z" fill="rgba(30, 41, 59, 0.95)" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.8" />
                        {/* Curved Endplates */}
                        <path d="M 6 12 C 6 12 7 24 9 26 L 11 26 C 9 24 8 12 8 12 Z" fill="var(--neon-cyan)" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.5" />
                        <path d="M 134 12 C 134 12 133 24 131 26 L 129 26 C 131 24 132 12 132 12 Z" fill="var(--neon-cyan)" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.5" />
                      </g>

                      {/* Monocoque Nose Cone & Chassis Structure */}
                      <g>
                        <path d="M 65 24 L 75 24 L 77 46 L 79 70 L 80 82 C 80 82 78 84 70 84 C 62 84 60 82 60 82 L 61 70 L 63 46 Z" fill="url(#bodyGrad)" stroke="var(--neon-cyan)" strokeWidth="1" />
                        <path d="M 70 24 L 70 82" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.8" strokeDasharray="2,2" />
                      </g>

                      {/* Sidepods & Underfloor - Coke-Bottle Aerodynamics */}
                      <g>
                        {/* Left and Right Floor extension details with carbon stripes */}
                        <path d="M 52 82 L 35 105 L 34 142 L 50 160" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
                        <path d="M 88 82 L 105 105 L 106 142 L 90 160" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1.5" />
                        <line x1="34" y1="115" x2="44" y2="115" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="1" />
                        <line x1="34" y1="125" x2="44" y2="125" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="1" />
                        <line x1="34" y1="135" x2="44" y2="135" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="1" />
                        <line x1="106" y1="115" x2="96" y2="115" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="1" />
                        <line x1="106" y1="125" x2="96" y2="125" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="1" />
                        <line x1="106" y1="135" x2="96" y2="135" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="1" />

                        {/* Symmetrical wide sidepods with elegant sweep */}
                        <path d="M 60 76 L 46 82 L 40 102 C 38 118 48 135 50 148 C 52 158 54 166 52 178 L 88 178 C 86 166 88 158 90 148 C 92 135 102 118 100 102 L 94 82 L 80 76 Z" fill="url(#bodyGrad)" stroke="rgba(34, 211, 238, 0.8)" strokeWidth="1.2" />

                        {/* Sidepod Cooling Louvers / Gills */}
                        <g stroke="rgba(34, 211, 238, 0.3)" strokeWidth="0.8">
                          <line x1="44" y1="102" x2="52" y2="100" />
                          <line x1="45" y1="106" x2="53" y2="104" />
                          <line x1="46" y1="110" x2="54" y2="108" />
                          <line x1="47" y1="114" x2="55" y2="112" />
                          <line x1="48" y1="118" x2="56" y2="116" />

                          <line x1="96" y1="102" x2="88" y2="100" />
                          <line x1="95" y1="106" x2="87" y2="104" />
                          <line x1="94" y1="110" x2="86" y2="108" />
                          <line x1="93" y1="114" x2="85" y2="112" />
                          <line x1="92" y1="118" x2="84" y2="116" />
                        </g>

                        {/* Left and Right Sidepod Intakes */}
                        <rect x="46" y="80" width="14" height="6" fill="#040711" stroke="#334155" strokeWidth="0.8" />
                        <rect x="80" y="80" width="14" height="6" fill="#040711" stroke="#334155" strokeWidth="0.8" />
                      </g>

                      {/* Cockpit Cavity, Driver Seat, Formula Steering Wheel, and Halo */}
                      <g>
                        <rect x="62" y="82" width="16" height="34" rx="8" fill="#040711" stroke="#1e293b" strokeWidth="1" />
                        {/* Seat */}
                        <path d="M 64 96 C 64 90 76 90 76 96 L 75 112 C 75 112 70 114 65 112 Z" fill="#0b0f19" stroke="#334155" strokeWidth="0.8" />
                        {/* Detailed Steering Wheel */}
                        <path d="M 65 88 L 75 88 L 76 92 L 73 92 L 73 90 L 67 90 L 67 92 L 64 92 Z" fill="#1e293b" stroke="#64748b" strokeWidth="0.5" />
                        <circle cx="70" cy="89" r="0.8" fill="#10b981" />
                        
                        {/* Titanium Halo Loop */}
                        <line x1="70" y1="80" x2="70" y2="92" stroke="#475569" strokeWidth="2.2" />
                        <path d="M 62 108 C 58 92 61 88 70 88 C 79 88 82 92 78 108" fill="none" stroke="#64748b" strokeWidth="2" />
                        <path d="M 62 108 C 58 92 61 88 70 88 C 79 88 82 92 78 108" fill="none" stroke="rgba(34, 211, 238, 0.6)" strokeWidth="0.8" />
                      </g>

                      {/* Engine Cover, Airbox & Shark Fin */}
                      <g>
                        <ellipse cx="70" cy="114" rx="4.5" ry="3" fill="#040711" stroke="#475569" strokeWidth="1.2" />
                        <line x1="70" y1="117" x2="70" y2="178" stroke="var(--neon-cyan)" strokeWidth="1.2" />
                        <path d="M 70 135 L 70 178 L 68 178 Z" fill="rgba(34, 211, 238, 0.45)" />
                      </g>

                      {/* Rear Wing Endplates, DRS Flaps & DRS Hydraulic Actuator */}
                      <g>
                        <path d="M 21 178 C 21 178 18 190 20 206 L 23 206 C 21 190 23 178 23 178 Z" fill="rgba(34, 211, 238, 0.8)" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                        <path d="M 119 178 C 119 178 122 190 120 206 L 117 206 C 119 190 117 178 117 178 Z" fill="rgba(34, 211, 238, 0.8)" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="0.5" />
                        <rect x="23" y="190" width="94" height="6" rx="1" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.8" />
                        <rect x="23" y="197" width="94" height="8" rx="1" fill="rgba(30, 41, 59, 0.95)" stroke="rgba(34, 211, 238, 0.5)" strokeWidth="0.8" />
                        <rect x="67" y="193" width="6" height="5" fill="var(--neon-cyan)" />
                      </g>
                    </svg>
                  </div>

                  {/* Right Side: Front-Right & Rear-Right Sensors */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '35%', alignItems: 'flex-end', textAlign: 'right' }}>
                    {/* FR TIRE */}
                    <div>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>FR TIRE</span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#6b7280', marginTop: '1px', justifyContent: 'flex-end' }}>
                        <span>🟧 Temp</span>
                        <span>🟩 Press</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '1px', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '14px', color: getTyreColor(frTyreTemp, false), fontWeight: '800', fontFamily: 'monospace' }}>{frTyreTemp}°C</span>
                        <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700', fontFamily: 'monospace' }}>{frTyrePress} bar</span>
                      </div>
                    </div>

                    {/* FR BRAKES */}
                    <div>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>FR BRAKES</span>
                      <div style={{ fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>🟧 Temp</div>
                      <p style={{ fontSize: '14px', color: frBrakeTemp > 650 ? 'var(--neon-red)' : frBrakeTemp > 500 ? 'var(--neon-orange)' : '#ffffff', fontWeight: '800', fontFamily: 'monospace', marginTop: '1px' }}>{frBrakeTemp}°C</p>
                    </div>

                    {/* RR TIRE */}
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>RR TIRE</span>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#6b7280', marginTop: '1px', justifyContent: 'flex-end' }}>
                        <span>🟥 Temp</span>
                        <span>🟩 Press</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '1px', alignItems: 'baseline', justifyContent: 'flex-end' }}>
                        <span style={{ fontSize: '14px', color: getTyreColor(rrTyreTemp, true), fontWeight: '800', fontFamily: 'monospace' }}>{rrTyreTemp}°C</span>
                        <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700', fontFamily: 'monospace' }}>{rrTyrePress} bar</span>
                      </div>
                    </div>

                    {/* RR BRAKES */}
                    <div>
                      <span style={{ fontSize: '9px', color: '#9ca3af', fontWeight: '800' }}>RR BRAKES</span>
                      <div style={{ fontSize: '8px', color: '#6b7280', marginTop: '1px' }}>🟧 Temp</div>
                      <p style={{ fontSize: '14px', color: rrBrakeTemp > 650 ? 'var(--neon-red)' : '#ffffff', fontWeight: '800', fontFamily: 'monospace', marginTop: '1px' }}>{rrBrakeTemp}°C</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Track Weather Matrix (4 columns) */}
              <div className="pitwall-card" style={{ gridColumn: 'span 4', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h4 style={{ color: '#f9fafb', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '16px' }}>Track Weather Matrix</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>AIR TEMP</span>
                    <p style={{ fontSize: '18px', color: '#f9fafb', fontWeight: '800' }}>{weather.air_temp}°C</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>TRACK TEMP</span>
                    <p style={{ fontSize: '18px', color: 'var(--neon-orange)', fontWeight: '800' }}>{weather.track_temp}°C</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>HUMIDITY</span>
                    <p style={{ fontSize: '16px', color: '#f9fafb', fontWeight: '700' }}>{weather.humidity}%</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#9ca3af' }}>RAIN RISK</span>
                    <p style={{ fontSize: '16px', color: 'var(--neon-cyan)', fontWeight: '700' }}>{weather.rainfall === 0 ? '0% (DRY)' : 'RAIN ACTIVE'}</p>
                  </div>
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
