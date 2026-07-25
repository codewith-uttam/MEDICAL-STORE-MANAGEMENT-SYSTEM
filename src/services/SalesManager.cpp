#include "services/SalesManager.hpp"
#include "utils/FileUtils.hpp"
#include "utils/DateUtils.hpp"
#include <sstream>
#include <iomanip>
#include <map>

SalesManager::SalesManager(InventoryManager& invMgr,
                           std::string headerPath,
                           std::string itemsPath)
    : invoicesHeaderFile(headerPath),
      invoicesItemsFile(itemsPath),
      inventoryManager(invMgr) {
    loadData();
}

bool SalesManager::loadData() {
    salesHistory.clear();
    if (!FileUtils::fileExists(invoicesHeaderFile)) {
        return false;
    }

    std::vector<std::string> headerLines = FileUtils::readLines(invoicesHeaderFile);
    if (headerLines.empty()) return true;

    // Load items and group by invoice ID
    std::map<std::string, std::vector<InvoiceItem>> itemMap;
    if (FileUtils::fileExists(invoicesItemsFile)) {
        std::vector<std::string> itemLines = FileUtils::readLines(invoicesItemsFile);
        size_t startIdx = (!itemLines.empty() && itemLines[0].rfind("InvoiceID,", 0) == 0) ? 1 : 0;
        for (size_t i = startIdx; i < itemLines.size(); ++i) {
            if (itemLines[i].empty()) continue;
            std::vector<std::string> fields = FileUtils::parseCSVLine(itemLines[i]);
            if (fields.size() >= 8) {
                std::string invId = fields[0];
                // Reconstruct line without invoiceId field for InvoiceItem::fromCSV
                std::string itemCSV = itemLines[i].substr(fields[0].length() + 1);
                InvoiceItem item = InvoiceItem::fromCSV(itemCSV);
                itemMap[invId].push_back(item);
            }
        }
    }

    size_t startIdx = (!headerLines.empty() && headerLines[0].rfind("InvoiceID,", 0) == 0) ? 1 : 0;
    for (size_t i = startIdx; i < headerLines.size(); ++i) {
        if (headerLines[i].empty()) continue;
        Invoice inv = Invoice::headerFromCSV(headerLines[i]);
        if (!inv.getInvoiceId().empty()) {
            auto it = itemMap.find(inv.getInvoiceId());
            if (it != itemMap.end()) {
                for (const auto& item : it->second) {
                    inv.addItem(item);
                }
            }
            salesHistory.push_back(inv);
        }
    }

    return true;
}

bool SalesManager::saveData() const {
    size_t lastSlash = invoicesHeaderFile.find_last_of("/\\");
    if (lastSlash != std::string::npos) {
        FileUtils::ensureDirectoryExists(invoicesHeaderFile.substr(0, lastSlash));
    }

    std::vector<std::string> headerLines;
    headerLines.push_back("InvoiceID,Date,CustomerName,CustomerPhone,DoctorName,Subtotal,DiscountPct,DiscountAmount,TaxPct,TaxAmount,GrandTotal,TotalProfit");

    std::vector<std::string> itemLines;
    itemLines.push_back("InvoiceID,MedicineID,MedicineName,BatchNumber,Quantity,UnitPrice,PurchasePrice,TotalPrice");

    for (const auto& inv : salesHistory) {
        headerLines.push_back(inv.toHeaderCSV());
        for (const auto& item : inv.getItems()) {
            itemLines.push_back(FileUtils::escapeCSVField(inv.getInvoiceId()) + "," + item.toCSV());
        }
    }

    bool hOk = FileUtils::writeLines(invoicesHeaderFile, headerLines);
    bool iOk = FileUtils::writeLines(invoicesItemsFile, itemLines);
    return hOk && iOk;
}

std::string SalesManager::generateInvoiceId() const {
    int maxNum = 0;
    for (const auto& inv : salesHistory) {
        std::string idStr = inv.getInvoiceId();
        if (idStr.rfind("INV-", 0) == 0) {
            try {
                int num = std::stoi(idStr.substr(4));
                if (num > maxNum) maxNum = num;
            } catch (...) {}
        }
    }

    std::ostringstream oss;
    oss << "INV-" << std::setw(4) << std::setfill('0') << (maxNum + 1);
    return oss.str();
}

