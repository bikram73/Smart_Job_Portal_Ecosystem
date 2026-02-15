const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ATSAssessment = sequelize.define('ATSAssessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  resumeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Resumes',
      key: 'id',
    },
  },
  overallScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  scores: {
    type: DataTypes.JSON,
    defaultValue: {
      formatting: 0,
      keywords: 0,
      experience: 0,
      education: 0,
      skills: 0,
      readability: 0,
    },
  },
  recommendations: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  missingKeywords: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  strengths: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  weaknesses: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  assessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: 'ATSAssessments',
});

module.exports = ATSAssessment;
