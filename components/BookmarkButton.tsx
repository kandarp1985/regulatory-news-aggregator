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
      <button className="p-1.5 text-gray-400">
        <span className="text-lg">☆</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-lg transition-colors ${
        bookmarked
          ? 'text-yellow-500 hover:text-yellow-600'
          : 'text-gray-400 hover:text-gray-500'
      }`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      <span className="text-lg">{bookmarked ? '★' : '☆'}</span>
    </button>
  );
}