import { NextResponse } from 'next/server';
import { fetchAllFeeds } from '@/lib/parser';
import { NewsApiResponse } from '@/types/article';

export const revalidate = 3600;

export async function GET() {
  try {
    const { articles, sources } = await fetchAllFeeds();
    
    const response: NewsApiResponse = {
      articles,
      fetchedAt: new Date().toISOString(),
      sources,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news feeds', articles: [], fetchedAt: new Date().toISOString(), sources: [] },
      { status: 500 }
    );
  }
}