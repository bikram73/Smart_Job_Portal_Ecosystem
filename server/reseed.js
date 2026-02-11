const { connectDB } = require('./config/database');
const { Job } = require('./models');
const { seedJobs } = require('./seedData');

async function reseed() {
  try {
    await connectDB();
    
    console.log('Checking current job count...');
    const count = await Job.count();
    console.log(`Current jobs in database: ${count}`);
    
    if (count === 0) {
      console.log('No jobs found. Seeding database...');
      await seedJobs();
      const newCount = await Job.count();
      console.log(`✓ Successfully seeded ${newCount} jobs!`);
    } else {
      console.log('Jobs already exist. To reseed, delete database.sqlite and run again.');
      console.log('\nOr run: npm run reseed-force');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

reseed();
