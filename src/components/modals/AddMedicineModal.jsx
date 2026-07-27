import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

const AddMedicineModal = () => {
  const { suppliers, medicines, setMedicines, showToast } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '', genericName: '', category: 'Tablet', supplierId: '',
    batchNumber: '', purchaseDate: '', expiryDate: '',
    purchasePrice: '', sellingPrice: '', quantity: '', rackLocation: ''
  });

  useEffect(() => {
    const handleOpen = (e) => {
      if (e.detail === 'modal-add-medicine') setIsOpen(true);
    };
    window.addEventListener('open-modal', handleOpen);
    return () => window.removeEventListener('open-modal', handleOpen);
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMed = {
      ...formData,
      id: `MED-${String(medicines.length + 1).padStart(3, '0')}`,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity, 10)
    };
    
    setMedicines([...medicines, newMed]);
    showToast(`Medicine ${newMed.name} added successfully!`, 'success');
    setIsOpen(false);
    setFormData({
      name: '', genericName: '', category: 'Tablet', supplierId: '',
      batchNumber: '', purchaseDate: '', expiryDate: '',
      purchasePrice: '', sellingPrice: '', quantity: '', rackLocation: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Medicine</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Medicine Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Generic Name</label>
                <input type="text" name="genericName" value={formData.genericName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" required value={formData.category} onChange={handleChange}>
                  <option>Tablet</option>
                  <option>Capsule</option>
                  <option>Syrup</option>
                  <option>Injection</option>
                  <option>Ointment</option>
                  <option>Drops</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Supplier *</label>
                <select name="supplierId" required value={formData.supplierId} onChange={handleChange}>
                  <option value="">-- Select Supplier --</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Batch Number *</label>
                <input type="text" name="batchNumber" required value={formData.batchNumber} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Expiry Date *</label>
                <input type="date" name="expiryDate" required value={formData.expiryDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Purchase Price (₹) *</label>
                <input type="number" step="0.01" name="purchasePrice" required value={formData.purchasePrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Selling Price (₹) *</label>
                <input type="number" step="0.01" name="sellingPrice" required value={formData.sellingPrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Quantity *</label>
                <input type="number" name="quantity" required value={formData.quantity} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Rack Location</label>
                <input type="text" name="rackLocation" value={formData.rackLocation} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Medicine</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicineModal;
