import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI is not set. Make sure to define it in your .env file.');
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// eslint-disable-next-line no-var
var globalMongoose = globalThis as unknown as { _mongoose?: GlobalMongoose };

const cached: GlobalMongoose = globalMongoose._mongoose || {
  conn: null,
  promise: null
};

globalMongoose._mongoose = cached;

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined');
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: 'urlshortener'
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
