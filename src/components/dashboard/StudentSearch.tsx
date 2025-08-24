import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import debounce from 'lodash/debounce';

interface StudentSearchProps {
  onSearch: (query: string) => void;
  isLargeAccount: boolean;
}

export function StudentSearch({ onSearch, isLargeAccount }: StudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchTerm(query);
    debouncedSearch(query);
  };

  if (!isLargeAccount) return null;

  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Search students by name or ID..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      {searchTerm.length === 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Please search for a student to view their details
        </p>
      )}
    </div>
  );
}
