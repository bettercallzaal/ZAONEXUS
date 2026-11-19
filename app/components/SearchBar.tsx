'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <Search
        className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60"
        size={20}
      />
      <input
        type="text"
        placeholder="Search links, descriptions, or URLs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 shadow-lg"
        style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-color)',
          borderColor: 'var(--text-color)',
        }}
      />
    </div>
  );
}
