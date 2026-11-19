export const initialOrders = [
  {
    id: 'ORD-1001',
    customer: 'Michael Scott',
    table: 'Table 4',
    type: 'Dine In',
    items: [
      { id: 1, name: 'Classic Cheeseburger', quantity: 2, price: 9.99 },
      { id: 7, name: 'Truffle Parmesan Fries', quantity: 1, price: 6.99 },
      { id: 9, name: 'Iced Caramel Macchiato', quantity: 2, price: 5.25 }
    ],
    total: 37.47,
    status: 'Completed',
    paymentMethod: 'Credit Card',
    time: '12:30 PM',
    date: '2026-11-19'
  },
  {
    id: 'ORD-1002',
    customer: 'Dwight Schrute',
    table: 'Table 2',
    type: 'Dine In',
    items: [
      { id: 2, name: 'Double Bacon BBQ Burger', quantity: 1, price: 13.49 },
      { id: 10, name: 'Fresh Mint Lime Mocktail', quantity: 1, price: 4.75 }
    ],
    total: 18.24,
    status: 'Preparing',
    paymentMethod: 'Cash',
    time: '12:45 PM',
    date: '2026-11-19'
  },
  {
    id: 'ORD-1003',
    customer: 'Pam Beesly',
    table: 'Takeaway',
    type: 'Takeaway',
    items: [
      { id: 4, name: 'Margherita Artisan Pizza', quantity: 1, price: 14.50 },
      { id: 11, name: 'Molten Lava Chocolate Cake', quantity: 1, price: 7.99 }
    ],
    total: 22.49,
    status: 'Ready',
    paymentMethod: 'UPI / Online',
    time: '01:10 PM',
    date: '2026-11-19'
  },
  {
    id: 'ORD-1004',
    customer: 'Jim Halpert',
    table: 'Table 7',
    type: 'Dine In',
    items: [
      { id: 5, name: 'Pepperoni Inferno Pizza', quantity: 2, price: 16.99 },
      { id: 8, name: 'Caesar Salad Bowl', quantity: 1, price: 8.50 },
      { id: 9, name: 'Iced Caramel Macchiato', quantity: 2, price: 5.25 }
    ],
    total: 52.98,
    status: 'Pending',
    paymentMethod: 'Credit Card',
    time: '01:25 PM',
    date: '2026-11-19'
  }
];
