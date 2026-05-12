const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Profile = sequelize.define('Profile', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: { model: 'users', key: 'id' },
  },
  first_name: { type: DataTypes.STRING(100) },
  last_name:  { type: DataTypes.STRING(100) },
  phone:      { type: DataTypes.STRING(20) },
  address:    { type: DataTypes.TEXT },
}, {
  tableName: 'profiles',
  timestamps: false,
});

User.hasOne(Profile, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Profile;