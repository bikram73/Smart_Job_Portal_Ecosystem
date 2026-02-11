import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { jobsAPI, applicationsAPI } from '@/services/api';
import { MapPin, Briefcase, DollarSign, Calendar, ExternalLink, Bookmark, Send, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');

  const { data: job, isLoading } = useQuery(['job', id], () =>
    jobsAPI.getJobById(id!).then(res => res.data)
  );

  const saveMutation = useMutation(
    () => applicationsAPI.createApplication({
      jobId: id,
      status: 'Saved',
      notes,
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('applications');
        toast.success('Job saved successfully!', { duration: 3000 });
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to save job', { duration: 5000 });
      },
    }
  );

  const applyMutation = useMutation(
    () => applicationsAPI.createApplication({
      jobId: id,
      status: 'Applied',
      appliedDate: new Date().toISOString(),
      notes,
      matchScore: 92,
      skillGaps: [],
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('applications');
        toast.success('Application submitted successfully!', { duration: 3000 });
        setTimeout(() => {
          navigate(`/roadmap/${id}`);
        }, 1000);
      },
      onError: (error: any) => {
        console.error('Apply error:', error);
        toast.error(error.response?.data?.message || 'Failed to apply for job', { 
          duration: 5000,
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #FCA5A5',
          },
        });
      },
    }
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="card">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="text-primary-600" size={32} />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{job?.title}</h1>
            <p className="text-xl text-gray-600 mt-2">{job?.company}</p>
            
            <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                {job?.location}
              </div>
              <div className="flex items-center gap-2">
                <Briefcase size={18} />
                {job?.jobType}
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} />
                {job?.salary.min / 100000}L - {job?.salary.max / 100000}L {job?.salary.currency}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                {job?.experience.min}-{job?.experience.max} years
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => applyMutation.mutate()}
            disabled={applyMutation.isLoading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {applyMutation.isLoading ? 'Applying...' : 'Apply Now'}
          </button>
          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isLoading}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bookmark size={18} />
            {saveMutation.isLoading ? 'Saving...' : 'Save Job'}
          </button>
          {job?.sourceUrl && (
            <a
              href={job.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center gap-2"
            >
              <ExternalLink size={18} />
              View Original
            </a>
          )}
        </div>

        {/* Description */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job?.description}</p>
          </div>

          {/* Requirements */}
          {job?.requirements && job.requirements.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((req: string, idx: number) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job?.skills && job.skills.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Add any notes about this application..."
            />
          </div>
        </div>
      </div>

      {/* Match Score */}
      <div className="card bg-gradient-to-r from-green-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Your Match Score</h3>
            <p className="text-gray-600 mt-1">Based on your profile and skills</p>
          </div>
          <div className="text-4xl font-bold text-green-600">92%</div>
        </div>
        <Link
          to={`/roadmap/${id}`}
          className="mt-4 btn-primary inline-flex items-center gap-2"
        >
          View Learning Roadmap
        </Link>
      </div>
    </div>
  );
}
