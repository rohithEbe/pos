import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, Receipt, Printer, Save, RefreshCw } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import { storage } from '../utils/storage';
import './Settings.css';

export const Settings = () => {
  const [storeInfo, setStoreInfo] = useState({
    name: 'Gourmet Resto & Bar',
    tagline: 'Fine Dining & Craft Brews',
    currency: 'USD ($)',
    taxRate: '8.0',
    phone: '+1 (555) 789-2345',
    address: '452 Downtown Culinary Ave, Suite 101',
    receiptFooter: 'Thank you for dining with us! Please come again.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to factory defaults?')) {
      storage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="pos-page-container">
      <Header
        title="Restaurant Settings"
        subtitle="Configure store information, tax regulations, hardware receipts, and system reset"
      />

      <div className="settings-page-content">
        <form onSubmit={handleSave} className="settings-form">
          <div className="settings-card">
            <div className="settings-card-header">
              <Store size={20} className="card-icon" />
              <div>
                <h3 className="card-title">Store Profile & Branding</h3>
                <p className="card-subtitle">Information printed on bills and customer receipts</p>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Restaurant Name</label>
                  <input
                    type="text"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Tagline / Concept</label>
                  <input
                    type="text"
                    value={storeInfo.tagline}
                    onChange={(e) => setStoreInfo({ ...storeInfo, tagline: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Currency Format</label>
                  <select
                    value={storeInfo.currency}
                    onChange={(e) => setStoreInfo({ ...storeInfo, currency: e.target.value })}
                  >
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                    <option value="GBP (£)">GBP (£)</option>
                    <option value="INR (₹)">INR (₹)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Physical Address</label>
                <input
                  type="text"
                  value={storeInfo.address}
                  onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <Receipt size={20} className="card-icon" />
              <div>
                <h3 className="card-title">Tax & Thermal Receipt Options</h3>
                <p className="card-subtitle">Configure VAT, sales tax rate, and receipt footer message</p>
              </div>
            </div>

            <div className="settings-card-body">
              <div className="form-group">
                <label>Sales Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={storeInfo.taxRate}
                  onChange={(e) => setStoreInfo({ ...storeInfo, taxRate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Receipt Footer Note</label>
                <textarea
                  rows="2"
                  value={storeInfo.receiptFooter}
                  onChange={(e) => setStoreInfo({ ...storeInfo, receiptFooter: e.target.value })}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="settings-actions-row">
            <button type="submit" className="btn-primary save-btn">
              <Save size={18} />
              <span>Save Configurations</span>
            </button>

            {savedSuccess && <span className="save-toast">Preferences saved successfully!</span>}

            <button
              type="button"
              className="btn-danger-outline"
              onClick={handleResetData}
            >
              <RefreshCw size={16} />
              <span>Reset Factory Demo Data</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
