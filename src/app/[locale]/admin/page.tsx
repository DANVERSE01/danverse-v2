'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';


interface DashboardStats {
  totalLeads: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
  recentActivity: any[];
}

export default function AdminPage() {
  const t = useTranslations();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalOrders: 0,
    pendingOrders: 0,
    paidOrders: 0,
    totalRevenue: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In production, these would be separate API calls
      const [leadsResponse, ordersResponse] = await Promise.all([
        fetch('/api/admin/leads/stats'),
        fetch('/api/admin/orders/stats'),
      ]);

      if (leadsResponse.ok && ordersResponse.ok) {
        const leadsData = await leadsResponse.json();
        const ordersData = await ordersResponse.json();
        
        setStats({
          totalLeads: leadsData.total || 0,
          totalOrders: ordersData.total || 0,
          pendingOrders: ordersData.pending || 0,
          paidOrders: ordersData.paid || 0,
          totalRevenue: ordersData.revenue || 0,
          recentActivity: [...(leadsData.recent || []), ...(ordersData.recent || [])],
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Leads',
      description: 'View and manage customer leads',
      href: '/admin/leads',
      icon: '👥',
      color: 'neon-blue',
    },
    {
      title: 'Manage Orders',
      description: 'View and update order status',
      href: '/admin/orders',
      icon: '📦',
      color: 'neon-pink',
    },
    {
      title: 'Export Data',
      description: 'Download leads and orders as CSV',
      href: '/admin/export',
      icon: '📊',
      color: 'neon-green',
    },
    {
      title: 'System Logs',
      description: 'View audit logs and system activity',
      href: '/admin/logs',
      icon: '📋',
      color: 'neon-yellow',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 cosmic-bg pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-neon-gradient bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl text-gray-300">
            Manage your DANVERSE platform
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Leads', value: stats.totalLeads, color: 'neon-blue', icon: '👥' },
            { label: 'Total Orders', value: stats.totalOrders, color: 'neon-pink', icon: '📦' },
            { label: 'Pending Orders', value: stats.pendingOrders, color: 'neon-yellow', icon: '⏳' },
            { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'neon-green', icon: '💰' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass-dark p-6 rounded-xl border border-gray-700 hover:border-neon-pink/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`text-2xl`}>{stat.icon}</div>
                <div className={`w-3 h-3 rounded-full bg-${stat.color} shadow-${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {loading ? '...' : stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={action.title} href={action.href as any}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-dark p-6 rounded-xl border border-gray-700 hover:border-neon-pink/50 transition-all duration-300 cursor-pointer group"
                >
                  <div className="text-3xl mb-4">{action.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-pink transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="glass-dark p-6 rounded-xl border border-gray-700">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-gray-400">Loading recent activity...</div>
              </div>
            ) : stats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {stats.recentActivity.slice(0, 10).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-neon-blue rounded-full" />
                      <div>
                        <div className="text-white text-sm">{activity.description}</div>
                        <div className="text-gray-400 text-xs">{activity.timestamp}</div>
                      </div>
                    </div>
                    <div className="text-gray-400 text-xs">{activity.type}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400">No recent activity</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

