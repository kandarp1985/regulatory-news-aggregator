'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import RefreshButton from './RefreshButton';

export default function Header() {
  const pathname = usePathname();
  const isBookmarks = pathname === '/bookmarks';

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900/95 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                🏥 Regulatory Affairs News
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                FDA • MHRA • Health Canada • CDC • NIH
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <RefreshButton />
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !isBookmarks
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              📰 News
            </Link>
            <Link
              href="/bookmarks"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isBookmarks
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              🔖 Bookmarks
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}