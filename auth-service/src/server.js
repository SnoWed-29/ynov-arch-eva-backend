const app = require('./app');
const sequelize = require('./config/db');

// Import models so Sequelize registers associations before sync
require('./models/user.model');
require('./models/profile.model');

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`🚀 auth-service running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start auth-service:', err.message);
    process.exit(1);
  }
};

start();