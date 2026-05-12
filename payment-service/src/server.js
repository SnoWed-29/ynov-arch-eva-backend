const app = require('./app');
const sequelize = require('./config/db');
require('./models/transaction.model');

const PORT = process.env.PORT || 3004;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ payment-service DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 payment-service running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start payment-service:', err.message);
    process.exit(1);
  }
};

start();