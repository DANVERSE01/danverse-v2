import { z } from 'zod';
import nodemailer from 'nodemailer';

const isProduction = process.env.VERCEL_ENV === 'production';
const hasSecrets = process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && process.env.SMTP_URL;

export const usePreviewAdapter = !isProduction || !hasSecrets;

// In-memory data stores
const leadsStore = new Map();
const ordersStore = new Map();

// Nodemailer test account for email previews
let testAccount: nodemailer.TestAccount;

async function getTestAccount() {
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }
  return testAccount;
}

// Preview adapter for leads
export const leadsAdapter = {
  create: async (data: any) => {
    const id = Date.now().toString();
    leadsStore.set(id, { ...data, id, created_at: new Date().toISOString() });
    return { data: leadsStore.get(id), error: null };
  },
  count: async () => {
    return { count: leadsStore.size, error: null };
  },
  getRecent: async (limit: number) => {
    const recent = Array.from(leadsStore.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    return { data: recent, error: null };
  },
};

// Preview adapter for orders
export const ordersAdapter = {
  create: async (data: any) => {
    const id = `DV-${Date.now()}`;
    ordersStore.set(id, { ...data, id, order_code: id, created_at: new Date().toISOString(), status: 'pending' });
    return { data: ordersStore.get(id), error: null };
  },
  update: async (orderCode: string, data: any) => {
    if (ordersStore.has(orderCode)) {
      const updatedOrder = { ...ordersStore.get(orderCode), ...data, updated_at: new Date().toISOString() };
      ordersStore.set(orderCode, updatedOrder);
      return { data: updatedOrder, error: null };
    }
    return { data: null, error: new Error('Order not found') };
  },
  find: async (filter: any) => {
    const orders = Array.from(ordersStore.values()).filter(order => {
      for (const key in filter) {
        if (order[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
    return { data: orders, error: null };
  },
  count: async (filter?: any) => {
    if (filter) {
      const orders = await ordersAdapter.find(filter);
      return { count: orders.data?.length || 0, error: null };
    }
    return { count: ordersStore.size, error: null };
  },
  getRecent: async (limit: number) => {
    const recent = Array.from(ordersStore.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
    return { data: recent, error: null };
  },
  getAll: async () => {
    return { data: Array.from(ordersStore.values()), error: null };
  }
};

// Preview adapter for email
export const emailAdapter = {
  send: async (options: any) => {
    const account = await getTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });

    const info = await transporter.sendMail(options);
    console.log('Ethereal email preview URL:', nodemailer.getTestMessageUrl(info));
    return { messageId: info.messageId };
  },
};


