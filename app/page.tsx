'use client';

import { useState, useMemo } from 'react';
import { Search, ExternalLink, ChevronDown, ChevronUp, Moon, Sun, Maximize2, Minimize2, Copy, Check, Hash } from 'lucide-react';
import { linksData, type MainCategory, type Subcategory } from './data/links';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedSubcategories, setExpandedSubcategories] = useState<Set<string>>(new Set());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isSearchSticky, setIsSearchSticky] = useState(false);

  const totalLinks = useMemo(() => {
    return linksData.reduce((total, category) => {
      return total + category.subcategories.reduce((sum, sub) => sum + sub.links.length, 0);
    }, 0);
  }, []);

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
    setExpandedCategories(new Set(linksData.map(c => c.mainCategory)));
    const allSubKeys: string[] = [];
    linksData.forEach(cat => {
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

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={darkMode ? 'dark-mode' : ''}>
      <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)' }}>
        <div className="max-w-5xl mx-auto px-4 py-8">
          <header className="text-center mb-8 fade-in">
            <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--text-color)' }}>
              ZAO NEXUS
            </h1>
            <p className="text-lg opacity-90 mb-2">Your Central Hub for All ZAO Links</p>
            <p className="text-sm opacity-75">
              {totalLinks} links across {linksData.length} categories
            </p>
          </header>

          {/* Quick Navigation */}
          <div className="mb-8 fade-in">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Hash size={16} className="opacity-60" />
              <span className="text-sm font-semibold opacity-75">Quick Jump:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {linksData.map((cat) => (
                <button
                  key={cat.mainCategory}
                  onClick={() => scrollToCategory(cat.mainCategory.toLowerCase().replace(/\s+/g, '-'))}
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

          <div className="mb-8 space-y-4 sticky top-0 z-50 py-4" style={{ backgroundColor: 'var(--bg-color)' }}>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
              <input
                type="text"
                placeholder="Search links, descriptions, or URLs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-color)',
                  borderColor: 'var(--text-color)',
                }}
              />
            </div>

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

          <div className="space-y-6">
            {filteredData.map((category, idx) => (
              <div
                key={category.mainCategory}
                id={category.mainCategory.toLowerCase().replace(/\s+/g, '-')}
                className="rounded-xl shadow-lg overflow-hidden transition-all duration-300 fade-in scroll-mt-32"
                style={{
                  backgroundColor: 'var(--accent-bg)',
                  color: 'var(--accent-text)',
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <button
                  onClick={() => toggleCategory(category.mainCategory)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <h2 className="text-2xl font-bold">{category.mainCategory}</h2>
                  {expandedCategories.has(category.mainCategory) ? (
                    <ChevronUp size={24} />
                  ) : (
                    <ChevronDown size={24} />
                  )}
                </button>

                {expandedCategories.has(category.mainCategory) && (
                  <div className="px-6 pb-6 space-y-4">
                    {category.subcategories.map((sub) => {
                      const subKey = `${category.mainCategory}-${sub.subTitle}`;
                      return (
                        <div key={subKey} className="border-t pt-4" style={{ borderColor: 'rgba(224, 221, 170, 0.2)' }}>
                          <button
                            onClick={() => toggleSubcategory(subKey)}
                            className="w-full flex items-center justify-between mb-3 hover:opacity-80 transition-opacity"
                          >
                            <h3 className="text-lg font-semibold">
                              {sub.subTitle} ({sub.links.length})
                            </h3>
                            {expandedSubcategories.has(subKey) ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>

                          {expandedSubcategories.has(subKey) && (
                            <ul className="space-y-2">
                              {sub.links.map((link, linkIdx) => (
                                <li key={linkIdx} className="group">
                                  <div
                                    className="flex items-start gap-3 p-4 rounded-lg transition-all duration-200 hover:shadow-md border-2"
                                    style={{
                                      backgroundColor: 'var(--link-bg)',
                                      borderColor: 'transparent',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.borderColor = 'var(--accent-bg)';
                                      e.currentTarget.style.transform = 'translateX(4px)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.borderColor = 'transparent';
                                      e.currentTarget.style.transform = 'translateX(0)';
                                    }}
                                  >
                                    <ExternalLink size={18} className="mt-1 flex-shrink-0" style={{ color: 'var(--text-color)', opacity: 0.7 }} />
                                    <div className="flex-1 min-w-0">
                                      <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold group-hover:underline block"
                                        style={{ color: 'var(--text-color)' }}
                                      >
                                        {link.title}
                                      </a>
                                      {link.description && (
                                        <div className="text-sm mt-1.5" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                                          {link.description}
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      onClick={() => copyToClipboard(link.url)}
                                      className="flex-shrink-0 p-2 rounded-md transition-all duration-200 hover:scale-110"
                                      style={{
                                        backgroundColor: copiedUrl === link.url ? 'var(--accent-bg)' : 'transparent',
                                        color: copiedUrl === link.url ? 'var(--accent-text)' : 'var(--text-color)',
                                        opacity: copiedUrl === link.url ? 1 : 0.5,
                                      }}
                                      title="Copy link"
                                    >
                                      {copiedUrl === link.url ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 opacity-75">
              <p className="text-xl">No links found matching "{searchQuery}"</p>
              <p className="text-sm mt-2">Try a different search term</p>
            </div>
          )}

          <footer className="text-center mt-16 pb-8 opacity-75">
            <p className="text-sm">
              ZAO NEXUS © {new Date().getFullYear()} | Built with ❤️ for the ZAO Community
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
