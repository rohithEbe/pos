import React from 'react';
import { BarChart3, TrendingUp, DollarSign, CreditCard, Banknote, QrCode, Download } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import './Reports.css';

export const Reports = () => {
  const { orders } = usePOS();

  const totalGrossRevenue = orders.reduce((s, o) => s + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalGrossRevenue / totalOrdersCount : 0;

  // Breakdown by payment
  const cashTotal = orders.filter((o) => o.paymentMethod === 'Cash').reduce((s, o) => s + o.total, 0);
  const cardTotal = orders.filter((o) => o.paymentMethod === 'Credit Card').reduce((s, o) => s + o.total, 0);
  const upiTotal = orders.filter((o) => o.paymentMethod.includes('UPI') || o.paymentMethod.includes('Online')).reduce((s, o) => s + o.total, 0);

  return (
    <div className="pos-page-container">
      <Header
        title="Reports & Analytics"
        subtitle="Sales performance, payment distribution, and revenue summaries"
      />

      <div className="reports-page-content">
        <div className="reports-stats-grid">
          <StatCard
            title="Total Net Sales"
            value={`$${totalGrossRevenue.toFixed(2)}`}
            icon={DollarSign}
            trend="+12.8%"
            trendDirection="up"
            color="orange"
            subtitle="Today's total"
          />
          <StatCard
            title="Average Ticket Size"
            value={`$${avgOrderValue.toFixed(2)}`}
            icon={TrendingUp}
            trend="+4.3%"
            trendDirection="up"
            color="blue"
            subtitle="Per completed order"
          />
          <StatCard
            title="Card Settlements"
            value={`$${cardTotal.toFixed(2)}`}
            icon={CreditCard}
            trend="48%"
            trendDirection="up"
            color="purple"
            subtitle="Of gross volume"
          />
          <StatCard
            title="Cash in Register"
            value={`$${cashTotal.toFixed(2)}`}
            icon={Banknote}
            trend="Drawer OK"
            trendDirection="up"
            color="emerald"
            subtitle="Counted & verified"
          />
        </div>

        {/* Breakdown sections */}
        <div className="reports-breakdown-grid">
          <div className="report-card">
            <h4 className="report-card-title">Payment Channels Breakdown</h4>
            <div className="payment-bar-list">
              <div className="payment-bar-item">
                <div className="bar-label-row">
                  <span><CreditCard size={15} /> Card Transactions</span>
                  <strong>${cardTotal.toFixed(2)}</strong>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill blue"
                    style={{ width: `${totalGrossRevenue > 0 ? (cardTotal / totalGrossRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="payment-bar-item">
                <div className="bar-label-row">
                  <span><Banknote size={15} /> Cash Register</span>
                  <strong>${cashTotal.toFixed(2)}</strong>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill green"
                    style={{ width: `${totalGrossRevenue > 0 ? (cashTotal / totalGrossRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="payment-bar-item">
                <div className="bar-label-row">
                  <span><QrCode size={15} /> UPI / QR Payments</span>
                  <strong>${upiTotal.toFixed(2)}</strong>
                </div>
                <div className="bar-track">
                  <div
                    className="bar-fill orange"
                    style={{ width: `${totalGrossRevenue > 0 ? (upiTotal / totalGrossRevenue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="report-card">
            <h4 className="report-card-title">Dining Channels Distribution</h4>
            <div className="channel-stats-list">
              <div className="channel-box">
                <span className="channel-name">Dine-in Service</span>
                <span className="channel-val">
                  {orders.filter((o) => o.type === 'Dine In').length} Orders
                </span>
              </div>
              <div className="channel-box">
                <span className="channel-name">Takeaway / Pick-up</span>
                <span className="channel-val">
                  {orders.filter((o) => o.type === 'Takeaway').length} Orders
                </span>
              </div>
              <div className="channel-box">
                <span className="channel-name">Delivery Dispatch</span>
                <span className="channel-val">
                  {orders.filter((o) => o.type === 'Delivery').length} Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
