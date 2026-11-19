import React, { useState, useEffect } from 'react';
import { Bell, Clock, Search, Wifi, Sparkles, Moon, Sun } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import './Header.css';

export const Header = ({ title, subtitle, onSearch }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="pos-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
      </div>

      <div className="header-right">
        {onSearch && (
          <div className="header-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Quick search item, order, table..."
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        )}

        <div className="status-indicator">
          <span className="pulse-dot"></span>
          <span className="status-text">System Live</span>
        </div>

        <div className="clock-badge">
          <Clock size={16} className="clock-icon" />
          <div className="clock-details">
            <span className="clock-time">{formattedTime}</span>
            <span className="clock-date">{formattedDate}</span>
          </div>
        </div>

        <div className="header-actions">
          <button className="icon-badge-btn" title="Notifications">
            <Bell size={18} />
            <span className="dot"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
