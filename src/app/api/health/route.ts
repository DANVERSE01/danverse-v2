import { NextRequest, NextResponse } from 'next/server';
import { isPreviewMode } from '@/server/adapter';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'ok',
      mode: isPreviewMode ? 'preview' : 'production',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      features: {
        secretlessPreview: isPreviewMode,
        dataAdapter: true,
        jweBackup: isPreviewMode,
        etherealEmail: isPreviewMode,
        cookiePersistence: isPreviewMode,
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        error: 'Health check failed',
        mode: 'unknown'
      },
      { status: 500 }
    );
  }
}

