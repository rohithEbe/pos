import React, { useState } from 'react';
import { CalendarCheck, Plus, Clock, Users, Calendar, Phone, Check, X } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import './Reservations.css';

export const Reservations = () => {
  const { reservations, setReservations, tables } = usePOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    guests: '2',
    table: 'Table 1',
    date: '2026-11-20',
    time: '07:00 PM',
    phone: ''
  });

  const handleAddReservation = (e) => {
    e.preventDefault();
    if (!formData.customer) return;

    const newRes = {
      id: Date.now(),
      customer: formData.customer,
      guests: parseInt(formData.guests, 10),
      table: formData.table,
      date: formData.date,
      time: formData.time,
      status: 'Confirmed'
    };

    setReservations((prev) => [newRes, ...prev]);
    setIsModalOpen(false);
    setFormData({
      customer: '',
      guests: '2',
      table: 'Table 1',
      date: '2026-11-20',
      time: '07:00 PM',
      phone: ''
    });
  };

  const handleUpdateStatus = (id, newStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const columns = [
    {
      header: 'Guest Name',
      key: 'customer',
      render: (name) => <strong className="res-name">{name}</strong>
    },
    {
      header: 'Party Size',
      key: 'guests',
      render: (g) => <span>{g} Guests</span>
    },
    {
      header: 'Assigned Table',
      key: 'table',
      render: (t) => <span className="res-table-tag">{t}</span>
    },
    {
      header: 'Date & Time',
      key: 'time',
      render: (time, row) => (
        <span className="res-datetime">
          {row.date} at {time}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (s) => (
        <span className={`status-badge ${s === 'Confirmed' ? 'badge-green' : s === 'Seated' ? 'badge-blue' : 'badge-yellow'}`}>
          {s}
        </span>
      )
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, row) => (
        <div className="table-actions">
          {row.status === 'Confirmed' && (
            <button
              className="action-icon-btn complete"
              title="Mark as Seated"
              onClick={() => handleUpdateStatus(row.id, 'Seated')}
            >
              <Check size={16} />
            </button>
          )}
          {row.status !== 'Cancelled' && (
            <button
              className="action-icon-btn delete"
              title="Cancel Booking"
              onClick={() => handleUpdateStatus(row.id, 'Cancelled')}
            >
              <X size={16} />
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="pos-page-container">
      <Header
        title="Table Reservations"
        subtitle="Manage upcoming guest bookings and seating schedules"
      />

      <div className="reservations-page-content">
        <div className="reservations-toolbar">
          <div className="res-summary">
            <CalendarCheck size={20} />
            <span>Upcoming Bookings ({reservations.length})</span>
          </div>

          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            <span>New Reservation</span>
          </button>
        </div>

        <DataTable
          columns={columns}
          data={reservations}
          emptyMessage="No reservations scheduled at the moment"
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book Table Reservation"
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
              form="res-form"
              className="btn-primary"
            >
              Confirm Reservation
            </button>
          </>
        }
      >
        <form id="res-form" onSubmit={handleAddReservation} className="res-modal-form">
          <div className="form-group">
            <label>Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Party Size (Guests)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Select Table</label>
              <select
                value={formData.table}
                onChange={(e) => setFormData({ ...formData, table: e.target.value })}
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} ({t.capacity} Seats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="text"
                placeholder="07:30 PM"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Reservations;
