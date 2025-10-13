const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// ⚠️ CRITICAL: Load .env FIRST before requiring any other files
const envPath = path.join(__dirname, '.env');
console.log('📁 Looking for .env at:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

console.log('✅ .env file loaded successfully');
console.log('🔑 API Key exists:', !!process.env.GEMINI_API_KEY);
console.log('🔑 API Key length:', process.env.GEMINI_API_KEY?.length || 0);
console.log('🔑 API Key preview:', process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'Not found');

// Exit if API key is missing
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ CRITICAL ERROR: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

// NOW require routes AFTER dotenv is loaded
const classifyRoutes = require('./routes/classify');

const app = express();
const PORT = process.env.PORT || 5000;

// Update CORS section
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Will set this env variable on Render
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
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RecycleBuddy API Server',
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
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/classify`);
  console.log(`🔑 Gemini API Key: Configured ✓`);
  console.log('🚀 =====================================\n');
});
