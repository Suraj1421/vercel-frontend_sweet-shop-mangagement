import React from 'react';
import { 
  FaEdit, 
  FaTrash, 
  FaShoppingCart, 
  FaBox,
  FaTag,
  FaDollarSign
} from 'react-icons/fa';
import './SweetCard.css';

const SweetCard = ({ sweet, onPurchase, onEdit, onDelete, onRestock, isAdmin }) => {
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  const getStockStatus = () => {
    if (isOutOfStock) return { text: 'Out of Stock', className: 'status-unavailable' };
    if (isLowStock) return { text: 'Low Stock', className: 'status-warning' };
    return { text: 'In Stock', className: 'status-available' };
  };

  const stockStatus = getStockStatus();

  return (
    <article className={`product-card ${isOutOfStock ? 'unavailable' : ''}`}>
      <div className="card-header-section">
        <div className="product-title-group">
          <h3 className="product-name">{sweet.name}</h3>
          <span className={`stock-indicator ${stockStatus.className}`}>
            {stockStatus.text}
          </span>
        </div>
        <div className="category-tag">
          <FaTag className="tag-icon" />
          <span>{sweet.category}</span>
        </div>
      </div>

      <div className="card-body-section">
        <div className="pricing-info">
          <div className="price-display">
            <FaDollarSign className="currency-icon" />
            <span className="price-amount">{sweet.price.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="inventory-info">
          <FaBox className="inventory-icon" />
          <span className="inventory-text">
            {sweet.quantity} {sweet.quantity === 1 ? 'unit' : 'units'} available
          </span>
        </div>
      </div>

      <div className="card-footer-section">
        <button
          onClick={() => onPurchase(sweet._id, 1)}
          className="action-btn primary-action"
          disabled={isOutOfStock}
          aria-label={`Purchase ${sweet.name}`}
        >
          <FaShoppingCart />
          <span>Purchase</span>
        </button>

        {isAdmin && (
          <div className="admin-controls">
            <button 
              onClick={() => onEdit(sweet)} 
              className="control-btn edit-control" 
              title="Edit product"
              aria-label="Edit product"
            >
              <FaEdit />
            </button>
            <button 
              onClick={() => onRestock(sweet)} 
              className="control-btn restock-control" 
              title="Restock product"
              aria-label="Restock product"
            >
              <FaBox />
            </button>
            <button 
              onClick={() => onDelete(sweet._id)} 
              className="control-btn delete-control" 
              title="Delete product"
              aria-label="Delete product"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default SweetCard;


