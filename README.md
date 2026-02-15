<div align="center">

# 🚀 Smart Job Portal Ecosystem

### Your AI-Powered Career Companion

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A full-stack TypeScript/React job portal application with intelligent job matching, ATS-optimized resume builder, application tracking, and personalized learning roadmaps.

[Features](#-features) • [Quick Start](#-quick-start) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎯 Core Features
- **🔍 Job Discovery Engine**: Browse and search 17+ job roles with advanced filters
- **🤖 Smart Job Matching**: AI-powered matching based on skills and profile
- **📄 Resume Builder**: Create ATS-optimized resumes with multiple templates
- **📊 Application Tracker**: Track all applications with status updates and timeline
- **🎓 Learning Roadmap**: Personalized interview prep and skill development paths
- **🔔 Notifications**: Real-time alerts for job matches and application updates
- **📈 Dashboard Analytics**: Visual insights into your job search progress

### 🛠️ Tech Stack

**Frontend:**
- ⚛️ React 18 with TypeScript
- ⚡ Vite for fast development
- 🎨 TailwindCSS for styling
- 🔄 React Query for data fetching
- 🐻 Zustand for state management
- 📝 React Hook Form for forms
- 📊 Recharts for analytics

**Backend:**
- 🟢 Node.js with Express
- 💾 SQLite / PostgreSQL with Sequelize ORM
- 🔐 JWT authentication
- 🌐 RESTful API architecture

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js 18+ 
- npm or yarn
- ✅ No database installation needed! (Uses SQLite by default)

### 📦 Installation

**1. Clone the repository**
```bash
git clone https://github.com/bikram73/Smart_Job_Portal_Ecosystem.git
cd Smart_Job_Portal_Ecosystem
```

**2. Install dependencies**
```bash
npm run install-all
```

**3. Configure environment variables**

Create `server/.env`:
```env
PORT=5000
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000

# Optional: PostgreSQL (uses SQLite if not set)
# POSTGRES_URL=postgresql://username:password@localhost:5432/job_portal
```

**4. Run the application**

**Windows:**
```bash
START.bat
```

**Mac/Linux:**
```bash
npm run dev
```

This will start:
- 🎨 Frontend: http://localhost:5173
- ⚙️ Backend: http://localhost:5000

### 🎯 First Time Setup

1. Visit http://localhost:5173
2. Click "Register" to create an account
3. Password requirements:
   - Minimum 12 characters
   - At least 1 uppercase letter
   - At least 1 special character (!@#$%^&* etc.)
4. Start exploring jobs!

## 💻 Development Commands

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run client

# Run backend only
npm run server

# Build for production
npm run build

# Reset database (Windows)
RESET_DATABASE.bat
```

## 📁 Project Structure

```
Smart_Job_Portal_Ecosystem/
├── 📂 client/                 # React frontend
│   ├── 📂 src/
│   │   ├── 📂 components/    # Reusable components
│   │   ├── 📂 pages/         # Page components
│   │   ├── 📂 services/      # API services
│   │   ├── 📂 store/         # State management
│   │   ├── 📂 types/         # TypeScript types
│   │   └── 📄 App.tsx        # Main app component
│   └── 📄 package.json
├── 📂 server/                # Node.js backend
│   ├── 📂 models/           # Database models
│   ├── 📂 routes/           # API routes
│   ├── 📂 middleware/       # Express middleware
│   ├── 📂 services/         # Business logic
│   ├── 📂 config/           # Configuration
│   └── 📄 server.js         # Server entry point
├── 📂 api/                  # Vercel serverless functions
└── 📄 package.json          # Root package.json
```

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### 💼 Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/search` - Search jobs

### 📋 Applications
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Create application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/stats` - Get application statistics

### 📄 Resumes
- `GET /api/resumes` - Get user resumes
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/analyze` - Analyze resume for ATS score

### 👤 Profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/matching-jobs` - Get matching jobs

### 🔔 Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read

## 🗄️ Database

### SQLite (Default)
No setup required! The app uses SQLite by default.

### PostgreSQL (Production)
For production deployment, use PostgreSQL:

1. Set `POSTGRES_URL` in environment variables
2. The app automatically switches to PostgreSQL
3. See `POSTGRES_MIGRATION.md` for detailed guide

**Vercel Postgres:**
```env
POSTGRES_URL=postgres://default:xxxxx@xxxxx.postgres.vercel-storage.com/verceldb
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `JWT_SECRET`
   - `POSTGRES_URL` (optional)
4. Deploy!

See `DEBUG_VERCEL.md` for detailed instructions.

## 📚 Documentation

- `POSTGRES_MIGRATION.md` - PostgreSQL setup guide
- `TROUBLESHOOTING.md` - Common issues and solutions
- `DEBUG_VERCEL.md` - Vercel deployment debugging

## 🎯 Available Job Roles

The platform includes 17 pre-seeded job roles:
- Full Stack Developer
- Frontend Developer
- Backend Developer
- Data Analyst
- DevOps Engineer
- UI/UX Designer
- Machine Learning Engineer
- Mobile App Developer
- QA Engineer
- Product Manager
- Cybersecurity Analyst
- Cloud Architect
- Business Analyst
- Blockchain Developer
- Technical Writer
- Site Reliability Engineer

## 🛠️ Troubleshooting

### Registration Issues
If registration fails:
1. Clear browser Local Storage (F12 → Application → Local Storage)
2. Ensure password meets requirements (12+ chars, uppercase, special char)
3. Use a unique email address
4. Check browser console for errors

### Database Issues
```bash
# Reset database (Windows)
RESET_DATABASE.bat

# Or manually
cd server
npm run reset-db
```

### Port Conflicts
```bash
# Kill all Node processes (Windows)
taskkill /f /im node.exe

# Then restart
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔃 Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Bikram**
- GitHub: [@bikram73](https://github.com/bikram73)

## 🙏 Acknowledgments

- Built with ❤️ using React, Node.js, and TypeScript
- Icons from Lucide React
- UI inspiration from modern job portals

## 📞 Support

For issues and questions, please open an issue on [GitHub Issues](https://github.com/bikram73/Smart_Job_Portal_Ecosystem/issues).

---

<div align="center">

Made with ❤️ by Bikram

⭐ Star this repo if you find it helpful!

</div>
