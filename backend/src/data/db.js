const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE = path.join(__dirname, 'db.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'initialData.json');

let cachedDb = null;
let isMongoConnected = false;
let SiteModel = null;

// Define simple key-value schema for CMS data
const SiteDataSchema = new mongoose.Schema({
  docId: { type: String, required: true, unique: true, default: 'main_cms' },
  data: { type: Object, required: true },
  updatedAt: { type: Date, default: Date.now }
});

// Load local fallback data
function loadLocalData() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('[DB] Error reading local db.json:', err.message);
  }

  try {
    if (fs.existsSync(INITIAL_DATA_FILE)) {
      const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
      fs.writeFileSync(DB_FILE, initialData, 'utf-8');
      return JSON.parse(initialData);
    }
  } catch (err) {
    console.error('[DB] Error loading initialData.json:', err.message);
  }

  return {};
}

// Initialize database
async function initDb() {
  if (!cachedDb) {
    cachedDb = loadLocalData();
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('[DB] MONGODB_URI not set. Running in local JSON mode with db.json.');
    return;
  }

  try {
    console.log('[DB] Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    isMongoConnected = true;
    console.log('[DB] Successfully connected to MongoDB Atlas!');

    SiteModel = mongoose.models.SiteData || mongoose.model('SiteData', SiteDataSchema);

    // Fetch existing data from MongoDB
    const existingDoc = await SiteModel.findOne({ docId: 'main_cms' });
    if (existingDoc && existingDoc.data && Object.keys(existingDoc.data).length > 0) {
      console.log('[DB] Loaded latest content from MongoDB Atlas.');
      cachedDb = existingDoc.data;
      // Also update local file as backup
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(cachedDb, null, 2), 'utf-8');
      } catch (e) {}
    } else {
      // First time on MongoDB: Seed cloud database with current data
      console.log('[DB] First time setup on MongoDB: Seeding cloud database with existing content...');
      await SiteModel.findOneAndUpdate(
        { docId: 'main_cms' },
        { data: cachedDb, updatedAt: new Date() },
        { upsert: true, new: true }
      );
      console.log('[DB] Seeding to MongoDB Atlas complete!');
    }
  } catch (err) {
    console.error('[DB] Warning: Failed to connect to MongoDB Atlas:', err.message);
    console.log('[DB] Continuing with local db.json fallback.');
  }
}

// Read database
function readDb() {
  if (!cachedDb) {
    cachedDb = loadLocalData();
  }
  return cachedDb;
}

// Write database atomically to local disk and persist to MongoDB
function writeDb(data) {
  cachedDb = data;

  // 1. Write to local file atomically as local backup
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('[DB] Warning: Error saving to local db.json:', err.message);
  }

  // 2. Persist to MongoDB Atlas asynchronously if connected
  if (isMongoConnected && SiteModel) {
    SiteModel.findOneAndUpdate(
      { docId: 'main_cms' },
      { data, updatedAt: new Date() },
      { upsert: true }
    ).catch((err) => {
      console.error('[DB] Error saving to MongoDB Atlas:', err.message);
    });
  }

  return true;
}

module.exports = {
  readDb,
  writeDb,
  initDb
};

