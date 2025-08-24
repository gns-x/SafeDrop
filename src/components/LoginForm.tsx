import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, School, Users } from 'lucide-react';
import { LoginFormData } from '../types/auth';
import { authenticate } from '../services/auth.service';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    accessCode: '',
    role: 'PARENT'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authenticate(formData.accessCode, formData.role);

      if (response.success && response.user) {
        localStorage.setItem('userId', response.user.id);
        localStorage.setItem('userRole', response.user.role);
        localStorage.setItem('userName', response.user.name);
        navigate('/parentdashboard');
        toast.success('Login successful!');
      } else {
        toast.error(response.error || 'Invalid access code');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <School className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Please enter your access code to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I am a:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'PARENT' }))}
                className={`p-4 rounded-lg border ${
                  formData.role === 'PARENT'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 hover:border-indigo-600 hover:bg-indigo-50'
                } transition-all duration-200`}
                disabled={isLoading}
              >
                <Users className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Parent</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role: 'TEACHER' }))}
                className={`p-4 rounded-lg border ${
                  formData.role === 'TEACHER'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                    : 'border-gray-200 hover:border-indigo-600 hover:bg-indigo-50'
                } transition-all duration-200`}
                disabled={isLoading}
              >
                <School className="w-6 h-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Teacher</span>
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="accessCode"
                type="password"
                value={formData.accessCode}
                onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your access code"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
