import { NextRequest, NextResponse } from 'next/server';
import { dataAdapter } from '@/server/adapter';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  // Admin authentication
  const authResult = requireAdminAuth(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  // Rate limiting
  const rateLimitResult = await rateLimitRequest(request);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  try {
    // Only available in preview mode
    if (!dataAdapter.isPreviewMode()) {
      return NextResponse.json(
        { error: 'Import is only available in preview mode' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { jweData } = body;

    if (!jweData) {
      return NextResponse.json(
        { error: 'JWE data is required' },
        { status: 400 }
      );
    }

    // Import data from JWE
    await (dataAdapter as any).importData(jweData);

    return NextResponse.json({
      success: true,
      message: 'Data imported successfully',
    });

  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to import data. Please check the backup file.' },
      { status: 500 }
    );
  }
}

