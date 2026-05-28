const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to DB
const connectDB = require('./src/config/db');
connectDB();

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/posts', require('./src/routes/posts'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api/comments', require('./src/routes/comments'));

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Blogging Platform API is running' });
});

// Global error handler
app.use(require('./src/middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
