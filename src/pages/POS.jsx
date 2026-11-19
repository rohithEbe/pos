import React, { useState, useMemo } from 'react';
import {
  UtensilsCrossed,
  Beef,
  Pizza,
  Coffee,
  CakeSlice,
  Salad,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
  CheckCircle,
  Receipt,
  User,
  Armchair,
  GitMerge,
  RefreshCw
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import './POS.css';

const categoryIcons = {
  all: UtensilsCrossed,
  burgers: Beef,
  pizzas: Pizza,
  beverages: Coffee,
  desserts: CakeSlice,
  sides: Salad
};

export const POS = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    cartTax,
    cartTotal,
    selectedTable,
    setSelectedTable,
    orderType,
    setOrderType,
    billingTables,
    checkoutOrder,
    releaseTable
  } = usePOS();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [receiptOrder, setReceiptOrder] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Filter products by category & search
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  // Current selected table info
  const currentTableObj = useMemo(() => {
    return billingTables.find((t) => t.name === selectedTable) || null;
  }, [billingTables, selectedTable]);

  const handleCheckout = (paymentMethod) => {
    if (cart.length === 0) return;
    const placedOrder = checkoutOrder(paymentMethod, customerName);
    if (placedOrder) {
      setReceiptOrder(placedOrder);
      setIsReceiptOpen(true);
    }
  };

  const handleFinishAndRelease = () => {
    if (receiptOrder && receiptOrder.type === 'Dine In' && receiptOrder.table) {
      releaseTable(receiptOrder.table);
    }
    setIsReceiptOpen(false);
  };

  return (
    <div className="pos-terminal-layout">
      {/* Left/Center Menu & Order Preparation View */}
      <div className="pos-menu-section">
        <Header title="Point of Sale" subtitle="Order booking and touch-screen billing station" />

        <div className="pos-menu-content">
          {/* Top Bar: Search & Categories */}
          <div className="pos-search-row">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search food by name, ingredient, category..."
            />
          </div>

          <div className="category-scroll-bar">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.id] || UtensilsCrossed;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className={`category-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Icon size={18} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Products Grid */}
          <div className="pos-products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="pos-empty-catalog">
                <UtensilsCrossed size={48} className="empty-icon" />
                <p>No delicious items found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Order Ticket & Summary Drawer */}
      <div className="pos-ticket-drawer">
        <div className="ticket-header">
          <div className="ticket-title-wrap">
            <h3 className="ticket-title">Current Order</h3>
            <span className="ticket-count">{cart.reduce((s, i) => s + i.quantity, 0)} items</span>
          </div>

          {cart.length > 0 && (
            <button className="clear-ticket-btn" onClick={clearCart} title="Clear cart">
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Order Type Tabs */}
        <div className="order-type-tabs">
          {['Dine In', 'Takeaway', 'Delivery'].map((type) => (
            <button
              key={type}
              className={`type-tab ${orderType === type ? 'active' : ''}`}
              onClick={() => setOrderType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Customer & Table details */}
        <div className="order-meta-box">
          <div className="meta-field">
            <User size={15} className="meta-icon" />
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Customer name"
            />
          </div>

          {orderType === 'Dine In' && (
            <div className="meta-field">
              <Armchair size={15} className="meta-icon" />
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
              >
                {billingTables.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.isMerged
                      ? `🔗 ${t.name} (Merged: ${t.chairs} Chairs)`
                      : `${t.name} (${t.chairs} Chairs)`}{' '}
                    - {t.status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Merged Table Seating Alert Banner */}
          {orderType === 'Dine In' && currentTableObj?.isMerged && (
            <div className="pos-merged-table-indicator">
              <GitMerge size={14} />
              <span>
                <strong>Merged Table ({currentTableObj.name}):</strong> {currentTableObj.chairs} Total Seats (One Unified Bill)
              </span>
            </div>
          )}
        </div>

        {/* Order Item List */}
        <div className="ticket-items-list">
          {cart.length === 0 ? (
            <div className="ticket-empty">
              <Receipt size={40} className="empty-icon" />
              <p>Your order is empty</p>
              <span>Click on any menu item on the left to add</span>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="ticket-item-row">
                <div className="ticket-item-info">
                  <span className="ticket-item-name">{item.name}</span>
                  <span className="ticket-item-unit">${item.price.toFixed(2)} each</span>
                </div>

                <div className="ticket-item-actions">
                  <div className="qty-counter">
                    <button onClick={() => updateQuantity(item.id, -1)}>
                      <Minus size={14} />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="ticket-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="delete-item-btn"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Bill Summary */}
        <div className="ticket-billing">
          <div className="bill-row">
            <span>Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>
          <div className="bill-row">
            <span>Tax (8%)</span>
            <span>${cartTax.toFixed(2)}</span>
          </div>
          <div className="bill-row grand-total">
            <span>Total Payable</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          {/* Payment Action Buttons */}
          <div className="payment-options">
            <button
              className="pay-btn cash"
              disabled={cart.length === 0}
              onClick={() => handleCheckout('Cash')}
            >
              <Banknote size={18} />
              <span>Cash</span>
            </button>
            <button
              className="pay-btn card"
              disabled={cart.length === 0}
              onClick={() => handleCheckout('Credit Card')}
            >
              <CreditCard size={18} />
              <span>Card</span>
            </button>
            <button
              className="pay-btn upi"
              disabled={cart.length === 0}
              onClick={() => handleCheckout('UPI / QR')}
            >
              <QrCode size={18} />
              <span>UPI / QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bill Receipt Modal with Release Table Workflow */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Payment Successful & Order Receipt"
        maxWidth="460px"
        footer={
          <div className="receipt-modal-actions">
            {receiptOrder?.type === 'Dine In' && (
              <button
                className="btn-release-table-modal"
                onClick={handleFinishAndRelease}
              >
                <RefreshCw size={15} />
                <span>Release Table ({receiptOrder.table})</span>
              </button>
            )}
            <button
              className="btn-primary"
              onClick={() => setIsReceiptOpen(false)}
            >
              Done & Keep Occupied
            </button>
          </div>
        }
      >
        {receiptOrder && (
          <div className="receipt-view">
            <div className="receipt-success-badge">
              <CheckCircle size={36} color="#10b981" />
              <h4>Order Received #{receiptOrder.id}</h4>
              <p>Kitchen ticket generated & payment settled</p>
            </div>

            <div className="receipt-details">
              <div className="receipt-info-line">
                <span>Customer:</span>
                <strong>{receiptOrder.customer}</strong>
              </div>
              <div className="receipt-info-line">
                <span>Table / Target:</span>
                <strong className="table-highlight-receipt">
                  {receiptOrder.table} ({receiptOrder.type})
                </strong>
              </div>
              <div className="receipt-info-line">
                <span>Time & Date:</span>
                <strong>{receiptOrder.date} - {receiptOrder.time}</strong>
              </div>
              <div className="receipt-info-line">
                <span>Payment Method:</span>
                <strong>{receiptOrder.paymentMethod}</strong>
              </div>
            </div>

            <div className="receipt-items-table">
              {receiptOrder.items.map((it) => (
                <div key={it.id} className="receipt-item-row">
                  <span>{it.quantity}x {it.name}</span>
                  <span>${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="receipt-total-highlight">
              <span>Grand Total</span>
              <span>${receiptOrder.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default POS;
