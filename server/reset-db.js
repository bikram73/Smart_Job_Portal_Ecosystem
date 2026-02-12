const fs = require('fs');
const path = require('path');
const { connectDB } = require('./config/database');
const { seedJobs } = require('./seedData');

async function resetDatabase() {
  try {
    const dbPath = path.join(__dirname, 'database.sqlite');
    
    // Delete existing database file
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✓ Deleted existing database');
    }
    
    // Connect and create fresh database
    await connectDB();
    console.log('✓ Created fresh database');
    
    // Seed with sample data
    await seedJobs();
    console.log('✓ Seeded database with sample jobs');
    
    console.log('\n🎉 Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

resetDatabase();