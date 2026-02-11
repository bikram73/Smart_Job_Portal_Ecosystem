import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Jobs from '@/pages/Jobs';
import JobDetails from '@/pages/JobDetails';
import Applications from '@/pages/Applications';
import Resumes from '@/pages/Resumes';
import ResumeBuilder from '@/pages/ResumeBuilder';
import Profile from '@/pages/Profile';
import Roadmap from '@/pages/Roadmap';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="jobs/:id" element={<JobDetails />} />
        <Route path="applications" element={<Applications />} />
        <Route path="resumes" element={<Resumes />} />
        <Route path="resumes/new" element={<ResumeBuilder />} />
        <Route path="resumes/:id/edit" element={<ResumeBuilder />} />
        <Route path="profile" element={<Profile />} />
        <Route path="roadmap/:jobId" element={<Roadmap />} />
      </Route>
    </Routes>
  );
}

export default App;
