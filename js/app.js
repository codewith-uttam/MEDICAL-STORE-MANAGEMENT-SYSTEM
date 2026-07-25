/**
 * Swastik Medical Store - Management System Engine (Indian Localization)
 * Fully featured JavaScript application with INR (₹) currency & Indian supplier/medicine seed data.
 */

// Initial Seed Data (Indian Context)
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

const SEED_INVOICES = [
  {
    id: "INV-0001",
    date: "2026-07-20 14:30:00",
    customerName: "Rahul Kumar",
    customerPhone: "+91-9835012345",
    doctorName: "Dr. A.K. Singh (MBBS, MD)",
    subtotal: 180.00,
    taxRate: 5.0,
    discountRate: 5.0,
    taxAmount: 9.00,
    discountAmount: 9.00,
    grandTotal: 180.00,
    items: [
      { medicineId: "MED-001", name: "Amoxicillin 500mg", batchNumber: "AMX2026A", quantity: 2, unitPrice: 75.00, total: 150.00 },
      { medicineId: "MED-002", name: "Dolo 650mg", batchNumber: "PAR2025B", quantity: 1, unitPrice: 30.00, total: 30.00 }
    ]
  }
];

// App State
let state = {
  suppliers: [],
  medicines: [],
  invoices: [],
  activeTab: 'dashboard',
  inventoryFilter: 'all',
  searchQuery: ''
};

// Initialize State
function initState() {
  const isIndianFormat = localStorage.getItem('swastik_indian_v1');
  if (!isIndianFormat) {
    localStorage.removeItem('pharma_suppliers');
    localStorage.removeItem('pharma_medicines');
    localStorage.removeItem('pharma_invoices');
    localStorage.setItem('swastik_indian_v1', 'true');
  }

  const savedSuppliers = localStorage.getItem('pharma_suppliers');
  const savedMedicines = localStorage.getItem('pharma_medicines');
  const savedInvoices = localStorage.getItem('pharma_invoices');

  state.suppliers = savedSuppliers ? JSON.parse(savedSuppliers) : [...SEED_SUPPLIERS];
  state.medicines = savedMedicines ? JSON.parse(savedMedicines) : [...SEED_MEDICINES];
  state.invoices = savedInvoices ? JSON.parse(savedInvoices) : [...SEED_INVOICES];

  saveState();
}

function saveState() {
  localStorage.setItem('pharma_suppliers', JSON.stringify(state.suppliers));
  localStorage.setItem('pharma_medicines', JSON.stringify(state.medicines));
  localStorage.setItem('pharma_invoices', JSON.stringify(state.invoices));
}

// Utility Functions
function isExpired(expiryDateStr) {
  const today = new Date().toISOString().split('T')[0];
  return expiryDateStr < today;
}

function isExpiringSoon(expiryDateStr) {
  const today = new Date();
  const expDate = new Date(expiryDateStr);
  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 90;
}

function formatCurrency(amount) {
  return '₹' + Number(amount).toFixed(2);
}

// UI Render Engine
function renderApp() {
  renderMetrics();
  renderInventoryTable();
  renderSuppliersTable();
  renderInvoicesTable();
  renderReports();
  populateInvoiceMedicineSelects();
}

function renderMetrics() {
  const totalMeds = state.medicines.length;
  const lowStockCount = state.medicines.filter(m => m.quantity < 10).length;
  const expiredCount = state.medicines.filter(m => isExpired(m.expiryDate)).length;
  const expiringSoonCount = state.medicines.filter(m => !isExpired(m.expiryDate) && isExpiringSoon(m.expiryDate)).length;
  const totalRevenue = state.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

  document.getElementById('metric-total-meds').textContent = totalMeds;
  document.getElementById('metric-low-stock').textContent = lowStockCount;
  document.getElementById('metric-expired').textContent = expiredCount + expiringSoonCount;
  document.getElementById('metric-total-suppliers').textContent = state.suppliers.length;
  document.getElementById('metric-total-sales').textContent = formatCurrency(totalRevenue);
}

