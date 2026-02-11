import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { roadmapAPI } from '@/services/api';
import { BookOpen, CheckCircle, Circle, Target } from 'lucide-react';

export default function Roadmap() {
  const { jobId } = useParams<{ jobId: string }>();

  const { data: roadmap, isLoading } = useQuery(['roadmap', jobId], () =>
    roadmapAPI.getRoadmap(jobId!).then(res => res.data)
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Roadmap</h1>
        <p className="text-gray-600 mt-1">Prepare for {roadmap?.role}</p>
      </div>

      {/* Skills to Learn */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Skills to Master</h2>
        <div className="space-y-3">
          {roadmap?.skills.map((skill: any, idx: number) => (
            <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
              <Circle className="text-gray-400" size={20} />
              <div className="flex-1">
                <h3 className="font-medium">{skill.name}</h3>
                <p className="text-sm text-gray-600">{skill.category} • {skill.priority} Priority</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Prep */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Interview Preparation</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Common Questions</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {roadmap?.interviewPrep.commonQuestions.map((q: string, idx: number) => (
                <li key={idx}>{q}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
