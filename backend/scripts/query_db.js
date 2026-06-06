const mongoose = require('mongoose');
const connectDB = require('../config/db');
const RaceSession = require('../models/RaceSession');

async function check() {
  await connectDB();
  const count = await RaceSession.countDocuments();
  console.log('Total archived sessions:', count);
  const sessions = await RaceSession.find().select('year round meeting_name');
  console.log('Archived sessions list:', sessions);
  process.exit(0);
}
check();
