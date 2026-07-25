#include "models/Medicine.hpp"
#include "models/Supplier.hpp"
#include "models/Invoice.hpp"
#include "services/InventoryManager.hpp"
#include "services/SupplierManager.hpp"
#include "services/SalesManager.hpp"
#include "services/ReportGenerator.hpp"
#include "utils/ConsoleUI.hpp"
#include "utils/DateUtils.hpp"
#include "utils/FileUtils.hpp"
#include <iostream>
#include <iomanip>
#include <cstdio>

// Helper to format double values to fixed decimal places
static std::string formatDouble(double val, int precision = 2) {
    char buf[32];
    std::snprintf(buf, sizeof(buf), "%.*f", precision, val);
    return std::string(buf);
}

// Helper to populate rich realistic sample data if system is freshly initialized
void seedSampleData(InventoryManager& invMgr, SupplierManager& supMgr, SalesManager& salesMgr) {
    if (supMgr.getTotalCount() == 0) {
        supMgr.addSupplier(Supplier("SUP-001", "Apex Pharma Solutions", "Robert Jenkins", "+1-555-0142", "orders@apexpharma.com", "45 Industrial Pkwy, Boston, MA"));
        supMgr.addSupplier(Supplier("SUP-002", "MediGlobal Supplies Co.", "Sarah Connor", "+1-555-0188", "sales@mediglobal.com", "80 Medical Hub Rd, Chicago, IL"));
        supMgr.addSupplier(Supplier("SUP-003", "BioHealth Care Distributors", "Michael Chang", "+1-555-0199", "mchang@biohealth.org", "12 Science Center, San Jose, CA"));
        ConsoleUI::printSuccess("Seed suppliers created.");
    }

    if (invMgr.getTotalCount() == 0) {
        invMgr.addMedicine(Medicine("MED-001", "Amoxicillin 500mg", "Amoxicillin", "Tablet", "SUP-001", "AMX2026A", "2025-01-10", "2027-06-30", 3.50, 6.00, 150, "Rack A-01"));
        invMgr.addMedicine(Medicine("MED-002", "Paracetamol 650mg", "Acetaminophen", "Tablet", "SUP-002", "PAR2025B", "2025-03-15", "2028-02-28", 0.50, 1.20, 300, "Rack A-02"));
        invMgr.addMedicine(Medicine("MED-003", "Ibuprofen 400mg", "Ibuprofen", "Tablet", "SUP-001", "IBU2025C", "2024-11-20", "2026-12-15", 1.20, 2.50, 8, "Rack A-03")); // Low stock
        invMgr.addMedicine(Medicine("MED-004", "Benadryl Cough Syrup 100ml", "Diphenhydramine", "Syrup", "SUP-003", "BEN2024D", "2024-05-01", "2026-08-15", 4.00, 7.50, 45, "Rack B-01")); // Expiring soon
        invMgr.addMedicine(Medicine("MED-005", "Insulin Glargine 100U/ml", "Insulin", "Injection", "SUP-002", "INS2023E", "2023-09-10", "2025-09-10", 18.00, 28.00, 12, "Fridge 01")); // Expired
        invMgr.addMedicine(Medicine("MED-006", "Omeprazole 20mg", "Omeprazole", "Tablet", "SUP-001", "OMP2026F", "2025-02-01", "2027-10-31", 2.10, 4.50, 90, "Rack C-02"));
        invMgr.addMedicine(Medicine("MED-007", "Azithromycin 250mg", "Azithromycin", "Tablet", "SUP-003", "AZI2025G", "2025-04-10", "2027-04-10", 5.00, 9.50, 5, "Rack A-04")); // Low stock
        invMgr.addMedicine(Medicine("MED-008", "Hydrocortisone Cream 1%", "Hydrocortisone", "Ointment", "SUP-002", "HYD2026H", "2025-01-15", "2027-01-15", 3.00, 5.80, 60, "Rack D-01"));
        ConsoleUI::printSuccess("Seed inventory created.");
    }

    if (salesMgr.getAllInvoices().empty()) {
        Invoice inv1(salesMgr.generateInvoiceId(), "Alice Smith", "+1-555-8899", "Dr. David Vance");
        inv1.addItem(InvoiceItem{"MED-001", "Amoxicillin 500mg", "AMX2026A", 2, 6.00, 3.50, 12.00});
        inv1.addItem(InvoiceItem{"MED-002", "Paracetamol 650mg", "PAR2025B", 1, 1.20, 0.50, 1.20});
        inv1.recalculateTotals(5.0, 5.0);
        std::string err;
        salesMgr.processSale(inv1, err);

        Invoice inv2(salesMgr.generateInvoiceId(), "John Doe", "+1-555-4433", "");
        inv2.addItem(InvoiceItem{"MED-006", "Omeprazole 20mg", "OMP2026F", 1, 4.50, 2.10, 4.50});
        inv2.addItem(InvoiceItem{"MED-008", "Hydrocortisone Cream 1%", "HYD2026H", 1, 5.80, 3.00, 5.80});
        inv2.recalculateTotals(0.0, 5.0);
        salesMgr.processSale(inv2, err);
        ConsoleUI::printSuccess("Seed sales invoices created.");
    }
}

