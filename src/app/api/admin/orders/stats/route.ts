import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest } from '@/lib/utils';

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
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Get pending orders count
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Get paid orders count
    const { count: paidOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'paid');

    // Get total revenue (sum of paid orders)
    const { data: revenueData } = await supabase
      .from('orders')
      .select('amount')
      .eq('status', 'paid');

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.amount || 0), 0) || 0;

    // Get recent orders for activity feed
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('order_code, customer_name, status, amount, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const recentActivity = recentOrders?.map(order => ({
      type: 'order',
      description: `New order ${order.order_code} from ${order.customer_name}`,
      timestamp: new Date(order.created_at).toLocaleString(),
      status: order.status,
      amount: order.amount,
    })) || [];

    return NextResponse.json({
      success: true,
      total: totalOrders || 0,
      pending: pendingOrders || 0,
      paid: paidOrders || 0,
      revenue: totalRevenue,
      recent: recentActivity,
    });

  } catch (error) {
    console.error('Orders stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


export const runtime = 'nodejs';

