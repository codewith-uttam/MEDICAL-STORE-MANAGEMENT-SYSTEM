#include "models/Supplier.hpp"
#include "utils/FileUtils.hpp"
#include <sstream>

Supplier::Supplier()
    : id(""), name(""), contactPerson(""), phone(""), email(""), address("") {}

Supplier::Supplier(std::string id, std::string name, std::string contactPerson,
                   std::string phone, std::string email, std::string address)
    : id(id), name(name), contactPerson(contactPerson),
      phone(phone), email(email), address(address) {}

std::string Supplier::toCSV() const {
    std::ostringstream oss;
    oss << FileUtils::escapeCSVField(id) << ","
        << FileUtils::escapeCSVField(name) << ","
        << FileUtils::escapeCSVField(contactPerson) << ","
        << FileUtils::escapeCSVField(phone) << ","
        << FileUtils::escapeCSVField(email) << ","
        << FileUtils::escapeCSVField(address);
    return oss.str();
}

Supplier Supplier::fromCSV(const std::string& csvLine) {
    std::vector<std::string> fields = FileUtils::parseCSVLine(csvLine);
    if (fields.size() < 6) {
        return Supplier();
    }
    return Supplier(fields[0], fields[1], fields[2], fields[3], fields[4], fields[5]);
}
