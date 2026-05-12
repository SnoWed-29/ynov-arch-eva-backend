const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending',
    validate: { isIn: [['pending', 'paid', 'shipped', 'cancelled']] },
  },
}, {
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Order;