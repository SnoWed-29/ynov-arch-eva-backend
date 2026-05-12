const app = require('./app');
const sequelize = require('./config/db');
require('./models/category.model');
require('./models/product.model');

const PORT = process.env.PORT || 3002;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 products-service running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start products-service:', err.message);
    process.exit(1);
  }
};

start();