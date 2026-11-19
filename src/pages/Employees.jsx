import React, { useState } from 'react';
import { UserCheck, Plus, Shield, Clock, KeyRound } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import './Employees.css';

export const Employees = () => {
  const { employees, setEmployees } = usePOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Waiter',
    shift: 'Morning',
    pin: '1234'
  });

  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newEmp = {
      id: Date.now(),
      name: formData.name,
      role: formData.role,
      shift: formData.shift,
      status: 'Active',
      pin: formData.pin
    };

    setEmployees((prev) => [...prev, newEmp]);
    setIsModalOpen(false);
    setFormData({ name: '', role: 'Waiter', shift: 'Morning', pin: '1234' });
  };

  const columns = [
    {
      header: 'Staff Member',
      key: 'name',
      render: (name) => <strong className="emp-name">{name}</strong>
    },
    {
      header: 'Role & Responsibility',
      key: 'role',
      render: (role) => (
        <span className="role-tag">
          <Shield size={12} /> {role}
        </span>
      )
    },
    {
      header: 'Current Shift',
      key: 'shift',
      render: (shift) => (
        <span className="shift-text">
          <Clock size={12} /> {shift}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (s) => <span className="status-badge badge-green">{s}</span>
    },
    {
      header: 'POS PIN',
      key: 'pin',
      render: (pin) => <span className="pin-code">••••</span>
    }
  ];

  return (
    <div className="pos-page-container">
      <Header
        title="Restaurant Staff & Staff Roles"
        subtitle="Manage cashier credentials, waitstaff, chefs, and shift schedules"
      />

      <div className="employees-page-content">
        <div className="employees-toolbar">
          <div className="emp-count-box">
            <UserCheck size={18} />
            <span>Active Staff on Roster ({employees.length})</span>
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>Add Staff Member</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={employees}
          emptyMessage="No staff members registered"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Staff Member"
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
              form="emp-form"
              className="btn-primary"
            >
              Save Member
            </button>
          </>
        }
      >
        <form id="emp-form" onSubmit={handleAddEmployee} className="emp-modal-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Head Chef">Head Chef</option>
                <option value="Line Cook">Line Cook</option>
                <option value="Cashier / Manager">Cashier / Manager</option>
                <option value="Head Waiter">Head Waiter</option>
                <option value="Waiter">Waiter</option>
                <option value="Hostess">Hostess</option>
              </select>
            </div>

            <div className="form-group">
              <label>Shift</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              >
                <option value="Morning">Morning (8am - 4pm)</option>
                <option value="Evening">Evening (4pm - 12am)</option>
                <option value="Full Time">Full Day</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>POS Quick Login PIN</label>
            <input
              type="password"
              maxLength="4"
              placeholder="4-digit PIN"
              value={formData.pin}
              onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Employees;
