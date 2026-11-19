import React from 'react';
import { Plus, Star } from 'lucide-react';
import './ProductCard.css';

export const ProductCard = ({ product, onAddToCart, onEdit, compact = false }) => {
  return (
    <div className={`pos-product-card ${compact ? 'compact' : ''}`} onClick={() => onAddToCart && onAddToCart(product)}>
      <div className="product-image-container">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        {product.rating && (
          <div className="product-rating">
            <Star size={12} fill="#eab308" color="#eab308" />
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      <div className="product-info">
        <h4 className="product-name">{product.name}</h4>
        {product.description && !compact && (
          <p className="product-desc">{product.description}</p>
        )}

        <div className="product-bottom">
          <div className="product-pricing">
            <span className="currency">$</span>
            <span className="price-amount">{product.price.toFixed(2)}</span>
          </div>

          <button
            className="add-btn"
            title="Add to order"
            onClick={(e) => {
              e.stopPropagation();
              if (onAddToCart) onAddToCart(product);
            }}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
