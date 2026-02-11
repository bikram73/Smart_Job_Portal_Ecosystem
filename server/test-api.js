const { connectDB } = require('./config/database');
const { Job, User } = require('./models');

async function testAPI() {
  try {
    await connectDB();
    
    console.log('\n=== DATABASE TEST ===\n');
    
    // Test Jobs
    const jobCount = await Job.count();
    console.log(`✓ Jobs in database: ${jobCount}`);
    
    if (jobCount > 0) {
      const sampleJob = await Job.findOne();
      console.log(`✓ Sample job: ${sampleJob.title} at ${sampleJob.company}`);
    }
    
    // Test Users
    const userCount = await User.count();
    console.log(`✓ Users in database: ${userCount}`);
    
    if (userCount > 0) {
      const sampleUser = await User.findOne();
      console.log(`✓ Sample user: ${sampleUser.name} (${sampleUser.email})`);
    }
    
    console.log('\n=== TEST COMPLETE ===\n');
    
    if (jobCount === 0) {
      console.log('⚠️  No jobs found! Run: npm run reseed-force');
    }
    
    if (userCount === 0) {
      console.log('⚠️  No users found! Register a new account at http://localhost:3000/register');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testAPI();