void displayMedicineTable(const std::vector<Medicine>& list) {
    if (list.empty()) {
        ConsoleUI::printInfo("No medicines found matching the criteria.");
        return;
    }

    std::vector<std::string> headers = {"ID", "Name", "Category", "Batch", "Exp Date", "Price ($)", "Stock", "Location"};
    std::vector<int> widths = {10, 24, 12, 12, 12, 11, 8, 12};
    ConsoleUI::printTableHeader(headers, widths);

    for (const auto& m : list) {
        std::string stockStr = std::to_string(m.getQuantity());
        if (m.isLowStock()) {
            stockStr = ConsoleUI::RED + stockStr + " (LOW)" + ConsoleUI::RESET;
        }

        std::string expStr = m.getExpDate();
        if (m.isExpired()) {
            expStr = ConsoleUI::RED + expStr + " (EXP)" + ConsoleUI::RESET;
        } else if (m.isExpiringSoon()) {
            expStr = ConsoleUI::YELLOW + expStr + " (SOON)" + ConsoleUI::RESET;
        }

        std::vector<std::string> row = {
            m.getId(), m.getName(), m.getCategory(), m.getBatchNumber(),
            expStr, formatDouble(m.getSellingPrice()), stockStr, m.getRackLocation()
        };
        ConsoleUI::printTableRow(row, widths);
    }
    ConsoleUI::printDivider(85, '-');
}

