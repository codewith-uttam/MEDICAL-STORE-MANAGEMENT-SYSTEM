import React, { createContext, useState, useEffect, useContext } from 'react';

// Default initial data
const SEED_SUPPLIERS = [
  { id: "SUP-001", name: "Sun Pharma Distributors", contactPerson: "Rajesh Kumar", phone: "+91-9876543210", email: "orders@sunpharma.in", address: "Plot 12, Industrial Area, Patna, Bihar" },
  { id: "SUP-002", name: "Cipla Healthcare India", contactPerson: "Amit Sharma", phone: "+91-9812345678", email: "sales@ciplaindia.com", address: "Exhibition Road, Patna, Bihar" },
  { id: "SUP-003", name: "Mankind Pharma Supplies", contactPerson: "Pankaj Verma", phone: "+91-9934567890", email: "distributors@mankindpharma.in", address: "Station Road, Hajipur, Vaishali, Bihar" }
];

const SEED_MEDICINES = [
  { id: "MED-001", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Capsule", supplierId: "SUP-001", batchNumber: "AMX2026A", purchaseDate: "2025-01-10", expiryDate: "2027-06-30", purchasePrice: 45.00, sellingPrice: 75.00, quantity: 150, rackLocation: "Rack A-01" },
  { id: "MED-002", name: "Dolo 650mg", genericName: "Paracetamol", category: "Tablet", supplierId: "SUP-002", batchNumber: "PAR2025B", purchaseDate: "2025-03-15", expiryDate: "2028-02-28", purchasePrice: 15.00, sellingPrice: 30.00, quantity: 300, rackLocation: "Rack A-02" },
  { id: "MED-003", name: "Combiflam", genericName: "Ibuprofen & Paracetamol", category: "Tablet", supplierId: "SUP-001", batchNumber: "IBU2025C", purchaseDate: "2024-11-20", expiryDate: "2026-12-15", purchasePrice: 20.00, sellingPrice: 40.00, quantity: 8, rackLocation: "Rack A-03" },
  { id: "MED-004", name: "Benadryl Cough Syrup 100ml", genericName: "Diphenhydramine", category: "Syrup", supplierId: "SUP-003", batchNumber: "BEN2024D", purchaseDate: "2024-05-01", expiryDate: "2026-08-15", purchasePrice: 65.00, sellingPrice: 115.00, quantity: 45, rackLocation: "Rack B-01" },
  { id: "MED-005", name: "Lantus Insulin 100U/ml", genericName: "Insulin Glargine", category: "Injection", supplierId: "SUP-002", batchNumber: "INS2023E", purchaseDate: "2023-09-10", expiryDate: "2025-09-10", purchasePrice: 480.00, sellingPrice: 650.00, quantity: 12, rackLocation: "Fridge 01" },
  { id: "MED-006", name: "Pantocid 40mg", genericName: "Pantoprazole", category: "Tablet", supplierId: "SUP-001", batchNumber: "OMP2026F", purchaseDate: "2025-02-01", expiryDate: "2027-10-31", purchasePrice: 55.00, sellingPrice: 95.00, quantity: 90, rackLocation: "Rack C-02" },
  { id: "MED-007", name: "Azithral 500mg", genericName: "Azithromycin", category: "Tablet", supplierId: "SUP-003", batchNumber: "AZI2025G", purchaseDate: "2025-04-10", expiryDate: "2027-04-10", purchasePrice: 70.00, sellingPrice: 120.00, quantity: 5, rackLocation: "Rack A-04" },
  { id: "MED-008", name: "Betnovate-N Cream 20g", genericName: "Betamethasone & Neomycin", category: "Ointment", supplierId: "SUP-002", batchNumber: "HYD2026H", purchaseDate: "2025-01-15", expiryDate: "2027-01-15", purchasePrice: 35.00, sellingPrice: 60.00, quantity: 60, rackLocation: "Rack D-01" }
];

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [suppliers, setSuppliers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [posCart, setPosCart] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSession, setUserSession] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load state from localStorage on mount
  useEffect(() => {
    const isZeroSales = localStorage.getItem('swastik_zero_sales_v2');
    if (!isZeroSales) {
      localStorage.removeItem('pharma_invoices');
      localStorage.setItem('swastik_zero_sales_v2', 'true');
    }

    const savedSuppliers = localStorage.getItem('pharma_suppliers');
    const savedMedicines = localStorage.getItem('pharma_medicines');
    const savedInvoices = localStorage.getItem('pharma_invoices');
    const savedSession = localStorage.getItem('swastik_user_session');

    setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : [...SEED_SUPPLIERS]);
    setMedicines(savedMedicines ? JSON.parse(savedMedicines) : [...SEED_MEDICINES]);
    setInvoices(savedInvoices ? JSON.parse(savedInvoices) : []);
    if (savedSession) {
      setUserSession(JSON.parse(savedSession));
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (suppliers.length > 0) localStorage.setItem('pharma_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    if (medicines.length > 0) localStorage.setItem('pharma_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('pharma_invoices', JSON.stringify(invoices));
  }, [invoices]);

  // Toast utility
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const login = (username, password) => {
    if (username && (password === 'swastik123' || password === 'admin123' || password.length > 0)) {
      const sessionUser = { username, loginTime: new Date().toISOString() };
      localStorage.setItem('swastik_user_session', JSON.stringify(sessionUser));
      setUserSession(sessionUser);
      showToast(`Welcome back, ${username}! 🔓`, 'success');
      return true;
    }
    showToast('Invalid credentials! Try demo: admin / swastik123', 'danger');
    return false;
  };

  const logout = () => {
    if (window.confirm("Are you sure you want to log out of Swastik Pharmacy Dashboard?")) {
      localStorage.removeItem('swastik_user_session');
      setUserSession(null);
      showToast('Logged out successfully 👋', 'info');
    }
  };

  return (
    <StoreContext.Provider value={{
      suppliers, setSuppliers,
      medicines, setMedicines,
      invoices, setInvoices,
      posCart, setPosCart,
      activeTab, setActiveTab,
      userSession, login, logout,
      toasts, showToast,
      isSidebarOpen, setIsSidebarOpen,
      searchQuery, setSearchQuery
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
