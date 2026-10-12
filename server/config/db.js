const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/comparekart';

  if (process.env.NODE_ENV === 'production' && !process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be configured for production.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Production MongoDB connection failed: ${err.message}`);
    }
    console.warn(`[Database] Local MongoDB not reachable at ${uri} (${err.message}).`);
    console.log('[Database] Starting embedded in-memory MongoDB fallback...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB at ${memoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database] In-memory MongoDB failed to start: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
