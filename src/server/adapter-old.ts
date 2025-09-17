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
  company?: string;
  message?: string;
  created_at?: string;
}

export interface Order {
  id?: string;
  order_code?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  package_type: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Abstract adapter interface
export interface DataAdapter {
  // Leads
  createLead(data: Omit<Lead, 'id' | 'created_at'>): Promise<{ data: Lead | null; error: Error | null }>;
  getLeadsCount(): Promise<{ count: number; error: Error | null }>;
  getRecentLeads(limit: number): Promise<{ data: Lead[]; error: Error | null }>;
  getAllLeads(): Promise<{ data: Lead[]; error: Error | null }>;
  
  // Orders
  createOrder(data: Omit<Order, 'id' | 'order_code' | 'created_at'>): Promise<{ data: Order | null; error: Error | null }>;
  updateOrder(orderCode: string, data: Partial<Order>): Promise<{ data: Order | null; error: Error | null }>;
  findOrders(filter: Partial<Order>): Promise<{ data: Order[]; error: Error | null }>;
  getOrdersCount(filter?: Partial<Order>): Promise<{ count: number; error: Error | null }>;
  getRecentOrders(limit: number): Promise<{ data: Order[]; error: Error | null }>;
  getAllOrders(): Promise<{ data: Order[]; error: Error | null }>;
  
  // Email
  sendEmail(options: {
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }): Promise<{ messageId: string; previewUrl?: string }>;
  
  // Preview mode specific
  exportData?(): Promise<string>; // JWE encrypted backup
  importData?(jweData: string): Promise<void>;
  isPreviewMode(): boolean;
}

// In-memory stores for preview mode
const previewData = {
  leads: new Map<string, Lead>(),
  orders: new Map<string, Order>(),
};

// JWE encryption/decryption helpers
const secret = new TextEncoder().encode(env.RATE_LIMIT_SECRET);

async function encryptData(data: any): Promise<string> {
  return await new EncryptJWT(data)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .encrypt(secret);
}

async function decryptData(jwe: string): Promise<any> {
  const { payload } = await jwtDecrypt(jwe, secret);
  return payload;
}

// Cookie helpers for persistence
async function setCookieData(key: string, data: any) {
  const cookieStore = await cookies();
  cookieStore.set(`preview_${key}`, JSON.stringify(data), {
    maxAge: 7 * 24 * 60 * 60, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

async function getCookieData(key: string): Promise<any> {
  try {
    const cookieStore = await cookies();
    const data = cookieStore.get(`preview_${key}`)?.value;
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// Production Adapter
class ProductionAdapter implements DataAdapter {
  private supabase;
  private transporter;

  constructor() {
    this.supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_ANON_KEY!);
    
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
    const { data: lead, error } = await this.supabase
      .from('leads')
      .insert(data)
      .select()
      .single();
    
    return { data: lead, error };
  }

  async getLeadsCount() {
    const { count, error } = await this.supabase
      .from('leads')
      .select('*', { count: 'exact', head: true });
    
    return { count: count || 0, error };
  }

  async getRecentLeads(limit: number) {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data: data || [], error };
  }

  async getAllLeads() {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data: data || [], error };
  }

  async createOrder(data: Omit<Order, 'id' | 'order_code' | 'created_at'>) {
    const orderCode = `DV-${Date.now()}`;
    const orderData = { ...data, order_code: orderCode, status: 'pending' };
    
    const { data: order, error } = await this.supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    return { data: order, error };
  }

  async updateOrder(orderCode: string, data: Partial<Order>) {
    const { data: order, error } = await this.supabase
      .from('orders')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('order_code', orderCode)
      .select()
      .single();
    
    return { data: order, error };
  }

  async findOrders(filter: Partial<Order>) {
    let query = this.supabase.from('orders').select('*');
    
    Object.entries(filter).forEach(([key, value]) => {
      query = query.eq(key, value);
    });
    
    const { data, error } = await query;
    return { data: data || [], error };
  }

  async getOrdersCount(filter?: Partial<Order>) {
    let query = this.supabase.from('orders').select('*', { count: 'exact', head: true });
    
    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { count, error } = await query;
    return { count: count || 0, error };
  }

  async getRecentOrders(limit: number) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    return { data: data || [], error };
  }

  async getAllOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data: data || [], error };
  }

