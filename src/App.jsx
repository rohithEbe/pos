import React from 'react';
import { POSProvider, usePOS } from './context/POSContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Tables from './pages/Tables';
import Reservations from './pages/Reservations';
import Customers from './pages/Customers';
import Employees from './pages/Employees';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import './App.css';

const MainLayout = () => {
  const { currentPage } = usePOS();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pos':
        return <POS />;
      case 'products':
        return <Products />;
      case 'categories':
        return <Categories />;
      case 'orders':
        return <Orders />;
      case 'tables':
        return <Tables />;
      case 'reservations':
        return <Reservations />;
      case 'customers':
        return <Customers />;
      case 'employees':
        return <Employees />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <POS />;
    }
  };

  return (
    <div className="pos-app-wrapper">
      <Sidebar />
      <main className="pos-main-viewport">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export function App() {
  return (
    <POSProvider>
      <MainLayout />
    </POSProvider>
  );
}

export default App;
