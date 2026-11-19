import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts, initialCategories } from '../data/products';
import { initialOrders } from '../data/orders';
import { initialTables } from '../data/tables';
import { storage } from '../utils/storage';

const POSContext = createContext();

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};

export const POSProvider = ({ children }) => {
  // Navigation
  const [currentPage, setCurrentPage] = useState('pos');

  // Products & Categories
  const [products, setProducts] = useState(() => storage.get('pos_products', initialProducts));
  const [categories, setCategories] = useState(() => storage.get('pos_categories', initialCategories));

  // Orders
  const [orders, setOrders] = useState(() => storage.get('pos_orders', initialOrders));

  // Tables
  const [tables, setTables] = useState(() => storage.get('pos_tables', initialTables));

  // Cart State for POS
  const [cart, setCart] = useState(() => storage.get('pos_cart', []));
  const [selectedTable, setSelectedTable] = useState('Table 1');
  const [orderType, setOrderType] = useState('Dine In'); // 'Dine In' | 'Takeaway' | 'Delivery'
  const [taxRate] = useState(0.08); // 8%

  // Customers
  const [customers, setCustomers] = useState(() => storage.get('pos_customers', [
    { id: 1, name: 'Michael Scott', email: 'michael@dundermifflin.com', phone: '+1 555-0199', visits: 14, totalSpent: 420.50 },
    { id: 2, name: 'Dwight Schrute', email: 'dwight@schrutebeetfarms.com', phone: '+1 555-0144', visits: 22, totalSpent: 680.00 },
    { id: 3, name: 'Pam Beesly', email: 'pam@artstudio.com', phone: '+1 555-0122', visits: 8, totalSpent: 195.20 },
    { id: 4, name: 'Jim Halpert', email: 'jim@athlead.com', phone: '+1 555-0177', visits: 12, totalSpent: 350.00 }
  ]));

  // Employees
  const [employees, setEmployees] = useState(() => storage.get('pos_employees', [
    { id: 1, name: 'Chef Gordon', role: 'Head Chef', shift: 'Morning', status: 'Active', pin: '1234' },
    { id: 2, name: 'Sarah Miller', role: 'Cashier / Manager', shift: 'Full Time', status: 'Active', pin: '2345' },
    { id: 3, name: 'Leo Vance', role: 'Head Waiter', shift: 'Evening', status: 'Active', pin: '3456' },
    { id: 4, name: 'Chloe Adams', role: 'Hostess', shift: 'Evening', status: 'Active', pin: '4567' }
  ]));

  // Reservations
  const [reservations, setReservations] = useState(() => storage.get('pos_reservations', [
    { id: 1, customer: 'Alice Cooper', guests: 4, table: 'Table 5', date: '2026-11-20', time: '07:30 PM', status: 'Confirmed' },
    { id: 2, customer: 'Bruce Wayne', guests: 2, table: 'Table 7', date: '2026-11-20', time: '08:00 PM', status: 'Confirmed' },
    { id: 3, customer: 'Diana Prince', guests: 6, table: 'Table 4', date: '2026-11-21', time: '06:45 PM', status: 'Pending' }
  ]));

  // Sync with LocalStorage
  useEffect(() => { storage.set('pos_products', products); }, [products]);
  useEffect(() => { storage.set('pos_categories', categories); }, [categories]);
  useEffect(() => { storage.set('pos_orders', orders); }, [orders]);
  useEffect(() => { storage.set('pos_tables', tables); }, [tables]);
  useEffect(() => { storage.set('pos_cart', cart); }, [cart]);
  useEffect(() => { storage.set('pos_customers', customers); }, [customers]);
  useEffect(() => { storage.set('pos_employees', employees); }, [employees]);
  useEffect(() => { storage.set('pos_reservations', reservations); }, [reservations]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartTax = cartSubtotal * taxRate;
  const cartTotal = cartSubtotal + cartTax;

  // Checkout order
  const checkoutOrder = (paymentMethod = 'Cash', customerName = 'Walk-in Guest') => {
    if (cart.length === 0) return null;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customer: customerName,
      table: orderType === 'Dine In' ? selectedTable : orderType,
      type: orderType,
      items: [...cart],
      total: Number(cartTotal.toFixed(2)),
      status: 'Preparing',
      paymentMethod,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0]
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update table status if dine-in
    if (orderType === 'Dine In') {
      setTables((prev) =>
        prev.map((t) => (t.name === selectedTable ? { ...t, status: 'occupied', currentOrder: newOrder.id } : t))
      );
    }

    clearCart();
    return newOrder;
  };

  // Product management
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 5.0,
      stock: Number(product.stock || 20)
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Table management
  const updateTableStatus = (tableId, newStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: newStatus } : t))
    );
  };

  // Order status
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <POSContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        products,
        setProducts,
        categories,
        setCategories,
        orders,
        setOrders,
        tables,
        setTables,
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
        checkoutOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        updateTableStatus,
        updateOrderStatus,
        customers,
        setCustomers,
        employees,
        setEmployees,
        reservations,
        setReservations
      }}
    >
      {children}
    </POSContext.Provider>
  );
};
