import React from "react";
import { LoadingSpinner } from "../LoadingSpinner";
import { AdminLoginHeader } from "./AdminLoginHeader";
import { AdminEmailInput } from "./AdminEmailInput";
import { AdminPasswordInput } from "./AdminPasswordInput";

interface AdminLoginCardProps {
  formData: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  logoUrl?: string;
}

export const AdminLoginCard: React.FC<AdminLoginCardProps> = ({
  formData,
  isLoading,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  logoUrl,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto relative">
      {/* Decorative Elements */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative bg-gradient-to-b from-purple-900/90 to-indigo-950/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Decorative section */}
          <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm">
            <div className="w-full max-w-md space-y-8">
              <h1 className="text-5xl font-bold text-white text-center leading-tight">
                Admin Portal
              </h1>
              <p className="text-xl text-purple-100/80 text-center">
                Secure access to administrative controls and system management.
              </p>
              <div className="relative mt-12">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-2xl"></div>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=500&h=350"
                  alt="Admin Dashboard"
                  className="relative rounded-2xl w-full h-auto shadow-xl"
                />
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="p-8 lg:p-12">
            <AdminLoginHeader logoUrl={logoUrl} />

            <form onSubmit={onSubmit} className="mt-8 space-y-6">
              <AdminEmailInput
                value={formData.email}
                onChange={onEmailChange}
                disabled={isLoading}
              />

              <AdminPasswordInput
                value={formData.password}
                onChange={onPasswordChange}
                disabled={isLoading}
              />

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 focus:ring-4 focus:ring-purple-300/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg shadow-lg shadow-purple-500/30"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <LoadingSpinner />
                    Authenticating...
                  </span>
                ) : (
                  "Access Admin Panel"
                )}
              </button>

              <p className="text-center text-sm text-white/60">
                Not an administrator?{" "}
                <a
                  href="/"
                  className="text-purple-300 hover:text-purple-200 transition-colors"
                >
                  Return to main login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
