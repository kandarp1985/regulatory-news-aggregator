'use client';

import { useEffect, useState } from 'react';
import { isBookmarked, addBookmark, removeBookmark } from '@/lib/bookmarks';

interface BookmarkButtonProps {
  articleId: string;
}

export default function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setBookmarked(isBookmarked(articleId));
  }, [articleId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(articleId);
      setBookmarked(false);
    } else {
      addBookmark(articleId);
      setBookmarked(true);
    }
  };

  if (!mounted) {
    return (
      <button style={{ padding: '0.2rem', background: 'transparent', border: 'none', cursor: 'default' }}>
        <svg style={{ width: 18, height: 18, color: '#2d5275' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      style={{
        padding: '0.2rem', background: 'transparent', border: 'none',
        cursor: 'pointer', transition: 'all 0.18s ease',
        display: 'flex', alignItems: 'center',
      }}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.15)';
        const svg = e.currentTarget.querySelector('svg');
        if (svg) svg.style.color = bookmarked ? '#ff4d6d' : '#00e5ff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        const svg = e.currentTarget.querySelector('svg');
        if (svg) svg.style.color = bookmarked ? '#f59e0b' : '#5a8aad';
      }}
    >
      <svg
        style={{
          width: 18, height: 18,
          color: bookmarked ? '#f59e0b' : '#5a8aad',
          filter: bookmarked ? 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))' : 'none',
          transition: 'all 0.18s ease',
        }}
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {bookmarked
          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        }
      </svg>
    </button>
  );
}