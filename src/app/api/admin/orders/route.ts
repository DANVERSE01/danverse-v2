import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/auth';
import { rateLimitRequest, generateCSV } from '@/lib/utils';

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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const format = searchParams.get('format'); // 'csv' for export

    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' });

    // Apply filters
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_code.ilike.%${search}%`);
    }

    // Apply pagination for non-CSV requests
    if (format !== 'csv') {
      query = query
        .range(offset, offset + limit - 1)
        .order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Return CSV format
    if (format === 'csv') {
      const csvHeaders = [
        'order_code',
        'plan',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_company',
        'amount',
        'currency',
        'status',
        'payment_method',
        'transaction_reference',
        'created_at',
        'paid_at',
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
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
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
    const validStatuses = ['pending', 'paid', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current order for audit log
    const { data: currentOrder } = await supabase
      .from('orders')
      .select('status')
      .eq('order_code', orderCode)
      .single();

    // Update order
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
      if (paymentMethod) updateData.payment_method = paymentMethod;
      if (transactionReference) updateData.transaction_reference = transactionReference;
    }

    if (notes) {
      updateData.admin_notes = notes;
    }

    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('order_code', orderCode)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Log to audit trail
    await supabase
      .from('audit_log')
      .insert({
        action: 'order_status_updated',
        details: {
          order_code: orderCode,
          old_status: currentOrder?.status || 'unknown',
          new_status: status,
          payment_method: paymentMethod,
          transaction_reference: transactionReference,
          admin_user: authResult.user?.username,
        },
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

