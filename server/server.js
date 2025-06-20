const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');

const app = express();

// ✅ Step 1: CORS configuration with origin + preflight
const allowedOrigins = ['https://my-movie-list-zf9p.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// ✅ Step 2: Preflight response support
app.options('*', cors());

// ✅ Step 3: JSON parsing
app.use(express.json());

// ✅ DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
app.get('/', (req, res) => res.send('🎬 Movie API is working'));
app.use('/api/auth', authRoutes);
app.use('/api/list', listRoutes);

// ✅ Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
