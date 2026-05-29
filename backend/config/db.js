const mongoose = require('mongoose');

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    // In tests, connection is managed by Jest through mongodb-memory-server
    return;
  }
  
  // Try connecting to standard MongoDB URI
  try {
    // Setting a brief timeout so it falls back quickly if standard Mongo isn't active
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auth_db', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`\n======================================================`);
    console.log(`⚠️  LOCAL MONGODB NOT RUNNING: ${error.message}`);
    console.log(`⚙️  Spawning automatic in-memory MongoDB Server fallback...`);
    console.log(`======================================================\n`);
    
    try {
      // Only require and spawn memory DB if it is available (e.g. dev/local)
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`🚀 In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log(`👉 Memory Database is active! Data will reset on server restart.`);
    } catch (memError) {
      console.error(`\n❌ PRODUCTION DATABASE CONNECTION FAILED!`);
      console.error(`Render environment is unable to connect to your MongoDB Atlas cluster.`);
      console.error(`Please verify your Atlas Network Access (IP Whitelist 0.0.0.0/0) and password credentials.\n`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
