import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { profileAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { User, Briefcase, MapPin, DollarSign, Plus, X } from 'lucide-react';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState(user?.skills || []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone,
      location: user?.location,
      experience: user?.experience,
      expectedSalary: user?.expectedSalary,
    },
  });

  const updateMutation = useMutation(
    (data: any) => profileAPI.updateProfile(data),
    {
      onSuccess: (response) => {
        updateUser(response.data);
        queryClient.invalidateQueries('profile');
        toast.success('Profile updated successfully');
      },
      onError: () => {
        toast.error('Failed to update profile');
      },
    }
  );

  const onSubmit = (data: any) => {
    updateMutation.mutate({
      ...data,
      skills,
      profileComplete: true,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <User className="text-primary-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="input-field"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="input-field"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="input-field"
                placeholder="+91 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                {...register('location')}
                className="input-field"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Briefcase className="text-primary-600" size={20} />
            </div>
            <h2 className="text-xl font-semibold">Professional Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                {...register('experience', { min: 0 })}
                className="input-field"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Salary (Annual)
              </label>
              <input
                type="number"
                {...register('expectedSalary')}
                className="input-field"
                placeholder="1000000"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="input-field"
                placeholder="Add a skill"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-2 bg-primary-50 text-primary-700 rounded-lg flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-primary-900"
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button type="button" className="btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isLoading}
            className="btn-primary disabled:opacity-50"
          >
            {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
