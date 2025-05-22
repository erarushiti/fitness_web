const sequelize = require('./config/db');
const User = require('./models/User');
const Client = require('./models/Client');
const Admin = require('./models/Admin');
const Session = require('./models/Sessions');
const SessionRegistration = require('./models/SessionRegistration');
const RefreshToken = require('./models/RefreshToken');
const Trainer = require('./models/Trainer');
const WaterLog = require('./models/WaterLog');
const Supplement = require('./models/Supplement');
const Orders = require('./models/Orders');
const OrderItems = require('./models/OrderItems');
const Cart = require('./models/Cart');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: false}); // Use { force: false } in production
    console.log('Database synchronized successfully with UUIDs.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

syncDatabase();