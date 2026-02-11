import { useQuery, useMutation, useQueryClient } from 'react-query';
import { resumesAPI } from '@/services/api';
import { Link } from 'react-router-dom';
import { FileText, Plus, Download, Edit, Trash2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Resumes() {
  const queryClient = useQueryClient();

  const { data: resumes, isLoading } = useQuery('resumes', () =>
    resumesAPI.getResumes().then(res => res.data)
  );

  const deleteMutation = useMutation(
    (id: string) => resumesAPI.deleteResume(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('resumes');
        toast.success('Resume deleted');
      },
    }
  );

  const handleDownload = async (id: string, title: string) => {
    try {
      const response = await resumesAPI.generatePDF(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Resume downloaded');
    } catch (error) {
      toast.error('Failed to download resume');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">Create and manage your ATS-optimized resumes</p>
        </div>
        <Link to="/resumes/new" className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Resume
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : resumes?.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900">No resumes yet</h3>
          <p className="text-gray-600 mt-2 mb-4">Create your first ATS-optimized resume</p>
          <Link to="/resumes/new" className="btn-primary inline-flex items-center gap-2">
            <Plus size={20} />
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes?.map((resume: any) => (
            <div key={resume._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="text-primary-600" size={24} />
                </div>
                {resume.atsScore && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <Star size={14} />
                    {resume.atsScore}%
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{resume.title}</h3>
              
              {resume.targetRole && (
                <p className="text-sm text-gray-600 mb-3">Target: {resume.targetRole}</p>
              )}

              <div className="text-sm text-gray-500 mb-4">
                Updated {new Date(resume.updatedAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/resumes/${resume._id}/edit`}
                  className="flex-1 btn-secondary text-center flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                  Edit
                </Link>
                <button
                  onClick={() => handleDownload(resume._id, resume.title)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Download PDF"
                >
                  <Download size={20} />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(resume._id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
