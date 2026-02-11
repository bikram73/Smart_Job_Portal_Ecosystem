import { useQuery, useMutation, useQueryClient } from 'react-query';
import { applicationsAPI } from '@/services/api';
import { Application } from '@/types';
import { Calendar, MapPin, Briefcase, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';

const statusColors = {
  'Saved': 'bg-gray-100 text-gray-700',
  'Applied': 'bg-blue-100 text-blue-700',
  'In Review': 'bg-yellow-100 text-yellow-700',
  'Interview': 'bg-purple-100 text-purple-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Selected': 'bg-green-100 text-green-700',
};

export default function Applications() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: applications, isLoading } = useQuery('applications', () =>
    applicationsAPI.getApplications().then(res => res.data)
  );

  const deleteMutation = useMutation(
    (id: string) => applicationsAPI.deleteApplication(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('applications');
        toast.success('Application deleted');
      },
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      applicationsAPI.updateApplication(id, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('applications');
        toast.success('Status updated');
      },
    }
  );

  const filteredApplications = applications?.filter((app: Application) => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">Track and manage your job applications</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'Saved', 'Applied', 'In Review', 'Interview', 'Selected', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredApplications?.length === 0 ? (
        <div className="card text-center py-12">
          <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
          <p className="text-gray-600 mt-2">Start applying to jobs to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications?.map((application: Application) => (
            <div key={application._id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="text-primary-600" size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {application.jobId.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{application.jobId.company}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          {application.jobId.location}
                        </div>
                        {application.appliedDate && (
                          <div className="flex items-center gap-1">
                            <Calendar size={16} />
                            Applied {new Date(application.appliedDate).toLocaleDateString()}
                          </div>
                        )}
                        {application.matchScore && (
                          <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            {application.matchScore}% Match
                          </span>
                        )}
                      </div>

                      {application.notes && (
                        <p className="mt-3 text-sm text-gray-600 italic">
                          Note: {application.notes}
                        </p>
                      )}

                      {application.skillGaps.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Skills to improve:</p>
                          <div className="flex flex-wrap gap-2">
                            {application.skillGaps.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 ml-4">
                  <select
                    value={application.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: application._id,
                        status: e.target.value,
                      })
                    }
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusColors[application.status as keyof typeof statusColors]
                    }`}
                  >
                    <option value="Saved">Saved</option>
                    <option value="Applied">Applied</option>
                    <option value="In Review">In Review</option>
                    <option value="Interview">Interview</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Selected">Selected</option>
                  </select>

                  <button
                    onClick={() => deleteMutation.mutate(application._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete application"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Timeline */}
              {application.timeline.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Timeline</p>
                  <div className="space-y-2">
                    {application.timeline.map((event, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-600">
                          {event.status} - {new Date(event.date).toLocaleDateString()}
                        </span>
                        {event.note && <span className="text-gray-500">({event.note})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
