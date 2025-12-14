import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import './RestockModal.css';

const RestockModal = ({ sweet, onClose, onRestock }) => {
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const qty = parseInt(quantity);
    if (qty && qty > 0) {
      onRestock(sweet._id, qty);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="restock-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="restock-modal-header">
          <h2>Restock {sweet?.name}</h2>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="restock-modal-form">
          <div className="form-group">
            <label htmlFor="quantity">Quantity to Add</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="1"
              placeholder="Enter quantity"
              autoFocus
            />
            <p className="form-hint">Current stock: {sweet?.quantity || 0}</p>
          </div>

          <div className="restock-modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="restock-submit-button">
              Add Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestockModal;

