import { MongoClient, Db, Collection, Document } from "mongodb"

if (!process.env.MONGODB_URI) {
  console.warn("MONGODB_URI environment variable is not set. Database operations will fail.")
}

const MONGODB_URI = process.env.MONGODB_URI || ""
const MONGODB_DB = process.env.MONGODB_DB || "joblensai"

interface MongoConnection {
  client: MongoClient
  db: Db
}

let cachedConnection: MongoConnection | null = null
let connectionPromise: Promise<MongoConnection> | null = null

/**
 * Connect to MongoDB with connection pooling
 * Uses a cached connection in production to prevent exhausting connections
 */
export async function connectToDatabase(): Promise<MongoConnection> {
  // Return cached connection if available
  if (cachedConnection) {
    return cachedConnection
  }

  // Return existing connection promise if one is in progress
  if (connectionPromise) {
    return connectionPromise
  }

  // Create new connection promise
  connectionPromise = (async () => {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not configured")
    }

    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })

    await client.connect()
    const db = client.db(MONGODB_DB)

    // Cache the connection
    cachedConnection = { client, db }

    // Handle connection events
    client.on("error", (error) => {
      console.error("MongoDB connection error:", error)
      cachedConnection = null
      connectionPromise = null
    })

    client.on("close", () => {
      console.log("MongoDB connection closed")
      cachedConnection = null
      connectionPromise = null
    })

    return cachedConnection
  })()

  return connectionPromise
}

/**
 * Get a typed collection from the database
 */
export async function getCollection<T extends Document>(
  collectionName: string
): Promise<Collection<T>> {
  const { db } = await connectToDatabase()
  return db.collection<T>(collectionName)
}

/**
 * Close the database connection
 * Useful for graceful shutdown or testing
 */
export async function closeConnection(): Promise<void> {
  if (cachedConnection) {
    await cachedConnection.client.close()
    cachedConnection = null
    connectionPromise = null
  }
}

// Collection names
export const COLLECTIONS = {
  USERS: "users",
  RESUMES: "resumes",
  BOOKMARKS: "bookmarks",
  JOBS: "jobs",
  NOTIFICATIONS: "notifications",
  SESSIONS: "sessions",
  ANALYTICS: "analytics",
} as const

// Database indexes (to be run on initialization)
export async function ensureIndexes(): Promise<void> {
  try {
    const { db } = await connectToDatabase()

    // Users collection indexes
    await db.collection(COLLECTIONS.USERS).createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { createdAt: -1 } },
    ])

    // Resumes collection indexes
    await db.collection(COLLECTIONS.RESUMES).createIndexes([
      { key: { userId: 1 } },
      { key: { uploadedAt: -1 } },
    ])

    // Bookmarks collection indexes
    await db.collection(COLLECTIONS.BOOKMARKS).createIndexes([
      { key: { userId: 1 } },
      { key: { jobId: 1 } },
      { key: { userId: 1, jobId: 1 }, unique: true },
    ])

    // Sessions collection index with TTL
    await db.collection(COLLECTIONS.SESSIONS).createIndexes([
      { key: { userId: 1 } },
      { key: { token: 1 }, unique: true },
      { key: { expiresAt: 1 }, expireAfterSeconds: 0 },
    ])

    console.log("Database indexes ensured")
  } catch (error) {
    console.error("Error creating database indexes:", error)
  }
}
