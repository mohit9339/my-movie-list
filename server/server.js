const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import route handlers (no colons or dynamic names here)
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// ✅ Step 1: Configure CORS for frontend domains
const allowedOrigins = [
  'https://my-movie-list-three.vercel.app', // your deployed frontend on Vercel
  'http://localhost:5173', // for local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl or Postman) or from allowed domains
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Step 2: Handle preflight OPTIONS requests globally
app.options('*', cors());

// ✅ Step 3: Parse JSON request bodies
app.use(express.json());

// ✅ Step 4: Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Step 5: Define base route and mount API routes
app.get('/', (req, res) => {
  res.send('🎬 Movie API is working');
});

// Mount auth and list routes
app.use('/api/auth', authRoutes);   // e.g., /api/auth/register, /api/auth/login
app.use('/api/list', listRoutes);   // e.g., /api/list/favorites

// ✅ Step 6: Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
