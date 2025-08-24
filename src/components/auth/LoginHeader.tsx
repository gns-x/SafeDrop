import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginHeaderProps {
  logoUrl?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ logoUrl }) => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center">
      <div
        onClick={() => navigate("/admin/login")}
        className="group relative cursor-pointer transform transition-transform duration-300 hover:scale-105"
      >
        {logoUrl ? (
          <div className="relative">
            <div className="w-40 h-40 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center p-3 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/20">
              <img
                src={logoUrl}
                alt="School Logo"
                className="w-32 h-32 object-contain transition-all duration-300 group-hover:brightness-110"
              />
            </div>
            <div className="absolute -right-2 -top-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
              <span className="text-white text-sm font-bold">EL</span>
            </div>
          </div>
        ) : (
          <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/20">
            <span className="text-5xl font-bold text-white">EL</span>
          </div>
        )}
      </div>

      <h2 className="mt-10 text-4xl font-bold text-white tracking-tight">
        Welcome Back
      </h2>
      <p className="mt-3 text-lg text-blue-100/80">
        Please sign in to continue
      </p>
    </div>
  );
};
