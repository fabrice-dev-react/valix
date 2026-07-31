import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof global & { mongoose?: MongooseCache };

const buildMongoUri = () => {
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }

  const user = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const host = process.env.MONGODB_HOST;
  const db = process.env.MONGODB_DB || "valix";

  if (user && password && host) {
    const credentials = `${encodeURIComponent(user)}:${encodeURIComponent(password)}`;
    const options = process.env.MONGODB_OPTIONS || "retryWrites=true&w=majority";
    return `mongodb+srv://${credentials}@${host}/${db}?${options}`;
  }

  return "mongodb://localhost:27017/valix";
};

const MONGODB_URI = buildMongoUri();

function getCache(): MongooseCache {
  if (!globalWithMongoose.mongoose) {
    globalWithMongoose.mongoose = { conn: null, promise: null };
  }
  return globalWithMongoose.mongoose;
}

const cached = getCache();

async function connectDB() {
  try {
    // Check if we have a valid connection
    if (cached.conn && mongoose.connection.readyState === 1) {
      return cached.conn;
    }
  } catch {
    // Connection invalid, reset
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    const options = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };
    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      console.log("MongoDB connected successfully");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB connection error:", err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

export default connectDB;
