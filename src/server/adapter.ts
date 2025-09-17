import { z } from 'zod';
import nodemailer from 'nodemailer';
import { EncryptJWT, jwtDecrypt } from 'jose';
import { cookies } from 'next/headers';

// Environment validation
const envSchema = z.object({
  SMTP_URL: z.string().optional(),
  RATE_LIMIT_SECRET: z.string().min(32),
});

const env = envSchema.parse(process.env);

// Check if we have production secrets
const hasProductionSecrets = !!(env.SMTP_URL);

// Data types
export interface Lead {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  created_at?: string;
}

export interface Order {
  id?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  timeline: string;
  description?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

// Data adapter interface
export interface DataAdapter {
  createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<{ data: Lead | null; error: any }>;
  getLeadsCount(): Promise<{ data: number; error: any }>;
  getRecentLeads(limit?: number): Promise<{ data: Lead[]; error: any }>;
  createOrder(data: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Order | null; error: any }>;
  updateOrder(id: string, data: Partial<Order>): Promise<{ data: Order | null; error: any }>;
  getOrdersCount(): Promise<{ data: number; error: any }>;
  getRecentOrders(limit?: number): Promise<{ data: Order[]; error: any }>;
  getAllOrders(): Promise<{ data: Order[]; error: any }>;
  sendEmail(options: { to: string; subject: string; text?: string; html?: string }): Promise<{ messageId: string; previewUrl?: string }>;
  exportData(): Promise<string>;
  importData(jweData: string): Promise<void>;
  isPreviewMode(): boolean;
}

// Encryption utilities
const secret = new TextEncoder().encode(env.RATE_LIMIT_SECRET);

async function encryptData(data: any): Promise<string> {
  const jwt = await new EncryptJWT({ data })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .encrypt(secret);
  
  return jwt;
}

async function decryptData(jwe: string): Promise<any> {
  const { payload } = await jwtDecrypt(jwe, secret);
  return payload.data;
}

// In-memory storage for preview mode
const previewData = {
  leads: new Map<string, Lead>(),
  orders: new Map<string, Order>(),
};

// Preview adapter
class PreviewAdapter implements DataAdapter {
  private testAccount: any = null;

  constructor() {
    this.loadFromCookies();
  }

  private async loadFromCookies() {
    try {
      const cookieStore = await cookies();
      const leadsData = cookieStore.get('preview_leads')?.value;
      const ordersData = cookieStore.get('preview_orders')?.value;

      if (leadsData) {
        const leads = await decryptData(leadsData);
        Object.entries(leads).forEach(([id, lead]) => {
          previewData.leads.set(id, lead as Lead);
        });
      }

      if (ordersData) {
        const orders = await decryptData(ordersData);
        Object.entries(orders).forEach(([id, order]) => {
          previewData.orders.set(id, order as Order);
        });
      }
    } catch (error) {
      console.log('No existing preview data found');
    }
  }

