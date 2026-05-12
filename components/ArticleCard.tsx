'use client';

import { useState } from 'react';
import { Article } from '@/types/article';
import BookmarkButton from './BookmarkButton';

interface ArticleCardProps {
  article: Article;
}

const countryLabels: Record<string, string> = {
  US: '🇺🇸 United States',
  UK: '🇬🇧 United Kingdom',
  CA: '🇨🇦 Canada',
};

const agencyBadgeColors: Record<string, string> = {
  FDA: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  CDC: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  NIH: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  MHRA: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  'UK Health Security Agency': 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  'Health Canada': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  PHAC: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const badgeColor = agencyBadgeColors[article.agency] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';

  return (
    <article
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-all duration-200 ${
        isHovered ? 'shadow-lg -translate-y-0.5' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top row: Agency badge + Country */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}>
          {article.agency}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {countryLabels[article.country]}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {article.title}
        </a>
      </h2>

      {/* Summary */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 leading-relaxed">
        {article.summary || 'No description available.'}
      </p>

      {/* Footer: Date + Bookmark */}
      <div className="flex items-center justify-between mt-auto">
        <time className="text-xs text-gray-500 dark:text-gray-400">
          {formatDate(article.publishedAt)}
        </time>
        <div className="flex items-center gap-2">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Read More →
          </a>
          <BookmarkButton articleId={article.id} />
        </div>
      </div>

      {/* Source */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
        {article.source}
      </p>
    </article>
  );
}