#ifndef SALES_MANAGER_HPP
#define SALES_MANAGER_HPP

#include "models/Invoice.hpp"
#include "services/InventoryManager.hpp"
#include <vector>
#include <string>

class SalesManager {
private:
    std::vector<Invoice> salesHistory;
    std::string invoicesHeaderFile;
    std::string invoicesItemsFile;
    InventoryManager& inventoryManager;

public:
    SalesManager(InventoryManager& invMgr,
                 std::string headerPath = "data/invoices.csv",
                 std::string itemsPath = "data/invoice_items.csv");

    bool loadData();
    bool saveData() const;

    // Cart and Sale transaction logic
    std::string generateInvoiceId() const;
    bool processSale(Invoice& invoice, std::string& errorMsg);

    // History & Queries
    std::vector<Invoice> getAllInvoices() const;
    const Invoice* getInvoiceById(const std::string& id) const;
    std::vector<Invoice> getInvoicesByDateRange(const std::string& startDate, const std::string& endDate) const;

    // Formatting receipt output
    std::string formatInvoiceReceipt(const Invoice& invoice) const;
};

#endif // SALES_MANAGER_HPP
