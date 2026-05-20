require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const fragmentRoutes = require('./routes/fragments');

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required before the server can start');
}

if (!CLIENT_ORIGIN) {
  throw new Error('CLIENT_ORIGIN is required before the server can start');
}

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/fragments', fragmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Fragments API listening on http://localhost:${PORT}`);
});
