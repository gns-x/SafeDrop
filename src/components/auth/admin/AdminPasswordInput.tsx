import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface AdminPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AdminPasswordInput: React.FC<AdminPasswordInputProps> = ({
  value,
  onChange,
  disabled
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mt-6">
      <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
        Password
      </label>
      <div className="relative group">
        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5 transition-colors duration-200 group-focus-within:text-purple-400" />
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-12 pr-12 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-200/50 backdrop-blur-md"
          placeholder="Enter your password"
          required
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-purple-400 transition-colors duration-200"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
