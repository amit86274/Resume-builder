
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3001; // Backend fixed on 3001 to avoid conflicts with frontend

// MongoDB Atlas Configuration
// Ensure your IP is whitelisted in the MongoDB Atlas console (Networking tab)
const URI = "mongodb+srv://keyframe:D3v3l0p3r@cluster0.uzvsg.mongodb.net/resumebuilder?retryWrites=true&w=majority";
const DB_NAME = "resumebuilder";
const JWT_SECRET = "resumaster_neural_key_2024_secure";

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' })); // Increased limit for profile images/PDF data

let db;

// Database Connection with immediate feedback
console.log('--- STARTING RESUMASTER BACKEND ---');
MongoClient.connect(URI)
  .then(client => {
    console.log('✅ SUCCESS: Connected to MongoDB Atlas (Cluster0)');
    db = client.db(DB_NAME);
  })
  .catch(error => {
    console.error('❌ CRITICAL ERROR: MongoDB Connection Failed!');
    console.error('Reason:', error.message);
    console.log('Troubleshooting: Check IP Whitelisting in Atlas and your connection string.');
  });

/**
 * Middleware: Authentication
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: "Access token missing. Please sign in." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Session expired. Please login again." });
    req.user = user;
    next();
  });
};

/**
 * Health Check Endpoint
 */
app.get('/api/health', async (req, res) => {
  if (!db) return res.status(503).json({ status: "offline", message: "Database not connected" });
  res.json({ status: "online", database: "connected", timestamp: new Date().toISOString() });
});

/**
 * Auth Endpoints
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt: ${email}`);
    
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    
    if (!user) return res.status(404).json({ error: "No account found with this email." });
    if (user.password !== password) return res.status(401).json({ error: "Incorrect password." });

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET);
    const { password: _, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (error) {
    res.status(500).json({ error: "Login failed: " + error.message });
  }
});

app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[AUTH] New Signup: ${email}`);
    
    const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: "Email is already registered." });

    const newUser = {
      name,
      email: email.toLowerCase(),
      password,
      role: email.toLowerCase() === 'amit86274@gmail.com' ? 'admin' : 'user',
      plan: 'free',
      createdAt: new Date().toISOString(),
      metadata: { resumeCount: 0, totalDownloads: 0 }
    };

    const result = await db.collection('users').insertOne(newUser);
    const token = jwt.sign({ id: result.insertedId.toString(), email: newUser.email, role: newUser.role }, JWT_SECRET);
    res.json({ user: { ...newUser, _id: result.insertedId, password: undefined }, token });
  } catch (error) {
    res.status(500).json({ error: "Signup failed: " + error.message });
  }
});

app.post('/api/auth/social', async (req, res) => {
  try {
    const { email, name, providerId } = req.body;
    console.log(`[AUTH] Social Login: ${email} via Google`);
    
    let user = await db.collection('users').findOne({ email: email.toLowerCase() });
    
    if (!user) {
      const newUser = {
        name,
        email: email.toLowerCase(),
        password: `social_${providerId}`, // security placeholder
        role: 'user',
        plan: 'free',
        createdAt: new Date().toISOString(),
        metadata: { resumeCount: 0, totalDownloads: 0 }
      };
      const result = await db.collection('users').insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
    }

    const token = jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, JWT_SECRET);
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Social Auth failed: " + error.message });
  }
});

/**
 * Database Endpoints (Protected)
 */
app.get('/api/db/resumes', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const resumes = await db.collection('resumes').find(query).toArray();
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: "Fetch failed: " + error.message });
  }
});

app.post('/api/db/resumes', authenticateToken, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.id, lastEdited: new Date().toISOString() };
    const result = await db.collection('resumes').insertOne(data);
    console.log(`[DB] Resume Saved: ${result.insertedId} for user ${req.user.id}`);
    res.json({ ...data, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: "Save failed: " + error.message });
  }
});

app.put('/api/db/resumes', authenticateToken, async (req, res) => {
  try {
    const { _id, update } = req.body;
    const { _id: dropId, userId: dropUid, ...cleanUpdate } = update;
    
    const query = { _id: new ObjectId(_id) };
    if (req.user.role !== 'admin') query.userId = req.user.id;
    
    const result = await db.collection('resumes').updateOne(
      query, 
      { $set: { ...cleanUpdate, lastEdited: new Date().toISOString() } }
    );
    
    res.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: "Update failed: " + error.message });
  }
});

app.delete('/api/db/resumes', authenticateToken, async (req, res) => {
  try {
    const { _id } = req.body;
    const query = { _id: new ObjectId(_id) };
    if (req.user.role !== 'admin') query.userId = req.user.id;
    
    const result = await db.collection('resumes').deleteOne(query);
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: "Delete failed: " + error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 NEURAL ENGINE ACTIVE ON PORT: ${PORT}`);
  console.log(`🔗 API BASE URL: http://localhost:${PORT}/api`);
});
