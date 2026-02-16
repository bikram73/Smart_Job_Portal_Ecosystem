const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

// Check for DATABASE_URL or POSTGRES_URL
const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectModule: require('pg'),
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
    const dbType = (process.env.DATABASE_URL || process.env.POSTGRES_URL) ? 'PostgreSQL' : 'SQLite';
    console.log(`${dbType} Database Connected`);
    
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
