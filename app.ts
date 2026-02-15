import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { jobRoutes } from './routes/jobRoutes';
import { resumeRoutes } from './routes/resumeRoutes';
import { readinessRoutes } from './routes/readinessRoutes';
import { authRoutes } from './routes/authRoutes';

// Initialize Express App
const app = express();

// ==========================================
// 8. Non-Functional Requirements (Security)
// ==========================================
// NFR-007: TLS 1.2+ (Handled by infra/reverse proxy, but app is ready)
// NFR-011: Privacy & Security Headers
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging Middleware (NFR-010 Audit logging hook)
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ==========================================
// Route Definitions (Modular Architecture)
// ==========================================

// FR-001, FR-002: Identity & Auth
app.use('/api/v1/auth', authRoutes);

// FR-101 to FR-108: Job Notification Tracker
app.use('/api/v1/jobs', jobRoutes);

// FR-301 to FR-307: AI Resume Builder
app.use('/api/v1/resumes', resumeRoutes);

// FR-201 to FR-207: Placement Readiness
app.use('/api/v1/readiness', readinessRoutes);

// Health Check (NFR-004 Availability)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', version: '3.0.0' });
});

export default app;