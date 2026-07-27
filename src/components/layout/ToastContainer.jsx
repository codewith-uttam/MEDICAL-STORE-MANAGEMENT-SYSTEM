import React from 'react';
import { useStore } from '../../context/StoreContext';

const ToastContainer = () => {
  const { toasts } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" style={{ pointerEvents: 'auto' }}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span>
            {toast.type === 'success' && '✅'}
            {toast.type === 'warning' && '⚠️'}
            {toast.type === 'danger' && '🚨'}
            {toast.type === 'info' && 'ℹ️'}
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
