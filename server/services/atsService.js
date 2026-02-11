const calculateATSScore = (resume) => {
  let score = 0;

  // Contact information (10 points)
  if (resume.personalInfo) {
    if (resume.personalInfo.email) score += 3;
    if (resume.personalInfo.phone) score += 3;
    if (resume.personalInfo.linkedin || resume.personalInfo.github) score += 4;
  }

  // Summary/Objective (10 points)
  if (resume.summary && resume.summary.length > 50) score += 10;

  // Experience (30 points)
  if (resume.experience && resume.experience.length > 0) {
    score += Math.min(resume.experience.length * 10, 30);
  }

  // Education (15 points)
  if (resume.education && resume.education.length > 0) {
    score += 15;
  }

  // Skills (20 points)
  if (resume.skills) {
    const totalSkills = (resume.skills.technical?.length || 0) + (resume.skills.soft?.length || 0);
    score += Math.min(totalSkills * 2, 20);
  }

  // Projects (10 points)
  if (resume.projects && resume.projects.length > 0) {
    score += Math.min(resume.projects.length * 5, 10);
  }

  // Certifications (5 points)
  if (resume.certifications && resume.certifications.length > 0) {
    score += 5;
  }

  return Math.min(score, 100);
};

module.exports = { calculateATSScore };
