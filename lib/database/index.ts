import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// initialize cache with empty object if a mongoose connection has not been established
// moongoose is a global object (not the imported package), so we can use it to store the connection
// Each Server Actions will have to connectToDatabase, so if we're not caching the connection,
// we will be connecting to the database multiple times, causing database exhaustion and even damaging effect
let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  // if there is a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  // if a connection is being established, wait for it
  // else if there is no connection, create a new one
  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URI, {
      dbName: "evently-jsm",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
