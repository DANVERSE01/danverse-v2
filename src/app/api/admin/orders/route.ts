import { NextRequest, NextResponse } from 'next/server';
import { dataAdapter } from '@/server/adapter';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest, generateCSV } from '@/lib/utils';

export const runtime = 'nodejs';

// Get all orders with pagination and filtering
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
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const format = searchParams.get('format'); // 'csv' for export

    // Get orders using adapter
    let orders;
    if (status && status !== 'all') {
      const { data, error } = await dataAdapter.findOrders({ status });
      if (error) throw error;
      orders = data;
    } else {
      const { data, error } = await dataAdapter.getAllOrders();
      if (error) throw error;
      orders = data;
    }

    // Return CSV format
    if (format === 'csv') {
      const csvHeaders = [
        'order_code',
        'service',
        'package_type',
        'name',
        'email',
        'phone',
        'total_amount',
        'currency',
        'status',
        'payment_method',
        'created_at',
      ];

      const csvData = generateCSV(orders || [], csvHeaders);
      
      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="orders-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      });
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      orders: orders || [],
      isPreviewMode: dataAdapter.isPreviewMode(),
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update order status
export async function PUT(request: NextRequest) {
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
    const body = await request.json();
    const { orderCode, status, paymentMethod, transactionReference, notes } = body;

    if (!orderCode || !status) {
      return NextResponse.json(
        { error: 'Order code and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update order using adapter
    const updateData: any = { status };

    if (status === 'confirmed') {
      if (paymentMethod) updateData.payment_method = paymentMethod;
      if (transactionReference) updateData.transaction_reference = transactionReference;
    }

    if (notes) {
      updateData.admin_notes = notes;
    }

    const { data: order, error } = await dataAdapter.updateOrder(orderCode, updateData);

    if (error || !order) {
      console.error('Order update error:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
      isPreviewMode: dataAdapter.isPreviewMode(),
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

