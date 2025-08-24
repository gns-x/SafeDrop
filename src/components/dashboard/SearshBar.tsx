import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-xl mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-primary" />
      </div>
      <input
        type="text"
        placeholder="Search students..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-neutral-900/50 border border-neutral-800 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all
                 placeholder:text-muted-foreground text-primary"
      />
    </div>
  );
}
