#include "services/SupplierManager.hpp"
#include "utils/FileUtils.hpp"
#include <algorithm>
#include <sstream>
#include <iomanip>

static std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c){ return std::tolower(c); });
    return s;
}

SupplierManager::SupplierManager(std::string dataPath)
    : dataFilePath(dataPath) {
    loadData();
}

bool SupplierManager::loadData() {
    suppliers.clear();
    if (!FileUtils::fileExists(dataFilePath)) {
        return false;
    }

    std::vector<std::string> lines = FileUtils::readLines(dataFilePath);
    if (lines.empty()) return true;

    size_t startIdx = 0;
    if (!lines.empty() && lines[0].rfind("ID,", 0) == 0) {
        startIdx = 1;
    }

    for (size_t i = startIdx; i < lines.size(); ++i) {
        if (lines[i].empty()) continue;
        Supplier sup = Supplier::fromCSV(lines[i]);
        if (!sup.getId().empty()) {
            suppliers.push_back(sup);
        }
    }
    return true;
}

bool SupplierManager::saveData() const {
    size_t lastSlash = dataFilePath.find_last_of("/\\");
    if (lastSlash != std::string::npos) {
        FileUtils::ensureDirectoryExists(dataFilePath.substr(0, lastSlash));
    }

    std::vector<std::string> lines;
    lines.push_back("ID,Name,ContactPerson,Phone,Email,Address");

    for (const auto& sup : suppliers) {
        lines.push_back(sup.toCSV());
    }

    return FileUtils::writeLines(dataFilePath, lines);
}

bool SupplierManager::addSupplier(const Supplier& supplier) {
    if (getSupplierById(supplier.getId()) != nullptr) {
        return false;
    }
    suppliers.push_back(supplier);
    saveData();
    return true;
}

bool SupplierManager::updateSupplier(const Supplier& supplier) {
    for (size_t i = 0; i < suppliers.size(); ++i) {
        if (suppliers[i].getId() == supplier.getId()) {
            suppliers[i] = supplier;
            saveData();
            return true;
        }
    }
    return false;
}

bool SupplierManager::deleteSupplier(const std::string& id) {
    auto it = std::remove_if(suppliers.begin(), suppliers.end(),
                             [&id](const Supplier& s) { return s.getId() == id; });

    if (it != suppliers.end()) {
        suppliers.erase(it, suppliers.end());
        saveData();
        return true;
    }
    return false;
}

const Supplier* SupplierManager::getSupplierById(const std::string& id) const {
    for (const auto& s : suppliers) {
        if (s.getId() == id) return &s;
    }
    return nullptr;
}

std::vector<Supplier> SupplierManager::getAllSuppliers() const {
    return suppliers;
}

std::vector<Supplier> SupplierManager::searchByName(const std::string& query) const {
    std::vector<Supplier> result;
    std::string q = toLower(query);
    for (const auto& s : suppliers) {
        if (toLower(s.getName()).find(q) != std::string::npos ||
            toLower(s.getContactPerson()).find(q) != std::string::npos) {
            result.push_back(s);
        }
    }
    return result;
}

std::string SupplierManager::generateNextId() const {
    int maxNum = 0;
    for (const auto& s : suppliers) {
        std::string idStr = s.getId();
        if (idStr.rfind("SUP-", 0) == 0) {
            try {
                int num = std::stoi(idStr.substr(4));
                if (num > maxNum) maxNum = num;
            } catch (...) {}
        }
    }

    std::ostringstream oss;
    oss << "SUP-" << std::setw(3) << std::setfill('0') << (maxNum + 1);
    return oss.str();
}
