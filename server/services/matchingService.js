const User = require('../models/User');
const Job = require('../models/Job');

const calculateMatchScore = async (userId, jobId) => {
  try {
    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user || !job) {
      return { score: 0, gaps: [] };
    }

    let score = 0;
    const gaps = [];

    // Skills matching (40%)
    const userSkills = user.skills.map(s => s.toLowerCase());
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const matchedSkills = jobSkills.filter(skill => userSkills.includes(skill));
    const skillScore = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 40 : 0;
    score += skillScore;

    jobSkills.forEach(skill => {
      if (!userSkills.includes(skill)) {
        gaps.push(skill);
      }
    });

    // Experience matching (30%)
    if (job.experience && job.experience.min !== undefined) {
      if (user.experience >= job.experience.min) {
        score += 30;
      } else {
        score += (user.experience / job.experience.min) * 30;
      }
    } else {
      score += 30;
    }

    // Location matching (15%)
    if (job.location && user.preferredLocations && user.preferredLocations.length > 0) {
      const locationMatch = user.preferredLocations.some(loc => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      );
      if (locationMatch) score += 15;
    } else {
      score += 15;
    }

    // Role matching (15%)
    if (user.preferredRoles && user.preferredRoles.length > 0) {
      const roleMatch = user.preferredRoles.some(role => 
        job.title.toLowerCase().includes(role.toLowerCase())
      );
      if (roleMatch) score += 15;
    } else {
      score += 15;
    }

    return {
      score: Math.round(score),
      gaps: gaps.slice(0, 5)
    };
  } catch (error) {
    console.error('Match score calculation error:', error);
    return { score: 0, gaps: [] };
  }
};

module.exports = { calculateMatchScore };