// Submenu 1: Inventory Management
void menuInventory(InventoryManager& invMgr, SupplierManager& supMgr) {
    while (true) {
        ConsoleUI::clearScreen();
        ConsoleUI::printHeader("INVENTORY MANAGEMENT");
        std::cout << " 1. View All Medicines\n";
        std::cout << " 2. Add New Medicine\n";
        std::cout << " 3. Update Existing Medicine\n";
        std::cout << " 4. Delete Medicine\n";
        std::cout << " 5. Search Medicine by Name\n";
        std::cout << " 6. Search Medicine by Generic Name\n";
        std::cout << " 7. Filter Medicines by Category\n";
        std::cout << " 0. Back to Main Menu\n";
        ConsoleUI::printDivider(85, '-');

        int choice = ConsoleUI::promptInt("Select option", 0, 7);
        if (choice == 0) break;

        switch (choice) {
            case 1: {
                ConsoleUI::printSubHeader("ALL INVENTORY MEDICINES");
                displayMedicineTable(invMgr.getAllMedicines());
                ConsoleUI::pauseConsole();
                break;
            }
            case 2: {
                ConsoleUI::printSubHeader("ADD NEW MEDICINE");
                std::string autoId = invMgr.generateNextId();
                std::cout << ConsoleUI::BOLD << "Assigned ID   : " << ConsoleUI::CYAN << autoId << ConsoleUI::RESET << "\n";
                std::string name = ConsoleUI::promptString("Medicine Name");
                std::string genName = ConsoleUI::promptString("Generic Name / Formula");
                std::string cat = ConsoleUI::promptString("Category (Tablet/Syrup/Injection/Ointment/etc)");
                std::string supId = ConsoleUI::promptString("Supplier ID (or Enter for SUP-001)", true);
                if (supId.empty()) supId = "SUP-001";
                if (!supMgr.getSupplierById(supId)) {
                    ConsoleUI::printWarning("Supplier " + supId + " not found in directory, but linking anyway.");
                }
                std::string batch = ConsoleUI::promptString("Batch Number");
                std::string mfg = ConsoleUI::promptDate("Manufacturing Date");
                std::string exp = ConsoleUI::promptDate("Expiry Date");
                double pp = ConsoleUI::promptDouble("Purchase Price ($)", 0.01, 10000.0);
                double sp = ConsoleUI::promptDouble("Selling Price ($)", 0.01, 10000.0);
                int qty = ConsoleUI::promptInt("Initial Stock Quantity", 0, 100000);
                std::string loc = ConsoleUI::promptString("Rack / Storage Location");

                Medicine med(autoId, name, genName, cat, supId, batch, mfg, exp, pp, sp, qty, loc);
                if (invMgr.addMedicine(med)) {
                    ConsoleUI::printSuccess("Medicine " + name + " added successfully!");
                } else {
                    ConsoleUI::printError("Failed to add medicine.");
                }
                ConsoleUI::pauseConsole();
                break;
            }
            case 3: {
                ConsoleUI::printSubHeader("UPDATE EXISTING MEDICINE");
                std::string id = ConsoleUI::promptString("Enter Medicine ID to Update");
                Medicine* med = invMgr.getMedicineByIdMutable(id);
                if (!med) {
                    ConsoleUI::printError("Medicine with ID " + id + " not found!");
                } else {
                    std::cout << "Updating " << med->getName() << " (Press Enter to keep existing value)\n";
                    std::string newName = ConsoleUI::promptString("Name [" + med->getName() + "]", true);
                    if (!newName.empty()) med->setName(newName);

                    std::string newGen = ConsoleUI::promptString("Generic Name [" + med->getGenericName() + "]", true);
                    if (!newGen.empty()) med->setGenericName(newGen);

                    std::string newCat = ConsoleUI::promptString("Category [" + med->getCategory() + "]", true);
                    if (!newCat.empty()) med->setCategory(newCat);

                    std::string newBatch = ConsoleUI::promptString("Batch Number [" + med->getBatchNumber() + "]", true);
                    if (!newBatch.empty()) med->setBatchNumber(newBatch);

                    std::string spStr = ConsoleUI::promptString("Selling Price [" + std::to_string(med->getSellingPrice()) + "]", true);
                    if (!spStr.empty()) {
                        try { med->setSellingPrice(std::stod(spStr)); } catch (...) {}
                    }

                    std::string qStr = ConsoleUI::promptString("Stock Quantity [" + std::to_string(med->getQuantity()) + "]", true);
                    if (!qStr.empty()) {
                        try { med->setQuantity(std::stoi(qStr)); } catch (...) {}
                    }

                    invMgr.saveData();
                    ConsoleUI::printSuccess("Medicine updated successfully!");
                }
                ConsoleUI::pauseConsole();
                break;
            }
            case 4: {
                ConsoleUI::printSubHeader("DELETE MEDICINE");
                std::string id = ConsoleUI::promptString("Enter Medicine ID to Delete");
                const Medicine* med = invMgr.getMedicineById(id);
                if (!med) {
                    ConsoleUI::printError("Medicine not found.");
                } else {
                    std::string confirm = ConsoleUI::promptString("Are you sure you want to delete " + med->getName() + "? (y/n)");
                    if (confirm == "y" || confirm == "Y") {
                        if (invMgr.deleteMedicine(id)) {
                            ConsoleUI::printSuccess("Medicine deleted.");
                        } else {
                            ConsoleUI::printError("Failed to delete.");
                        }
                    } else {
                        ConsoleUI::printInfo("Deletion cancelled.");
                    }
                }
                ConsoleUI::pauseConsole();
                break;
            }
            case 5: {
                std::string query = ConsoleUI::promptString("Enter Name Search Query");
                displayMedicineTable(invMgr.searchByName(query));
                ConsoleUI::pauseConsole();
                break;
            }
            case 6: {
                std::string query = ConsoleUI::promptString("Enter Generic Formula Search Query");
                displayMedicineTable(invMgr.searchByGenericName(query));
                ConsoleUI::pauseConsole();
                break;
            }
            case 7: {
                std::string cat = ConsoleUI::promptString("Enter Category (e.g. Tablet, Syrup)");
                displayMedicineTable(invMgr.searchByCategory(cat));
                ConsoleUI::pauseConsole();
                break;
            }
        }
    }
}

