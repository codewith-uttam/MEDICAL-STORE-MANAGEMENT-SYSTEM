import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Menu, Search, PlusCircle, Pill, User, LogOut } from 'lucide-react';

const TopBar = () => {
  const { userSession, logout, isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, searchQuery, setSearchQuery } = useStore();

  const titleMap = {
    'dashboard': 'Home Overview',
    'inventory': 'Medicine Stock',
    'suppliers': 'Suppliers & Wholesalers',
    'sales': 'Billing & New Sale',
    'reports': 'Sales & Profit Reports'
  };

  const title = titleMap[activeTab] || 'Home Overview';

  return (
    <header className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          id="mobile-menu-btn" 
          className="mobile-menu-btn" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={24} />
        </button>
        <h1 id="page-title" className="page-header-title">{title}</h1>
      </div>

      <div className="header-actions">
        <div className="search-box">
          <span className="search-icon"><Search size={16} /></span>
          <input 
            type="text" 
            id="global-search" 
            placeholder="Type medicine name, generic name, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={() => setActiveTab('sales')} 
          style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
        >
          <PlusCircle size={16} /> New Bill / Sale
        </button>
        <button 
          className="btn btn-primary" 
          onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: 'modal-add-medicine' }))}
        >
          <Pill size={16} /> Add New Medicine
        </button>
        
        <div className="user-profile-chip">
          <User size={16} />
          <span id="logged-user-name">{userSession?.username || 'Admin'}</span>
        </div>
        <button 
          className="btn btn-secondary" 
          onClick={logout} 
          style={{ padding: '8px 12px', fontSize: '0.8rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#FF8A8A', borderColor: 'rgba(239, 68, 68, 0.4)' }}
        >
          <LogOut size={14} /> Logout
        </button>
      </div>
    </header>
  );
};

export default TopBar;
