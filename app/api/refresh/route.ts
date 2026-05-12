import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    revalidatePath('/');
    revalidatePath('/api/news');

    return NextResponse.json({
      success: true,
      refreshedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error refreshing cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh' },
      { status: 500 }
    );
  }
}