// Submenu 2: Sales & Billing Checkout
void menuSalesBilling(SalesManager& salesMgr, InventoryManager& invMgr) {
    while (true) {
        ConsoleUI::clearScreen();
        ConsoleUI::printHeader("SALES & BILLING SYSTEM");
        std::cout << " 1. Create New Sales Invoice (Checkout)\n";
        std::cout << " 2. View All Past Invoices\n";
        std::cout << " 3. Search Invoice by ID\n";
        std::cout << " 0. Back to Main Menu\n";
        ConsoleUI::printDivider(85, '-');

        int choice = ConsoleUI::promptInt("Select option", 0, 3);
        if (choice == 0) break;

        if (choice == 1) {
            ConsoleUI::printSubHeader("NEW SALES INVOICE");
            std::string invId = salesMgr.generateInvoiceId();
            std::cout << ConsoleUI::BOLD << "Invoice ID    : " << ConsoleUI::CYAN << invId << ConsoleUI::RESET << "\n";
            std::string custName = ConsoleUI::promptString("Customer Name");
            std::string custPhone = ConsoleUI::promptString("Customer Phone");
            std::string docName = ConsoleUI::promptString("Prescribing Doctor Name (Optional)", true);

            Invoice newInvoice(invId, custName, custPhone, docName);

            while (true) {
                std::cout << "\n--- Current Cart Items (" << newInvoice.getItems().size() << ") ---\n";
                if (!newInvoice.getItems().empty()) {
                    for (size_t i = 0; i < newInvoice.getItems().size(); ++i) {
                        const auto& item = newInvoice.getItems()[i];
                        std::cout << " " << (i + 1) << ". " << item.medicineName << " x" << item.quantity
                                  << " @ $" << item.unitPrice << " = $" << item.totalPrice << "\n";
                    }
                }

                std::cout << "\nActions: [1] Add Item to Cart  [2] Complete & Print Invoice  [0] Cancel Cart\n";
                int action = ConsoleUI::promptInt("Select Cart Action", 0, 2);

                if (action == 0) {
                    ConsoleUI::printInfo("Cart cancelled.");
                    break;
                } else if (action == 1) {
                    std::string medId = ConsoleUI::promptString("Enter Medicine ID (e.g. MED-001)");
                    const Medicine* med = invMgr.getMedicineById(medId);
                    if (!med) {
                        ConsoleUI::printError("Medicine ID not found!");
                        continue;
                    }

                    if (med->isExpired()) {
                        ConsoleUI::printError("Cannot sell expired medicine: " + med->getName() + " (Expired on " + med->getExpDate() + ")");
                        continue;
                    }

                    std::cout << ConsoleUI::CYAN << "Found: " << med->getName()
                              << " | Stock Available: " << med->getQuantity()
                              << " | Price: $" << med->getSellingPrice() << ConsoleUI::RESET << "\n";

                    int qty = ConsoleUI::promptInt("Enter Purchase Quantity", 1, med->getQuantity());

                    InvoiceItem item;
                    item.medicineId = med->getId();
                    item.medicineName = med->getName();
                    item.batchNumber = med->getBatchNumber();
                    item.quantity = qty;
                    item.unitPrice = med->getSellingPrice();
                    item.purchasePrice = med->getPurchasePrice();
                    item.totalPrice = qty * item.unitPrice;

                    newInvoice.addItem(item);
                    ConsoleUI::printSuccess("Item added to cart!");
                } else if (action == 2) {
                    if (newInvoice.getItems().empty()) {
                        ConsoleUI::printError("Cart is empty. Please add items before completing sale.");
                        continue;
                    }

                    double discountPct = ConsoleUI::promptDouble("Enter Discount % (0-50)", 0.0, 50.0);
                    double taxPct = ConsoleUI::promptDouble("Enter Tax / VAT % (0-30)", 0.0, 30.0);
                    newInvoice.recalculateTotals(discountPct, taxPct);

                    std::string errorMsg;
                    if (salesMgr.processSale(newInvoice, errorMsg)) {
                        ConsoleUI::printSuccess("Sale processed & stock updated successfully!");
                        std::cout << "\n" << salesMgr.formatInvoiceReceipt(newInvoice) << "\n";
                    } else {
                        ConsoleUI::printError("Failed to process sale: " + errorMsg);
                    }
                    ConsoleUI::pauseConsole();
                    break;
                }
            }
        } else if (choice == 2) {
            ConsoleUI::printSubHeader("ALL PAST INVOICES");
            auto invoices = salesMgr.getAllInvoices();
            if (invoices.empty()) {
                ConsoleUI::printInfo("No past invoices recorded.");
            } else {
                std::vector<std::string> headers = {"Invoice ID", "Date", "Customer Name", "Phone", "Items", "Grand Total ($)"};
                std::vector<int> widths = {14, 22, 22, 16, 8, 16};
                ConsoleUI::printTableHeader(headers, widths);

                for (const auto& inv : invoices) {
                    std::vector<std::string> row = {
                        inv.getInvoiceId(), inv.getDateStr(), inv.getCustomerName(),
                        inv.getCustomerPhone(), std::to_string(inv.getItems().size()), formatDouble(inv.getGrandTotal())
                    };
                    ConsoleUI::printTableRow(row, widths);
                }
                ConsoleUI::printDivider(85, '-');
            }
            ConsoleUI::pauseConsole();
        } else if (choice == 3) {
            std::string invId = ConsoleUI::promptString("Enter Invoice ID (e.g. INV-0001)");
            const Invoice* inv = salesMgr.getInvoiceById(invId);
            if (!inv) {
                ConsoleUI::printError("Invoice ID not found.");
            } else {
                std::cout << "\n" << salesMgr.formatInvoiceReceipt(*inv) << "\n";
            }
            ConsoleUI::pauseConsole();
        }
    }
}

