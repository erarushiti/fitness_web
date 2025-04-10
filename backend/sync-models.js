const sequelize = require('./config/db');
const User = require('./models/User');
const Client = require('./models/Client');
const Admin = require('./models/Admin');
const Session = require('./models/Sessions');

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ force: true }); // Use { force: false } in production
    console.log('Database synchronized successfully with UUIDs.');

    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

syncDatabase();