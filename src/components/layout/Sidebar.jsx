import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Home, Pill, Truck, Receipt, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const { activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen } = useStore();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home Overview', icon: <Home size={18} /> },
    { id: 'inventory', label: 'Medicine Stock', icon: <Pill size={18} /> },
    { id: 'suppliers', label: 'Suppliers & Wholesalers', icon: <Truck size={18} /> },
    { id: 'sales', label: 'Billing & New Sale', icon: <Receipt size={18} /> },
    { id: 'reports', label: 'Sales & Profit Reports', icon: <BarChart2 size={18} /> },
  ];

  return (
    <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <div className="brand">
        <div className="brand-icon">🏥</div>
        <div>
          <div className="brand-title">Swastik Pharmacy</div>
          <div className="brand-subtitle">Medical Store v1.0</div>
        </div>
      </div>

      <nav className="nav-menu">
        {navItems.map(item => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleTabClick(item.id);
            }}
          >
            <span className="nav-icon" style={{ display: 'flex', alignItems: 'center' }}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>Store Status: <span style={{ color: 'var(--accent-green)', fontWeight: 700 }}>● Ready for Sales</span></div>
        <div style={{ marginTop: '4px', fontWeight: 600, color: '#F26522' }}>✓ 100% Genuine Medicines</div>
        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>Bidupur Bazar, Vaishali</div>
      </div>
    </aside>
  );
};

export default Sidebar;