// Submenu 3: Stock & Expiry Alerts
void menuStockAlerts(InventoryManager& invMgr) {
    while (true) {
        ConsoleUI::clearScreen();
        ConsoleUI::printHeader("STOCK & EXPIRY ALERTS HUB");
        std::cout << " 1. Low Stock Alerts (Stock <= 10)\n";
        std::cout << " 2. Expiring Soon Alerts (Within 30 Days)\n";
        std::cout << " 3. Expired Medicines Alert\n";
        std::cout << " 0. Back to Main Menu\n";
        ConsoleUI::printDivider(85, '-');

        int choice = ConsoleUI::promptInt("Select option", 0, 3);
        if (choice == 0) break;

        if (choice == 1) {
            int threshold = ConsoleUI::promptInt("Enter low stock threshold limit", 1, 1000);
            ConsoleUI::printSubHeader("LOW STOCK ALERTS (Threshold <= " + std::to_string(threshold) + ")");
            displayMedicineTable(invMgr.getLowStockMedicines(threshold));
            ConsoleUI::pauseConsole();
        } else if (choice == 2) {
            int days = ConsoleUI::promptInt("Enter days to expiry threshold", 1, 365);
            ConsoleUI::printSubHeader("MEDICINES EXPIRING WITHIN " + std::to_string(days) + " DAYS");
            displayMedicineTable(invMgr.getExpiringMedicines(days));
            ConsoleUI::pauseConsole();
        } else if (choice == 3) {
            ConsoleUI::printSubHeader("EXPIRED MEDICINES IN INVENTORY");
            displayMedicineTable(invMgr.getExpiredMedicines());
            ConsoleUI::pauseConsole();
        }
    }
}

