import { NextRequest, NextResponse } from 'next/server';
import { dataAdapter } from '@/server/adapter';
import { orderFormSchema } from '@/lib/validations';
import { rateLimit, getClientIP, sanitizeInput } from '@/lib/utils';
import { EmailService } from '@/lib/email';

export const runtime = 'nodejs';

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Apply rate limiting (3 orders per hour per IP)
    const rateLimitResult = rateLimit(clientIP, 3, 60 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many orders. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Validate input data
    const validationResult = orderFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid order data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const orderData = validationResult.data;

    // Sanitize input data
    const sanitizedOrder = {
      name: sanitizeInput(orderData.name),
      email: sanitizeInput(orderData.email),
      phone: sanitizeInput(orderData.phone),
      service: sanitizeInput(orderData.service),
      package_type: sanitizeInput(orderData.package_type),
      total_amount: orderData.total_amount,
      currency: orderData.currency || 'EGP',
      payment_method: sanitizeInput(orderData.payment_method),
      status: 'pending' as const,
    };

    // Create order using adapter
    const { data: createdOrder, error: createError } = await dataAdapter.createOrder(sanitizedOrder);

    if (createError || !createdOrder) {
      console.error('Order creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create order. Please try again.' },
        { status: 500 }
      );
    }

    // Send order confirmation email
    const emailService = EmailService.getInstance();
    emailService.sendOrderConfirmation(createdOrder).catch(error => {
      console.error('Failed to send order confirmation email:', error);
    });

    // Send admin notification
    emailService.sendOrderNotification(createdOrder).catch(error => {
      console.error('Failed to send admin order notification:', error);
    });

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Order created successfully',
        order: createdOrder,
        isPreviewMode: dataAdapter.isPreviewMode()
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': '3',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Order creation error:', error);

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update order status (for payment confirmation)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderCode, status, paymentProof } = body;

    if (!orderCode || !status) {
      return NextResponse.json(
        { error: 'Order code and status are required' },
        { status: 400 }
      );
    }

    // Update order using adapter
    const updateData: any = { status };
    if (paymentProof) {
      updateData.payment_proof = paymentProof;
    }

    const { data: updatedOrder, error: updateError } = await dataAdapter.updateOrder(orderCode, updateData);

    if (updateError || !updatedOrder) {
      console.error('Order update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Send status update email if order is confirmed
    if (status === 'confirmed') {
      const emailService = EmailService.getInstance();
      emailService.sendPaymentConfirmation(updatedOrder).catch(error => {
        console.error('Failed to send payment confirmation email:', error);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
      isPreviewMode: dataAdapter.isPreviewMode()
    });

  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/orders - Reject with 401 (unauthorized)
export async function GET() {
  return NextResponse.json(
    { error: 'Unauthorized access' },
    { status: 401 }
  );
}

// All other methods are not allowed
export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

