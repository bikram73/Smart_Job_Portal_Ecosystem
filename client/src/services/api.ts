import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;
      
      // Clear auth state
      useAuthStore.getState().logout();
      
      // Show appropriate message
      if (errorCode === 'TOKEN_OUTDATED') {
        // Token format changed, need to re-login
        console.log('Token outdated, redirecting to login');
      }
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Jobs API
export const jobsAPI = {
  getJobs: (params?: any) => api.get('/jobs', { params }),
  getJobById: (id: string) => api.get(`/jobs/${id}`),
  searchJobs: (query: string) => api.get(`/jobs/search?q=${query}`),
};

// Applications API
export const applicationsAPI = {
  getApplications: () => api.get('/applications'),
  createApplication: (data: any) => api.post('/applications', data),
  updateApplication: (id: string, data: any) => api.put(`/applications/${id}`, data),
  deleteApplication: (id: string) => api.delete(`/applications/${id}`),
  getStats: () => api.get('/applications/stats'),
};

// Resumes API
export const resumesAPI = {
  getResumes: () => api.get('/resumes'),
  getResumeById: (id: string) => api.get(`/resumes/${id}`),
  createResume: (data: any) => api.post('/resumes', data),
  updateResume: (id: string, data: any) => api.put(`/resumes/${id}`, data),
  deleteResume: (id: string) => api.delete(`/resumes/${id}`),
  analyzeResume: (data: any) => api.post('/resumes/analyze', data),
  generatePDF: (id: string) => api.get(`/resumes/${id}/pdf`, { responseType: 'blob' }),
};

// Profile API
export const profileAPI = {
  updateProfile: (data: any) => api.put('/profile', data),
  getMatchingJobs: () => api.get('/profile/matching-jobs'),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

// Roadmap API
export const roadmapAPI = {
  getRoadmap: (jobId: string) => api.get(`/roadmap/${jobId}`),
  updateSkillStatus: (skillId: string, status: string) => api.put(`/roadmap/skills/${skillId}`, { status }),
};
