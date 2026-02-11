import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { resumesAPI } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const createMutation = useMutation(
    (data: any) => resumesAPI.createResume(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('resumes');
        toast.success('Resume created!');
        navigate('/resumes');
      },
    }
  );

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create Resume</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Resume Title</label>
          <input {...register('title')} className="input-field" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input {...register('personalInfo.name')} className="input-field" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" {...register('personalInfo.email')} className="input-field" required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input {...register('personalInfo.phone')} className="input-field" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Summary</label>
          <textarea {...register('summary')} className="input-field" rows={4} />
        </div>

        <button type="submit" className="btn-primary flex items-center gap-2">
          <Save size={20} />
          Save Resume
        </button>
      </form>
    </div>
  );
}
