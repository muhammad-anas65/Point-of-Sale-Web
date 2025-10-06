import { ReactNode, useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Receipt,
  Truck,
  Gift
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'cashier', 'accountant'] },
  { id: 'sales', name: 'Sales Register', icon: ShoppingCart, roles: ['admin', 'manager', 'cashier'] },
  { id: 'products', name: 'Products', icon: Package, roles: ['admin', 'manager'] },
  { id: 'customers', name: 'Customers', icon: Users, roles: ['admin', 'manager', 'cashier'] },
  { id: 'quotations', name: 'Quotations', icon: FileText, roles: ['admin', 'manager'] },
  { id: 'purchases', name: 'Purchases', icon: Truck, roles: ['admin', 'manager'] },
  { id: 'expenses', name: 'Expenses', icon: DollarSign, roles: ['admin', 'manager', 'accountant'] },
  { id: 'gift-cards', name: 'Gift Cards', icon: Gift, roles: ['admin', 'manager'] },
  { id: 'reports', name: 'Reports', icon: BarChart3, roles: ['admin', 'manager', 'accountant'] },
  { id: 'settings', name: 'Settings', icon: Settings, roles: ['admin'] },
];

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { profile, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNavigation = navigation.filter(item =>
    profile && item.roles.includes(profile.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Receipt className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg">POS System</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Receipt className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">POS System</h1>
                <p className="text-xs text-gray-500">{profile?.role.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {profile?.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile?.full_name}
                </p>
                <p className="text-xs text-gray-500">{profile?.role}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
