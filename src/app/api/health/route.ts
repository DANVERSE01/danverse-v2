import { NextResponse } from 'next/server';
import { isPreviewMode } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET() {
  const mode = isPreviewMode ? 'preview' : 'prod';
  return NextResponse.json({ status: 'ok', mode });
}


