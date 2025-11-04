const connectToDatabase = require('./mongo');

module.exports = async function handler(req, res) {
  // simple CORS for a separate frontend domain (adjust origin)
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { db } = await connectToDatabase(process.env.DB_NAME || 'mydb');
    const users = db.collection('users');

    if (req.method === 'GET') {
      const docs = await users.find({}).limit(100).toArray();
      return res.status(200).json(docs);
    }

    if (req.method === 'POST') {
      const payload = req.body;
      if (!payload || !payload.name) return res.status(400).json({ error: 'Missing name' });
      const result = await users.insertOne({ name: payload.name, createdAt: new Date() });
      return res.status(201).json({ insertedId: result.insertedId });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
};
