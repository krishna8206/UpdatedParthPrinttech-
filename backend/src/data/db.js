const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');
const INITIAL_DATA_FILE = path.join(__dirname, 'initialData.json');

// Initialize database file if not present
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
    console.log('[DB] Initialized new db.json from initialData.json');
  }
}

// Read database
function readDb() {
  initDb();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('[DB] Error reading db.json, recreating...', err);
    const initialData = fs.readFileSync(INITIAL_DATA_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, initialData, 'utf-8');
    return JSON.parse(initialData);
  }
}

// Write database atomically
function writeDb(data) {
  try {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('[DB] Error saving to db.json:', err);
    throw err;
  }
}

module.exports = {
  readDb,
  writeDb,
  initDb
};
