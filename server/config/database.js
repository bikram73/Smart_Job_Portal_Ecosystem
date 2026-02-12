const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite Database Connected');
    
    // Use force: true in development to recreate tables, or just sync normally
    const syncOptions = process.env.NODE_ENV === 'production' 
      ? { alter: false } 
      : { force: false };
    
    await sequelize.sync(syncOptions);
    console.log('Database synced');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error; // Don't exit process in serverless environment
  }
};

module.exports = { sequelize, connectDB };
