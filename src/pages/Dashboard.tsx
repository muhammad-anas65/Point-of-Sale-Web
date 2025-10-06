import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertCircle } from 'lucide-react';

interface DashboardStats {
  todaySales: number;
  todayTransactions: number;
  lowStockCount: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
}

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayTransactions: 0,
    lowStockCount: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [salesData, productsData, customersData, lowStockData] = await Promise.all([
        supabase
          .from('sales')
          .select('total_amount, created_at')
          .gte('sale_date', today.toISOString()),

        supabase
          .from('products')
          .select('id, selling_price')
          .eq('is_active', true),

        supabase
          .from('customers')
          .select('id, total_spent'),

        supabase
          .from('products')
          .select('id')
          .lte('stock_quantity', 10)
          .eq('is_active', true),
      ]);

      const todaySales = salesData.data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const todayTransactions = salesData.data?.length || 0;
      const lowStockCount = lowStockData.data?.length || 0;
      const totalCustomers = customersData.data?.length || 0;
      const totalProducts = productsData.data?.length || 0;
      const totalRevenue = customersData.data?.reduce((sum, customer) => sum + Number(customer.total_spent), 0) || 0;

      setStats({
        todaySales,
        todayTransactions,
        lowStockCount,
        totalCustomers,
        totalProducts,
        totalRevenue,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: `$${stats.todaySales.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12%',
    },
    {
      title: 'Transactions',
      value: stats.todayTransactions.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-500',
      change: '+8%',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'bg-purple-500',
      change: '+3%',
    },
    {
      title: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'bg-orange-500',
      change: '+15%',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.lowStockCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Low Stock Alert</h3>
              <p className="text-sm text-yellow-700 mt-1">
                {stats.lowStockCount} product{stats.lowStockCount !== 1 ? 's' : ''} running low on stock.
                Consider restocking soon.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <ShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">New Sale</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Product</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Users className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">New Customer</p>
            </button>
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <DollarSign className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Expense</p>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Total Revenue</h2>
          <div className="text-center py-8">
            <p className="text-4xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-2">All-time revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
