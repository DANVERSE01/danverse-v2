import { NextRequest, NextResponse } from 'next/server';
import { dataAdapter } from '@/server/adapter';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const isPreview = dataAdapter.isPreviewMode();
    
    return NextResponse.json({
      status: 'ok',
      mode: isPreview ? 'preview' : 'production',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      features: {
        secretlessPreview: isPreview,
        dataAdapter: true,
        jweBackup: isPreview,
        etherealEmail: isPreview,
        cookiePersistence: isPreview,
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

