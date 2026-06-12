import { Article } from '@/types/article';
import NewsClient from '@/components/NewsClient';

async function fetchArticles(): Promise<Article[]> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 300 }, // cache for 5 minutes
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.articles ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const initialArticles = await fetchArticles();

  return <NewsClient initialArticles={initialArticles} />;
}