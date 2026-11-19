import React from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export const SearchBar = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search dishes, drinks, appetizers...',
  className = ''
}) => {
  return (
    <div className={`pos-search-bar ${className}`}>
      <Search size={18} className="search-icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          className="clear-search-btn"
          onClick={() => (onClear ? onClear() : onChange(''))}
          type="button"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
