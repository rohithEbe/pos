import React from 'react';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Grid,
  ClipboardList,
  Armchair,
  CalendarCheck,
  Users,
  UserCheck,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import './Sidebar.css';

const menuItems = [
  { id: 'pos', label: 'POS Terminal', icon: Utensils, badge: null },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: ClipboardList, badgeKey: 'orders' },
  { id: 'tables', label: 'Tables', icon: Armchair },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'categories', label: 'Categories', icon: Grid },
  { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'employees', label: 'Employees', icon: UserCheck },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar = () => {
  const { currentPage, setCurrentPage, orders } = usePOS();
  const activeOrdersCount = orders.filter((o) => o.status === 'Preparing' || o.status === 'Pending').length;

  return (
    <aside className="pos-sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo-wrap">
          <Utensils className="brand-icon" size={24} />
        </div>
        <div className="brand-info">
          <h2 className="brand-title">Gourmet<span>POS</span></h2>
          <span className="brand-subtitle">Resto & Bar OS</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <div className="nav-icon-box">
                <Icon size={20} />
              </div>
              <span className="nav-label">{item.label}</span>
              {item.id === 'orders' && activeOrdersCount > 0 && (
                <span className="nav-badge">{activeOrdersCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">AD</div>
          <div className="user-details">
            <span className="user-name">Alex Dawson</span>
            <span className="user-role">Shift Manager</span>
          </div>
        </div>
        <button className="logout-btn" title="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
