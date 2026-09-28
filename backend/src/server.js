const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDb } = require('./data/db');
const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const uploadRoutes = require('./routes/upload.routes');
const productRoutes = require('./routes/product.routes');
const aboutRoutes = require('./routes/about.routes');
const marketsPageRoutes = require('./routes/marketsPage.routes');
const careerRoutes = require('./routes/career.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database
initDb();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10gb' }));
app.use(express.urlencoded({ extended: true, limit: '10gb' }));

// Serve Uploads statically
const uploadDir = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Parth Printtech Backend API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/markets-page', marketsPageRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Parth Printtech Backend API`);
  console.log(` Running on: http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/api/health`);
  console.log(`=========================================`);
});

// Configure server timeouts to support large video uploads without dropping connection
server.timeout = 0; // Disable idle timeout
server.keepAliveTimeout = 1200000; // 20 minutes keep-alive
if (server.requestTimeout !== undefined) {
  server.requestTimeout = 0; // Disable request timeout (Node 18+)
}
if (server.headersTimeout !== undefined) {
  server.headersTimeout = 1260000; // 21 minutes
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[ERROR] Port ${PORT} is already in use by another process.`);
    console.error(`Please terminate the process using port ${PORT} or set PORT in .env\n`);
  } else {
    console.error('[ERROR] Server error:', err);
  }
});

