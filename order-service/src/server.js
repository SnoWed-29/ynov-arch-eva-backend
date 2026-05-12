const app = require('./app');
const sequelize = require('./config/db');
require('./models/order.model');
require('./models/orderItem.model');

const PORT = process.env.PORT || 3003;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 order-service running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start order-service:', err.message);
    process.exit(1);
  }
};

start();