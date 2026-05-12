const Category = require('../models/category.model');

exports.getAll = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const category = await Category.create({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-') });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create category', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.update(req.body);
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};