# GourmetPOS - Modern Restaurant Management & Point of Sale System

A high-performance, responsive Restaurant Point of Sale (POS) and operations suite built with **React**, **Vite**, and **Lucide Icons**.

## 🚀 Features

- **Touch-optimized POS Terminal**: Real-time product selection, live order cart calculation, multi-payment checkout (Cash, Card, UPI/QR), and receipt generation.
- **Manager Dashboard**: Instant KPI analytics (daily sales, active tables, kitchen queue, bestsellers).
- **Interactive Floor & Tables Plan**: Live table occupancy tracking (Available, Occupied, Reserved) across dining zones.
- **Kitchen & Order Queue**: Live order pipeline (Pending, Preparing, Ready, Completed).
- **Menu & Product Management**: Real-time add, edit, and delete food items with inventory stock levels.
- **Food Categories**: Customizable menu categorization with visual iconography.
- **Reservations**: Table scheduling and booking management.
- **Customer CRM**: Regular diner database, contact records, and lifetime loyalty metrics.
- **Staff & Shift Management**: Employee roster, role allocation, and POS PIN access.
- **Reports & Analytics**: Payment distribution and channel breakdown.
- **System Settings**: Restaurant branding, sales tax rules, and local storage data management.

## 📁 Project Structure

```text
restaurant-pos/
├── public/
│   └── images/
│       ├── food/
│       ├── categories/
│       └── logo.png
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── Sidebar.jsx & Sidebar.css
│   │   ├── Header.jsx & Header.css
│   │   ├── StatCard.jsx & StatCard.css
│   │   ├── ProductCard.jsx & ProductCard.css
│   │   ├── SearchBar.jsx & SearchBar.css
│   │   ├── Modal.jsx & Modal.css
│   │   └── DataTable.jsx & DataTable.css
│   ├── pages/
│   │   ├── Dashboard.jsx & Dashboard.css
│   │   ├── POS.jsx & POS.css
│   │   ├── Products.jsx & Products.css
│   │   ├── Categories.jsx & Categories.css
│   │   ├── Orders.jsx & Orders.css
│   │   ├── Tables.jsx & Tables.css
│   │   ├── Reservations.jsx & Reservations.css
│   │   ├── Customers.jsx & Customers.css
│   │   ├── Employees.jsx & Employees.css
│   │   ├── Reports.jsx & Reports.css
│   │   └── Settings.jsx & Settings.css
│   ├── data/
│   │   ├── products.js
│   │   ├── orders.js
│   │   └── tables.js
│   ├── context/
│   │   └── POSContext.jsx
│   ├── utils/
│   │   └── storage.js
│   ├── App.jsx & App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── index.html
```

## 🛠️ Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