bool SalesManager::processSale(Invoice& invoice, std::string& errorMsg) {
    if (invoice.getItems().empty()) {
        errorMsg = "Cannot process an empty invoice with no items.";
        return false;
    }

    // Step 1: Validate stock availability and expiry for all items
    for (const auto& item : invoice.getItems()) {
        Medicine* med = inventoryManager.getMedicineByIdMutable(item.medicineId);
        if (!med) {
            errorMsg = "Medicine ID " + item.medicineId + " (" + item.medicineName + ") not found in inventory.";
            return false;
        }
        if (med->isExpired()) {
            errorMsg = "Medicine " + med->getName() + " (Batch: " + med->getBatchNumber() + ") is EXPIRED. Sale aborted.";
            return false;
        }
        if (med->getQuantity() < item.quantity) {
            errorMsg = "Insufficient stock for " + med->getName() + ". Requested: " +
                       std::to_string(item.quantity) + ", Available: " + std::to_string(med->getQuantity()) + ".";
            return false;
        }
    }

    // Step 2: Deduct stock from inventory
    for (const auto& item : invoice.getItems()) {
        Medicine* med = inventoryManager.getMedicineByIdMutable(item.medicineId);
        med->reduceStock(item.quantity);
    }
    inventoryManager.saveData();

    // Step 3: Record sale in history and save data
    invoice.setDateStr(DateUtils::getCurrentTimestampStr());
    salesHistory.push_back(invoice);
    saveData();

    return true;
}

std::vector<Invoice> SalesManager::getAllInvoices() const {
    return salesHistory;
}

const Invoice* SalesManager::getInvoiceById(const std::string& id) const {
    for (const auto& inv : salesHistory) {
        if (inv.getInvoiceId() == id) return &inv;
    }
    return nullptr;
}

std::vector<Invoice> SalesManager::getInvoicesByDateRange(const std::string& startDate, const std::string& endDate) const {
    std::vector<Invoice> result;
    for (const auto& inv : salesHistory) {
        std::string d = inv.getDateStr().substr(0, 10);
        if (DateUtils::compareDates(d, startDate) >= 0 && DateUtils::compareDates(d, endDate) <= 0) {
            result.push_back(inv);
        }
    }
    return result;
}

std::string SalesManager::formatInvoiceReceipt(const Invoice& invoice) const {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(2);

    oss << "=================================================================================\n";
    oss << "                          HEALTHCARE PHARMA PHARMACY                             \n";
    oss << "                   123 Health Avenue, Medical Zone, City                         \n";
    oss << "                        Phone: +1 (555) 019-2834                                 \n";
    oss << "=================================================================================\n";
    oss << "Invoice ID    : " << invoice.getInvoiceId() << "\n";
    oss << "Date & Time   : " << invoice.getDateStr() << "\n";
    oss << "Customer Name : " << invoice.getCustomerName() << "\n";
    oss << "Contact Phone : " << invoice.getCustomerPhone() << "\n";
    if (!invoice.getDoctorName().empty()) {
        oss << "Presc. Doctor : Dr. " << invoice.getDoctorName() << "\n";
    }
    oss << "---------------------------------------------------------------------------------\n";
    oss << std::left << std::setw(4) << "#"
        << std::setw(28) << "Item Name"
        << std::setw(12) << "Batch"
        << std::setw(8) << "Qty"
        << std::setw(14) << "Price ($)"
        << std::setw(14) << "Total ($)" << "\n";
    oss << "---------------------------------------------------------------------------------\n";

    int idx = 1;
    for (const auto& item : invoice.getItems()) {
        oss << std::left << std::setw(4) << idx++
            << std::setw(28) << item.medicineName
            << std::setw(12) << item.batchNumber
            << std::setw(8) << item.quantity
            << std::setw(14) << item.unitPrice
            << std::setw(14) << item.totalPrice << "\n";
    }

    oss << "---------------------------------------------------------------------------------\n";
    oss << std::right << std::setw(66) << "Subtotal : $" << std::setw(10) << invoice.getSubtotal() << "\n";
    if (invoice.getDiscountPercentage() > 0) {
        oss << std::right << std::setw(58) << "Discount (" << std::setw(4) << invoice.getDiscountPercentage() << "%) : -$" << std::setw(10) << invoice.getDiscountAmount() << "\n";
    }
    oss << std::right << std::setw(58) << "Tax/VAT (" << std::setw(4) << invoice.getTaxPercentage() << "%) : +$" << std::setw(10) << invoice.getTaxAmount() << "\n";
    oss << "---------------------------------------------------------------------------------\n";
    oss << std::right << std::setw(66) << "GRAND TOTAL : $" << std::setw(10) << invoice.getGrandTotal() << "\n";
    oss << "=================================================================================\n";
    oss << "               Thank you for visiting! Get well soon!                            \n";
    oss << "=================================================================================\n";

    return oss.str();
}
