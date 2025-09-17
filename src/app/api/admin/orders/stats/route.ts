import { NextRequest, NextResponse } from 'next/server';
import { dataAdapter } from '@/server/adapter';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest } from '@/lib/utils';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
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
    // Get total orders count
    const { data: totalOrders } = await dataAdapter.getOrdersCount();

    // Get recent orders for activity feed
    const { data: recentOrders } = await dataAdapter.getRecentOrders(5);

    const recentActivity = recentOrders?.map(order => ({
      type: 'order',
      description: `New order ${order.order_code} from ${order.name}`,
      timestamp: new Date(order.created_at!).toLocaleString(),
      status: order.status,
      amount: order.total_amount,
    })) || [];

    return NextResponse.json({
      success: true,
      total: totalOrders || 0,
      pending: 0, // Simplified for preview mode
      confirmed: 0, // Simplified for preview mode
      revenue: 0, // Simplified for preview mode
      recent: recentActivity,
      isPreviewMode: dataAdapter.isPreviewMode(),
    });

  } catch (error) {
    console.error('Orders stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

