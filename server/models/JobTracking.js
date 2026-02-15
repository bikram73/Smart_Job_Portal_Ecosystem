const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobTracking = sequelize.define('JobTracking', {
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
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('new', 'saved', 'applied', 'interviewing', 'offered', 'rejected', 'archived'),
    defaultValue: 'new',
  },
  relevanceScore: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  },
  matchReasons: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  appliedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  lastStatusChange: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  timeline: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'JobTrackings',
});

module.exports = JobTracking;
