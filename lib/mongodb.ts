import mongoose from "mongoose";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached = global.mongooseCache ?? { connection: null, promise: null };
global.mongooseCache = cached;

export async function connectToDatabase() {
  if (cached.connection) return cached.connection;

  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not configured.");
    cached.promise = mongoose.connect(uri, { bufferCommands: false });
  }

  try {
    cached.connection = await cached.promise;
    return cached.connection;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
