import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingCart, Plus, Minus, Trash2, Receipt } from 'lucide-react';

const POSBilling = () => {
  const { medicines, setMedicines, posCart, setPosCart, invoices, setInvoices, showToast } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash');
  const [medSearch, setMedSearch] = useState('');

  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

  const searchResults = medSearch.trim() === '' ? [] : medicines.filter(m => 
    (m.name.toLowerCase().includes(medSearch.toLowerCase()) || 
     m.id.toLowerCase().includes(medSearch.toLowerCase())) && 
    m.quantity > 0
  ).slice(0, 5);

  const addToCart = (med) => {
    const existing = posCart.find(item => item.id === med.id);
    if (existing) {
      if (existing.qty + 1 > med.quantity) {
        showToast(`Cannot add more. Only ${med.quantity} in stock!`, 'danger');
        return;
      }
      setPosCart(posCart.map(item => item.id === med.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setPosCart([...posCart, { ...med, qty: 1 }]);
    }
    setMedSearch('');
  };

  const updateCartQty = (id, delta) => {
    const med = medicines.find(m => m.id === id);
    setPosCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty > med.quantity) {
            showToast(`Only ${med.quantity} in stock!`, 'danger');
            return item;
          }
          if (newQty < 1) return null;
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id) => {
    setPosCart(posCart.filter(item => item.id !== id));
  };

  const subtotal = posCart.reduce((sum, item) => sum + (item.sellingPrice * item.qty), 0);
  const tax = subtotal * 0.12; // 12% GST
  const grandTotal = subtotal + tax;

  const handleCheckout = () => {
    if (posCart.length === 0) {
      showToast('Cart is empty!', 'danger');
      return;
    }

    // Generate Invoice
    const invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      customerName,
      customerPhone,
      paymentMode,
      items: [...posCart],
      subtotal,
      tax,
      grandTotal
    };

    setInvoices([invoice, ...invoices]);

    // Deduct stock
    setMedicines(prev => prev.map(m => {
      const cartItem = posCart.find(item => item.id === m.id);
      if (cartItem) {
        return { ...m, quantity: m.quantity - cartItem.qty };
      }
      return m;
    }));

    setPosCart([]);
    setCustomerName('');
    setCustomerPhone('');
    showToast(`Invoice ${invoice.id} generated successfully!`, 'success');
    window.dispatchEvent(new CustomEvent('open-receipt', { detail: invoice }));
  };

  return (
    <div className="pos-layout">
      {/* Search & Products */}
      <div className="pos-search-section">
        <h2 className="section-title">New Sale / Billing</h2>
        
        <div className="pos-search-box">
          <input 
            type="text" 
            placeholder="Search medicine to add (Name or ID)..." 
            value={medSearch}
            onChange={(e) => setMedSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="pos-search-results active">
              {searchResults.map(med => (
                <div key={med.id} className="pos-search-item" onClick={() => addToCart(med)}>
                  <div>
                    <strong>{med.name}</strong> 
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '10px' }}>Stock: {med.quantity}</span>
                  </div>
                  <strong>{formatCurrency(med.sellingPrice)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-table-wrapper" style={{ marginTop: '20px' }}>
          <table className="custom-table pos-cart-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posCart.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                    <div>Cart is empty. Search to add medicines.</div>
                  </td>
                </tr>
              ) : (
                posCart.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.id}</div>
                    </td>
                    <td>{formatCurrency(item.sellingPrice)}</td>
                    <td>
                      <div className="qty-control">
                        <button onClick={() => updateCartQty(item.id, -1)}><Minus size={14} /></button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, 1)}><Plus size={14} /></button>
                      </div>
                    </td>
                    <td><strong>{formatCurrency(item.sellingPrice * item.qty)}</strong></td>
                    <td>
                      <button className="btn" style={{ padding: '4px', color: 'var(--accent-red)' }} onClick={() => removeFromCart(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkout Sidebar */}
      <div className="pos-checkout-section">
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Payment Summary</h3>
        
        <div className="form-group">
          <label>Customer Name</label>
          <input type="text" placeholder="Walk-in Customer" value={customerName} onChange={e => setCustomerName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" placeholder="Enter phone" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Payment Mode</label>
          <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)}>
            <option>Cash</option>
            <option>UPI / QR</option>
            <option>Card</option>
          </select>
        </div>

        <div className="pos-totals">
          <div className="pos-total-row">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="pos-total-row">
            <span>GST (12%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div className="pos-total-row grand-total">
            <span>Grand Total:</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <button 
          className="btn btn-primary btn-checkout" 
          disabled={posCart.length === 0}
          onClick={handleCheckout}
        >
          <Receipt size={18} /> Checkout & Generate Bill
        </button>
      </div>
    </div>
  );
};

export default POSBilling;
