const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PrepPlan = sequelize.define('PrepPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetRole: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  jdText: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  extractedSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  roundMapping: {
    type: DataTypes.JSON,
    defaultValue: {
      aptitude: [],
      coding: [],
      technical: [],
      hr: [],
    },
  },
  readinessScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100,
    },
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'archived'),
    defaultValue: 'active',
  },
  targetDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'PrepPlans',
});

module.exports = PrepPlan;
