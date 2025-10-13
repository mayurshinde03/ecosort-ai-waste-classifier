const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables with explicit path
const envPath = path.join(__dirname, '.env');
console.log('📁 Looking for .env at:', envPath);

// Try to load .env file, but don't fail if it doesn't exist (for Render deployment)
const result = dotenv.config({ path: envPath });

if (result.error) {
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ No .env file found (expected in production - using environment variables)');
  } else {
    console.error('❌ Error loading .env file:', result.error);
    // Only exit in development if .env is missing
    if (!process.env.GEMINI_API_KEY) {
      console.error('💡 Please create a .env file with GEMINI_API_KEY');
      process.exit(1);
    }
  }
} else {
  console.log('✅ .env file loaded successfully');
}

// NOW require routes AFTER dotenv is loaded
const classifyRoutes = require('./routes/classify');

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔧 ===== Environment Configuration =====');
console.log('🔑 API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('🔑 API Key length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('🔑 API Key preview:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'Not found');
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('========================================\n');

// Exit if API key is missing
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ CRITICAL ERROR: GEMINI_API_KEY not found in environment variables');
  console.error('📝 For local development: Create .env file in server directory');
  console.error('📝 For Render deployment: Set environment variable in dashboard');
  process.exit(1);
}

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL 
  ? [process.env.CLIENT_URL, 'http://localhost:5173'] 
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', classifyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RecycleBuddy API Server',
    status: 'active',
    endpoints: {
      health: '/health',
      classify: '/api/classify'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 =====================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 API endpoint: /api/classify`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Configured ✓' : 'Missing ✗'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 =====================================\n');
});
