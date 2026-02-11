import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      setErrorMessage('Passwords do not match');
      toast.error('Passwords do not match', { 
        duration: 5000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(response.data.user, response.data.token);
      toast.success('Account created successfully!', { duration: 3000 });
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrorMessage(message);
      toast.error(message, { 
        duration: 5000,
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #FCA5A5',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Briefcase className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Join Smart Job Portal</h1>
          <p className="text-gray-600 mt-2">Start your career journey today</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
              <div className="flex-1">
                <p className="text-red-900 font-bold text-base">Registration Failed</p>
                <p className="text-red-800 text-sm mt-1 font-medium">{errorMessage}</p>
                {errorMessage.includes('already exists') && (
                  <Link 
                    to="/login" 
                    className="text-red-700 hover:text-red-800 text-sm font-bold underline mt-3 inline-block bg-red-100 px-3 py-1 rounded"
                  >
                    Sign in instead →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('name', { 
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' }
                })}
                className="input-field"
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="input-field"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { 
                    value: 12, 
                    message: 'Password must be at least 12 characters' 
                  },
                  validate: {
                    hasUpperCase: (value) => 
                      /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                    hasSpecialChar: (value) => 
                      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) || 
                      'Password must contain at least one special character (!@#$%^&* etc.)',
                  }
                })}
                className="input-field"
                placeholder="Min 12 chars, 1 uppercase, 1 special"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    watch('password')?.length >= 12 ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={watch('password')?.length >= 12 ? 'text-green-600' : 'text-gray-500'}>
                    At least 12 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    /[A-Z]/.test(watch('password') || '') ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={/[A-Z]/.test(watch('password') || '') ? 'text-green-600' : 'text-gray-500'}>
                    One uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${
                    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watch('password') || '') ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(watch('password') || '') ? 'text-green-600' : 'text-gray-500'}>
                    One special character (!@#$%^&* etc.)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                {...register('confirmPassword', { 
                  required: 'Please confirm password',
                  validate: value => value === password || 'Passwords do not match'
                })}
                className="input-field"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
              {!errors.confirmPassword && watch('confirmPassword') && watch('confirmPassword') === password && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle size={14} />
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
