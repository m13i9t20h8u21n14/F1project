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
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`🚀 In-Memory MongoDB Connected: ${conn.connection.host}`);
      console.log(`👉 Memory Database is active! Data will reset on server restart.`);
    } catch (memError) {
      console.error(`❌ In-Memory MongoDB Fallback Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
