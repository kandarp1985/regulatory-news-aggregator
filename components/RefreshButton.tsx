'use client';

import { useState } from 'react';

interface RefreshButtonProps {
  compact?: boolean;
}

export default function RefreshButton({ compact = false }: RefreshButtonProps) {
  const [refreshing, setRefreshing] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    if (refreshing || cooldown) return;

    setRefreshing(true);
    setMessage(null);

    try {
      // Trigger cache refresh
      await fetch('/api/refresh', { method: 'POST' });

      // Dispatch custom event to notify pages to re-fetch
      window.dispatchEvent(new CustomEvent('news-refresh'));

      const count = (window as unknown as { __newsCount?: number }).__newsCount || 0;
      setMessage(`Feed refreshed — ${count} articles`);
    } catch (error) {
      setMessage('Failed to refresh. Please try again.');
    } finally {
      setRefreshing(false);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 30000);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleRefresh}
        disabled={refreshing || cooldown}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Refresh feeds"
      >
        {refreshing ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <span className="text-lg">🔄</span>
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleRefresh}
        disabled={refreshing || cooldown}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
      >
        {refreshing ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Refreshing...
          </>
        ) : (
          <>
            🔄 Refresh Feeds
          </>
        )}
      </button>
      {message && (
        <span className="text-sm text-green-600 dark:text-green-400">{message}</span>
      )}
    </div>
  );
}