  private async saveToCookies() {
    try {
      const cookieStore = await cookies();
      
      const leadsObj = Object.fromEntries(previewData.leads);
      const ordersObj = Object.fromEntries(previewData.orders);

      const encryptedLeads = await encryptData(leadsObj);
      const encryptedOrders = await encryptData(ordersObj);

      cookieStore.set('preview_leads', encryptedLeads, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      cookieStore.set('preview_orders', encryptedOrders, {
        maxAge: 30 * 24 * 60 * 60, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    } catch (error) {
      console.error('Failed to save to cookies:', error);
    }
  }

  async createLead(data: Omit<Lead, 'id' | 'created_at'>) {
    const lead: Lead = {
      ...data,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
    };

    previewData.leads.set(lead.id!, lead);
    await this.saveToCookies();

    return { data: lead, error: null };
  }

  async getLeadsCount() {
    return { data: previewData.leads.size, error: null };
  }

  async getRecentLeads(limit: number = 10) {
    const leads = Array.from(previewData.leads.values())
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, limit);
    
    return { data: leads, error: null };
  }

  async createOrder(data: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    const order: Order = {
      ...data,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    previewData.orders.set(order.id!, order);
    await this.saveToCookies();

    return { data: order, error: null };
  }

  async updateOrder(id: string, data: Partial<Order>) {
    const existingOrder = previewData.orders.get(id);
    if (!existingOrder) {
      return { data: null, error: new Error('Order not found') };
    }

    const updatedOrder = {
      ...existingOrder,
      ...data,
      updated_at: new Date().toISOString(),
    };

    previewData.orders.set(id, updatedOrder);
    await this.saveToCookies();

    return { data: updatedOrder, error: null };
  }

  async getOrdersCount() {
    return { data: previewData.orders.size, error: null };
  }

  async getRecentOrders(limit: number = 10) {
    const orders = Array.from(previewData.orders.values())
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, limit);
    
    return { data: orders, error: null };
  }

  async getAllOrders() {
    const orders = Array.from(previewData.orders.values())
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    
    return { data: orders, error: null };
  }

  async sendEmail(options: { to: string; subject: string; text?: string; html?: string }) {
    if (!this.testAccount) {
      this.testAccount = await nodemailer.createTestAccount();
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: this.testAccount.user,
        pass: this.testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: '"DANVERSE" <noreply@danverse.ai>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Preview email:', previewUrl);

    return {
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
    };
  }

  async exportData(): Promise<string> {
    const exportData = {
      leads: Object.fromEntries(previewData.leads),
      orders: Object.fromEntries(previewData.orders),
      exportedAt: new Date().toISOString(),
    };
    
    return await encryptData(exportData);
  }

  async importData(jweData: string): Promise<void> {
    try {
      const importedData = await decryptData(jweData);
      
      // Clear existing data
      previewData.leads.clear();
      previewData.orders.clear();
      
      // Import leads
      if (importedData.leads) {
        Object.entries(importedData.leads).forEach(([id, lead]) => {
          previewData.leads.set(id, lead as Lead);
        });
      }
      
      // Import orders
      if (importedData.orders) {
        Object.entries(importedData.orders).forEach(([id, order]) => {
          previewData.orders.set(id, order as Order);
        });
      }
      
      // Save to cookies
      await this.saveToCookies();
    } catch (error) {
      throw new Error('Invalid backup data');
    }
  }

  isPreviewMode() {
    return true;
  }
}

// Production adapter (placeholder - not used in preview mode)
class ProductionAdapter implements DataAdapter {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Parse SMTP URL
    const smtpUrl = new URL(env.SMTP_URL!);
    this.transporter = nodemailer.createTransport({
      host: smtpUrl.hostname,
      port: parseInt(smtpUrl.port) || 587,
      secure: smtpUrl.protocol === 'smtps:',
      auth: {
        user: smtpUrl.username,
        pass: smtpUrl.password,
      },
    });
  }

  async createLead(data: Omit<Lead, 'id' | 'created_at'>) {
    // In preview mode, this won't be called
    return { data: null, error: new Error('Production mode not available') };
  }

  async getLeadsCount() {
    return { data: 0, error: null };
  }

  async getRecentLeads(limit: number = 10) {
    return { data: [], error: null };
  }

  async createOrder(data: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
    return { data: null, error: new Error('Production mode not available') };
  }

  async updateOrder(id: string, data: Partial<Order>) {
    return { data: null, error: new Error('Production mode not available') };
  }

  async getOrdersCount() {
    return { data: 0, error: null };
  }

  async getRecentOrders(limit: number = 10) {
    return { data: [], error: null };
  }

  async getAllOrders() {
    return { data: [], error: null };
  }

  async sendEmail(options: { to: string; subject: string; text?: string; html?: string }) {
    const info = await this.transporter.sendMail({
      from: '"DANVERSE" <noreply@danverse.ai>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    return {
      messageId: info.messageId,
      previewUrl: undefined,
    };
  }

  async exportData(): Promise<string> {
    return await encryptData({ leads: {}, orders: {}, exportedAt: new Date().toISOString() });
  }

  async importData(jweData: string): Promise<void> {
    // Not implemented for production
  }

  isPreviewMode() {
    return false;
  }
}

// Create and export the adapter instance
export const dataAdapter: DataAdapter = hasProductionSecrets 
  ? new ProductionAdapter() 
  : new PreviewAdapter();

// Export utilities
export { encryptData, decryptData };