function renderInventoryTable() {
  const tbody = document.getElementById('inventory-tbody');
  if (!tbody) return;

  let filtered = state.medicines.filter(m => {
    const q = state.searchQuery.toLowerCase();
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.id.toLowerCase().includes(q) || m.category.toLowerCase().includes(q);
    
    if (!matchesSearch) return false;
    
    if (state.inventoryFilter === 'low-stock') return m.quantity < 10;
    if (state.inventoryFilter === 'expired') return isExpired(m.expiryDate);
    if (state.inventoryFilter === 'expiring-soon') return !isExpired(m.expiryDate) && isExpiringSoon(m.expiryDate);
    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 30px;">No medicines found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(m => {
    const expired = isExpired(m.expiryDate);
    const expiring = !expired && isExpiringSoon(m.expiryDate);
    const lowStock = m.quantity < 10;

    let statusBadge = `<span class="badge badge-success">In Stock</span>`;
    if (expired) {
      statusBadge = `<span class="badge badge-danger">Expired</span>`;
    } else if (expiring) {
      statusBadge = `<span class="badge badge-warning">Expiring Soon</span>`;
    } else if (lowStock) {
      statusBadge = `<span class="badge badge-danger">Low Stock (${m.quantity})</span>`;
    }

    return `
      <tr>
        <td><strong>${m.id}</strong></td>
        <td>
          <div style="font-weight: 600;">${m.name}</div>
          <div style="font-size: 0.76rem; color: var(--text-dim);">${m.genericName}</div>
        </td>
        <td><span class="badge badge-info">${m.category}</span></td>
        <td>${m.batchNumber}</td>
        <td>${m.expiryDate} ${statusBadge}</td>
        <td>${formatCurrency(m.purchasePrice)}</td>
        <td><strong>${formatCurrency(m.sellingPrice)}</strong></td>
        <td><strong style="color: ${lowStock ? 'var(--accent-red)' : 'inherit'};">${m.quantity}</strong></td>
        <td>${m.rackLocation}</td>
        <td>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.76rem;" onclick="deleteMedicine('${m.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderSuppliersTable() {
  const tbody = document.getElementById('suppliers-tbody');
  if (!tbody) return;

  const q = state.searchQuery.toLowerCase();
  let filtered = state.suppliers.filter(s => 
    !q || s.name.toLowerCase().includes(q) || s.contactPerson.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
  );

  tbody.innerHTML = filtered.map(s => `
    <tr>
      <td><strong>${s.id}</strong></td>
      <td><strong>${s.name}</strong></td>
      <td>${s.contactPerson}</td>
      <td>${s.phone}</td>
      <td>${s.email}</td>
      <td>${s.address}</td>
      <td>
        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.76rem;" onclick="deleteSupplier('${s.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderInvoicesTable() {
  const tbody = document.getElementById('invoices-tbody');
  if (!tbody) return;

  tbody.innerHTML = state.invoices.map(inv => `
    <tr>
      <td><strong>${inv.id}</strong></td>
      <td>${inv.date}</td>
      <td>${inv.customerName} (${inv.customerPhone})</td>
      <td>${inv.doctorName || 'N/A'}</td>
      <td>${inv.items.length} items</td>
      <td><strong>${formatCurrency(inv.grandTotal)}</strong></td>
      <td>
        <button class="btn btn-primary" style="padding: 4px 10px; font-size: 0.76rem;" onclick="viewInvoiceReceipt('${inv.id}')">Receipt</button>
      </td>
    </tr>
  `).join('');
}

function renderReports() {
  const reportContent = document.getElementById('report-analytics-container');
  if (!reportContent) return;

  let totalInvValuation = state.medicines.reduce((sum, m) => sum + (m.purchasePrice * m.quantity), 0);
  let totalInvRetailVal = state.medicines.reduce((sum, m) => sum + (m.sellingPrice * m.quantity), 0);
  let estProfitMargin = totalInvRetailVal - totalInvValuation;

  reportContent.innerHTML = `
    <div class="metrics-grid" style="margin-bottom: 24px;">
      <div class="metric-card">
        <div class="metric-icon-box blue">📊</div>
        <div class="metric-info">
          <span class="metric-label">Inventory Purchase Value</span>
          <span class="metric-value">${formatCurrency(totalInvValuation)}</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box green">💰</div>
        <div class="metric-info">
          <span class="metric-label">Inventory Retail Potential</span>
          <span class="metric-value">${formatCurrency(totalInvRetailVal)}</span>
        </div>
      </div>
      <div class="metric-card">
        <div class="metric-icon-box purple">📈</div>
        <div class="metric-info">
          <span class="metric-label">Projected Margin</span>
          <span class="metric-value">${formatCurrency(estProfitMargin)}</span>
        </div>
      </div>
    </div>
  `;
}

// Human-Friendly Toast Notification System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const icons = {
    success: '✅',
    warning: '⚠️',
    danger: '🚨',
    info: 'ℹ️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Operations & Handlers
function deleteMedicine(id) {
  if (confirm(`Are you sure you want to delete Medicine ${id}?`)) {
    state.medicines = state.medicines.filter(m => m.id !== id);
    saveState();
    renderApp();
    showToast(`Medicine ${id} removed from stock`, 'warning');
  }
}

function deleteSupplier(id) {
  if (confirm(`Are you sure you want to delete Supplier ${id}?`)) {
    state.suppliers = state.suppliers.filter(s => s.id !== id);
    saveState();
    renderApp();
    showToast(`Supplier ${id} removed`, 'warning');
  }
}

// Modal Handlers
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// Add Medicine Form
function handleAddMedicineSubmit(e) {
  e.preventDefault();
  const newMed = {
    id: `MED-00${state.medicines.length + 1}`,
    name: document.getElementById('med-name').value,
    genericName: document.getElementById('med-generic').value,
    category: document.getElementById('med-category').value,
    supplierId: document.getElementById('med-supplier').value,
    batchNumber: document.getElementById('med-batch').value,
    purchaseDate: document.getElementById('med-pdate').value,
    expiryDate: document.getElementById('med-edate').value,
    purchasePrice: parseFloat(document.getElementById('med-pprice').value),
    sellingPrice: parseFloat(document.getElementById('med-sprice').value),
    quantity: parseInt(document.getElementById('med-qty').value),
    rackLocation: document.getElementById('med-rack').value
  };

  state.medicines.push(newMed);
  saveState();
  renderApp();
  closeModal('modal-add-medicine');
  e.target.reset();
  showToast(`Medicine "${newMed.name}" added to stock! 💊`, 'success');
}

// Add Supplier Form
function handleAddSupplierSubmit(e) {
  e.preventDefault();
  const newSup = {
    id: `SUP-00${state.suppliers.length + 1}`,
    name: document.getElementById('sup-name').value,
    contactPerson: document.getElementById('sup-contact').value,
    phone: document.getElementById('sup-phone').value,
    email: document.getElementById('sup-email').value,
    address: document.getElementById('sup-address').value
  };

  state.suppliers.push(newSup);
  saveState();
  renderApp();
  closeModal('modal-add-supplier');
  e.target.reset();
  showToast(`Supplier "${newSup.name}" added to directory! 🚚`, 'success');
}

// POS Counter Engine
let posCart = [];

function populateInvoiceMedicineSelects() {
  const supSelect = document.getElementById('med-supplier');
  if (supSelect) {
    supSelect.innerHTML = state.suppliers.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
  }

  const posMedSelect = document.getElementById('pos-medicine-select');
  if (posMedSelect) {
    const inStock = state.medicines.filter(m => m.quantity > 0 && !isExpired(m.expiryDate));
    if (inStock.length === 0) {
      posMedSelect.innerHTML = `<option value="">No available medicines in stock</option>`;
    } else {
      posMedSelect.innerHTML = inStock.map(m => 
        `<option value="${m.id}">${m.name} [${m.batchNumber}] - Stock: ${m.quantity} - ₹${m.sellingPrice.toFixed(2)}</option>`
      ).join('');
    }
  }
}

function addItemToPosCart() {
  const medSelect = document.getElementById('pos-medicine-select');
  const qtyInput = document.getElementById('pos-qty-input');
  
  if (!medSelect || !medSelect.value) {
    showToast("Please select a valid medicine in stock!", "warning");
    return;
  }
  
  const medId = medSelect.value;
  const qty = parseInt(qtyInput.value) || 1;
  
  const med = state.medicines.find(m => m.id === medId);
  if (!med) return;

  if (qty > med.quantity) {
    showToast(`Insufficient stock! Only ${med.quantity} units of ${med.name} available.`, "danger");
    return;
  }

  const existingItemIndex = posCart.findIndex(item => item.medicineId === medId);
  if (existingItemIndex > -1) {
    const newQty = posCart[existingItemIndex].quantity + qty;
    if (newQty > med.quantity) {
      showToast(`Cannot add more. Total in cart (${newQty}) exceeds stock (${med.quantity}).`, "danger");
      return;
    }
    posCart[existingItemIndex].quantity = newQty;
    posCart[existingItemIndex].total = newQty * med.sellingPrice;
  } else {
    posCart.push({
      medicineId: med.id,
      name: med.name,
      batchNumber: med.batchNumber,
      quantity: qty,
      unitPrice: med.sellingPrice,
      total: qty * med.sellingPrice
    });
  }

  renderPosCart();
  showToast(`Added ${qty}x "${med.name}" to bill! 🛒`, "success");
}

function removePosCartItem(index) {
  const item = posCart[index];
  posCart.splice(index, 1);
  renderPosCart();
  if (item) showToast(`Removed "${item.name}" from bill`, "info");
}

function renderPosCart() {
  const tbody = document.getElementById('pos-cart-tbody');
  if (!tbody) return;

  if (posCart.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No items added to bill yet. Select a medicine above.</td></tr>`;
  } else {
    tbody.innerHTML = posCart.map((item, idx) => `
      <tr>
        <td><strong>${item.name}</strong></td>
        <td>${item.batchNumber}</td>
        <td>₹${item.unitPrice.toFixed(2)}</td>
        <td><strong>${item.quantity}</strong></td>
        <td><strong>₹${item.total.toFixed(2)}</strong></td>
        <td>
          <button class="btn btn-danger" style="padding: 2px 8px; font-size: 0.74rem;" onclick="removePosCartItem(${idx})">&times;</button>
        </td>
      </tr>
    `).join('');
  }

  calculatePosTotals();
}

function calculatePosTotals() {
  const subtotal = posCart.reduce((sum, item) => sum + item.total, 0);
  const gstRate = parseFloat(document.getElementById('pos-gst-input')?.value || 0);
  const discountRate = parseFloat(document.getElementById('pos-discount-input')?.value || 0);

  const gstAmount = subtotal * (gstRate / 100);
  const discountAmount = subtotal * (discountRate / 100);
  const grandTotal = subtotal + gstAmount - discountAmount;

  document.getElementById('pos-subtotal-val').textContent = formatCurrency(subtotal);
  document.getElementById('pos-grand-val').textContent = formatCurrency(grandTotal);

  return { subtotal, gstRate, discountRate, gstAmount, discountAmount, grandTotal };
}

function completePosSale() {
  if (posCart.length === 0) {
    showToast("Your bill is empty! Select a medicine to add to bill.", "warning");
    return;
  }

  const customerName = document.getElementById('pos-customer-name').value.trim() || 'Cash Customer';
  const customerPhone = document.getElementById('pos-customer-phone').value.trim() || '+91-7766086408';
  const doctorName = document.getElementById('pos-doctor-name').value.trim() || 'Self / OTC';

  const totals = calculatePosTotals();

  // Deduct Inventory Stock
  posCart.forEach(cartItem => {
    const med = state.medicines.find(m => m.id === cartItem.medicineId);
    if (med) {
      med.quantity -= cartItem.quantity;
    }
  });

  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);

  const newInvoiceId = `INV-00${state.invoices.length + 1}`;
  const newInvoice = {
    id: newInvoiceId,
    date: dateStr,
    customerName: customerName,
    customerPhone: customerPhone,
    doctorName: doctorName,
    subtotal: totals.subtotal,
    taxRate: totals.gstRate,
    discountRate: totals.discountRate,
    taxAmount: totals.gstAmount,
    discountAmount: totals.discountAmount,
    grandTotal: totals.grandTotal,
    items: [...posCart]
  };

  state.invoices.unshift(newInvoice);
  saveState();

  // Reset Cart
  posCart = [];
  renderPosCart();
  
  // Re-render UI
  renderApp();

  showToast(`Bill ${newInvoiceId} created & stock updated! 🎉`, "success");

  // Show Printable Receipt Modal
  viewInvoiceReceipt(newInvoiceId);
}

function viewInvoiceReceipt(id) {
  const inv = state.invoices.find(i => i.id === id);
  if (!inv) return;

  const container = document.getElementById('receipt-content-box');
  container.innerHTML = `
    <div class="receipt-header">
      <h2>SWASTIK MEDICAL STORE</h2>
      <p>Bidupur Bazar, Vaishali, Bihar - 844502</p>
      <p>Mob: +91-7766086408 | GSTIN: 10ABCDE1234F1Z5</p>
    </div>
    <div class="receipt-details">
      <div><strong>Invoice #:</strong> ${inv.id}</div>
      <div><strong>Date:</strong> ${inv.date}</div>
      <div><strong>Customer:</strong> ${inv.customerName} (${inv.customerPhone})</div>
      <div><strong>Doctor:</strong> ${inv.doctorName || 'N/A'}</div>
    </div>
    <table class="receipt-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${inv.items.map(item => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.unitPrice.toFixed(2)}</td>
            <td>₹${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="receipt-summary">
      <div class="receipt-row"><span>Subtotal:</span> <span>₹${inv.subtotal.toFixed(2)}</span></div>
      <div class="receipt-row"><span>GST (${inv.taxRate}%):</span> <span>+₹${inv.taxAmount.toFixed(2)}</span></div>
      <div class="receipt-row"><span>Discount (${inv.discountRate}%):</span> <span>-₹${inv.discountAmount.toFixed(2)}</span></div>
      <div class="receipt-row grand"><span>GRAND TOTAL:</span> <span>₹${inv.grandTotal.toFixed(2)}</span></div>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 0.78rem; color: #64748b;">
      Thank you for visiting Swastik Medical Store! Get well soon.
    </div>
  `;

  openModal('modal-view-receipt');
}

// Switch Tabs
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));

  const navEl = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const panelEl = document.getElementById(`tab-${tabId}`);

  if (navEl) navEl.classList.add('active');
  if (panelEl) panelEl.classList.add('active');

  const titleMap = {
    'dashboard': 'Executive Dashboard',
    'inventory': 'Medicine Inventory',
    'suppliers': 'Supplier Directory',
    'sales': 'Sales & Invoicing',
    'reports': 'Analytics & Financial Reports'
  };
  document.getElementById('page-title').textContent = titleMap[tabId] || 'Dashboard';
}

// Global Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  initState();
  renderApp();

  // Navigation Click Handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = item.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Search Box Listener
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderApp();
    });
  }

  // Inventory Filter Listener
  const invFilter = document.getElementById('inventory-filter-select');
  if (invFilter) {
    invFilter.addEventListener('change', (e) => {
      state.inventoryFilter = e.target.value;
      renderInventoryTable();
    });
  }

  // Form Submissions
  const formMed = document.getElementById('form-add-medicine');
  if (formMed) formMed.addEventListener('submit', handleAddMedicineSubmit);

  const formSup = document.getElementById('form-add-supplier');
  if (formSup) formSup.addEventListener('submit', handleAddSupplierSubmit);
});
