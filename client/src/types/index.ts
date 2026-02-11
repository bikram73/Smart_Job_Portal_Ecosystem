export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience: number;
  skills: string[];
  education: Education[];
  preferredRoles: string[];
  preferredLocations: string[];
  expectedSalary?: number;
  resumeUrl?: string;
  profileComplete: boolean;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  experience: {
    min: number;
    max: number;
  };
  description: string;
  requirements: string[];
  skills: string[];
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  source: 'LinkedIn' | 'Naukri' | 'Indeed' | 'Company' | 'Manual';
  sourceUrl: string;
  postedDate: string;
  isActive: boolean;
}

export interface Application {
  _id: string;
  userId: string;
  jobId: Job;
  status: 'Saved' | 'Applied' | 'In Review' | 'Interview' | 'Rejected' | 'Selected';
  appliedDate?: string;
  notes?: string;
  resumeUsed?: string;
  matchScore?: number;
  skillGaps: string[];
  timeline: TimelineEvent[];
  createdAt: string;
}

export interface TimelineEvent {
  status: string;
  date: string;
  note?: string;
}

export interface Resume {
  _id: string;
  userId: string;
  title: string;
  template: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: ResumeEducation[];
  skills: {
    technical: string[];
    soft: string[];
  };
  projects: Project[];
  certifications: Certification[];
  atsScore?: number;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  location: string;
  year: string;
  gpa?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: 'job_match' | 'application_update' | 'interview_reminder' | 'skill_suggestion';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalApplications: number;
  appliedJobs: number;
  savedJobs: number;
  interviewsScheduled: number;
  successRate: number;
  avgMatchScore: number;
  recentApplications: Application[];
}

export interface Roadmap {
  role: string;
  skills: RoadmapSkill[];
  resources: Resource[];
  timeline: string;
  interviewPrep: InterviewPrep;
}

export interface RoadmapSkill {
  name: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface Resource {
  title: string;
  type: 'Course' | 'Book' | 'Article' | 'Video';
  url: string;
  duration?: string;
}

export interface InterviewPrep {
  topics: string[];
  commonQuestions: string[];
  codingProblems: string[];
}
