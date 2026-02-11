import { useQuery } from 'react-query';
import { applicationsAPI, jobsAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { 
  Briefcase, 
  FileText, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  
  const { data: stats } = useQuery('dashboard-stats', () => 
    applicationsAPI.getStats().then(res => res.data)
  );

  const { data: recentJobs } = useQuery('recent-jobs', () =>
    jobsAPI.getJobs({ limit: 5 }).then(res => res.data)
  );

  const statusData = [
    { name: 'Applied', count: stats?.appliedJobs || 0 },
    { name: 'Interview', count: stats?.interviewsScheduled || 0 },
    { name: 'Saved', count: stats?.savedJobs || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">Here's your job search overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalApplications || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Applied Jobs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.appliedJobs || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.successRate || 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Interviews</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.interviewsScheduled || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Application Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Profile Completion */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Profile Strength</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Profile Completion</span>
                <span className="font-medium">{user?.profileComplete ? '100%' : '60%'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full" 
                  style={{ width: user?.profileComplete ? '100%' : '60%' }}
                />
              </div>
            </div>
            
            <div className="space-y-2 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${user?.skills.length ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Skills Added</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${user?.resumeUrl ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Resume Uploaded</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${user?.preferredRoles.length ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Preferences Set</span>
              </div>
            </div>

            {!user?.profileComplete && (
              <Link to="/profile" className="btn-primary w-full mt-4 inline-flex items-center justify-center gap-2">
                Complete Profile
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recommended Jobs</h2>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentJobs?.jobs?.slice(0, 5).map((job: any) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{job.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span>{job.experience.min}-{job.experience.max} years</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="text-green-600" size={16} />
                  <span className="text-sm font-medium text-green-600">85% Match</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
