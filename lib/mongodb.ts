import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "shilpsutra";

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

// Check if a real MongoDB URI is provided (not placeholder)
export function isMongoConfigured(): boolean {
  if (!uri) return false;
  if (uri.includes("username:password") || uri.includes("<username>") || uri.includes("<db_username>")) return false;
  return uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://");
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (isMongoConfigured() && uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so the MongoClient is not repeated on hot reload
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, create a standard client
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    clientPromise = client.connect();
  }
}

export async function getDb(): Promise<Db | null> {
  if (!isMongoConfigured() || !clientPromise) {
    return null;
  }

  try {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (error) {
    console.warn("[MongoDB] Connection failed, falling back to local storage:", error);
    return null;
  }
}

export default clientPromise;
