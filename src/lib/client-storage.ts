// Client-side data persistence for Preview Mode
export interface ClientData {
  leads: any[];
  orders: any[];
  lastSync: string;
}

const STORAGE_KEY = 'danverse_preview_data';

export class ClientStorage {
  static save(data: Partial<ClientData>) {
    if (typeof window === 'undefined') return;
    
    try {
      const existing = this.load();
      const updated = {
        ...existing,
        ...data,
        lastSync: new Date().toISOString(),
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  static load(): ClientData {
    if (typeof window === 'undefined') {
      return { leads: [], orders: [], lastSync: '' };
    }
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
    
    return { leads: [], orders: [], lastSync: '' };
  }

  static addLead(lead: any) {
    const data = this.load();
    data.leads.push({
      ...lead,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    });
    this.save(data);
  }

  static addOrder(order: any) {
    const data = this.load();
    data.orders.push({
      ...order,
      created_at: new Date().toISOString(),
    });
    this.save(data);
  }

  static getLeads() {
    return this.load().leads;
  }

  static getOrders() {
    return this.load().orders;
  }

  static clear() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }

  static sync() {
    // Sync with server if needed
    const data = this.load();
    console.log('Client data:', data);
    return data;
  }
}

