require('dotenv').config();
const express = require('express');
const cors = require('cors');
const categoryRoutes = require('./routes/category.routes');
const productRoutes  = require('./routes/product.routes');

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-role'],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'products-service OK' }));
app.use('/api/categories', categoryRoutes);
app.use('/api/products',   productRoutes);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;