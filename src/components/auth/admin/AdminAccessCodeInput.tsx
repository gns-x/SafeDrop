import React from 'react';
import { Key } from 'lucide-react';

interface AdminAccessCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AdminAccessCodeInput: React.FC<AdminAccessCodeInputProps> = ({
  value,
  onChange,
  disabled
}) => (
  <div className="mt-6">
    <label htmlFor="adminAccessCode" className="block text-sm font-medium text-white/80 mb-2">
      Admin Access Code
    </label>
    <div className="relative group">
      <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5 transition-colors duration-200 group-focus-within:text-purple-400" />
      <input
        id="adminAccessCode"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-200/50 backdrop-blur-md"
        placeholder="Enter admin access code"
        required
        disabled={disabled}
      />
    </div>
  </div>
);
