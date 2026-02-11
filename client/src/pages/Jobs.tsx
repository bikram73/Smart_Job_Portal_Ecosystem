import { useState } from 'react';
import { useQuery } from 'react-query';
import { jobsAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, DollarSign, Filter, Target } from 'lucide-react';
import { Job } from '@/types';

export default function Jobs() {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: '',
    experience: '',
  });

  const { data, isLoading } = useQuery(['jobs', filters], () =>
    jobsAPI.getJobs(filters).then(res => res.data)
  );

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Find Your Dream Job</h1>
        <p className="text-gray-600 mt-1">Discover opportunities that match your skills</p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Job title or keyword"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <select
            value={filters.jobType}
            onChange={(e) => handleFilterChange('jobType', e.target.value)}
            className="input-field"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={filters.experience}
            onChange={(e) => handleFilterChange('experience', e.target.value)}
            className="input-field"
          >
            <option value="">Experience Level</option>
            <option value="0-2">0-2 years</option>
            <option value="2-5">2-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {data?.total || 0} jobs found
        </p>
        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
          <Filter size={16} />
          More Filters
        </button>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          data?.jobs?.map((job: Job) => (
            <Link
              key={job._id}
              to={`/jobs/${job._id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="text-primary-600" size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <p className="text-gray-600 mt-1">{job.company}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {job.jobType}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign size={16} />
                          {job.salary.min / 100000}L - {job.salary.max / 100000}L {job.salary.currency}
                        </div>
                        <span>{job.experience.min}-{job.experience.max} years</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.skills.slice(0, 5).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.skills.length > 5 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <Target size={16} />
                    92% Match
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(job.postedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
