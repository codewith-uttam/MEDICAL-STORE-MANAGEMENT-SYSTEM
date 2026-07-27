import React, { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';

const ReceiptModal = () => {
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const handleOpen = (e) => {
      setInvoice(e.detail);
    };
    window.addEventListener('open-receipt', handleOpen);
    return () => window.removeEventListener('open-receipt', handleOpen);
  }, []);

  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

  if (!invoice) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header hide-on-print">
          <h2>Sales Receipt</h2>
          <button className="close-btn" onClick={() => setInvoice(null)}>&times;</button>
        </div>
        
        <div className="modal-body print-area" id="print-receipt-content" style={{ fontFamily: 'monospace', padding: '20px', background: 'white', color: 'black' }}>
          <div style={{ textAlign: 'center', marginBottom: '15px', borderBottom: '1px dashed #ccc', paddingBottom: '10px' }}>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '1.2rem' }}>SWASTIK PHARMACY</h2>
            <p style={{ margin: '0', fontSize: '0.85rem' }}>Bidupur Bazar, Vaishali, Bihar</p>
            <p style={{ margin: '0', fontSize: '0.85rem' }}>Ph: +91-9999999999</p>
            <p style={{ margin: '0', fontSize: '0.85rem' }}>GSTIN: 10AAAAA0000A1Z5</p>
          </div>
          
          <div style={{ fontSize: '0.85rem', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Invoice: {invoice.id}</span>
              <span>Date: {new Date(invoice.date).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Customer: {invoice.customerName || 'Walk-in'}</span>
              <span>Time: {new Date(invoice.date).toLocaleTimeString()}</span>
            </div>
            <div>Payment Mode: {invoice.paymentMode}</div>
          </div>

          <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr style={{ borderTop: '1px dashed #ccc', borderBottom: '1px dashed #ccc' }}>
                <th style={{ padding: '5px 0' }}>Item</th>
                <th style={{ padding: '5px 0', textAlign: 'center' }}>Qty</th>
                <th style={{ padding: '5px 0', textAlign: 'right' }}>Price</th>
                <th style={{ padding: '5px 0', textAlign: 'right' }}>Amt</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id}>
                  <td style={{ padding: '5px 0' }}>{item.name}</td>
                  <td style={{ padding: '5px 0', textAlign: 'center' }}>{item.qty}</td>
                  <td style={{ padding: '5px 0', textAlign: 'right' }}>{item.sellingPrice.toFixed(2)}</td>
                  <td style={{ padding: '5px 0', textAlign: 'right' }}>{(item.sellingPrice * item.qty).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ fontSize: '0.85rem', textAlign: 'right', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>CGST + SGST (12%):</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', marginTop: '5px', borderTop: '1px solid #ccc', paddingTop: '5px' }}>
              <span>Grand Total:</span>
              <span>{formatCurrency(invoice.grandTotal)}</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem', fontStyle: 'italic' }}>
            Thank you for shopping with us!<br/>
            Get well soon! ⚕️
          </div>
        </div>
        
        <div className="modal-footer hide-on-print">
          <button type="button" className="btn btn-secondary" onClick={() => setInvoice(null)}>Close</button>
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Print Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
