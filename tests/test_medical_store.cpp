#include "models/Medicine.hpp"
#include "models/Supplier.hpp"
#include "models/Invoice.hpp"
#include "services/InventoryManager.hpp"
#include "services/SalesManager.hpp"
#include "services/SupplierManager.hpp"
#include "utils/DateUtils.hpp"
#include "utils/FileUtils.hpp"
#include <iostream>
#include <cassert>
#include <cmath>

void testDateUtils() {
    std::cout << "[TEST] Running DateUtils Tests...\n";
    assert(DateUtils::isValidDate("2026-05-15") == true);
    assert(DateUtils::isValidDate("2026-13-01") == false); // Invalid month
    assert(DateUtils::isValidDate("invalid-date") == false);

    assert(DateUtils::compareDates("2026-01-01", "2026-01-02") < 0);
    assert(DateUtils::compareDates("2026-01-02", "2026-01-01") > 0);
    assert(DateUtils::compareDates("2026-05-05", "2026-05-05") == 0);

    assert(DateUtils::isExpired("2020-01-01") == true);
    assert(DateUtils::isExpired("2035-01-01") == false);
    std::cout << "[PASS] DateUtils tests passed successfully.\n\n";
}

void testMedicineModel() {
    std::cout << "[TEST] Running Medicine Model Tests...\n";
    Medicine m("MED-100", "Test Med", "Test Formula", "Tablet", "SUP-001", "B123", "2025-01-01", "2027-01-01", 10.0, 15.0, 50, "Rack 1");

    assert(m.getId() == "MED-100");
    assert(m.getQuantity() == 50);
    assert(m.isLowStock(10) == false);

    m.reduceStock(45);
    assert(m.getQuantity() == 5);
    assert(m.isLowStock(10) == true); // 5 <= 10

    m.addStock(20);
    assert(m.getQuantity() == 25);

    double profit = m.calculateProfitMargin();
    assert(std::abs(profit - 5.0) < 1e-6);

    // Serialization test
    std::string csv = m.toCSV();
    Medicine m2 = Medicine::fromCSV(csv);
    assert(m2.getId() == m.getId());
    assert(m2.getName() == m.getName());
    assert(m2.getSellingPrice() == m.getSellingPrice());

    std::cout << "[PASS] Medicine Model tests passed successfully.\n\n";
}

void testInvoiceCalculation() {
    std::cout << "[TEST] Running Invoice Calculation Tests...\n";
    Invoice inv("INV-9999", "Test Customer", "+123456789", "Dr. Smith");

    InvoiceItem i1{"MED-001", "Med A", "B01", 2, 10.0, 6.0, 20.0}; // $20.0 total, profit $8.0
    InvoiceItem i2{"MED-002", "Med B", "B02", 1, 30.0, 20.0, 30.0}; // $30.0 total, profit $10.0

    inv.addItem(i1);
    inv.addItem(i2);

    // Subtotal should be 20 + 30 = 50.0
    assert(std::abs(inv.getSubtotal() - 50.0) < 1e-6);

    // Apply 10% discount and 5% tax
    // Subtotal = 50.0
    // Discount = 5.0
    // Tax = (50 - 5) * 0.05 = 2.25
    // Grand Total = 45 + 2.25 = 47.25
    inv.recalculateTotals(10.0, 5.0);

    assert(std::abs(inv.getDiscountAmount() - 5.0) < 1e-6);
    assert(std::abs(inv.getTaxAmount() - 2.25) < 1e-6);
    assert(std::abs(inv.getGrandTotal() - 47.25) < 1e-6);

    std::cout << "[PASS] Invoice Calculation tests passed successfully.\n\n";
}

void testSalesTransactionValidation() {
    std::cout << "[TEST] Running Sales Manager Validation Tests...\n";
    std::string testMedPath = "data/test_medicines.csv";
    std::string testInvPath = "data/test_invoices.csv";
    std::string testItemPath = "data/test_items.csv";

    // Clean up test files if exists
    remove(testMedPath.c_str());
    remove(testInvPath.c_str());
    remove(testItemPath.c_str());

    InventoryManager invMgr(testMedPath);
    Medicine validMed("MED-001", "Valid Pills", "Formula A", "Tablet", "SUP-001", "B01", "2025-01-01", "2028-01-01", 2.0, 5.0, 10, "Rack A");
    Medicine expiredMed("MED-002", "Expired Syrup", "Formula B", "Syrup", "SUP-001", "B02", "2020-01-01", "2022-01-01", 3.0, 8.0, 20, "Rack B");
    invMgr.addMedicine(validMed);
    invMgr.addMedicine(expiredMed);

    SalesManager salesMgr(invMgr, testInvPath, testItemPath);

    // Test 1: Attempt to purchase more than available stock
    Invoice invOver("INV-0001", "Bob", "111");
    invOver.addItem(InvoiceItem{"MED-001", "Valid Pills", "B01", 15, 5.0, 2.0, 75.0}); // Stock is only 10
    std::string err1;
    bool res1 = salesMgr.processSale(invOver, err1);
    assert(res1 == false);
    assert(err1.find("Insufficient stock") != std::string::npos);

    // Test 2: Attempt to purchase expired medicine
    Invoice invExp("INV-0002", "Bob", "111");
    invExp.addItem(InvoiceItem{"MED-002", "Expired Syrup", "B02", 1, 8.0, 3.0, 8.0});
    std::string err2;
    bool res2 = salesMgr.processSale(invExp, err2);
    assert(res2 == false);
    assert(err2.find("EXPIRED") != std::string::npos);

    // Test 3: Successful sale -> verify stock deduction
    Invoice invValid("INV-0003", "Bob", "111");
    invValid.addItem(InvoiceItem{"MED-001", "Valid Pills", "B01", 4, 5.0, 2.0, 20.0});
    std::string err3;
    bool res3 = salesMgr.processSale(invValid, err3);
    assert(res3 == true);

    // Stock was 10, sold 4 -> should now be 6
    const Medicine* mAfter = invMgr.getMedicineById("MED-001");
    assert(mAfter != nullptr);
    assert(mAfter->getQuantity() == 6);

    // Cleanup
    remove(testMedPath.c_str());
    remove(testInvPath.c_str());
    remove(testItemPath.c_str());

    std::cout << "[PASS] Sales Manager Validation tests passed successfully.\n\n";
}

int main() {
    std::cout << "=======================================================\n";
    std::cout << "  RUNNING MEDICAL STORE MANAGEMENT SYSTEM UNIT TESTS   \n";
    std::cout << "=======================================================\n\n";

    testDateUtils();
    testMedicineModel();
    testInvoiceCalculation();
    testSalesTransactionValidation();

    std::cout << "=======================================================\n";
    std::cout << "  ALL UNIT TESTS COMPLETED WITH 100% SUCCESS!          \n";
    std::cout << "=======================================================\n";
    return 0;
}
