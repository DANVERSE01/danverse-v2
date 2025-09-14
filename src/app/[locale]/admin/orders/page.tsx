'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Order {
  id: number;
  order_code: string;
  plan: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_company?: string;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  transaction_reference?: string;
  created_at: string;
  paid_at?: string;
}

interface OrdersPageProps {
  params: {
    locale: string;
  };
}

export default function AdminOrdersPage({ params }: OrdersPageProps) {
  const t = useTranslations();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, searchQuery]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        status: statusFilter,
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderCode: string, newStatus: string, paymentMethod?: string, transactionRef?: string) => {
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderCode,
          status: newStatus,
          paymentMethod,
          transactionReference: transactionRef,
        }),
      });

      if (response.ok) {
        fetchOrders(); // Refresh the list
        setUpdateModalOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  const exportToCSV = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        status: statusFilter,
        search: searchQuery,
      });

      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-neon-green';
      case 'pending': return 'text-neon-yellow';
      case 'cancelled': return 'text-neon-red';
      case 'refunded': return 'text-neon-blue';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      paid: 'bg-neon-green/20 text-neon-green border-neon-green/30',
      pending: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30',
      cancelled: 'bg-neon-red/20 text-neon-red border-neon-red/30',
      refunded: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs border ${colors[status as keyof typeof colors] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-dark-950 cosmic-bg pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-neon-gradient bg-clip-text text-transparent">
              Orders Management
            </h1>
            <p className="text-gray-300">Manage customer orders and payment status</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="/admin"
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              ← Back to Dashboard
            </Link>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-neon-green text-white rounded-lg hover:bg-neon-green/80 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-dark p-6 rounded-xl border border-gray-700 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-300 mb-2">Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name, email, or order code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setCurrentPage(1);
                  fetchOrders();
                }}
                className="w-full py-3 px-6 bg-neon-pink text-white rounded-lg font-semibold hover:bg-neon-pink/80 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-dark rounded-xl border border-gray-700 overflow-hidden"
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="text-gray-400">Loading orders...</div>
            </div>
          ) : orders.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-800 border-b border-gray-700">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-semibold">Order Code</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Customer</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Plan</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Amount</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Status</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                      <th className="text-left p-4 text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-700 hover:bg-dark-800/50">
                        <td className="p-4">
                          <div className="font-mono text-neon-blue">{order.order_code}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{order.customer_name}</div>
                          <div className="text-gray-400 text-sm">{order.customer_email}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white capitalize">{order.plan}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-semibold">${order.amount.toLocaleString()}</div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-4">
                          <div className="text-gray-300">{new Date(order.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setUpdateModalOpen(true);
                            }}
                            className="px-3 py-1 bg-neon-pink text-white rounded text-sm hover:bg-neon-pink/80 transition-colors"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-700 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-neon-pink text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400">No orders found</div>
            </div>
          )}
        </motion.div>

        {/* Update Modal */}
        {updateModalOpen && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-dark p-6 rounded-xl border border-gray-700 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-4">Update Order Status</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Order Code</label>
                  <div className="font-mono text-neon-blue">{selectedOrder.order_code}</div>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">New Status</label>
                  <select
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                    defaultValue={selectedOrder.status}
                    id="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Payment Method (Optional)</label>
                  <select
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                    id="payment-method-select"
                  >
                    <option value="">Select payment method</option>
                    <option value="instapay">InstaPay</option>
                    <option value="vodafone_cash">Vodafone Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Transaction Reference (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter transaction reference"
                    className="w-full p-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:border-neon-pink focus:outline-none"
                    id="transaction-ref-input"
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setUpdateModalOpen(false);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 py-2 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const statusSelect = document.getElementById('status-select') as HTMLSelectElement;
                    const paymentMethodSelect = document.getElementById('payment-method-select') as HTMLSelectElement;
                    const transactionRefInput = document.getElementById('transaction-ref-input') as HTMLInputElement;
                    
                    handleStatusUpdate(
                      selectedOrder.order_code,
                      statusSelect.value,
                      paymentMethodSelect.value || undefined,
                      transactionRefInput.value || undefined
                    );
                  }}
                  className="flex-1 py-2 px-4 bg-neon-pink text-white rounded-lg hover:bg-neon-pink/80 transition-colors"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

