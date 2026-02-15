const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PrepTask = sequelize.define('PrepTask', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  prepPlanId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'PrepPlans',
      key: 'id',
    },
  },
  round: {
    type: DataTypes.ENUM('aptitude', 'coding', 'technical', 'hr'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  resourceLinks: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  estimatedTime: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
  },
  priority: {
    type: DataTypes.ENUM('high', 'medium', 'low'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'skipped'),
    defaultValue: 'pending',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'PrepTasks',
});

module.exports = PrepTask;
