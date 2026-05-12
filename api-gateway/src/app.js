require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler.middleware');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'api-gateway OK' }));
app.use('/api', routes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

module.exports = app;