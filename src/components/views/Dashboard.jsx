import React from 'react';
import { useStore } from '../../context/StoreContext';
import InventoryTable from './InventoryTable';
import { Pill, AlertTriangle, Clock, Truck, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { medicines, suppliers, invoices, setActiveTab } = useStore();

  const isExpired = (expiryDateStr) => {
    const today = new Date().toISOString().split('T')[0];
    return expiryDateStr < today;
  };

  const isExpiringSoon = (expiryDateStr) => {
    const today = new Date();
    const expDate = new Date(expiryDateStr);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 90;
  };

  const totalMeds = medicines.length;
  const lowStockCount = medicines.filter(m => m.quantity < 10).length;
  const expiredCount = medicines.filter(m => isExpired(m.expiryDate)).length;
  const expiringSoonCount = medicines.filter(m => !isExpired(m.expiryDate) && isExpiringSoon(m.expiryDate)).length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

  return (
    <>
      <div className="welcome-banner">
        <div>
          <div className="welcome-title">Welcome back, Swastik Medical Store 👋</div>
          <div className="welcome-sub">Bidupur Bazar, Vaishali | Today's sales counter & live stock status</div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary" onClick={() => setActiveTab('sales')}>⚡ Create New Bill</button>
          <button className="btn btn-secondary" onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: 'modal-add-medicine' }))}>💊 Add Medicine</button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box blue"><Pill /></div>
          <div className="metric-info">
            <span className="metric-label">Total Medicines</span>
            <span className="metric-value">{totalMeds}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-box yellow"><AlertTriangle /></div>
          <div className="metric-info">
            <span className="metric-label">Low Stock Alerts (&lt;10)</span>
            <span className="metric-value">{lowStockCount}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-box red"><Clock /></div>
          <div className="metric-info">
            <span className="metric-label">Expired / Expiring Soon</span>
            <span className="metric-value">{expiredCount + expiringSoonCount}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-box purple"><Truck /></div>
          <div className="metric-info">
            <span className="metric-label">Active Suppliers</span>
            <span className="metric-value">{suppliers.length}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-box green"><DollarSign /></div>
          <div className="metric-info">
            <span className="metric-label">Total Gross Sales</span>
            <span className="metric-value">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
      </div>

      <div className="section-action-header">
        <h2 className="section-title">Critical Inventory Overview</h2>
        <button className="btn btn-secondary" onClick={() => setActiveTab('inventory')}>View All Medicines →</button>
      </div>

      <InventoryTable limit={5} filter="low-stock" />
    </>
  );
};

export default Dashboard;
