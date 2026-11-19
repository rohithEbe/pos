import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

  // Tables with schema migration for chairs & merge metadata
  const [tables, setTables] = useState(() => {
    const saved = storage.get('pos_tables', initialTables);
    return saved.map((t) => ({
      ...t,
      chairs: t.chairs || t.capacity || 4,
      isMerged: Boolean(t.isMerged),
      mergedGroupId: t.mergedGroupId || null,
      mergedGroupName: t.mergedGroupName || null
    }));
  });

  // Cart State for POS
  const [cart, setCart] = useState(() => storage.get('pos_cart', []));
  const [selectedTable, setSelectedTable] = useState('T1');
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
    { id: 1, customer: 'Alice Cooper', guests: 4, table: 'T5', date: '2026-11-20', time: '07:30 PM', status: 'Confirmed' },
    { id: 2, customer: 'Bruce Wayne', guests: 2, table: 'T7', date: '2026-11-20', time: '08:00 PM', status: 'Confirmed' },
    { id: 3, customer: 'Diana Prince', guests: 6, table: 'T4', date: '2026-11-21', time: '06:45 PM', status: 'Pending' }
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

  // Combined Billing Tables helper: returns individual unmerged tables + consolidated merged table groups
  const billingTables = useMemo(() => {
    const result = [];
    const processedGroups = new Set();

    tables.forEach((t) => {
      if (t.isMerged && t.mergedGroupId) {
        if (!processedGroups.has(t.mergedGroupId)) {
          processedGroups.add(t.mergedGroupId);
          const groupTables = tables.filter((item) => item.mergedGroupId === t.mergedGroupId);
          const totalChairs = groupTables.reduce((sum, item) => sum + (item.chairs || item.capacity || 4), 0);
          const isOccupied = groupTables.some((item) => item.status === 'occupied');
          const isReserved = groupTables.some((item) => item.status === 'reserved');
          const groupStatus = isOccupied ? 'occupied' : isReserved ? 'reserved' : 'available';
          const currentOrder = groupTables.find((item) => item.currentOrder)?.currentOrder || null;

          result.push({
            id: t.mergedGroupId,
            name: t.mergedGroupName || groupTables.map((g) => g.name).join(' + '),
            chairs: totalChairs,
            status: groupStatus,
            floor: t.floor,
            isMerged: true,
            mergedGroupId: t.mergedGroupId,
            memberTables: groupTables,
            currentOrder
          });
        }
      } else {
        result.push({
          id: t.id,
          name: t.name,
          chairs: t.chairs || t.capacity || 4,
          status: t.status,
          floor: t.floor,
          isMerged: false,
          memberTables: [t],
          currentOrder: t.currentOrder
        });
      }
    });

    return result;
  }, [tables]);

  // Table Management Actions
  const addTable = ({ name, chairs = 4, floor = 'Main Dining' }) => {
    const formattedName = name.trim();
    if (!formattedName) return false;

    // Check uniqueness
    const exists = tables.some((t) => t.name.toLowerCase() === formattedName.toLowerCase());
    if (exists) {
      alert(`A table named "${formattedName}" already exists!`);
      return false;
    }

    const newTable = {
      id: Date.now(),
      name: formattedName,
      chairs: parseInt(chairs, 10) || 4,
      status: 'available',
      floor,
      currentOrder: null,
      isMerged: false,
      mergedGroupId: null,
      mergedGroupName: null
    };

    setTables((prev) => [...prev, newTable]);
    return true;
  };

  const editTable = (tableId, updatedFields) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          return {
            ...t,
            name: updatedFields.name !== undefined ? updatedFields.name.trim() : t.name,
            chairs: updatedFields.chairs !== undefined ? parseInt(updatedFields.chairs, 10) : t.chairs,
            floor: updatedFields.floor !== undefined ? updatedFields.floor : t.floor,
            status: updatedFields.status !== undefined ? updatedFields.status : t.status
          };
        }
        return t;
      })
    );
  };

  const deleteTable = (tableId) => {
    const target = tables.find((t) => t.id === tableId);
    if (!target) return;

    if (target.status === 'occupied') {
      alert(`Cannot delete ${target.name} while it is currently occupied!`);
      return;
    }

    if (target.isMerged) {
      alert(`Please split the merged table group before deleting ${target.name}.`);
      return;
    }

    setTables((prev) => prev.filter((t) => t.id !== tableId));
  };

  const updateTableStatus = (tableId, newStatus) => {
    setTables((prev) => {
      const target = prev.find((t) => t.id === tableId);
      if (!target) return prev;

      // If part of merged group, update status for entire group
      if (target.isMerged && target.mergedGroupId) {
        return prev.map((t) =>
          t.mergedGroupId === target.mergedGroupId
            ? { ...t, status: newStatus, currentOrder: newStatus === 'available' ? null : t.currentOrder }
            : t
        );
      }

      return prev.map((t) =>
        t.id === tableId
          ? { ...t, status: newStatus, currentOrder: newStatus === 'available' ? null : t.currentOrder }
          : t
      );
    });
  };

  // Merge multiple tables
  const mergeTables = (tableIds) => {
    if (!tableIds || tableIds.length < 2) return false;

    const tablesToMerge = tables.filter((t) => tableIds.includes(t.id));
    if (tablesToMerge.length < 2) return false;

    // Check if any table is already merged
    const alreadyMerged = tablesToMerge.some((t) => t.isMerged);
    if (alreadyMerged) {
      alert('One or more selected tables are already part of a merged group. Split them first.');
      return false;
    }

    const mergedGroupId = `MG-${Date.now()}`;
    const mergedGroupName = tablesToMerge.map((t) => t.name).join(' + ');

    setTables((prev) =>
      prev.map((t) => {
        if (tableIds.includes(t.id)) {
          return {
            ...t,
            isMerged: true,
            mergedGroupId,
            mergedGroupName
          };
        }
        return t;
      })
    );

    return true;
  };

  // Split a merged group of tables
  const splitTables = (mergedGroupIdOrTableId) => {
    setTables((prev) => {
      // Find the group id
      let targetGroupId = mergedGroupIdOrTableId;
      if (typeof mergedGroupIdOrTableId === 'number') {
        const found = prev.find((t) => t.id === mergedGroupIdOrTableId);
        targetGroupId = found ? found.mergedGroupId : null;
      }

      if (!targetGroupId) return prev;

      return prev.map((t) => {
        if (t.mergedGroupId === targetGroupId) {
          return {
            ...t,
            isMerged: false,
            mergedGroupId: null,
            mergedGroupName: null,
            status: 'available',
            currentOrder: null
          };
        }
        return t;
      });
    });
  };

  // Release table after billing or dining complete
  const releaseTable = (tableNameOrId) => {
    setTables((prev) => {
      return prev.map((t) => {
        const matchesName = t.name === tableNameOrId || t.mergedGroupName === tableNameOrId;
        const matchesId = t.id === tableNameOrId || t.mergedGroupId === tableNameOrId;

        if (matchesName || matchesId) {
          return {
            ...t,
            status: 'available',
            currentOrder: null
          };
        }
        return t;
      });
    });
  };

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

    const assignedTableLabel = orderType === 'Dine In' ? selectedTable : orderType;

    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      customer: customerName,
      table: assignedTableLabel,
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
        prev.map((t) => {
          // If table name matches OR table is part of the merged group matching selectedTable
          const isDirectMatch = t.name === selectedTable;
          const isMergedGroupMatch = t.mergedGroupName && t.mergedGroupName === selectedTable;

          if (isDirectMatch || isMergedGroupMatch) {
            return {
              ...t,
              status: 'occupied',
              currentOrder: newOrder.id
            };
          }
          return t;
        })
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
        billingTables,
        addTable,
        editTable,
        deleteTable,
        updateTableStatus,
        mergeTables,
        splitTables,
        releaseTable,
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
