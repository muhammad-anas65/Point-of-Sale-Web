import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { SalesRegister } from './pages/SalesRegister';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'sales':
        return <SalesRegister />;
      case 'products':
        return <Products />;
      case 'customers':
        return <Customers />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'quotations':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Quotations</h2>
            <p className="text-gray-600 mt-2">Feature coming soon</p>
          </div>
        );
      case 'purchases':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Purchases</h2>
            <p className="text-gray-600 mt-2">Feature coming soon</p>
          </div>
        );
      case 'expenses':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
            <p className="text-gray-600 mt-2">Feature coming soon</p>
          </div>
        );
      case 'gift-cards':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Gift Cards</h2>
            <p className="text-gray-600 mt-2">Feature coming soon</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