// Submenu 4: Supplier Directory
void menuSuppliers(SupplierManager& supMgr) {
    while (true) {
        ConsoleUI::clearScreen();
        ConsoleUI::printHeader("SUPPLIER DIRECTORY");
        std::cout << " 1. View All Suppliers\n";
        std::cout << " 2. Add New Supplier\n";
        std::cout << " 3. Search Supplier by Name\n";
        std::cout << " 0. Back to Main Menu\n";
        ConsoleUI::printDivider(85, '-');

        int choice = ConsoleUI::promptInt("Select option", 0, 3);
        if (choice == 0) break;

        if (choice == 1) {
            ConsoleUI::printSubHeader("ALL SUPPLIERS");
            auto list = supMgr.getAllSuppliers();
            if (list.empty()) {
                ConsoleUI::printInfo("No suppliers recorded.");
            } else {
                std::vector<std::string> headers = {"ID", "Supplier Name", "Contact Person", "Phone", "Email"};
                std::vector<int> widths = {12, 26, 20, 16, 24};
                ConsoleUI::printTableHeader(headers, widths);

                for (const auto& s : list) {
                    std::vector<std::string> row = {
                        s.getId(), s.getName(), s.getContactPerson(), s.getPhone(), s.getEmail()
                    };
                    ConsoleUI::printTableRow(row, widths);
                }
                ConsoleUI::printDivider(85, '-');
            }
            ConsoleUI::pauseConsole();
        } else if (choice == 2) {
            ConsoleUI::printSubHeader("ADD NEW SUPPLIER");
            std::string autoId = supMgr.generateNextId();
            std::cout << ConsoleUI::BOLD << "Assigned Supplier ID : " << ConsoleUI::CYAN << autoId << ConsoleUI::RESET << "\n";
            std::string name = ConsoleUI::promptString("Supplier Company Name");
            std::string contact = ConsoleUI::promptString("Contact Person Name");
            std::string phone = ConsoleUI::promptString("Phone Number");
            std::string email = ConsoleUI::promptString("Email Address");
            std::string addr = ConsoleUI::promptString("Office Address");

            Supplier sup(autoId, name, contact, phone, email, addr);
            if (supMgr.addSupplier(sup)) {
                ConsoleUI::printSuccess("Supplier " + name + " added successfully!");
            } else {
                ConsoleUI::printError("Failed to add supplier.");
            }
            ConsoleUI::pauseConsole();
        } else if (choice == 3) {
            std::string query = ConsoleUI::promptString("Enter Supplier Name / Contact Search Query");
            auto list = supMgr.searchByName(query);
            if (list.empty()) {
                ConsoleUI::printInfo("No matching suppliers found.");
            } else {
                std::vector<std::string> headers = {"ID", "Supplier Name", "Contact Person", "Phone", "Email"};
                std::vector<int> widths = {12, 26, 20, 16, 24};
                ConsoleUI::printTableHeader(headers, widths);
                for (const auto& s : list) {
                    std::vector<std::string> row = {s.getId(), s.getName(), s.getContactPerson(), s.getPhone(), s.getEmail()};
                    ConsoleUI::printTableRow(row, widths);
                }
                ConsoleUI::printDivider(85, '-');
            }
            ConsoleUI::pauseConsole();
        }
    }
}

