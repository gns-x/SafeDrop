import React from 'react';
import { LoginFormData } from '../../types/auth';
import { RoleSelector } from './RoleSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { LoginHeader } from './LoginHeader';
import { AccessCodeInput } from './AccessCodeInput';

interface LoginCardProps {
  formData: LoginFormData;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onRoleChange: (role: 'PARENT' | 'TEACHER') => void;
  onAccessCodeChange: (code: string) => void;
  logoUrl?: string;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  formData,
  isLoading,
  onSubmit,
  onRoleChange,
  onAccessCodeChange,
  logoUrl,
}) => {
  return (
    <div className="w-full max-w-md relative">
      {/* Decorative Elements */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative bg-gradient-to-b from-blue-600/90 to-indigo-900/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="px-8 pt-12 pb-8">
          <LoginHeader logoUrl={logoUrl} />
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="px-8 pb-8">
          <RoleSelector
            selectedRole={formData.role}
            onRoleChange={onRoleChange}
            isLoading={isLoading}
          />

          <AccessCodeInput
            value={formData.accessCode}
            onChange={onAccessCodeChange}
            disabled={isLoading}
          />

          <button
            type="submit"
            className="mt-8 w-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white py-3.5 px-4 rounded-xl hover:from-blue-500 hover:to-indigo-600 focus:ring-4 focus:ring-blue-300/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg shadow-blue-500/30"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
