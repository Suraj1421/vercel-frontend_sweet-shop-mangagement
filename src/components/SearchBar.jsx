import React, { useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [showFilters, setShowFilters] = useState(false);
  const hasActiveFilters = searchQuery.category || searchQuery.minPrice || searchQuery.maxPrice;

  const handleChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setSearchQuery({
      name: searchQuery.name,
      category: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  return (
    <div className="filter-panel">
      <div className="main-search">
        <div className="search-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            name="name"
            placeholder="Search products by name..."
            value={searchQuery.name}
            onChange={handleChange}
            className="search-field"
          />
        </div>
        <button 
          className={`filter-toggle ${hasActiveFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <FaFilter /> Filters
          {hasActiveFilters && <span className="filter-count"></span>}
        </button>
      </div>

      {showFilters && (
        <div className="advanced-filters">
          <div className="filter-row">
            <div className="filter-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="Filter by category"
                value={searchQuery.category}
                onChange={handleChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={searchQuery.minPrice}
                  onChange={handleChange}
                  className="filter-input"
                  min="0"
                  step="0.01"
                />
                <span className="price-divider">to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={searchQuery.maxPrice}
                  onChange={handleChange}
                  className="filter-input"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button className="clear-filters" onClick={clearFilters}>
                <FaTimes /> Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

