import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BarChart3, DollarSign, TrendingUp, Download, Calendar } from 'lucide-react';

interface ReportData {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  averageTransaction: number;
}

export function Reports() {
  const [reportData, setReportData] = useState<ReportData>({
    totalSales: 0,
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    transactionCount: 0,
    averageTransaction: 0,
  });
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [dateRange]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const startDate = new Date(dateRange.start);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      const [salesData, expensesData] = await Promise.all([
        supabase
          .from('sales')
          .select('total_amount, subtotal, created_at')
          .gte('sale_date', startDate.toISOString())
          .lte('sale_date', endDate.toISOString()),

        supabase
          .from('expenses')
          .select('amount')
          .gte('expense_date', dateRange.start)
          .lte('expense_date', dateRange.end),
      ]);

      const totalRevenue = salesData.data?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
      const totalSales = salesData.data?.reduce((sum, sale) => sum + Number(sale.subtotal), 0) || 0;
      const totalExpenses = expensesData.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      const transactionCount = salesData.data?.length || 0;
      const averageTransaction = transactionCount > 0 ? totalRevenue / transactionCount : 0;
      const netProfit = totalRevenue - totalExpenses;

      setReportData({
        totalSales,
        totalRevenue,
        totalExpenses,
        netProfit,
        transactionCount,
        averageTransaction,
      });
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">View your business performance metrics</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-5 h-5" />
          Export PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <Calendar className="w-5 h-5 text-gray-600" />
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-800 font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-blue-900">${reportData.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-green-800 font-medium mb-1">Net Profit</p>
            <p className="text-3xl font-bold text-green-900">${reportData.netProfit.toFixed(2)}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-orange-800 font-medium mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-orange-900">${reportData.totalExpenses.toFixed(2)}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-purple-800 font-medium mb-1">Transactions</p>
            <p className="text-3xl font-bold text-purple-900">{reportData.transactionCount}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-600 rounded-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-pink-800 font-medium mb-1">Avg Transaction</p>
            <p className="text-3xl font-bold text-pink-900">${reportData.averageTransaction.toFixed(2)}</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-teal-800 font-medium mb-1">Profit Margin</p>
            <p className="text-3xl font-bold text-teal-900">
              {reportData.totalRevenue > 0
                ? ((reportData.netProfit / reportData.totalRevenue) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Sales (before tax)</span>
              <span className="font-semibold text-gray-900">${reportData.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Revenue (with tax)</span>
              <span className="font-semibold text-gray-900">${reportData.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Number of Transactions</span>
              <span className="font-semibold text-gray-900">{reportData.transactionCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profit & Loss</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700 font-medium">Revenue</span>
              <span className="font-semibold text-green-900">+${reportData.totalRevenue.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm text-red-700 font-medium">Expenses</span>
              <span className="font-semibold text-red-900">-${reportData.totalExpenses.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <span className="text-sm text-blue-700 font-bold">Net Profit</span>
              <span className="font-bold text-blue-900 text-lg">${reportData.netProfit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
