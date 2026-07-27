import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BarChart2, DollarSign, Calendar } from 'lucide-react';

const Reports = () => {
  const { invoices } = useStore();

  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);
  const totalInvoices = invoices.length;
  
  // Calculate today's sales
  const today = new Date().toISOString().split('T')[0];
  const todaySales = invoices.filter(inv => inv.date.startsWith(today)).reduce((sum, inv) => sum + inv.grandTotal, 0);

  return (
    <>
      <div className="section-action-header">
        <h2 className="section-title">Sales & Profit Reports</h2>
      </div>

      <div className="metrics-grid" style={{ marginBottom: '20px' }}>
        <div className="metric-card">
          <div className="metric-icon-box green"><DollarSign /></div>
          <div className="metric-info">
            <span className="metric-label">Total Revenue</span>
            <span className="metric-value">{formatCurrency(totalRevenue)}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-box blue"><BarChart2 /></div>
          <div className="metric-info">
            <span className="metric-label">Today's Sales</span>
            <span className="metric-value">{formatCurrency(todaySales)}</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon-box purple"><Calendar /></div>
          <div className="metric-info">
            <span className="metric-label">Total Invoices Generated</span>
            <span className="metric-value">{totalInvoices}</span>
          </div>
        </div>
      </div>

      <div className="card-table-wrapper">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
          <span>Invoice History</span>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Date & Time</th>
              <th>Customer Name</th>
              <th>Payment Mode</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              invoices.map(inv => (
                <tr key={inv.id}>
                  <td><strong>{inv.id}</strong></td>
                  <td>{formatDate(inv.date)}</td>
                  <td>{inv.customerName || 'Walk-in Customer'}</td>
                  <td><span className={`badge badge-${inv.paymentMode === 'Cash' ? 'success' : 'info'}`}>{inv.paymentMode}</span></td>
                  <td>{inv.items.length}</td>
                  <td><strong style={{ color: 'var(--primary)' }}>{formatCurrency(inv.grandTotal)}</strong></td>
                  <td>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', fontSize: '0.76rem' }} 
                      onClick={() => window.dispatchEvent(new CustomEvent('open-receipt', { detail: inv }))}
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Reports;
