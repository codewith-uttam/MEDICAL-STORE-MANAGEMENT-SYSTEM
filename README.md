# Medical Store Management System (C++17)

A feature-rich, high-performance, command-line Medical Store Management System built in modern C++17. Designed with a clean Object-Oriented Architecture, ANSI color console interface, real-time inventory management, stock alerts, checkout & invoice generation, supplier directory, and financial reporting.

---

## 🌟 Key Features

1. **Medicine Inventory Management**
   - Track medicine details: ID, Name, Generic Formula, Category (Tablet, Syrup, Injection, Ointment, etc.), Supplier ID, Batch Number, Manufacturing Date, Expiry Date, Purchase Price, Selling Price, Quantity, and Storage Rack Location.
   - Case-insensitive search by Name, Generic Formula, and Category filters.
   - Interactive CRUD operations (Add, Update, Delete).

2. **Sales & Billing System**
   - Customer checkout cart with real-time stock validation and expiry check.
   - Automatic calculation of subtotal, customizable discount %, and tax / VAT %.
   - Real-time inventory stock deduction upon sale completion.
   - Itemized, printable invoice receipt generation.
   - Historical sales lookup and invoice lookup by ID.

3. **Stock & Expiry Alerts Hub**
   - **Low Stock Alert**: Detect items with stock below configurable thresholds (default <= 10).
   - **Expiring Soon Alert**: Track medicines expiring within specified window (default 30 days).
   - **Expired Medicines Alert**: Highlight expired items to prevent accidental sale.

4. **Supplier Directory**
   - Manage supplier details (ID, Name, Contact Person, Phone, Email, Address).
   - Search suppliers and link medicines to their respective suppliers.

5. **Financial Analytics & Business Reports**
   - **Inventory Stock Valuation**: Total cost value, potential gross profit, physical quantity.
   - **Overall Revenue & Net Profit Report**: Total orders, gross revenue, COGS, net profit, average invoice order value.
   - **Sales Report by Date Range**: Filter financial results between custom start and end dates.
   - **Expired Stock Loss Report**: Measure exact financial loss due to expired inventory.
   - **Top Selling Medicines Ranking**: Rank best-selling medicines by volume.
   - **Supplier Distribution**: Breakdown of inventory count supplied per vendor.

6. **Data Persistence & Auto-Seeding**
   - Saves all inventory, suppliers, and sales history to standard CSV files in `data/`.
   - Auto-populates realistic sample data on first launch for instant testing.

---

## 🏗️ Project Architecture

```
llm/
├── Makefile                     # Build targets (all, test, clean)
├── include/                     # C++ Header files
│   ├── models/                  # Core Data Models
│   │   ├── Medicine.hpp
│   │   ├── Supplier.hpp
│   │   └── Invoice.hpp
│   ├── services/                # Business Logic Services
│   │   ├── InventoryManager.hpp
│   │   ├── SupplierManager.hpp
│   │   ├── SalesManager.hpp
│   │   └── ReportGenerator.hpp
│   └── utils/                   # Utilities & Console UI
│       ├── ConsoleUI.hpp
│       ├── DateUtils.hpp
│       └── FileUtils.hpp
├── src/                         # C++ Source implementations
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── main.cpp                 # Main application CLI loop
└── tests/                       # Unit Test Suite
    └── test_medical_store.cpp
```

---

## 🚀 Building & Running

### Prerequisites
- C++17 compatible compiler (`clang++` or `g++`)
- `make` utility

### Compile the Application & Tests
```bash
make
```

### Run Unit Tests
```bash
make test
```

### Run Medical Store Management System
```bash
./bin/medstore
```

---

## 🧪 Automated Unit Verification

The test suite validates:
- **Date Utilities**: Date parsing, comparison, and expiry checking.
- **Medicine Model**: Stock reduction/addition, low stock trigger, margin calculation, and CSV serialization.
- **Invoice Calculations**: Subtotal, discount deduction, tax addition, and net profit math.
- **Sales Manager Guardrails**: Rejection of sales exceeding stock quantity, rejection of expired medicines, and automatic stock deduction.
