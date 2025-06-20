const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// ✅ CORS setup — allow your frontend to access this backend
app.use(cors({
  origin: ['https://my-movie-list-zf9p.vercel.app'], // ← Replace with your actual Vercel frontend URL
  methods: ['GET', 'POST', 'DELETE'],
  credentials: true
}));

// Body parser
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Basic health check route
app.get('/', (req, res) => {
  res.send('🎬 Movie API is working');
});

// ✅ Routes
app.use('/api/auth', authRoutes);  // Register/Login
app.use('/api/list', listRoutes);  // Favorites / Watched / Recommended

// ✅ Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
