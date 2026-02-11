import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Briefcase, AlertCircle } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await authAPI.login(data);
      setAuth(response.data.user, response.data.token);
      toast.success('Welcome back!', { duration: 3000 });
      navigate('/');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
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
          <h1 className="text-3xl font-bold text-gray-900">Smart Job Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to find your dream job</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={24} />
              <div className="flex-1">
                <p className="text-red-900 font-bold text-base">Login Failed</p>
                <p className="text-red-800 text-sm mt-1 font-medium">{errorMessage}</p>
                {errorMessage.includes('does not exist') && (
                  <Link 
                    to="/register" 
                    className="text-red-700 hover:text-red-800 text-sm font-bold underline mt-3 inline-block bg-red-100 px-3 py-1 rounded"
                  >
                    Create an account instead →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                {...register('password', { required: 'Password is required' })}
                className="input-field"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
