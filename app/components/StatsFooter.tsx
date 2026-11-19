'use client';

interface StatsFooterProps {
  totalLinks: number;
  totalSubcategories: number;
  totalCategories: number;
}

export default function StatsFooter({
  totalLinks,
  totalSubcategories,
  totalCategories,
}: StatsFooterProps) {
  return (
    <footer className="text-center mt-16 pb-8">
      <div
        className="mb-6 p-6 rounded-xl"
        style={{ backgroundColor: 'var(--accent-bg)', color: 'var(--accent-text)' }}
      >
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div>
            <div className="text-3xl font-bold">{totalLinks}</div>
            <div className="text-sm opacity-75 mt-1">Total Links</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{totalSubcategories}</div>
            <div className="text-sm opacity-75 mt-1">Subcategories</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{totalCategories}</div>
            <div className="text-sm opacity-75 mt-1">Categories</div>
          </div>
        </div>
      </div>
      <p className="text-sm opacity-75">
        ZAO NEXUS &copy; {new Date().getFullYear()} | Built with love for the ZAO
        Community
      </p>
    </footer>
  );
}
