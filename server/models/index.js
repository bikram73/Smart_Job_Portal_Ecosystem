const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: DataTypes.STRING,
  location: DataTypes.STRING,
  experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  skills: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    },
  },
  education: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('education');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('education', JSON.stringify(value));
    },
  },
  preferredRoles: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('preferredRoles');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('preferredRoles', JSON.stringify(value));
    },
  },
  preferredLocations: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('preferredLocations');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('preferredLocations', JSON.stringify(value));
    },
  },
  expectedSalary: DataTypes.INTEGER,
  resumeUrl: DataTypes.STRING,
  profileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Job Model
const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: DataTypes.STRING,
  salaryMin: DataTypes.INTEGER,
  salaryMax: DataTypes.INTEGER,
  salaryCurrency: {
    type: DataTypes.STRING,
    defaultValue: 'INR',
  },
  experienceMin: DataTypes.INTEGER,
  experienceMax: DataTypes.INTEGER,
  description: DataTypes.TEXT,
  requirements: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('requirements');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('requirements', JSON.stringify(value));
    },
  },
  skills: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    },
  },
  jobType: {
    type: DataTypes.STRING,
    defaultValue: 'Full-time',
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'Manual',
  },
  sourceUrl: DataTypes.STRING,
  postedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

// Application Model
const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Saved',
  },
  appliedDate: DataTypes.DATE,
  notes: DataTypes.TEXT,
  resumeUsed: DataTypes.STRING,
  matchScore: DataTypes.INTEGER,
  skillGaps: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('skillGaps');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('skillGaps', JSON.stringify(value));
    },
  },
  timeline: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('timeline');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('timeline', JSON.stringify(value));
    },
  },
});

// Resume Model
const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  template: {
    type: DataTypes.STRING,
    defaultValue: 'modern',
  },
  personalInfo: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('personalInfo');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('personalInfo', JSON.stringify(value));
    },
  },
  summary: DataTypes.TEXT,
  experience: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('experience');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('experience', JSON.stringify(value));
    },
  },
  education: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('education');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('education', JSON.stringify(value));
    },
  },
  skills: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('skills');
      return value ? JSON.parse(value) : { technical: [], soft: [] };
    },
    set(value) {
      this.setDataValue('skills', JSON.stringify(value));
    },
  },
  projects: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('projects');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('projects', JSON.stringify(value));
    },
  },
  certifications: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('certifications');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('certifications', JSON.stringify(value));
    },
  },
  atsScore: DataTypes.INTEGER,
  targetRole: DataTypes.STRING,
  pdfUrl: DataTypes.STRING,
});

// Notification Model
const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: DataTypes.STRING,
  message: DataTypes.TEXT,
  link: DataTypes.STRING,
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// PrepPlan Model - For Placement Readiness
const PrepPlan = sequelize.define('PrepPlan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetRole: DataTypes.STRING,
  jdText: DataTypes.TEXT,
  extractedSkills: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('extractedSkills');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('extractedSkills', JSON.stringify(value));
    },
  },
  roundMapping: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('roundMapping');
      return value ? JSON.parse(value) : { aptitude: [], coding: [], technical: [], hr: [] };
    },
    set(value) {
      this.setDataValue('roundMapping', JSON.stringify(value));
    },
  },
  readinessScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
  targetDate: DataTypes.DATE,
});

// PrepTask Model
const PrepTask = sequelize.define('PrepTask', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  round: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  resourceLinks: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('resourceLinks');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('resourceLinks', JSON.stringify(value));
    },
  },
  estimatedTime: DataTypes.INTEGER,
  priority: {
    type: DataTypes.STRING,
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  completedAt: DataTypes.DATE,
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

// ATSAssessment Model
const ATSAssessment = sequelize.define('ATSAssessment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  overallScore: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  scores: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('scores');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('scores', JSON.stringify(value));
    },
  },
  recommendations: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('recommendations');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('recommendations', JSON.stringify(value));
    },
  },
  missingKeywords: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('missingKeywords');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('missingKeywords', JSON.stringify(value));
    },
  },
  strengths: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('strengths');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('strengths', JSON.stringify(value));
    },
  },
  weaknesses: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('weaknesses');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('weaknesses', JSON.stringify(value));
    },
  },
  assessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// JobTracking Model
const JobTracking = sequelize.define('JobTracking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'new',
  },
  relevanceScore: DataTypes.FLOAT,
  matchReasons: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('matchReasons');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('matchReasons', JSON.stringify(value));
    },
  },
  notes: DataTypes.TEXT,
  appliedDate: DataTypes.DATE,
  lastStatusChange: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  timeline: {
    type: DataTypes.TEXT,
    get() {
      const value = this.getDataValue('timeline');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('timeline', JSON.stringify(value));
    },
  },
});

// Relationships
User.hasMany(Application, { foreignKey: 'userId' });
Application.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(Application, { foreignKey: 'jobId' });
Application.belongsTo(Job, { foreignKey: 'jobId' });

User.hasMany(Resume, { foreignKey: 'userId' });
Resume.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// New KodNestCareers relationships
User.hasMany(PrepPlan, { foreignKey: 'userId' });
PrepPlan.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(PrepPlan, { foreignKey: 'jobId' });
PrepPlan.belongsTo(Job, { foreignKey: 'jobId' });

PrepPlan.hasMany(PrepTask, { foreignKey: 'prepPlanId' });
PrepTask.belongsTo(PrepPlan, { foreignKey: 'prepPlanId' });

Resume.hasMany(ATSAssessment, { foreignKey: 'resumeId' });
ATSAssessment.belongsTo(Resume, { foreignKey: 'resumeId' });

User.hasMany(JobTracking, { foreignKey: 'userId' });
JobTracking.belongsTo(User, { foreignKey: 'userId' });

Job.hasMany(JobTracking, { foreignKey: 'jobId' });
JobTracking.belongsTo(Job, { foreignKey: 'jobId' });

module.exports = {
  User,
  Job,
  Application,
  Resume,
  Notification,
  PrepPlan,
  PrepTask,
  ATSAssessment,
  JobTracking,
};
