import React from "react";
import { Shield } from "lucide-react";

interface AdminLoginHeaderProps {
  logoUrl?: string;
}

export const AdminLoginHeader: React.FC<AdminLoginHeaderProps> = ({
  logoUrl,
}) => (
  <div className="relative flex flex-col items-center">
    <div className="relative">
      {logoUrl ? (
        <div className="relative">
          <div className="w-40 h-40 bg-white/10 backdrop-blur-lg rounded-full flex items-center justify-center p-3">
            <img
              src={logoUrl}
              alt="School Logo"
              className="w-32 h-32 object-contain"
            />
          </div>
          <div className="absolute -right-2 -top-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>
      ) : (
        <div className="w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
          <Shield className="w-16 h-16 text-white" />
        </div>
      )}
    </div>

    <h2 className="mt-10 text-4xl font-bold text-white tracking-tight">
      Admin Access
    </h2>
    <p className="mt-3 text-lg text-purple-100/80">
      Enter your admin credentials to continue
    </p>
  </div>
);
