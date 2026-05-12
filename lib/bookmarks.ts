const BOOKMARKS_KEY = 'reg-bookmarks';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addBookmark(id: string): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.includes(id)) {
    bookmarks.push(id);
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b !== id);
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().includes(id);
}

export function clearAllBookmarks(): void {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify([]));
}