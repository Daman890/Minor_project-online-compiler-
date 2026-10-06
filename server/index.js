const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Rate limiting
//const limiter = rateLimit({
//  windowMs: 15 * 60 * 1000, // 15 minutes
//  max: 100, // limit each IP to 100 requests per windowMs
//});
//app.use('/api/', limiter);

// Temporary test route
app.get('/api', (req, res) => {
  res.json({ message: 'API is working' });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/code', require('./routes/code'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/execute', require('./routes/execute'));
app.use('/api/code', require('./routes/code'));

// Test route
app.get('/', (req, res) => {
  res.send('Online Compiler API is running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});