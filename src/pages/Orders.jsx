import React, { useState } from 'react';
import { ClipboardList, Eye, CheckCircle2, Clock, Check, X, Filter } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import './Orders.css';

export const Orders = () => {
  const { orders, updateOrderStatus } = usePOS();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === 'All' || order.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customer.toLowerCase().includes(search.toLowerCase()) ||
      order.table.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="status-badge badge-green">Completed</span>;
      case 'Preparing':
        return <span className="status-badge badge-yellow">Preparing</span>;
      case 'Ready':
        return <span className="status-badge badge-blue">Ready</span>;
      case 'Pending':
        return <span className="status-badge badge-gray">Pending</span>;
      case 'Cancelled':
        return <span className="status-badge badge-red">Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const columns = [
    {
      header: 'Order ID',
      key: 'id',
      render: (id) => <strong className="order-code">{id}</strong>
    },
    {
      header: 'Customer',
      key: 'customer',
      render: (c, item) => (
        <div className="order-customer-cell">
          <span className="customer-name">{c}</span>
          <span className="customer-type">{item.type}</span>
        </div>
      )
    },
    {
      header: 'Table / Spot',
      key: 'table',
      render: (table) => <span className="table-chip">{table}</span>
    },
    {
      header: 'Items',
      key: 'items',
      render: (items) => (
        <span className="items-summary">
          {items.reduce((s, i) => s + i.quantity, 0)} items ({items.map((i) => i.name).slice(0, 2).join(', ')}
          {items.length > 2 ? '...' : ''})
        </span>
      )
    },
    {
      header: 'Total',
      key: 'total',
      render: (total) => <strong className="order-total">${Number(total).toFixed(2)}</strong>
    },
    {
      header: 'Time',
      key: 'time',
      render: (time, item) => (
        <span className="order-time-text">
          {time} ({item.date})
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (status) => getStatusBadge(status)
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, order) => (
        <div className="table-actions">
          <button
            className="action-icon-btn view"
            title="View order details"
            onClick={() => setSelectedOrder(order)}
          >
            <Eye size={16} />
          </button>
          {order.status === 'Preparing' && (
            <button
              className="action-icon-btn ready"
              title="Mark as Ready"
              onClick={() => updateOrderStatus(order.id, 'Ready')}
            >
              <Clock size={16} />
            </button>
          )}
          {order.status === 'Ready' && (
            <button
              className="action-icon-btn complete"
              title="Mark as Completed"
              onClick={() => updateOrderStatus(order.id, 'Completed')}
            >
              <Check size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="pos-page-container">
      <Header
        title="Kitchen & Live Orders"
        subtitle="Track incoming kitchen tickets, takeaway pickups, and payment settlements"
      />

      <div className="orders-page-content">
        <div className="orders-toolbar">
          <div className="order-status-tabs">
            {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map((tab) => (
              <button
                key={tab}
                className={`order-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="order-search-wrap">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by order ID, customer, table..."
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage={`No orders found in '${activeTab}'`}
        />
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order Details - ${selectedOrder.id}` : ''}
        maxWidth="500px"
        footer={
          <div className="modal-order-footer">
            {selectedOrder?.status !== 'Completed' && selectedOrder?.status !== 'Cancelled' && (
              <button
                className="btn-primary"
                onClick={() => {
                  updateOrderStatus(selectedOrder.id, 'Completed');
                  setSelectedOrder({ ...selectedOrder, status: 'Completed' });
                }}
              >
                Mark as Completed
              </button>
            )}
            <button className="btn-cancel" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        }
      >
        {selectedOrder && (
          <div className="order-modal-body">
            <div className="order-meta-grid">
              <div>
                <span className="meta-label">Customer</span>
                <p className="meta-val">{selectedOrder.customer}</p>
              </div>
              <div>
                <span className="meta-label">Dining Option</span>
                <p className="meta-val">{selectedOrder.type} ({selectedOrder.table})</p>
              </div>
              <div>
                <span className="meta-label">Payment Method</span>
                <p className="meta-val">{selectedOrder.paymentMethod}</p>
              </div>
              <div>
                <span className="meta-label">Current Status</span>
                <div style={{ marginTop: '0.2rem' }}>{getStatusBadge(selectedOrder.status)}</div>
              </div>
            </div>

            <h4 className="order-items-heading">Ordered Dishes</h4>
            <div className="order-modal-items">
              {selectedOrder.items.map((it, idx) => (
                <div key={idx} className="order-modal-item-line">
                  <span className="item-title-qty">
                    <strong>{it.quantity}x</strong> {it.name}
                  </span>
                  <span className="item-price-calc">
                    ${(it.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="order-modal-total-bar">
              <span>Total Amount</span>
              <strong className="grand-price">${selectedOrder.total.toFixed(2)}</strong>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
