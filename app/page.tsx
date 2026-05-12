'use client';

import { useState, useEffect, useCallback } from 'react';
import { Article, NewsApiResponse } from '@/types/article';
import ArticleCard from '@/components/ArticleCard';
import FilterBar from '@/components/FilterBar';
import RefreshButton from '@/components/RefreshButton';

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
      <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="space-y-2 mb-3">
        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-auto" />
    </div>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['US', 'UK', 'CA']);
  const [keyword, setKeyword] = useState('');

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/news');
      if (!res.ok) throw new Error('Failed to fetch');
      const data: NewsApiResponse = await res.json();
      setArticles(data.articles);
      setFetchedAt(data.fetchedAt);
      (window as unknown as { __newsCount?: number }).__newsCount = data.articles.length;
    } catch (err) {
      setError('Failed to load feeds. Please try refreshing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();

    const handleRefresh = () => fetchNews();
    window.addEventListener('news-refresh', handleRefresh);
    return () => window.removeEventListener('news-refresh', handleRefresh);
  }, [fetchNews]);

  const filteredArticles = articles.filter((article) => {
    // Country filter
    if (!selectedCountries.includes(article.country)) return false;

    // Keyword filter
    if (keyword) {
      const search = keyword.toLowerCase();
      const searchableText = `${article.title} ${article.summary} ${article.agency} ${article.tags.join(' ')}`.toLowerCase();
      if (!searchableText.includes(search)) return false;
    }

    return true;
  });

  const formatFetchedAt = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <FilterBar
        selectedCountries={selectedCountries}
        onCountryChange={setSelectedCountries}
        keyword={keyword}
        onKeywordChange={setKeyword}
      />

      {/* Error banner */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading ? (
            'Loading articles...'
          ) : (
            `Showing ${filteredArticles.length} of ${articles.length} articles`
          )}
        </p>
        {fetchedAt && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Last updated: {formatFetchedAt(fetchedAt)}
          </p>
        )}
      </div>

      {/* Article grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No articles match your current filters.</p>
          <button
            onClick={() => {
              setSelectedCountries(['US', 'UK', 'CA']);
              setKeyword('');
            }}
            className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}