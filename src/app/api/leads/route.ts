import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { leadFormSchema } from '@/lib/validations';
import { rateLimit, getClientIP, sanitizeInput } from '@/lib/utils';
import { EmailService } from '@/lib/email';
import { headers } from 'next/headers';

// POST /api/leads - Submit a new lead
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Apply rate limiting (5 requests per 15 minutes per IP)
    const rateLimitResult = rateLimit(clientIP, 5, 15 * 60 * 1000);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please try again later.',
          resetTime: rateLimitResult.resetTime 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    
    // Honeypot check - if honeypot field is filled, it's likely spam
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.log('Honeypot triggered for IP:', clientIP);
      // Return success to not reveal the honeypot
      return NextResponse.json({ success: true, message: 'Thank you for your submission.' });
    }

    // Validate input data
    const validationResult = leadFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid input data',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const leadData = validationResult.data;

    // Sanitize input data
    const sanitizedLead = {
      name: leadData.name ? sanitizeInput(leadData.name) : null,
      email: sanitizeInput(leadData.email),
      phone: leadData.phone ? sanitizeInput(leadData.phone) : null,
      company: leadData.company ? sanitizeInput(leadData.company) : null,
      budget_range: leadData.budget_range || null,
      service: leadData.service || null,
      message: leadData.message ? sanitizeInput(leadData.message) : null,
      source: leadData.source || 'website',
      status: 'new' as const,
    };

    // Insert lead into database
    const { data: insertedLead, error: insertError } = await supabase
      .from('leads')
      .insert([sanitizedLead])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to save lead. Please try again.' },
        { status: 500 }
      );
    }

    // Log the action in audit log
    await supabase
      .from('audit_log')
      .insert([{
        actor: clientIP,
        action: 'lead_created',
        target: `lead:${insertedLead.id}`,
        meta: {
          email: sanitizedLead.email,
          service: sanitizedLead.service,
          source: sanitizedLead.source,
          user_agent: request.headers.get('user-agent'),
        }
      }]);

    // Send emails asynchronously (don't wait for completion)
    const emailService = EmailService.getInstance();
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || 'en';
    const locale = acceptLanguage.includes('ar') ? 'ar' : 'en';

    // Send confirmation email to user
    emailService.sendLeadConfirmation(leadData, locale).catch(error => {
      console.error('Failed to send confirmation email:', error);
    });

    // Send notification email to admin
    emailService.sendLeadNotification(leadData).catch(error => {
      console.error('Failed to send admin notification:', error);
    });

    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your submission. We will contact you soon.',
        leadId: insertedLead.id,
        source: sanitizedLead.source
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
        }
      }
    );

  } catch (error) {
    console.error('Lead submission error:', error);
    
    // Log error in audit log
    const clientIP = getClientIP(request);
    await supabase
      .from('audit_log')
      .insert([{
        actor: clientIP,
        action: 'lead_submission_error',
        target: 'api:leads',
        meta: {
          error: error instanceof Error ? error.message : 'Unknown error',
          user_agent: request.headers.get('user-agent'),
        }
      }]);

    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}

// GET /api/leads - Reject with 401 (unauthorized)
export async function GET(request: NextRequest) {
  const clientIP = getClientIP(request);
  
  // Log unauthorized access attempt
  await supabase
    .from('audit_log')
    .insert([{
      actor: clientIP,
      action: 'unauthorized_access_attempt',
      target: 'api:leads',
      meta: {
        method: 'GET',
        user_agent: request.headers.get('user-agent'),
      }
    }]);

  return NextResponse.json(
    { error: 'Unauthorized access' },
    { status: 401 }
  );
}

// All other methods are not allowed
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

