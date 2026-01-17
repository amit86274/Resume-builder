
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// MongoDB Atlas Connection String
const URI = "mongodb+srv://keyframe:D3v3l0p3r%4074@cluster0.uzvsg.mongodb.net/";
const DB_NAME = "resumebuilder";

app.use(cors());
app.use(bodyParser.json());

let db;

// Connect to MongoDB
MongoClient.connect(URI)
  .then(client => {
    console.log('Connected to MongoDB Atlas');
    db = client.db(DB_NAME);
  })
  .catch(error => console.error('Connection error:', error));

/**
 * Dynamic CRUD API for Collections
 */

// GET: Find documents
app.get('/api/db/:collection', async (req, res) => {
  try {
    const collection = db.collection(req.params.collection);
    const results = await collection.find({}).toArray();
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Insert document
app.post('/api/db/:collection', async (req, res) => {
  try {
    const collection = db.collection(req.params.collection);
    const result = await collection.insertOne(req.body);
    res.json({ ...req.body, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update document
app.put('/api/db/:collection', async (req, res) => {
  try {
    const { _id, update } = req.body;
    const collection = db.collection(req.params.collection);
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      { $set: update }
    );
    res.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Remove document
app.delete('/api/db/:collection', async (req, res) => {
  try {
    const { _id } = req.body;
    const collection = db.collection(req.params.collection);
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`ResuMaster Backend running on http://localhost:${PORT}`);
});
