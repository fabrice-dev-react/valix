import mongoose from "mongoose";

const explicitUri = process.env.MONGODB_URI;
const explicitUser = process.env.MONGODB_USER;
const explicitPassword = process.env.MONGODB_PASSWORD;
const explicitHost = process.env.MONGODB_HOST;
const explicitDb = process.env.MONGODB_DB || "valix";
const explicitOptions = process.env.MONGODB_OPTIONS || "retryWrites=true&w=majority";

const buildMongoUri = () => {
  if (explicitUri) {
    return explicitUri;
  }

  if (!explicitUser || !explicitPassword || !explicitHost) {
    throw new Error(
      "Please define MONGODB_URI or provide MONGODB_USER, MONGODB_PASSWORD, and MONGODB_HOST"
    );
  }

  const credentials = `${encodeURIComponent(explicitUser)}:${encodeURIComponent(
    explicitPassword
  )}`;
  return `mongodb+srv://${credentials}@${explicitHost}/${explicitDb}?${explicitOptions}`;
};

const MONGODB_URI = buildMongoUri();

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

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
