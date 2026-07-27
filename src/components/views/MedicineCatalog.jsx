import React, { useState } from 'react';
import InventoryTable from './InventoryTable';
import { Plus } from 'lucide-react';

const MedicineCatalog = () => {
  const [filter, setFilter] = useState('all');

  return (
    <>
      <div className="section-action-header">
        <h2 className="section-title">Medicine Catalog & Stock Control</h2>
        <div className="filter-group">
          <select 
            className="btn btn-secondary" 
            style={{ padding: '9px 14px' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Medicines</option>
            <option value="low-stock">Low Stock Only (&lt;10)</option>
            <option value="expired">Expired Only</option>
            <option value="expiring-soon">Expiring Soon (&lt;90 days)</option>
          </select>
          <button 
            className="btn btn-primary" 
            onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: 'modal-add-medicine' }))}
          >
            <Plus size={16} /> Add Medicine
          </button>
        </div>
      </div>

      <InventoryTable filter={filter === 'all' ? null : filter} />
    </>
  );
};

export default MedicineCatalog;
