// Shared Types based on PRD Data Models

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  skills: string[];
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedAt: string;
  matchStatus?: 'NEW' | 'SAVED' | 'APPLIED';
  relevanceScore?: number;
}

export interface Resume {
  id: string;
  title: string;
  atsScore?: number;
  sections: ResumeSection[];
}

export interface ResumeSection {
  title: string;
  content: string; // HTML or Markdown
}

export interface PrepPlan {
  id: string;
  targetRole: string;
  readinessScore: number;
  tasks: PrepTask[];
}

export interface PrepTask {
  id: string;
  title: string;
  category: 'APTITUDE' | 'CODING' | 'TECHNICAL' | 'HR';
  isCompleted: boolean;
}