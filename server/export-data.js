const fs = require('fs');
const { User, Job, Application, Resume } = require('./models');
const { connectDB } = require('./config/database');

async function exportData() {
  try {
    await connectDB();
    
    console.log('\n========================================');
    console.log('     EXPORTING DATA FROM SQLITE');
    console.log('========================================\n');
    
    // Export Users
    const users = await User.findAll();
    console.log(`✓ Exported ${users.length} users`);
    
    // Export Jobs
    const jobs = await Job.findAll();
    console.log(`✓ Exported ${jobs.length} jobs`);
    
    // Export Applications
    const applications = await Application.findAll();
    console.log(`✓ Exported ${applications.length} applications`);
    
    // Export Resumes
    const resumes = await Resume.findAll();
    console.log(`✓ Exported ${resumes.length} resumes`);
    
    // Save to JSON file
    const data = {
      users: users.map(u => u.toJSON()),
      jobs: jobs.map(j => j.toJSON()),
      applications: applications.map(a => a.toJSON()),
      resumes: resumes.map(r => r.toJSON()),
      exportedAt: new Date().toISOString(),
    };
    
    fs.writeFileSync('data-export.json', JSON.stringify(data, null, 2));
    
    console.log('\n✓ Data exported to: data-export.json');
    console.log('\nYou can now:');
    console.log('1. Update POSTGRES_URL in .env');
    console.log('2. Restart server');
    console.log('3. Run: node import-data.js');
    console.log('\n========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  }
}

exportData();
