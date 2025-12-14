import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  FaStore,
  FaSignOutAlt,
  FaPlus,
  FaUserCircle,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import SweetCard from '../components/SweetCard';
import SweetModal from '../components/SweetModal';
import RestockModal from '../components/RestockModal';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [restockingSweet, setRestockingSweet] = useState(null);
  const [searchQuery, setSearchQuery] = useState({ 
    name: '', 
    category: '', 
    minPrice: '', 
    maxPrice: '' 
  });
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [searchQuery, sweets]);

  const fetchSweets = async () => {
    try {
      const response = await axios.get('/api/sweets');
      setSweets(response.data.sweets);
      setFilteredSweets(response.data.sweets);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery.name) params.append('name', searchQuery.name);
      if (searchQuery.category) params.append('category', searchQuery.category);
      if (searchQuery.minPrice) params.append('minPrice', searchQuery.minPrice);
      if (searchQuery.maxPrice) params.append('maxPrice', searchQuery.maxPrice);

      if (params.toString()) {
        const response = await axios.get(`/api/sweets/search?${params.toString()}`);
        setFilteredSweets(response.data.sweets);
      } else {
        setFilteredSweets(sweets);
      }
    } catch (error) {
      console.error('Error searching sweets:', error);
      // Fallback to showing all sweets if search fails
      setFilteredSweets(sweets);
    }
  };

  const handlePurchase = async (sweetId, quantity = 1) => {
    try {
      await axios.post(`/api/sweets/${sweetId}/purchase`, { quantity });
      fetchSweets();
      setToast({ message: 'Purchase successful!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Purchase failed', type: 'error' });
    }
  };

  const handleRestock = async (sweetId, quantity) => {
    try {
      await axios.post(`/api/sweets/${sweetId}/restock`, { quantity });
      fetchSweets();
      setShowRestockModal(false);
      setRestockingSweet(null);
      setToast({ message: `Successfully added ${quantity} items to stock!`, type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Restock failed', type: 'error' });
    }
  };

  const handleCreate = async (sweetData) => {
    try {
      await axios.post('/api/sweets', sweetData);
      fetchSweets();
      setShowModal(false);
      setToast({ message: 'Sweet created successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to create sweet', type: 'error' });
    }
  };

  const handleUpdate = async (sweetId, sweetData) => {
    try {
      await axios.put(`/api/sweets/${sweetId}`, sweetData);
      fetchSweets();
      setShowModal(false);
      setEditingSweet(null);
      setToast({ message: 'Sweet updated successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to update sweet', type: 'error' });
    }
  };

  const handleDelete = async (sweetId) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return;

    try {
      await axios.delete(`/api/sweets/${sweetId}`);
      fetchSweets();
      setToast({ message: 'Sweet deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: error.response?.data?.message || 'Failed to delete sweet', type: 'error' });
    }
  };

  const openCreateModal = () => {
    setEditingSweet(null);
    setShowModal(true);
  };

  const openEditModal = (sweet) => {
    setEditingSweet(sweet);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSweet(null);
  };

  const openRestockModal = (sweet) => {
    setRestockingSweet(sweet);
    setShowRestockModal(true);
  };

  const closeRestockModal = () => {
    setShowRestockModal(false);
    setRestockingSweet(null);
  };

  const stats = useMemo(() => {
    const totalItems = filteredSweets.length;
    const totalStock = filteredSweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
    const lowStock = filteredSweets.filter(sweet => sweet.quantity > 0 && sweet.quantity < 10).length;
    return { totalItems, totalStock, lowStock };
  }, [filteredSweets]);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <FaStore className="brand-icon" />
            <h2>Sweet Shop</h2>
          </div>
          <button 
            className="sidebar-close" 
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="sidebar-content">
          <div className="user-profile">
            <FaUserCircle className="user-avatar" />
            <div className="user-details">
              <p className="user-name">{user?.username}</p>
              {isAdmin() && <span className="role-badge">Administrator</span>}
            </div>
          </div>

          <div className="stats-section">
            <h3>Overview</h3>
            <div className="stat-item">
              <span className="stat-label">Total Items</span>
              <span className="stat-value">{stats.totalItems}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Stock</span>
              <span className="stat-value">{stats.totalStock}</span>
            </div>
            {isAdmin() && (
              <div className="stat-item">
                <span className="stat-label">Low Stock</span>
                <span className="stat-value warning">{stats.lowStock}</span>
              </div>
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      <div className="main-content">
        <header className="top-bar">
          <button 
            className="menu-toggle" 
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
          <h1 className="page-title">Product Catalog</h1>
          {isAdmin() && (
            <button onClick={openCreateModal} className="primary-action-btn">
              <FaPlus /> New Product
            </button>
          )}
        </header>

        <div className="content-wrapper">
          <div className="filters-section">
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loader"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              {filteredSweets.length === 0 ? (
                <div className="empty-catalog">
                  <div className="empty-icon-wrapper">
                    <FaStore />
                  </div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search filters</p>
                </div>
              ) : (
                <div className="products-container">
                  {filteredSweets.map((sweet) => (
                    <SweetCard
                      key={sweet._id}
                      sweet={sweet}
                      onPurchase={handlePurchase}
                      onEdit={isAdmin() ? openEditModal : null}
                      onDelete={isAdmin() ? handleDelete : null}
                      onRestock={isAdmin() ? openRestockModal : null}
                      isAdmin={isAdmin()}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {showModal && (
        <SweetModal
          sweet={editingSweet}
          onClose={closeModal}
          onSave={editingSweet ? handleUpdate : handleCreate}
        />
      )}

      {showRestockModal && restockingSweet && (
        <RestockModal
          sweet={restockingSweet}
          onClose={closeRestockModal}
          onRestock={handleRestock}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;

