import React, { useState } from 'react';
import { Users, Plus, Mail, Phone, Award } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import './Customers.css';

export const Customers = () => {
  const { customers, setCustomers } = usePOS();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      email: formData.email || 'N/A',
      phone: formData.phone || 'N/A',
      visits: 1,
      totalSpent: 0
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  const columns = [
    {
      header: 'Customer',
      key: 'name',
      render: (name) => <strong className="cust-name">{name}</strong>
    },
    {
      header: 'Contact Info',
      key: 'email',
      render: (email, row) => (
        <div className="cust-contact">
          <span><Mail size={12} /> {email}</span>
          <span><Phone size={12} /> {row.phone}</span>
        </div>
      )
    },
    {
      header: 'Total Visits',
      key: 'visits',
      render: (v) => <span className="visit-badge">{v} Dining visits</span>
    },
    {
      header: 'Lifetime Spend',
      key: 'totalSpent',
      render: (spent) => <strong className="cust-spend">${Number(spent).toFixed(2)}</strong>
    }
  ];

  return (
    <div className="pos-page-container">
      <Header
        title="Customer Directory & CRM"
        subtitle="Manage regular diner profiles, contact information, and loyalty spend"
      />

      <div className="customers-page-content">
        <div className="customers-toolbar">
          <div className="cust-search-wrap">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search by customer name, email, or phone..."
            />
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Customer</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="No customer records found"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Customer"
        maxWidth="460px"
        footer={
          <>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="cust-form"
              className="btn-primary"
            >
              Save Customer
            </button>
          </>
        }
      >
        <form id="cust-form" onSubmit={handleAddCustomer} className="cust-modal-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Jane Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              placeholder="+1 555-0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
