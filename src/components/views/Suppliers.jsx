import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus } from 'lucide-react';

const Suppliers = () => {
  const { suppliers, setSuppliers, searchQuery, showToast } = useStore();

  const deleteSupplier = (id) => {
    if (window.confirm(`Are you sure you want to delete Supplier ${id}?`)) {
      setSuppliers(prev => prev.filter(s => s.id !== id));
      showToast(`Supplier ${id} removed`, 'warning');
    }
  };

  const q = searchQuery.toLowerCase();
  const filtered = suppliers.filter(s => 
    !q || s.name.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
  );

  return (
    <>
      <div className="section-action-header">
        <h2 className="section-title">Pharmaceutical Supplier Directory</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => window.dispatchEvent(new CustomEvent('open-modal', { detail: 'modal-add-supplier' }))}
        >
          <Plus size={16} /> Add Supplier
        </button>
      </div>

      <div className="card-table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Supplier ID</th>
              <th>Company Name</th>
              <th>Contact Person</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px' }}>
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filtered.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.id}</strong></td>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.contactPerson}</td>
                  <td>{s.phone}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>
                    <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: '0.76rem' }} onClick={() => deleteSupplier(s.id)}>
                      Delete
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

export default Suppliers;
