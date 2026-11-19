import React, { useState } from 'react';
import { Armchair, Users, CheckCircle2, Clock, Plus, Filter } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './Tables.css';

export const Tables = () => {
  const { tables, updateTableStatus, setCurrentPage, setSelectedTable } = usePOS();
  const [selectedFloor, setSelectedFloor] = useState('All');
  const [activeTableDetail, setActiveTableDetail] = useState(null);

  const floors = ['All', 'Main Dining', 'Terrace Garden', 'VIP Lounge'];

  const filteredTables = tables.filter((t) => {
    return selectedFloor === 'All' || t.floor === selectedFloor;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'available':
        return 'status-available';
      case 'occupied':
        return 'status-occupied';
      case 'reserved':
        return 'status-reserved';
      default:
        return '';
    }
  };

  const handleOpenPOSForTable = (table) => {
    setSelectedTable(table.name);
    setCurrentPage('pos');
  };

  return (
    <div className="pos-page-container">
      <Header
        title="Restaurant Floor & Tables"
        subtitle="Manage live seating layouts, table turnover, and guest allocations"
      />

      <div className="tables-page-content">
        <div className="tables-toolbar">
          <div className="floor-filter-tabs">
            {floors.map((floor) => (
              <button
                key={floor}
                className={`floor-tab ${selectedFloor === floor ? 'active' : ''}`}
                onClick={() => setSelectedFloor(floor)}
              >
                {floor}
              </button>
            ))}
          </div>

          <div className="legend-row">
            <span className="legend-item"><span className="dot dot-available"></span> Available</span>
            <span className="legend-item"><span className="dot dot-occupied"></span> Occupied</span>
            <span className="legend-item"><span className="dot dot-reserved"></span> Reserved</span>
          </div>
        </div>

        {/* Tables Floor Cards */}
        <div className="tables-layout-grid">
          {filteredTables.map((table) => (
            <div
              key={table.id}
              className={`table-card ${getStatusClass(table.status)}`}
              onClick={() => setActiveTableDetail(table)}
            >
              <div className="table-card-top">
                <span className="table-name">{table.name}</span>
                <span className={`table-status-tag ${table.status}`}>{table.status}</span>
              </div>

              <div className="table-card-center">
                <Armchair size={44} className="table-center-icon" />
                <span className="table-capacity">
                  <Users size={14} /> {table.capacity} Person capacity
                </span>
              </div>

              <div className="table-card-footer">
                <span className="table-floor-label">{table.floor}</span>
                {table.currentOrder && (
                  <span className="table-order-badge">{table.currentOrder}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Table Detail / Action Modal */}
      <Modal
        isOpen={Boolean(activeTableDetail)}
        onClose={() => setActiveTableDetail(null)}
        title={activeTableDetail ? `${activeTableDetail.name} Management` : ''}
        maxWidth="460px"
        footer={
          <div className="table-modal-footer">
            <button
              className="btn-primary"
              onClick={() => {
                handleOpenPOSForTable(activeTableDetail);
                setActiveTableDetail(null);
              }}
            >
              Take Order at {activeTableDetail?.name}
            </button>
            <button className="btn-cancel" onClick={() => setActiveTableDetail(null)}>
              Close
            </button>
          </div>
        }
      >
        {activeTableDetail && (
          <div className="table-modal-body">
            <div className="table-info-box">
              <p><strong>Floor:</strong> {activeTableDetail.floor}</p>
              <p><strong>Seating Capacity:</strong> {activeTableDetail.capacity} Guests</p>
              <p><strong>Current Status:</strong> <span style={{ textTransform: 'capitalize' }}>{activeTableDetail.status}</span></p>
              {activeTableDetail.currentOrder && (
                <p><strong>Active Order ID:</strong> {activeTableDetail.currentOrder}</p>
              )}
            </div>

            <div className="status-change-buttons">
              <label>Update Table Status:</label>
              <div className="button-group">
                <button
                  className={`btn-state available ${activeTableDetail.status === 'available' ? 'active' : ''}`}
                  onClick={() => {
                    updateTableStatus(activeTableDetail.id, 'available');
                    setActiveTableDetail({ ...activeTableDetail, status: 'available', currentOrder: null });
                  }}
                >
                  Available
                </button>
                <button
                  className={`btn-state occupied ${activeTableDetail.status === 'occupied' ? 'active' : ''}`}
                  onClick={() => {
                    updateTableStatus(activeTableDetail.id, 'occupied');
                    setActiveTableDetail({ ...activeTableDetail, status: 'occupied' });
                  }}
                >
                  Occupied
                </button>
                <button
                  className={`btn-state reserved ${activeTableDetail.status === 'reserved' ? 'active' : ''}`}
                  onClick={() => {
                    updateTableStatus(activeTableDetail.id, 'reserved');
                    setActiveTableDetail({ ...activeTableDetail, status: 'reserved' });
                  }}
                >
                  Reserved
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tables;
