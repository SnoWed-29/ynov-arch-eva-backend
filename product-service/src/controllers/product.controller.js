const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const where = {};
    if (category)  where.category_id = category;
    if (search)    where.name = { [Op.iLike]: `%${search}%` };

    const offset = (page - 1) * limit;
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ total: count, page: parseInt(page), products: rows });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, category_id } = req.body;
    if (!name || !price) return res.status(400).json({ message: 'name and price are required' });
    const product = await Product.create({ name, description, price, stock_quantity, category_id });
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.update(req.body);
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};

// Internal route called by order-service to decrement stock
exports.decrementStock = async (req, res) => {
  try {
    const { items } = req.body; // [{ product_id, quantity }]
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product) return res.status(404).json({ message: `Product ${item.product_id} not found` });
      if (product.stock_quantity < item.quantity)
        return res.status(409).json({ message: `Insufficient stock for product ${product.name}` });
      await product.decrement('stock_quantity', { by: item.quantity });
    }
    res.json({ message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ message: 'Stock update failed', error: err.message });
  }
};