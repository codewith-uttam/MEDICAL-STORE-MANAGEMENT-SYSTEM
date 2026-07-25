#include "models/Medicine.hpp"
#include "utils/DateUtils.hpp"
#include "utils/FileUtils.hpp"
#include <sstream>
#include <iostream>

Medicine::Medicine()
    : id(""), name(""), genericName(""), category("Tablet"),
      supplierId(""), batchNumber(""), mfgDate(""), expDate(""),
      purchasePrice(0.0), sellingPrice(0.0), quantity(0), rackLocation("") {}

Medicine::Medicine(std::string id, std::string name, std::string genericName, std::string category,
                   std::string supplierId, std::string batchNumber, std::string mfgDate, std::string expDate,
                   double purchasePrice, double sellingPrice, int quantity, std::string rackLocation)
    : id(id), name(name), genericName(genericName), category(category),
      supplierId(supplierId), batchNumber(batchNumber), mfgDate(mfgDate), expDate(expDate),
      purchasePrice(purchasePrice), sellingPrice(sellingPrice), quantity(quantity), rackLocation(rackLocation) {}

bool Medicine::reduceStock(int amount) {
    if (amount <= 0 || amount > quantity) return false;
    quantity -= amount;
    return true;
}

void Medicine::addStock(int amount) {
    if (amount > 0) {
        quantity += amount;
    }
}

bool Medicine::isExpired() const {
    if (expDate.empty()) return false;
    return DateUtils::isExpired(expDate);
}

bool Medicine::isExpiringSoon(int withinDays) const {
    if (expDate.empty()) return false;
    return DateUtils::isExpiringSoon(expDate, withinDays);
}

bool Medicine::isLowStock(int threshold) const {
    return quantity <= threshold;
}

double Medicine::calculateProfitMargin() const {
    return sellingPrice - purchasePrice;
}

std::string Medicine::toCSV() const {
    std::ostringstream oss;
    oss << FileUtils::escapeCSVField(id) << ","
        << FileUtils::escapeCSVField(name) << ","
        << FileUtils::escapeCSVField(genericName) << ","
        << FileUtils::escapeCSVField(category) << ","
        << FileUtils::escapeCSVField(supplierId) << ","
        << FileUtils::escapeCSVField(batchNumber) << ","
        << FileUtils::escapeCSVField(mfgDate) << ","
        << FileUtils::escapeCSVField(expDate) << ","
        << purchasePrice << ","
        << sellingPrice << ","
        << quantity << ","
        << FileUtils::escapeCSVField(rackLocation);
    return oss.str();
}

Medicine Medicine::fromCSV(const std::string& csvLine) {
    std::vector<std::string> fields = FileUtils::parseCSVLine(csvLine);
    if (fields.size() < 12) {
        return Medicine();
    }

    try {
        double pp = std::stod(fields[8]);
        double sp = std::stod(fields[9]);
        int q = std::stoi(fields[10]);

        return Medicine(fields[0], fields[1], fields[2], fields[3],
                        fields[4], fields[5], fields[6], fields[7],
                        pp, sp, q, fields[11]);
    } catch (...) {
        return Medicine();
    }
}
