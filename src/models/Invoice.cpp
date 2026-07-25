#include "models/Invoice.hpp"
#include "utils/DateUtils.hpp"
#include "utils/FileUtils.hpp"
#include <sstream>
#include <iomanip>

std::string InvoiceItem::toCSV() const {
    std::ostringstream oss;
    oss << FileUtils::escapeCSVField(medicineId) << ","
        << FileUtils::escapeCSVField(medicineName) << ","
        << FileUtils::escapeCSVField(batchNumber) << ","
        << quantity << ","
        << unitPrice << ","
        << purchasePrice << ","
        << totalPrice;
    return oss.str();
}

InvoiceItem InvoiceItem::fromCSV(const std::string& csvLine) {
    std::vector<std::string> fields = FileUtils::parseCSVLine(csvLine);
    if (fields.size() < 7) {
        return InvoiceItem();
    }
    try {
        InvoiceItem item;
        item.medicineId = fields[0];
        item.medicineName = fields[1];
        item.batchNumber = fields[2];
        item.quantity = std::stoi(fields[3]);
        item.unitPrice = std::stod(fields[4]);
        item.purchasePrice = std::stod(fields[5]);
        item.totalPrice = std::stod(fields[6]);
        return item;
    } catch (...) {
        return InvoiceItem();
    }
}

Invoice::Invoice()
    : invoiceId(""), dateStr(DateUtils::getCurrentTimestampStr()),
      customerName(""), customerPhone(""), doctorName(""),
      subtotal(0.0), discountPercentage(0.0), discountAmount(0.0),
      taxPercentage(0.0), taxAmount(0.0), grandTotal(0.0), totalProfit(0.0) {}

Invoice::Invoice(std::string invoiceId, std::string customerName, std::string customerPhone, std::string doctorName)
    : invoiceId(invoiceId), dateStr(DateUtils::getCurrentTimestampStr()),
      customerName(customerName), customerPhone(customerPhone), doctorName(doctorName),
      subtotal(0.0), discountPercentage(0.0), discountAmount(0.0),
      taxPercentage(0.0), taxAmount(0.0), grandTotal(0.0), totalProfit(0.0) {}

void Invoice::addItem(const InvoiceItem& item) {
    items.push_back(item);
    recalculateTotals(discountPercentage, taxPercentage);
}

void Invoice::recalculateTotals(double discountPct, double taxPct) {
    discountPercentage = discountPct;
    taxPercentage = taxPct;
    subtotal = 0.0;
    totalProfit = 0.0;

    for (auto& item : items) {
        item.totalPrice = item.quantity * item.unitPrice;
        subtotal += item.totalPrice;
        totalProfit += (item.unitPrice - item.purchasePrice) * item.quantity;
    }

    discountAmount = (subtotal * discountPercentage) / 100.0;
    double afterDiscount = subtotal - discountAmount;
    taxAmount = (afterDiscount * taxPercentage) / 100.0;
    grandTotal = afterDiscount + taxAmount;

    // Adjust total profit for overall invoice discount
    totalProfit -= discountAmount;
}

std::string Invoice::toHeaderCSV() const {
    std::ostringstream oss;
    oss << FileUtils::escapeCSVField(invoiceId) << ","
        << FileUtils::escapeCSVField(dateStr) << ","
        << FileUtils::escapeCSVField(customerName) << ","
        << FileUtils::escapeCSVField(customerPhone) << ","
        << FileUtils::escapeCSVField(doctorName) << ","
        << subtotal << ","
        << discountPercentage << ","
        << discountAmount << ","
        << taxPercentage << ","
        << taxAmount << ","
        << grandTotal << ","
        << totalProfit;
    return oss.str();
}

Invoice Invoice::headerFromCSV(const std::string& csvLine) {
    std::vector<std::string> fields = FileUtils::parseCSVLine(csvLine);
    if (fields.size() < 12) {
        return Invoice();
    }
    try {
        Invoice inv;
        inv.invoiceId = fields[0];
        inv.dateStr = fields[1];
        inv.customerName = fields[2];
        inv.customerPhone = fields[3];
        inv.doctorName = fields[4];
        inv.subtotal = std::stod(fields[5]);
        inv.discountPercentage = std::stod(fields[6]);
        inv.discountAmount = std::stod(fields[7]);
        inv.taxPercentage = std::stod(fields[8]);
        inv.taxAmount = std::stod(fields[9]);
        inv.grandTotal = std::stod(fields[10]);
        inv.totalProfit = std::stod(fields[11]);
        return inv;
    } catch (...) {
        return Invoice();
    }
}
