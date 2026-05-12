const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./category.model');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: { model: 'categories', key: 'id' },
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: { type: DataTypes.TEXT },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'products',
  timestamps: false,
});

Category.hasMany(Product, { foreignKey: 'category_id' });
Product.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Product;