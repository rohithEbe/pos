import React, { useState, useMemo } from 'react';
import {
  Armchair,
  Users,
  Plus,
  GitMerge,
  Split,
  Edit2,
  Trash2,
  CheckCircle2,
  Receipt,
  Utensils,
  Layers,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import Modal from '../components/Modal';
import './Tables.css';

export const Tables = () => {
  const {
    tables,
    addTable,
    editTable,
    deleteTable,
    updateTableStatus,
    mergeTables,
    splitTables,
    releaseTable,
    setSelectedTable,
    setCurrentPage
  } = usePOS();

  const [selectedFloor, setSelectedFloor] = useState('All');
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedTableIdsForMerge, setSelectedTableIdsForMerge] = useState([]);

  // Modals state
  const [activeTableDetail, setActiveTableDetail] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Forms
  const [newTableForm, setNewTableForm] = useState({
    name: '',
    chairs: 4,
    floor: 'Main Dining'
  });

  const [editTableForm, setEditTableForm] = useState({
    name: '',
    chairs: 4,
    floor: 'Main Dining'
  });

  const floors = ['All', 'Main Dining', 'Terrace Garden', 'VIP Lounge', 'Bar Counter'];

  // Metrics
  const totalChairs = useMemo(() => {
    return tables.reduce((sum, t) => sum + (t.chairs || 4), 0);
  }, [tables]);

  const occupiedChairs = useMemo(() => {
    return tables
      .filter((t) => t.status === 'occupied')
      .reduce((sum, t) => sum + (t.chairs || 4), 0);
  }, [tables]);

  const mergedGroupsCount = useMemo(() => {
    const set = new Set();
    tables.forEach((t) => {
      if (t.isMerged && t.mergedGroupId) set.add(t.mergedGroupId);
    });
    return set.size;
  }, [tables]);

  // Filtered tables by floor
  const filteredTables = useMemo(() => {
    if (selectedFloor === 'All') return tables;
    return tables.filter((t) => t.floor === selectedFloor);
  }, [tables, selectedFloor]);

  // Group tables for display: separate merged group cards and standalone tables
  const displayedStructure = useMemo(() => {
    const list = [];
    const handledGroups = new Set();

    filteredTables.forEach((table) => {
      if (table.isMerged && table.mergedGroupId) {
        if (!handledGroups.has(table.mergedGroupId)) {
          handledGroups.add(table.mergedGroupId);
          // Find all member tables belonging to this group
          const members = tables.filter((t) => t.mergedGroupId === table.mergedGroupId);
          const totalGroupChairs = members.reduce((sum, m) => sum + (m.chairs || 4), 0);
          const isOccupied = members.some((m) => m.status === 'occupied');
          const isReserved = members.some((m) => m.status === 'reserved');
          const status = isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available';
          const activeOrder = members.find((m) => m.currentOrder)?.currentOrder || null;

          list.push({
            type: 'merged',
            groupId: table.mergedGroupId,
            groupName: table.mergedGroupName || members.map((m) => m.name).join(' + '),
            totalChairs: totalGroupChairs,
            status,
            floor: table.floor,
            members,
            currentOrder: activeOrder
          });
        }
      } else {
        list.push({
          type: 'single',
          table
        });
      }
    });

    return list;
  }, [filteredTables, tables]);

  // Handle Add Table
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTableForm.name.trim()) return;

    const ok = addTable(newTableForm);
    if (ok) {
      setIsAddModalOpen(false);
      setNewTableForm({ name: '', chairs: 4, floor: 'Main Dining' });
    }
  };

  // Handle Edit Table
  const handleOpenEdit = (table) => {
    setEditTableForm({
      name: table.name,
      chairs: table.chairs || 4,
      floor: table.floor
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!activeTableDetail) return;
    editTable(activeTableDetail.id, editTableForm);
    setActiveTableDetail((prev) => ({
      ...prev,
      name: editTableForm.name,
      chairs: parseInt(editTableForm.chairs, 10),
      floor: editTableForm.floor
    }));
    setIsEditModalOpen(false);
  };

  // Handle Merge Mode Selection
  const toggleSelectForMerge = (tableId) => {
    setSelectedTableIdsForMerge((prev) => {
      if (prev.includes(tableId)) {
        return prev.filter((id) => id !== tableId);
      }
      return [...prev, tableId];
    });
  };

  const executeMerge = () => {
    if (selectedTableIdsForMerge.length < 2) {
      alert('Please select at least 2 tables to merge.');
      return;
    }
    const success = mergeTables(selectedTableIdsForMerge);
    if (success) {
      setSelectedTableIdsForMerge([]);
      setMergeMode(false);
    }
  };

  // Open POS with selected table
  const handleTakeOrder = (tableName) => {
    setSelectedTable(tableName);
    setCurrentPage('pos');
  };

  // Render Visual Chairs around Table Surface (Architectural Floor Plan View)
  const renderVisualChairs = (chairCount) => {
    const count = Math.min(Math.max(chairCount || 4, 1), 16);
    // Split chairs across 4 sides: top, bottom, left, right
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    if (count === 1) {
      top = 1;
    } else if (count === 2) {
      left = 1;
      right = 1;
    } else if (count === 3) {
      top = 1;
      left = 1;
      right = 1;
    } else if (count === 4) {
      top = 1;
      bottom = 1;
      left = 1;
      right = 1;
    } else if (count <= 6) {
      top = 2;
      bottom = 2;
      left = 1;
      right = 1;
    } else if (count <= 8) {
      top = 3;
      bottom = 3;
      left = 1;
      right = 1;
    } else if (count <= 10) {
      top = 4;
      bottom = 4;
      left = 1;
      right = 1;
    } else {
      top = 5;
      bottom = 5;
      left = 2;
      right = 2;
    }

    return (
      <div className="table-visual-blueprint">
        {/* Top Chairs Row */}
        <div className="chair-row chair-top">
          {Array.from({ length: top }).map((_, i) => (
            <div key={`top-${i}`} className="chair-cushion" title="Chair" />
          ))}
        </div>

        {/* Center Row: Left Chairs + Table Surface + Right Chairs */}
        <div className="blueprint-middle-row">
          <div className="chair-col chair-left">
            {Array.from({ length: left }).map((_, i) => (
              <div key={`left-${i}`} className="chair-cushion vertical" title="Chair" />
            ))}
          </div>

          {/* Realistic CAD Table Surface */}
          <div className="cad-table-surface">
            <div className="cad-inner-rim">
              <span className="cad-center-plates">🍽️</span>
            </div>
          </div>

          <div className="chair-col chair-right">
            {Array.from({ length: right }).map((_, i) => (
              <div key={`right-${i}`} className="chair-cushion vertical" title="Chair" />
            ))}
          </div>
        </div>

        {/* Bottom Chairs Row */}
        <div className="chair-row chair-bottom">
          {Array.from({ length: bottom }).map((_, i) => (
            <div key={`bottom-${i}`} className="chair-cushion" title="Chair" />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pos-page-container">
      <Header
        title="Restaurant Tables & Floor Management"
        subtitle="Visual seating blueprint, chair capacity, merge & split tables, and billing routing"
      />

      <div className="tables-content-wrapper">
        {/* Quick Stats Bar */}
        <div className="tables-kpi-bar">
          <div className="kpi-mini-card">
            <span className="kpi-label">Total Tables</span>
            <strong className="kpi-val">{tables.length}</strong>
          </div>
          <div className="kpi-mini-card">
            <span className="kpi-label">Merged Groups</span>
            <strong className="kpi-val highlight">{mergedGroupsCount}</strong>
          </div>
          <div className="kpi-mini-card">
            <span className="kpi-label">Total Chairs / Seats</span>
            <strong className="kpi-val">{totalChairs}</strong>
          </div>
          <div className="kpi-mini-card">
            <span className="kpi-label">Occupied Seats</span>
            <strong className="kpi-val alert">{occupiedChairs} ({totalChairs > 0 ? Math.round((occupiedChairs / totalChairs) * 100) : 0}%)</strong>
          </div>
        </div>

        {/* Action Controls & Floor Filters */}
        <div className="tables-toolbar-action-row">
          <div className="floor-filter-pills">
            {floors.map((floor) => (
              <button
                key={floor}
                className={`floor-pill-btn ${selectedFloor === floor ? 'active' : ''}`}
                onClick={() => setSelectedFloor(floor)}
              >
                {floor}
              </button>
            ))}
          </div>

          <div className="action-buttons-group">
            <button
              className={`btn-toolbar merge-toggle ${mergeMode ? 'active' : ''}`}
              onClick={() => {
                setMergeMode(!mergeMode);
                setSelectedTableIdsForMerge([]);
              }}
            >
              <GitMerge size={17} />
              <span>{mergeMode ? 'Cancel Merge' : 'Merge Tables'}</span>
            </button>

            <button
              className="btn-toolbar btn-primary-add"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus size={18} />
              <span>Add Table</span>
            </button>
          </div>
        </div>

        {/* Merge Notification Banner if in Merge Mode */}
        {mergeMode && (
          <div className="merge-instruction-banner">
            <div className="banner-text">
              <GitMerge size={20} className="banner-icon" />
              <div>
                <strong>Merge Tables Mode Active</strong>
                <p>Click on 2 or more available tables to combine seating and create one unified bill.</p>
              </div>
            </div>

            <div className="banner-actions">
              <span className="selection-counter">
                {selectedTableIdsForMerge.length} tables selected
              </span>
              <button
                className="btn-confirm-merge"
                disabled={selectedTableIdsForMerge.length < 2}
                onClick={executeMerge}
              >
                Merge Selected Tables ({selectedTableIdsForMerge.length})
              </button>
            </div>
          </div>
        )}

        {/* Floor Visual Cards Grid */}
        <div className="tables-floor-canvas">
          {displayedStructure.map((item, idx) => {
            if (item.type === 'merged') {
              // MERGED TABLE SUITE VIEW
              return (
                <div key={`merged-${item.groupId}`} className={`merged-suite-container status-${item.status}`}>
                  <div className="merged-suite-header">
                    <div className="merged-title-badge">
                      <GitMerge size={16} />
                      <span className="group-name">{item.groupName}</span>
                      <span className="merged-tag">Combined Table</span>
                    </div>

                    <div className="merged-header-actions">
                      <span className={`status-pill ${item.status}`}>{item.status}</span>
                      <button
                        className="btn-split-action"
                        title="Split tables back into individual units"
                        onClick={() => splitTables(item.groupId)}
                      >
                        <Split size={14} /> Split Tables
                      </button>
                    </div>
                  </div>

                  <div className="merged-suite-body">
                    {/* Visual Combined Seating Units */}
                    <div className="merged-tables-flex">
                      {item.members.map((memberTable) => (
                        <div key={memberTable.id} className="merged-sub-table">
                          <span className="sub-table-code">{memberTable.name}</span>
                          {renderVisualChairs(memberTable.chairs)}
                          <span className="sub-table-chairs">{memberTable.chairs} Chairs</span>
                        </div>
                      ))}
                    </div>

                    <div className="merged-suite-summary">
                      <div className="summary-left">
                        <span className="total-chairs-count">
                          <Users size={16} /> Total Capacity: <strong>{item.totalChairs} Chairs</strong>
                        </span>
                        <span className="summary-floor">{item.floor}</span>
                        {item.currentOrder && (
                          <span className="current-order-tag">Order: {item.currentOrder}</span>
                        )}
                      </div>

                      <div className="summary-right">
                        <button
                          className="btn-order-now"
                          onClick={() => handleTakeOrder(item.groupName)}
                        >
                          <Receipt size={15} />
                          <span>{item.status === 'occupied' ? 'Open Bill' : 'Take Order'}</span>
                        </button>
                        {item.status === 'occupied' && (
                          <button
                            className="btn-release-table"
                            onClick={() => releaseTable(item.groupName)}
                          >
                            <RefreshCw size={14} /> Release
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // INDIVIDUAL TABLE CARD
            const table = item.table;
            const isSelectedForMerge = selectedTableIdsForMerge.includes(table.id);

            return (
              <div
                key={table.id}
                className={`table-visual-card status-${table.status} ${
                  mergeMode ? 'selectable' : ''
                } ${isSelectedForMerge ? 'selected-for-merge' : ''}`}
                onClick={() => {
                  if (mergeMode) {
                    toggleSelectForMerge(table.id);
                  } else {
                    setActiveTableDetail(table);
                  }
                }}
              >
                {/* Checkbox indicator in merge mode */}
                {mergeMode && (
                  <div className={`merge-checkbox ${isSelectedForMerge ? 'checked' : ''}`}>
                    {isSelectedForMerge ? '✓' : ''}
                  </div>
                )}

                <div className="card-top-bar">
                  <div className="table-code-wrap">
                    <span className="table-number">{table.name}</span>
                  </div>
                  <span className={`status-pill ${table.status}`}>{table.status}</span>
                </div>

                {/* Visual Architectural CAD Blueprint representation */}
                <div className="table-visual-stage">
                  {renderVisualChairs(table.chairs)}
                </div>

                <div className="card-bottom-bar">
                  <div className="seating-info">
                    <Users size={14} className="chair-icon" />
                    <span>{table.chairs} Chairs</span>
                  </div>
                  <span className="floor-badge">{table.floor}</span>
                </div>

                {table.currentOrder && (
                  <div className="card-order-ribbon">
                    <span>{table.currentOrder}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Detail / Quick Action Modal */}
      <Modal
        isOpen={Boolean(activeTableDetail)}
        onClose={() => setActiveTableDetail(null)}
        title={activeTableDetail ? `${activeTableDetail.name} Management & Billing` : ''}
        maxWidth="500px"
        footer={
          <div className="modal-actions-row">
            <button
              className="btn-primary"
              onClick={() => {
                handleTakeOrder(activeTableDetail.name);
                setActiveTableDetail(null);
              }}
            >
              <Receipt size={16} /> Take Order / Bill
            </button>
            <button className="btn-cancel" onClick={() => setActiveTableDetail(null)}>
              Close
            </button>
          </div>
        }
      >
        {activeTableDetail && (
          <div className="table-detail-modal-content">
            <div className="detail-meta-overview">
              <div className="meta-box">
                <span className="lbl">Table Name</span>
                <strong>{activeTableDetail.name}</strong>
              </div>
              <div className="meta-box">
                <span className="lbl">Seating</span>
                <strong>{activeTableDetail.chairs} Chairs</strong>
              </div>
              <div className="meta-box">
                <span className="lbl">Floor Zone</span>
                <strong>{activeTableDetail.floor}</strong>
              </div>
              <div className="meta-box">
                <span className="lbl">Status</span>
                <span className={`status-pill ${activeTableDetail.status}`}>
                  {activeTableDetail.status}
                </span>
              </div>
            </div>

            {/* Visual Chairs Blueprint Preview in Modal */}
            <div className="modal-blueprint-preview">
              {renderVisualChairs(activeTableDetail.chairs)}
            </div>

            {/* Change Status Fast Buttons */}
            <div className="status-selector-section">
              <label className="section-label">Change Table Status</label>
              <div className="status-button-grid">
                <button
                  className={`status-btn-choice available ${activeTableDetail.status === 'available' ? 'active' : ''}`}
                  onClick={() => {
                    updateTableStatus(activeTableDetail.id, 'available');
                    setActiveTableDetail({ ...activeTableDetail, status: 'available', currentOrder: null });
                  }}
                >
                  Available
                </button>
                <button
                  className={`status-btn-choice occupied ${activeTableDetail.status === 'occupied' ? 'active' : ''}`}
                  onClick={() => {
                    updateTableStatus(activeTableDetail.id, 'occupied');
                    setActiveTableDetail({ ...activeTableDetail, status: 'occupied' });
                  }}
                >
                  Occupied
                </button>
                <button
                  className={`status-btn-choice reserved ${activeTableDetail.status === 'reserved' ? 'active' : ''}`}
                  onClick={() => {
                    updateTableStatus(activeTableDetail.id, 'reserved');
                    setActiveTableDetail({ ...activeTableDetail, status: 'reserved' });
                  }}
                >
                  Reserved
                </button>
              </div>
            </div>

            {/* Release Table Button if Occupied */}
            {activeTableDetail.status === 'occupied' && (
              <div className="release-section">
                <button
                  className="btn-release-prominent"
                  onClick={() => {
                    releaseTable(activeTableDetail.name);
                    setActiveTableDetail({ ...activeTableDetail, status: 'available', currentOrder: null });
                  }}
                >
                  <RefreshCw size={16} /> Release Table (Free for next guest)
                </button>
              </div>
            )}

            {/* Edit / Delete actions */}
            <div className="table-modal-controls">
              <button
                className="btn-control edit"
                onClick={() => {
                  handleOpenEdit(activeTableDetail);
                  setActiveTableDetail(null);
                }}
              >
                <Edit2 size={15} /> Edit Name & Chairs
              </button>

              <button
                className="btn-control delete"
                onClick={() => {
                  deleteTable(activeTableDetail.id);
                  setActiveTableDetail(null);
                }}
              >
                <Trash2 size={15} /> Delete Table
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Table Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Restaurant Table"
        maxWidth="460px"
        footer={
          <>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-table-form"
              className="btn-primary"
            >
              Create Table
            </button>
          </>
        }
      >
        <form id="add-table-form" onSubmit={handleAddSubmit} className="table-modal-form">
          <div className="form-group">
            <label>Table Number / Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. T9 or Table 9"
              value={newTableForm.name}
              onChange={(e) => setNewTableForm({ ...newTableForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Number of Chairs ({newTableForm.chairs} Seats)</label>
            <div className="chair-slider-wrap">
              <input
                type="range"
                min="1"
                max="16"
                value={newTableForm.chairs}
                onChange={(e) =>
                  setNewTableForm({ ...newTableForm, chairs: parseInt(e.target.value, 10) })
                }
              />
              <span className="slider-counter">{newTableForm.chairs}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Floor / Dining Section</label>
            <select
              value={newTableForm.floor}
              onChange={(e) => setNewTableForm({ ...newTableForm, floor: e.target.value })}
            >
              <option value="Main Dining">Main Dining</option>
              <option value="Terrace Garden">Terrace Garden</option>
              <option value="VIP Lounge">VIP Lounge</option>
              <option value="Bar Counter">Bar Counter</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Table Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Table Configuration"
        maxWidth="460px"
        footer={
          <>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-table-form"
              className="btn-primary"
            >
              Save Changes
            </button>
          </>
        }
      >
        <form id="edit-table-form" onSubmit={handleEditSubmit} className="table-modal-form">
          <div className="form-group">
            <label>Table Name *</label>
            <input
              type="text"
              required
              value={editTableForm.name}
              onChange={(e) => setEditTableForm({ ...editTableForm, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Number of Chairs ({editTableForm.chairs} Seats)</label>
            <div className="chair-slider-wrap">
              <input
                type="range"
                min="1"
                max="16"
                value={editTableForm.chairs}
                onChange={(e) =>
                  setEditTableForm({ ...editTableForm, chairs: parseInt(e.target.value, 10) })
                }
              />
              <span className="slider-counter">{editTableForm.chairs}</span>
            </div>
          </div>

          <div className="form-group">
            <label>Floor / Dining Section</label>
            <select
              value={editTableForm.floor}
              onChange={(e) => setEditTableForm({ ...editTableForm, floor: e.target.value })}
            >
              <option value="Main Dining">Main Dining</option>
              <option value="Terrace Garden">Terrace Garden</option>
              <option value="VIP Lounge">VIP Lounge</option>
              <option value="Bar Counter">Bar Counter</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tables;
