import { LeadFormData } from './validations';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Email service interface
export class EmailService {
  private static instance: EmailService;
  private provider: 'smtp' | 'resend' | 'none';

  constructor() {
    // Determine which email provider to use
    if (process.env.RESEND_API_KEY) {
      this.provider = 'resend';
    } else if (process.env.SMTP_URL) {
      this.provider = 'smtp';
    } else {
      this.provider = 'none';
      console.warn('No email provider configured. Emails will be logged only.');
    }
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendWithResend(options);
        case 'smtp':
          return await this.sendWithSMTP(options);
        case 'none':
          console.log('Email would be sent:', options);
          return { success: true };
        default:
          return { success: false, error: 'No email provider configured' };
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  private async sendWithResend(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    // Note: In a real implementation, you would use the Resend SDK
    // For now, we'll simulate the API call
    console.log('Sending email via Resend:', options);
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'DANVERSE <noreply@danverse.ai>',
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (response.ok) {
      return { success: true };
    } else {
      const error = await response.text();
      return { success: false, error };
    }
  }

  private async sendWithSMTP(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    // Note: In a real implementation, you would use nodemailer or similar
    // For now, we'll simulate SMTP sending
    console.log('Sending email via SMTP:', options);
    return { success: true };
  }

  // Send lead confirmation email to user
  async sendLeadConfirmation(lead: LeadFormData, locale: string = 'en'): Promise<{ success: boolean; error?: string }> {
    const isArabic = locale === 'ar';
    
    const subject = isArabic 
      ? 'شكراً لتواصلك مع DANVERSE'
      : 'Thank you for contacting DANVERSE';

    const html = isArabic ? this.getArabicConfirmationHTML(lead) : this.getEnglishConfirmationHTML(lead);
    const text = isArabic ? this.getArabicConfirmationText(lead) : this.getEnglishConfirmationText(lead);

    return await this.sendEmail({
      to: lead.email,
      subject,
      html,
      text,
    });
  }

  // Send lead notification email to admin
  async sendLeadNotification(lead: LeadFormData): Promise<{ success: boolean; error?: string }> {
    const subject = `New Lead: ${lead.name || 'Unknown'} - ${lead.service || 'General Inquiry'}`;
    
    const html = `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${lead.name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${lead.company || 'Not provided'}</p>
      <p><strong>Service:</strong> ${lead.service || 'Not specified'}</p>
      <p><strong>Budget Range:</strong> ${lead.budget_range || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${lead.message || 'No message provided'}</p>
      <p><strong>Source:</strong> ${lead.source || 'Website'}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
    `;

    const text = `
New Lead Received

Name: ${lead.name || 'Not provided'}
Email: ${lead.email}
Phone: ${lead.phone || 'Not provided'}
Company: ${lead.company || 'Not provided'}
Service: ${lead.service || 'Not specified'}
Budget Range: ${lead.budget_range || 'Not specified'}
Message: ${lead.message || 'No message provided'}
Source: ${lead.source || 'Website'}
Submitted: ${new Date().toLocaleString()}
    `;

    return await this.sendEmail({
      to: 'danverseai@outlook.com',
      subject,
      html,
      text,
    });
  }

  private getEnglishConfirmationHTML(lead: LeadFormData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Thank you for contacting DANVERSE</h1>
        <p>Dear ${lead.name || 'Valued Client'},</p>
        <p>Thank you for reaching out to us. We have received your inquiry and our team will review it shortly.</p>
        
        <h3>Your submission details:</h3>
        <ul>
          <li><strong>Service of Interest:</strong> ${lead.service || 'General Inquiry'}</li>
          <li><strong>Budget Range:</strong> ${lead.budget_range || 'To be discussed'}</li>
        </ul>
        
        <p>We typically respond within 24 hours during business days. If you have any urgent questions, please feel free to contact us directly:</p>
        
        <ul>
          <li><strong>WhatsApp/Telegram:</strong> +20 1207346648</li>
          <li><strong>Email:</strong> danverseai@outlook.com</li>
          <li><strong>Instagram:</strong> @muhammedd_adel</li>
        </ul>
        
        <p>Best regards,<br>The DANVERSE Team</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          This is an automated confirmation email. Please do not reply to this email.
        </p>
      </div>
    `;
  }

  private getArabicConfirmationHTML(lead: LeadFormData): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl; text-align: right;">
        <h1 style="color: #6366f1;">شكراً لتواصلك مع DANVERSE</h1>
        <p>عزيزي ${lead.name || 'العميل الكريم'},</p>
        <p>شكراً لتواصلك معنا. لقد تلقينا استفسارك وسيقوم فريقنا بمراجعته قريباً.</p>
        
        <h3>تفاصيل طلبك:</h3>
        <ul>
          <li><strong>الخدمة المطلوبة:</strong> ${lead.service || 'استفسار عام'}</li>
          <li><strong>نطاق الميزانية:</strong> ${lead.budget_range || 'سيتم مناقشتها'}</li>
        </ul>
        
        <p>نحن عادة نرد خلال 24 ساعة في أيام العمل. إذا كان لديك أي أسئلة عاجلة، لا تتردد في التواصل معنا مباشرة:</p>
        
        <ul>
          <li><strong>واتساب/تليجرام:</strong> +20 1207346648</li>
          <li><strong>البريد الإلكتروني:</strong> danverseai@outlook.com</li>
          <li><strong>إنستجرام:</strong> @muhammedd_adel</li>
        </ul>
        
        <p>مع أطيب التحيات,<br>فريق DANVERSE</p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #666;">
          هذا بريد تأكيد تلقائي. يرجى عدم الرد على هذا البريد.
        </p>
      </div>
    `;
  }

  private getEnglishConfirmationText(lead: LeadFormData): string {
    return `
Thank you for contacting DANVERSE

Dear ${lead.name || 'Valued Client'},

Thank you for reaching out to us. We have received your inquiry and our team will review it shortly.

Your submission details:
- Service of Interest: ${lead.service || 'General Inquiry'}
- Budget Range: ${lead.budget_range || 'To be discussed'}

We typically respond within 24 hours during business days. If you have any urgent questions, please feel free to contact us directly:

- WhatsApp/Telegram: +20 1207346648
- Email: danverseai@outlook.com
- Instagram: @muhammedd_adel

Best regards,
The DANVERSE Team

This is an automated confirmation email. Please do not reply to this email.
    `;
  }

  private getArabicConfirmationText(lead: LeadFormData): string {
    return `
شكراً لتواصلك مع DANVERSE

عزيزي ${lead.name || 'العميل الكريم'},

شكراً لتواصلك معنا. لقد تلقينا استفسارك وسيقوم فريقنا بمراجعته قريباً.

تفاصيل طلبك:
- الخدمة المطلوبة: ${lead.service || 'استفسار عام'}
- نطاق الميزانية: ${lead.budget_range || 'سيتم مناقشتها'}

نحن عادة نرد خلال 24 ساعة في أيام العمل. إذا كان لديك أي أسئلة عاجلة، لا تتردد في التواصل معنا مباشرة:

- واتساب/تليجرام: +20 1207346648
- البريد الإلكتروني: danverseai@outlook.com
- إنستجرام: @muhammedd_adel

مع أطيب التحيات,
فريق DANVERSE

هذا بريد تأكيد تلقائي. يرجى عدم الرد على هذا البريد.
    `;
  }
}

