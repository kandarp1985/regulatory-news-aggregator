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
      await fetch('/api/refresh', { method: 'POST' });
      window.dispatchEvent(new CustomEvent('news-refresh'));
      const count = (window as unknown as { __newsCount?: number }).__newsCount || 0;
      setMessage(`Feed refreshed — ${count} articles`);
    } catch {
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
        style={{
          padding: '0.4rem', borderRadius: 4,
          background: 'transparent', border: '1px solid #1a3a5c',
          color: '#5a8aad', cursor: refreshing || cooldown ? 'not-allowed' : 'pointer',
          transition: 'all 0.18s ease', display: 'flex', alignItems: 'center',
          opacity: refreshing || cooldown ? 0.5 : 1,
        }}
        aria-label="Refresh feeds"
        onMouseEnter={(e) => { if (!refreshing && !cooldown) { e.currentTarget.style.borderColor = '#00e5ff'; e.currentTarget.style.color = '#00e5ff'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3a5c'; e.currentTarget.style.color = '#5a8aad'; }}
      >
        {refreshing ? (
          <svg style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <button
        onClick={handleRefresh}
        disabled={refreshing || cooldown}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.45rem 1rem', borderRadius: 4,
          background: refreshing ? 'rgba(0, 229, 255, 0.05)' : 'rgba(0, 229, 255, 0.07)',
          border: `1px solid ${refreshing ? '#00e5ff60' : 'rgba(0, 229, 255, 0.35)'}`,
          color: '#00e5ff',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.82rem', fontWeight: 600,
          letterSpacing: '0.06em', cursor: refreshing || cooldown ? 'not-allowed' : 'pointer',
          transition: 'all 0.18s ease',
          boxShadow: refreshing ? '0 0 10px rgba(0, 229, 255, 0.2)' : 'none',
          opacity: refreshing || cooldown ? 0.7 : 1,
        }}
        onMouseEnter={(e) => { if (!refreshing && !cooldown) { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.12)'; e.currentTarget.style.boxShadow = '0 0 10px rgba(0, 229, 255, 0.2)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0, 229, 255, 0.07)'; e.currentTarget.style.boxShadow = 'none'; }}
      >
        {refreshing ? (
          <>
            <svg style={{ width: 15, height: 15, animation: 'spin 0.8s linear infinite' }} fill="none" viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Refreshing...
          </>
        ) : (
          <>
            <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh Feeds
          </>
        )}
      </button>

      {message && (
        <span style={{
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.78rem',
          color: message.includes('Failed') ? '#ff4d6d' : '#06d6a0',
          letterSpacing: '0.03em',
          textShadow: message.includes('Failed') ? '0 0 8px rgba(255, 77, 109, 0.3)' : '0 0 8px rgba(6, 214, 160, 0.3)',
        }}>
          {message}
        </span>
      )}
    </div>
  );
}