import React from 'react';
import { useStore } from '../../context/StoreContext';

const InventoryTable = ({ limit, filter }) => {
  const { medicines, setMedicines, searchQuery, showToast } = useStore();

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

  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

  const deleteMedicine = (id) => {
    if (window.confirm(`Are you sure you want to delete Medicine ${id}?`)) {
      setMedicines(prev => prev.filter(m => m.id !== id));
      showToast(`Medicine ${id} removed from stock`, 'warning');
    }
  };

  let filtered = medicines.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    
    if (!matchesSearch) return false;
    
    if (filter === 'low-stock') return m.quantity < 10;
    if (filter === 'expired') return isExpired(m.expiryDate);
    if (filter === 'expiring-soon') return !isExpired(m.expiryDate) && isExpiringSoon(m.expiryDate);
    return true;
  });

  if (limit) {
    filtered = filtered.slice(0, limit);
  }

  if (filtered.length === 0) {
    return (
      <div className="card-table-wrapper">
        <table className="custom-table">
          <tbody>
            <tr>
              <td colSpan="10" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                No medicines found matching criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="card-table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Medicine Name & Generic</th>
            <th>Category</th>
            <th>Batch</th>
            <th>Expiry Date</th>
            <th>Cost Price</th>
            <th>Retail Price</th>
            <th>Stock Qty</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => {
            const expired = isExpired(m.expiryDate);
            const expiring = !expired && isExpiringSoon(m.expiryDate);
            const lowStock = m.quantity < 10;

            let statusBadge = <span className="badge badge-success">In Stock</span>;
            if (expired) {
              statusBadge = <span className="badge badge-danger">Expired</span>;
            } else if (expiring) {
              statusBadge = <span className="badge badge-warning">Expiring Soon</span>;
            } else if (lowStock) {
              statusBadge = <span className="badge badge-danger">Low Stock ({m.quantity})</span>;
            }

            return (
              <tr key={m.id}>
                <td><strong>{m.id}</strong></td>
                <td>
                  <div style={{ fontWeight: 700, color: 'var(--apollo-navy)' }}>{m.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.genericName}</div>
                </td>
                <td><span className="badge badge-info">{m.category}</span></td>
                <td>{m.batchNumber}</td>
                <td>{m.expiryDate} {statusBadge}</td>
                <td>{formatCurrency(m.purchasePrice)}</td>
                <td><strong style={{ color: 'var(--primary)' }}>{formatCurrency(m.sellingPrice)}</strong></td>
                <td><strong style={{ color: lowStock ? 'var(--accent-red)' : 'inherit' }}>{m.quantity}</strong></td>
                <td>{m.rackLocation}</td>
                <td>
                  <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.76rem' }} onClick={() => deleteMedicine(m.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
