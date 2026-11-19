import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Armchair,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import './Dashboard.css';

export const Dashboard = () => {
  const { orders, tables, products, setCurrentPage } = usePOS();

  const totalSales = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const pendingOrders = orders.filter((o) => o.status === 'Preparing' || o.status === 'Pending').length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="status-badge badge-green">{status}</span>;
      case 'Preparing':
        return <span className="status-badge badge-yellow">{status}</span>;
      case 'Ready':
        return <span className="status-badge badge-blue">{status}</span>;
      default:
        return <span className="status-badge badge-gray">{status}</span>;
    }
  };

  return (
    <div className="pos-page-container">
      <Header
        title="Manager Dashboard"
        subtitle="Real-time restaurant performance and live operational metrics"
      />

      <div className="dashboard-content">
        {/* Stat Cards Grid */}
        <div className="stats-grid">
          <StatCard
            title="Today's Revenue"
            value={`$${totalSales.toFixed(2)}`}
            icon={DollarSign}
            trend="+14.2%"
            trendDirection="up"
            color="orange"
            subtitle="vs yesterday"
          />
          <StatCard
            title="Total Orders"
            value={orders.length}
            icon={ShoppingBag}
            trend="+8.5%"
            trendDirection="up"
            color="blue"
            subtitle="3 active now"
          />
          <StatCard
            title="Table Occupancy"
            value={`${occupiedTables}/${tables.length}`}
            icon={Armchair}
            trend={`${Math.round((occupiedTables / tables.length) * 100)}%`}
            trendDirection="up"
            color="emerald"
            subtitle="Occupancy rate"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={TrendingUp}
            trend={pendingOrders > 0 ? 'Needs attention' : 'All clear'}
            trendDirection={pendingOrders > 2 ? 'down' : 'up'}
            color="purple"
            subtitle="Kitchen queue"
          />
        </div>

        {/* Mid section: Recent orders & Live tables */}
        <div className="dashboard-main-grid">
          {/* Recent Orders Box */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Live Orders</h3>
                <p className="card-subtitle">Latest orders processed in the restaurant</p>
              </div>
              <button className="view-all-btn" onClick={() => setCurrentPage('orders')}>
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="recent-orders-list">
              {orders.slice(0, 5).map((order) => (
                <div key={order.id} className="order-row-item">
                  <div className="order-item-left">
                    <span className="order-id">{order.id}</span>
                    <span className="order-customer">{order.customer}</span>
                    <span className="order-table-tag">{order.table}</span>
                  </div>
                  <div className="order-item-right">
                    <span className="order-amount">${order.total.toFixed(2)}</span>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table Layout Overview */}
          <div className="dashboard-card">
            <div className="card-header">
              <div>
                <h3 className="card-title">Floor Status</h3>
                <p className="card-subtitle">Real-time table arrangement and availability</p>
              </div>
              <button className="view-all-btn" onClick={() => setCurrentPage('tables')}>
                Floor Plan <ArrowRight size={14} />
              </button>
            </div>

            <div className="table-quick-grid">
              {tables.map((table) => (
                <div key={table.id} className={`table-badge-item status-${table.status}`}>
                  <span className="table-badge-name">{table.name}</span>
                  <span className="table-badge-cap">{table.capacity} Seats</span>
                  <span className="table-badge-state">{table.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <div>
              <h3 className="card-title">Chef Specials & Bestsellers</h3>
              <p className="card-subtitle">Top customer favorites ordered today</p>
            </div>
            <button className="view-all-btn" onClick={() => setCurrentPage('pos')}>
              Open Terminal <ArrowRight size={14} />
            </button>
          </div>

          <div className="bestsellers-grid">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bestseller-item">
                <img src={product.image} alt={product.name} className="bestseller-img" />
                <div className="bestseller-info">
                  <span className="bestseller-name">{product.name}</span>
                  <span className="bestseller-cat">{product.category}</span>
                  <span className="bestseller-price">${product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
