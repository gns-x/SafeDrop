import React from 'react';
import { Mail } from 'lucide-react';

interface AdminEmailInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AdminEmailInput: React.FC<AdminEmailInputProps> = ({
  value,
  onChange,
  disabled
}) => (
  <div className="mt-6">
    <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
      Email Address
    </label>
    <div className="relative group">
      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5 transition-colors duration-200 group-focus-within:text-purple-400" />
      <input
        id="email"
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 text-white placeholder-purple-200/50 backdrop-blur-md"
        placeholder="Enter your email"
        required
        disabled={disabled}
      />
    </div>
  </div>
);
