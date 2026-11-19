'use client';

import { useState, useMemo, useEffect } from 'react';
import { Moon, Sun, Maximize2, Minimize2 } from 'lucide-react';
import { linksData, featuredProjects } from './data/links';
import HeroSection from './components/HeroSection';
import SearchBar from './components/SearchBar';
import QuickNav from './components/QuickNav';
import CategoryAccordion from './components/CategoryAccordion';
import StatsFooter from './components/StatsFooter';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());

  // Handle hydration - set darkMode after mount
  useEffect(() => {
    setMounted(true);
    setDarkMode(true); // Default to dark mode after hydration
  }, []);

  // Calculate stats
  const totalLinks = useMemo(() => {
    return linksData.reduce((total, category) => {
      return total + category.subcategories.reduce((sum, sub) => sum + sub.links.length, 0);
    }, 0);
  }, []);

  const totalCategories = linksData.length;
  const totalSubcategories = useMemo(() => {
    return linksData.reduce((total, category) => total + category.subcategories.length, 0);
  }, []);

  // Calculate link counts for featured projects
  const featuredLinkCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    linksData.forEach(category => {
      category.subcategories.forEach(sub => {
        const sectionId = sub.subTitle.toLowerCase().replace(/\s+/g, '-');
        counts[sectionId] = sub.links.length;
      });
    });

    return counts;
  }, []);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return linksData;

    const query = searchQuery.toLowerCase();
    return linksData
      .map(category => ({
        ...category,
        subcategories: category.subcategories
          .map(sub => ({
            ...sub,
            links: sub.links.filter(
              link =>
                link.title.toLowerCase().includes(query) ||
                link.description.toLowerCase().includes(query) ||
                link.url.toLowerCase().includes(query)
            ),
          }))
          .filter(sub => sub.links.length > 0),
      }))
      .filter(category => category.subcategories.length > 0);
  }, [searchQuery]);

  // Auto-expand categories and subcategories when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      const categoriesToExpand = new Set(filteredData.map(cat => cat.mainCategory));
      setExpandedCategories(categoriesToExpand);

      const subCategoriesToExpand = new Set<string>();
      filteredData.forEach(cat => {
        cat.subcategories.forEach(sub => {
          subCategoriesToExpand.add(`${cat.mainCategory}-${sub.subTitle}`);
        });
      });
      setExpandedSubcategories(subCategoriesToExpand);
    }
  }, [searchQuery, filteredData]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  };

  const toggleSubcategory = (key: string) => {
    setExpandedSubcategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    const dataToExpand = searchQuery.trim() ? filteredData : linksData;
    setExpandedCategories(new Set(dataToExpand.map(c => c.mainCategory)));
    const allSubKeys: string[] = [];
    dataToExpand.forEach(cat => {
      cat.subcategories.forEach(sub => {
        allSubKeys.push(`${cat.mainCategory}-${sub.subTitle}`);
      });
    });
    setExpandedSubcategories(new Set(allSubKeys));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setExpandedSubcategories(new Set());
  };

  const scrollToSection = (sectionId: string) => {
    // First, find and expand the category containing this section
    let foundCategory = '';
    let foundSubcategory = '';

    linksData.forEach(cat => {
      cat.subcategories.forEach(sub => {
        if (sub.subTitle.toLowerCase().replace(/\s+/g, '-') === sectionId) {
          foundCategory = cat.mainCategory;
          foundSubcategory = sub.subTitle;
        }
      });
    });

    if (foundCategory) {
      // Expand the category and subcategory
      setExpandedCategories(prev => new Set(prev).add(foundCategory));
      setExpandedSubcategories(prev => new Set(prev).add(`${foundCategory}-${foundSubcategory}`));

      // Wait for DOM to update, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          // Fallback: scroll to the category
          const categoryId = foundCategory.toLowerCase().replace(/\s+/g, '-');
          const catElement = document.getElementById(categoryId);
          if (catElement) {
            catElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }
  };

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={mounted && darkMode ? 'dark-mode' : ''}>
      <div
        className="min-h-screen transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Hero Section - Featured Projects */}
          <HeroSection
            projects={featuredProjects}
            linkCounts={featuredLinkCounts}
            onProjectClick={scrollToSection}
          />

          {/* Quick Navigation */}
          <QuickNav categories={linksData} onCategoryClick={scrollToCategory} />

          {/* Search & Controls */}
          <div
            className="mb-8 space-y-4 sticky top-0 z-50 py-4"
            style={{ backgroundColor: 'var(--bg-color)' }}
          >
            <SearchBar value={searchQuery} onChange={setSearchQuery} />

            <div className="flex justify-center gap-3 flex-wrap">
              <button
                onClick={expandAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent-text)',
                }}
              >
                <Maximize2 size={16} />
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent-text)',
                }}
              >
                <Minimize2 size={16} />
                Collapse All
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent-text)',
                }}
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>

          {/* Directory - Categories */}
          <div className="space-y-6">
            {filteredData.map((category, idx) => (
              <CategoryAccordion
                key={category.mainCategory}
                category={category}
                index={idx}
                isExpanded={expandedCategories.has(category.mainCategory)}
                expandedSubcategories={expandedSubcategories}
                onToggleCategory={() => toggleCategory(category.mainCategory)}
                onToggleSubcategory={toggleSubcategory}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredData.length === 0 && (
            <div className="text-center py-12 opacity-75">
              <p className="text-xl">No links found matching &quot;{searchQuery}&quot;</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          )}

          {/* Footer */}
          <StatsFooter
            totalLinks={totalLinks}
            totalSubcategories={totalSubcategories}
            totalCategories={totalCategories}
          />
        </div>
      </div>
    </div>
  );
}
