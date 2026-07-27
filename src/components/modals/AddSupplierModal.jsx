import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

const AddSupplierModal = () => {
  const { suppliers, setSuppliers, showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', contactPerson: '', phone: '', email: '', address: ''
  });

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail === 'modal-add-supplier') setIsOpen(true);
    };
    window.addEventListener('open-modal', handleOpen);
    return () => window.removeEventListener('open-modal', handleOpen);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSup = {
      ...formData,
      id: `SUP-${String(suppliers.length + 1).padStart(3, '0')}`
    };
    
    setSuppliers([...suppliers, newSup]);
    showToast(`Supplier ${newSup.name} added successfully!`, 'success');
    setIsOpen(false);
    setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Supplier</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Company Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Contact Person *</label>
                <input type="text" name="contactPerson" required value={formData.contactPerson} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <textarea name="address" rows="3" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', outline: 'none' }}></textarea>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Supplier</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplierModal;
