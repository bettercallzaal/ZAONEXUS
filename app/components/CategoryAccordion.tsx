'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { type MainCategory } from '../data/links';
import LinkItem from './LinkItem';

interface CategoryAccordionProps {
  category: MainCategory;
  index: number;
  isExpanded: boolean;
  expandedSubcategories: Set<string>;
  onToggleCategory: () => void;
  onToggleSubcategory: (key: string) => void;
}

export default function CategoryAccordion({
  category,
  index,
  isExpanded,
  expandedSubcategories,
  onToggleCategory,
  onToggleSubcategory,
}: CategoryAccordionProps) {
  return (
    <div
      id={category.mainCategory.toLowerCase().replace(/\s+/g, '-')}
      className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 fade-in scroll-mt-32"
      style={{
        backgroundColor: 'var(--accent-bg)',
        color: 'var(--accent-text)',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <button
        onClick={onToggleCategory}
        className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition-opacity"
      >
        <h2 className="text-2xl font-bold">{category.mainCategory}</h2>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          {category.subcategories.map((sub) => {
            const subKey = `${category.mainCategory}-${sub.subTitle}`;
            const isSubExpanded = expandedSubcategories.has(subKey);

            return (
              <div
                key={subKey}
                id={sub.subTitle.toLowerCase().replace(/\s+/g, '-')}
                className="border-t pt-4"
                style={{ borderColor: 'rgba(224, 221, 170, 0.2)' }}
              >
                <button
                  onClick={() => onToggleSubcategory(subKey)}
                  className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
                >
                  <h3 className="text-lg font-semibold">
                    {sub.subTitle} ({sub.links.length})
                  </h3>
                  {isSubExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {isSubExpanded && (
                  <ul className="space-y-1.5">
                    {sub.links.map((link, linkIdx) => (
                      <LinkItem key={linkIdx} link={link} />
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
