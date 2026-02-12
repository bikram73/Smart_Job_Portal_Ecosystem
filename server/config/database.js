const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.POSTGRES_URL) {
  sequelize = new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'),
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(process.env.POSTGRES_URL ? 'PostgreSQL Database Connected' : 'SQLite Database Connected');
    
    // Use force: true in development to recreate tables, or just sync normally
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: true } 
      : { force: false };
    
    await sequelize.sync(syncOptions);
    console.log('Database synced');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error; // Don't exit process in serverless environment
  }
};

module.exports = { sequelize, connectDB };
