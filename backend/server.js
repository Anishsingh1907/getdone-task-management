const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { initMongoSeed } = require('./services/dataService');
const { setupSwagger } = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (usually 5173 or 3000)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role', 'x-user-email'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI Documentation
setupSwagger(app);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'GetDone Task Management API',
    swaggerDocs: '/api-docs',
  });
});

// Root friendly redirect/landing
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center; background: #f8fafc; min-height: 100vh;">
      <h1 style="color: #3157d5; margin-bottom: 8px;">🚀 GetDone Task Management Backend API</h1>
      <p style="color: #64748b; font-size: 16px;">Node.js + Express + MongoDB Atlas/Compass + RBAC</p>
      <div style="margin-top: 24px;">
        <a href="/api-docs" style="display: inline-block; padding: 12px 24px; background: #3157d5; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">
          📘 Open Swagger API Documentation (/api-docs)
        </a>
      </div>
    </div>
  `);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  await initMongoSeed();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 GetDone Server listening at http://localhost:${PORT}`);
    console.log(`📘 Swagger API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🛠️  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

startServer();

