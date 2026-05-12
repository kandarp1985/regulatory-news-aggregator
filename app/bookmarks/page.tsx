'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/types/article';
import { getBookmarks, removeBookmark, clearAllBookmarks } from '@/lib/bookmarks';
import ArticleCard from '@/components/ArticleCard';

export default function BookmarksPage() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const loadBookmarks = async () => {
      const ids = getBookmarks();
      setBookmarkedIds(ids);

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        const bookmarkedArticles = data.articles.filter((article: Article) =>
          ids.includes(article.id)
        );
        setArticles(bookmarkedArticles);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const handleRemoveBookmark = (id: string) => {
    removeBookmark(id);
    setBookmarkedIds((prev) => prev.filter((bid) => bid !== id));
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleClearAll = () => {
    clearAllBookmarks();
    setBookmarkedIds([]);
    setArticles([]);
    setShowClearConfirm(false);
  };

  // Listen for bookmark changes from other pages
  useEffect(() => {
    const handleStorageChange = () => {
      const ids = getBookmarks();
      setBookmarkedIds(ids);
      if (ids.length === 0) {
        setArticles([]);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bookmark-changed', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bookmark-changed', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading bookmarks...</p>
      </div>
    );
  }

  if (bookmarkedIds.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl mb-4 block">🔖</span>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No bookmarks yet
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Save articles for later by clicking the bookmark icon.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ← Browse Articles
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Bookmarks ({bookmarkedIds.length})
        </h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Clear All Bookmarks
        </button>
      </div>

      {/* Clear confirmation modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Clear all bookmarks?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This will remove all {bookmarkedIds.length} bookmarks. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bookmark list with remove buttons */}
      <div className="space-y-2 mb-6">
        {articles.map((article) => (
          <div key={article.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex-1 min-w-0">
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 truncate block"
              >
                {article.title}
              </a>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {article.agency} • {new Date(article.publishedAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleRemoveBookmark(article.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Remove bookmark"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Full article cards */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Article Cards
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}