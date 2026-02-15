const fs = require('fs');
const { User, Job, Application, Resume } = require('./models');
const { connectDB } = require('./config/database');

async function importData() {
  try {
    await connectDB();
    
    console.log('\n========================================');
    console.log('     IMPORTING DATA TO POSTGRESQL');
    console.log('========================================\n');
    
    // Check if export file exists
    if (!fs.existsSync('data-export.json')) {
      console.error('❌ data-export.json not found!');
      console.log('Run: node export-data.js first');
      process.exit(1);
    }
    
    // Read exported data
    const data = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));
    
    console.log('Importing data...\n');
    
    // Import Users (without passwords being re-hashed)
    for (const userData of data.users) {
      await User.create(userData, {
        hooks: false, // Skip password hashing since already hashed
      });
    }
    console.log(`✓ Imported ${data.users.length} users`);
    
    // Import Jobs
    for (const jobData of data.jobs) {
      await Job.create(jobData);
    }
    console.log(`✓ Imported ${data.jobs.length} jobs`);
    
    // Import Applications
    for (const appData of data.applications) {
      await Application.create(appData);
    }
    console.log(`✓ Imported ${data.applications.length} applications`);
    
    // Import Resumes
    for (const resumeData of data.resumes) {
      await Resume.create(resumeData);
    }
    console.log(`✓ Imported ${data.resumes.length} resumes`);
    
    console.log('\n✓ Data import complete!');
    console.log(`\nExported from: ${data.exportedAt}`);
    console.log('Imported to: PostgreSQL');
    console.log('\n========================================\n');
    
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importData();
