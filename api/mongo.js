const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // set this in Vercel
if (!uri) throw new Error('MONGODB_URI not set');

let cachedClient = global.__mongoClient; // reuse across invocations
let cachedDb = global.__mongoDb;

async function connectToDatabase(dbName) {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  global.__mongoClient = client;
  global.__mongoDb = db;
  return { client, db };
}

module.exports = connectToDatabase;
