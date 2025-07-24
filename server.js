const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');
const commentRoutes = require('./routes/comment'); // if you have comments

dotenv.config();

const app = express();

// ✅ Netlify frontend domain for CORS
const allowedOrigins = ['https://silver-arithmetic-660977.netlify.app'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  exposedHeaders: ['Authorization'],
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection and server start
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');

  // ✅ Route middlewares
  app.use('/api/auth', authRoutes);  
  app.use('/api/blogs', blogRoutes);
  app.use('/api/comments', commentRoutes);

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});