  async sendEmail(options: { to: string; subject: string; text?: string; html?: string }) {
    const info = await this.transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@danverse.ai',
      ...options,
    });
    
    return { messageId: info.messageId };
  }

  isPreviewMode() {
    return false;
  }
}

// Preview Adapter
class PreviewAdapter implements DataAdapter {
  private testAccount: nodemailer.TestAccount | null = null;

  constructor() {
    // Load data from cookies on initialization
    this.loadFromCookies();
  }

  private async loadFromCookies() {
    const leadsData = await getCookieData('leads');
    const ordersData = await getCookieData('orders');
    
    if (leadsData) {
      Object.entries(leadsData).forEach(([id, lead]) => {
        previewData.leads.set(id, lead as Lead);
      });
    }
    
    if (ordersData) {
      Object.entries(ordersData).forEach(([id, order]) => {
        previewData.orders.set(id, order as Order);
      });
    }
  }

  private async saveToCookies() {
    await setCookieData('leads', Object.fromEntries(previewData.leads));
    await setCookieData('orders', Object.fromEntries(previewData.orders));
  }

  async createLead(data: Omit<Lead, 'id' | 'created_at'>) {
    const id = Date.now().toString();
    const lead: Lead = {
      ...data,
      id,
      created_at: new Date().toISOString(),
    };
    
    previewData.leads.set(id, lead);
    await this.saveToCookies();
    
    return { data: lead, error: null };
  }

  async getLeadsCount() {
    return { count: previewData.leads.size, error: null };
  }

  async getRecentLeads(limit: number) {
    const leads = Array.from(previewData.leads.values())
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
      .slice(0, limit);
    
    return { data: leads, error: null };
  }

  async getAllLeads() {
    const leads = Array.from(previewData.leads.values())
      .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    
    return { data: leads, error: null };
  }

  async createOrder(data: Omit<Order, 'id' | 'order_code' | 'created_at'>) {
    const orderCode = `DV-${Date.now()}`;
    const order: Order = {
      ...data,
      id: orderCode,
      order_code: orderCode,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    
    previewData.orders.set(orderCode, order);
    await this.saveToCookies();
    
    return { data: order, error: null };
  }

  async updateOrder(orderCode: string, data: Partial<Order>) {
    const existingOrder = previewData.orders.get(orderCode);
    if (!existingOrder) {
      return { data: null, error: new Error('Order not found') };
    }
    
    const updatedOrder = {
      ...existingOrder,
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    previewData.orders.set(orderCode, updatedOrder);
    await this.saveToCookies();
    
    return { data: updatedOrder, error: null };
  }

  async findOrders(filter: Partial<Order>) {
    const orders = Array.from(previewData.orders.values()).filter(order => {
      return Object.entries(filter).every(([key, value]) => order[key as keyof Order] === value);
    });
    
    return { data: orders, error: null };
  }

  async getOrdersCount(filter?: Partial<Order>) {
    if (filter) {
      const { data } = await this.findOrders(filter);
      return { count: data.length, error: null };
    }
    
    return { count: previewData.orders.size, error: null };
  }

  async getRecentOrders(limit: number) {
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

// Export the appropriate adapter
export const dataAdapter: DataAdapter = hasProductionSecrets 
  ? new ProductionAdapter() 
  : new PreviewAdapter();

// Export preview mode status
export const isPreviewMode = !hasProductionSecrets;

// Export for client-side usage
export function getClientData() {
  if (!isPreviewMode) return null;
  
  return {
    leads: Object.fromEntries(previewData.leads),
    orders: Object.fromEntries(previewData.orders),
  };
}

