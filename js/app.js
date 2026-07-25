/**
 * PharmaCare Pro - Medical Store Management System Engine
 * Fully featured JavaScript application with state management & LocalStorage persistence.
 */

// Initial Seed Data (Matches C++ system seed data)
const SEED_SUPPLIERS = [
  { id: "SUP-001", name: "Apex Pharma Solutions", contactPerson: "Robert Jenkins", phone: "+1-555-0142", email: "orders@apexpharma.com", address: "45 Industrial Pkwy, Boston, MA" },
  { id: "SUP-002", name: "MediGlobal Supplies Co.", contactPerson: "Sarah Connor", phone: "+1-555-0188", email: "sales@mediglobal.com", address: "80 Medical Hub Rd, Chicago, IL" },
  { id: "SUP-003", name: "BioHealth Care Distributors", contactPerson: "Michael Chang", phone: "+1-555-0199", email: "mchang@biohealth.org", address: "12 Science Center, San Jose, CA" }
];

const SEED_MEDICINES = [
  { id: "MED-001", name: "Amoxicillin 500mg", genericName: "Amoxicillin", category: "Tablet", supplierId: "SUP-001", batchNumber: "AMX2026A", purchaseDate: "2025-01-10", expiryDate: "2027-06-30", purchasePrice: 3.50, sellingPrice: 6.00, quantity: 150, rackLocation: "Rack A-01" },
  { id: "MED-002", name: "Paracetamol 650mg", genericName: "Acetaminophen", category: "Tablet", supplierId: "SUP-002", batchNumber: "PAR2025B", purchaseDate: "2025-03-15", expiryDate: "2028-02-28", purchasePrice: 0.50, sellingPrice: 1.20, quantity: 300, rackLocation: "Rack A-02" },
  { id: "MED-003", name: "Ibuprofen 400mg", genericName: "Ibuprofen", category: "Tablet", supplierId: "SUP-001", batchNumber: "IBU2025C", purchaseDate: "2024-11-20", expiryDate: "2026-12-15", purchasePrice: 1.20, sellingPrice: 2.50, quantity: 8, rackLocation: "Rack A-03" },
  { id: "MED-004", name: "Benadryl Cough Syrup 100ml", genericName: "Diphenhydramine", category: "Syrup", supplierId: "SUP-003", batchNumber: "BEN2024D", purchaseDate: "2024-05-01", expiryDate: "2026-08-15", purchasePrice: 4.00, sellingPrice: 7.50, quantity: 45, rackLocation: "Rack B-01" },
  { id: "MED-005", name: "Insulin Glargine 100U/ml", genericName: "Insulin", category: "Injection", supplierId: "SUP-002", batchNumber: "INS2023E", purchaseDate: "2023-09-10", expiryDate: "2025-09-10", purchasePrice: 18.00, sellingPrice: 28.00, quantity: 12, rackLocation: "Fridge 01" },
  { id: "MED-006", name: "Omeprazole 20mg", genericName: "Omeprazole", category: "Tablet", supplierId: "SUP-001", batchNumber: "OMP2026F", purchaseDate: "2025-02-01", expiryDate: "2027-10-31", purchasePrice: 2.10, sellingPrice: 4.50, quantity: 90, rackLocation: "Rack C-02" },
  { id: "MED-007", name: "Azithromycin 250mg", genericName: "Azithromycin", category: "Tablet", supplierId: "SUP-003", batchNumber: "AZI2025G", purchaseDate: "2025-04-10", expiryDate: "2027-04-10", purchasePrice: 5.00, sellingPrice: 9.50, quantity: 5, rackLocation: "Rack A-04" },
  { id: "MED-008", name: "Hydrocortisone Cream 1%", genericName: "Hydrocortisone", category: "Ointment", supplierId: "SUP-002", batchNumber: "HYD2026H", purchaseDate: "2025-01-15", expiryDate: "2027-01-15", purchasePrice: 3.00, sellingPrice: 5.80, quantity: 60, rackLocation: "Rack D-01" }
];

const SEED_INVOICES = [
  {
    id: "INV-0001",
    date: "2026-07-20 14:30:00",
    customerName: "Alice Smith",
    customerPhone: "+1-555-8899",
    doctorName: "Dr. David Vance",
    subtotal: 13.20,
    taxRate: 5.0,
    discountRate: 5.0,
    taxAmount: 0.66,
    discountAmount: 0.66,
    grandTotal: 13.20,
    items: [
      { medicineId: "MED-001", name: "Amoxicillin 500mg", batchNumber: "AMX2026A", quantity: 2, unitPrice: 6.00, total: 12.00 },
      { medicineId: "MED-002", name: "Paracetamol 650mg", batchNumber: "PAR2025B", quantity: 1, unitPrice: 1.20, total: 1.20 }
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
  return '$' + Number(amount).toFixed(2);
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

  let totalSales = state.invoices.reduce((sum, inv) => sum + inv.grandTotal, 0);

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

// Operations & Handlers
function deleteMedicine(id) {
  if (confirm(`Are you sure you want to delete Medicine ${id}?`)) {
    state.medicines = state.medicines.filter(m => m.id !== id);
    saveState();
    renderApp();
  }
}

function deleteSupplier(id) {
  if (confirm(`Are you sure you want to delete Supplier ${id}?`)) {
    state.suppliers = state.suppliers.filter(s => s.id !== id);
    saveState();
    renderApp();
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
}

// Invoice Generator Logic
function populateInvoiceMedicineSelects() {
  const supSelect = document.getElementById('med-supplier');
  if (supSelect) {
    supSelect.innerHTML = state.suppliers.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('');
  }
}

function viewInvoiceReceipt(id) {
  const inv = state.invoices.find(i => i.id === id);
  if (!inv) return;

  const container = document.getElementById('receipt-content-box');
  container.innerHTML = `
    <div class="receipt-header">
      <h2>SWASTIK MEDICAL STORE</h2>
      <p>100 Health Avenue, Suite 400</p>
      <p>Tel: +1-800-SWASTIK-MED</p>
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
            <td>$${item.unitPrice.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="receipt-summary">
      <div class="receipt-row"><span>Subtotal:</span> <span>$${inv.subtotal.toFixed(2)}</span></div>
      <div class="receipt-row"><span>Tax (${inv.taxRate}%):</span> <span>+$${inv.taxAmount.toFixed(2)}</span></div>
      <div class="receipt-row"><span>Discount (${inv.discountRate}%):</span> <span>-$${inv.discountAmount.toFixed(2)}</span></div>
      <div class="receipt-row grand"><span>GRAND TOTAL:</span> <span>$${inv.grandTotal.toFixed(2)}</span></div>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 0.78rem; color: #64748b;">
      Thank you for choosing Swastik Medical Store! Get well soon.
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
    'inventory': 'Inventory Management',
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
