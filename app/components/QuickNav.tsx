'use client';

import { Hash } from 'lucide-react';
import { type MainCategory } from '../data/links';

interface QuickNavProps {
  categories: MainCategory[];
  onCategoryClick: (categoryId: string) => void;
}

export default function QuickNav({ categories, onCategoryClick }: QuickNavProps) {
  return (
    <div className="mb-6 fade-in">
      <div className="flex items-center gap-2 mb-3 justify-center">
        <Hash size={16} className="opacity-60" />
        <span className="text-sm font-semibold opacity-75">Quick Jump:</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.mainCategory}
            onClick={() =>
              onCategoryClick(cat.mainCategory.toLowerCase().replace(/\s+/g, '-'))
            }
            className="px-3 py-1.5 text-sm rounded-md transition-all duration-200 hover:scale-105"
            style={{
              backgroundColor: 'var(--accent-bg)',
              color: 'var(--accent-text)',
              opacity: 0.8,
            }}
          >
            {cat.mainCategory}
          </button>
        ))}
      </div>
    </div>
  );
}
