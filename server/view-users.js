const { User, Application, Resume } = require('./models');
const { connectDB } = require('./config/database');

async function viewUsers() {
  try {
    await connectDB();
    
    console.log('\n========================================');
    console.log('           USER DATABASE');
    console.log('========================================\n');
    
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'experience', 'skills', 'profileComplete', 'createdAt'],
      order: [['createdAt', 'DESC']],
    });
    
    if (users.length === 0) {
      console.log('No users found in database.\n');
      process.exit(0);
    }
    
    console.log(`Total Users: ${users.length}\n`);
    
    for (const user of users) {
      const applications = await Application.count({ where: { userId: user.id } });
      const resumes = await Resume.count({ where: { userId: user.id } });
      
      console.log('----------------------------------------');
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Experience: ${user.experience} years`);
      console.log(`Skills: ${user.skills.length > 0 ? user.skills.join(', ') : 'None'}`);
      console.log(`Profile Complete: ${user.profileComplete ? 'Yes' : 'No'}`);
      console.log(`Applications: ${applications}`);
      console.log(`Resumes: ${resumes}`);
      console.log(`Registered: ${new Date(user.createdAt).toLocaleString()}`);
      console.log('');
    }
    
    console.log('========================================\n');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

viewUsers();