// Submenu 5: Financial Analytics & Reports
void menuAnalytics(const InventoryManager& invMgr, const SalesManager& salesMgr, const SupplierManager& supMgr) {
    ReportGenerator reportGen(invMgr, salesMgr, supMgr);

    while (true) {
        ConsoleUI::clearScreen();
        ConsoleUI::printHeader("FINANCIAL ANALYTICS & REPORTS");
        std::cout << " 1. Inventory Stock Valuation Report\n";
        std::cout << " 2. Overall Revenue & Net Profit Report\n";
        std::cout << " 3. Sales Report by Date Range\n";
        std::cout << " 4. Expired Medicine Loss Report\n";
        std::cout << " 5. Top-Selling Medicines Ranking\n";
        std::cout << " 6. Supplier Distribution Summary\n";
        std::cout << " 0. Back to Main Menu\n";
        ConsoleUI::printDivider(85, '-');

        int choice = ConsoleUI::promptInt("Select option", 0, 6);
        if (choice == 0) break;

        switch (choice) {
            case 1:
                reportGen.displayInventoryValuationReport();
                ConsoleUI::pauseConsole();
                break;
            case 2:
                reportGen.displaySalesReport();
                ConsoleUI::pauseConsole();
                break;
            case 3: {
                std::string startDate = ConsoleUI::promptDate("Enter Start Date");
                std::string endDate = ConsoleUI::promptDate("Enter End Date");
                reportGen.displaySalesReport(startDate, endDate);
                ConsoleUI::pauseConsole();
                break;
            }
            case 4:
                reportGen.displayExpiredStockLossReport();
                ConsoleUI::pauseConsole();
                break;
            case 5: {
                int topN = ConsoleUI::promptInt("How many top items to display?", 1, 50);
                reportGen.displayTopSellingMedicinesReport(topN);
                ConsoleUI::pauseConsole();
                break;
            }
            case 6:
                reportGen.displaySupplierSummaryReport();
                ConsoleUI::pauseConsole();
                break;
        }
    }
}

int main() {
    // Ensure data directory exists
    FileUtils::ensureDirectoryExists("data");

    // Initialize Services
    InventoryManager inventoryManager("data/medicines.csv");
    SupplierManager supplierManager("data/suppliers.csv");
    SalesManager salesManager(inventoryManager, "data/invoices.csv", "data/invoice_items.csv");

    // If initial startup, auto-seed sample data
    if (inventoryManager.getTotalCount() == 0) {
        seedSampleData(inventoryManager, supplierManager, salesManager);
    }

    while (true) {
        ConsoleUI::clearScreen();
        ConsoleUI::printBanner();

        // Print quick dashboard status
        std::cout << ConsoleUI::BOLD << " System Date : " << ConsoleUI::CYAN << DateUtils::getCurrentDateStr()
                  << ConsoleUI::BOLD << " | Total Medicines : " << ConsoleUI::GREEN << inventoryManager.getTotalCount()
                  << ConsoleUI::BOLD << " | Low Stock Alerts : " << ConsoleUI::RED << inventoryManager.getLowStockMedicines().size()
                  << ConsoleUI::BOLD << " | Expired : " << ConsoleUI::RED << inventoryManager.getExpiredMedicines().size()
                  << ConsoleUI::RESET << "\n";
        ConsoleUI::printDivider(85, '=');

        std::cout << " 1. Inventory Management (View, Add, Update, Search, Delete)\n";
        std::cout << " 2. Sales & Billing System (Checkout, New Invoice, Past Bills)\n";
        std::cout << " 3. Stock & Expiry Alerts Hub\n";
        std::cout << " 4. Supplier Directory Management\n";
        std::cout << " 5. Financial Analytics & Business Reports\n";
        std::cout << " 6. Reload / Re-seed Sample Data\n";
        std::cout << " 0. Exit System\n";
        ConsoleUI::printDivider(85, '-');

        int choice = ConsoleUI::promptInt("Enter Choice", 0, 6);
        if (choice == 0) {
            ConsoleUI::printSuccess("Saving data files and exiting Medical Store Management System. Goodbye!");
            break;
        }

        switch (choice) {
            case 1:
                menuInventory(inventoryManager, supplierManager);
                break;
            case 2:
                menuSalesBilling(salesManager, inventoryManager);
                break;
            case 3:
                menuStockAlerts(inventoryManager);
                break;
            case 4:
                menuSuppliers(supplierManager);
                break;
            case 5:
                menuAnalytics(inventoryManager, salesManager, supplierManager);
                break;
            case 6:
                seedSampleData(inventoryManager, supplierManager, salesManager);
                ConsoleUI::pauseConsole();
                break;
        }
    }

    return 0;
}
