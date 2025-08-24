import React from 'react';
import { KeyRound } from 'lucide-react';

interface AccessCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const AccessCodeInput: React.FC<AccessCodeInputProps> = ({
  value,
  onChange,
  disabled
}) => (
  <div className="mt-6">
    <label htmlFor="accessCode" className="block text-sm font-medium text-white/80 mb-2">
      Access Code
    </label>
    <div className="relative group">
      <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 w-5 h-5 transition-colors duration-200 group-focus-within:text-blue-400" />
      <input
        id="accessCode"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-12 pr-4 py-3.5 bg-white/10 border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 text-white placeholder-blue-200/50 backdrop-blur-md"
        placeholder="Enter your access code"
        required
        disabled={disabled}
      />
    </div>
  </div>
);
