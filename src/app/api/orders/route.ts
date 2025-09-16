export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { supabase, isPreviewMode } from '@/lib/supabase';
import { rateLimitRequest } from '@/lib/utils';

// Order creation schema
const createOrderSchema = z.object({
  plan: z.enum(['starter', 'professional', 'enterprise']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  company: z.string().optional(),
  notes: z.string().optional(),
  method: z.enum(['instapay', 'vodafone', 'bank']).default('instapay'),
});

// Plan pricing configuration
const PLAN_PRICING = {
  starter: { amount: 2999, currency: 'EGP' },
  professional: { amount: 7999, currency: 'EGP' },
  enterprise: { amount: 19999, currency: 'EGP' },
} as const;

function buildPaymentTemplate(method: 'instapay'|'vodafone'|'bank', amount: number, code: string): string {
  const alias = process.env.INSTA_ALIAS || 'muhamedadel69@instapay';
  const vodafone = process.env.VODAFONE_CASH_NUMBER || '+20 106 941 5658';
  const bankName = process.env.BANK_NAME || 'CIB';
  const bankAccName = process.env.BANK_ACCOUNT_NAME || 'MOHAMED ADEL';
  const bankAccNum = process.env.BANK_ACCOUNT_NUMBER || '100065756317';

  if (method === 'instapay') {
    return `Send ${amount} EGP to **${alias}**. Note **${code}**. Then submit ref.`;
  }
  if (method === 'vodafone') {
    return `Send ${amount} EGP to **${vodafone}**. Message **${code}**.`;
  }
  return `Transfer ${amount} EGP → **Bank: ${bankName}**, **Account name: ${bankAccName}**, **Account no.: ${bankAccNum}**. Ref **${code}**.`;
}

// Generate unique order code
function generateOrderCode(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `DV-${timestamp}-${random}`.toUpperCase();
}

// Send order confirmation email
async function sendOrderConfirmationEmail(orderData: unknown) {
  // In production, integrate with email service (SendGrid, Resend, etc.)
  if (!isPreviewMode) return;
  console.log('Preview Mode: Order confirmation email would be sent.');
}

// Send admin notification
async function sendAdminNotification(orderData: unknown) {
  // In production, send notification to admin
  if (!isPreviewMode) return;
  console.log('Preview Mode: Admin notification for new order');
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitRequest(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Get plan pricing
    const planPricing = PLAN_PRICING[validatedData.plan];
    if (!planPricing) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    // Generate order code
    const orderCode = generateOrderCode();

    const paymentInstructions = buildPaymentTemplate(validatedData.method, planPricing.amount, orderCode);
    const whatsappText = encodeURIComponent(`Order ${orderCode} – I sent ${planPricing.amount} via ${validatedData.method}.`);

    // Create order in database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        plan: validatedData.plan,
        customer_name: validatedData.name,
        customer_email: validatedData.email,
        customer_phone: validatedData.phone,
        customer_company: validatedData.company || null,
        notes: validatedData.notes || null,
        amount: planPricing.amount,
        currency: planPricing.currency,
        status: 'awaiting_proof',
        payment_method: validatedData.method,
        payment_instructions: paymentInstructions,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Send notifications (async, don't wait)
    sendOrderConfirmationEmail(order).catch(console.error);
    sendAdminNotification(order).catch(console.error);

    // Log to audit trail
    await supabase
      .from('audit_log')
      .insert({
        action: 'order_created',
        details: {
          order_code: orderCode,
          plan: validatedData.plan,
          amount: planPricing.amount,
          customer_email: validatedData.email,
        },
        ip_address: request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });

    return NextResponse.json({
      success: true,
      orderCode,
      order: {
        id: order.id,
        orderCode: order.order_code,
        plan: order.plan,
        amount: order.amount,
        currency: order.currency,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentInstructions,
        whatsappDeeplink: `https://wa.me/?text=${whatsappText}`,
      },
    });

  } catch (error) {
    console.error('Order creation error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: (error as unknown as { errors: Array<{ path: (string|number)[]; message: string }> }).errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update order status (for admin use)
export async function PUT(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimitRequest(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { orderCode, status, paymentMethod, transactionReference } = body;

    if (!orderCode || !status) {
      return NextResponse.json(
        { error: 'Order code and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['awaiting_proof', 'pending', 'paid', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Update order
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === 'paid') {
      updateData.paid_at = new Date().toISOString();
      if (paymentMethod) updateData.payment_method = paymentMethod;
      if (transactionReference) updateData.transaction_reference = transactionReference;
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
        action: 'order_updated',
        details: {
          order_code: orderCode,
          old_status: 'pending', // In production, fetch old status
          new_status: status,
          payment_method: paymentMethod,
          transaction_reference: transactionReference,
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

