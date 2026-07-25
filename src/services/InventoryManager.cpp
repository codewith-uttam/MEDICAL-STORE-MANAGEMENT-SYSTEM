#include "services/InventoryManager.hpp"
#include "utils/FileUtils.hpp"
#include <algorithm>
#include <sstream>
#include <iomanip>
#include <iostream>

static std::string toLower(std::string s) {
    std::transform(s.begin(), s.end(), s.begin(), [](unsigned char c){ return std::tolower(c); });
    return s;
}

InventoryManager::InventoryManager(std::string dataPath)
    : dataFilePath(dataPath) {
    loadData();
}

bool InventoryManager::loadData() {
    medicines.clear();
    if (!FileUtils::fileExists(dataFilePath)) {
        return false;
    }

    std::vector<std::string> lines = FileUtils::readLines(dataFilePath);
    if (lines.empty()) return true;

    // Skip header line if present
    size_t startIdx = 0;
    if (!lines.empty() && lines[0].rfind("ID,", 0) == 0) {
        startIdx = 1;
    }

    for (size_t i = startIdx; i < lines.size(); ++i) {
        if (lines[i].empty()) continue;
        Medicine med = Medicine::fromCSV(lines[i]);
        if (!med.getId().empty()) {
            medicines.push_back(med);
        }
    }
    return true;
}

bool InventoryManager::saveData() const {
    size_t lastSlash = dataFilePath.find_last_of("/\\");
    if (lastSlash != std::string::npos) {
        FileUtils::ensureDirectoryExists(dataFilePath.substr(0, lastSlash));
    }

    std::vector<std::string> lines;
    lines.push_back("ID,Name,GenericName,Category,SupplierID,BatchNumber,MfgDate,ExpDate,PurchasePrice,SellingPrice,Quantity,RackLocation");

    for (const auto& med : medicines) {
        lines.push_back(med.toCSV());
    }

    return FileUtils::writeLines(dataFilePath, lines);
}

bool InventoryManager::addMedicine(const Medicine& med) {
    if (getMedicineById(med.getId()) != nullptr) {
        return false; // Duplicate ID
    }
    medicines.push_back(med);
    saveData();
    return true;
}

bool InventoryManager::updateMedicine(const Medicine& med) {
    for (size_t i = 0; i < medicines.size(); ++i) {
        if (medicines[i].getId() == med.getId()) {
            medicines[i] = med;
            saveData();
            return true;
        }
    }
    return false;
}

bool InventoryManager::deleteMedicine(const std::string& id) {
    auto it = std::remove_if(medicines.begin(), medicines.end(),
                             [&id](const Medicine& m) { return m.getId() == id; });

    if (it != medicines.end()) {
        medicines.erase(it, medicines.end());
        saveData();
        return true;
    }
    return false;
}

const Medicine* InventoryManager::getMedicineById(const std::string& id) const {
    for (const auto& m : medicines) {
        if (m.getId() == id) return &m;
    }
    return nullptr;
}

Medicine* InventoryManager::getMedicineByIdMutable(const std::string& id) {
    for (auto& m : medicines) {
        if (m.getId() == id) return &m;
    }
    return nullptr;
}

std::vector<Medicine> InventoryManager::getAllMedicines() const {
    return medicines;
}

std::vector<Medicine> InventoryManager::searchByName(const std::string& nameQuery) const {
    std::vector<Medicine> result;
    std::string q = toLower(nameQuery);
    for (const auto& m : medicines) {
        if (toLower(m.getName()).find(q) != std::string::npos) {
            result.push_back(m);
        }
    }
    return result;
}

std::vector<Medicine> InventoryManager::searchByGenericName(const std::string& genericQuery) const {
    std::vector<Medicine> result;
    std::string q = toLower(genericQuery);
    for (const auto& m : medicines) {
        if (toLower(m.getGenericName()).find(q) != std::string::npos) {
            result.push_back(m);
        }
    }
    return result;
}

std::vector<Medicine> InventoryManager::searchByCategory(const std::string& category) const {
    std::vector<Medicine> result;
    std::string q = toLower(category);
    for (const auto& m : medicines) {
        if (toLower(m.getCategory()).find(q) != std::string::npos) {
            result.push_back(m);
        }
    }
    return result;
}

std::vector<Medicine> InventoryManager::getLowStockMedicines(int threshold) const {
    std::vector<Medicine> result;
    for (const auto& m : medicines) {
        if (m.isLowStock(threshold)) {
            result.push_back(m);
        }
    }
    return result;
}

std::vector<Medicine> InventoryManager::getExpiringMedicines(int withinDays) const {
    std::vector<Medicine> result;
    for (const auto& m : medicines) {
        if (!m.isExpired() && m.isExpiringSoon(withinDays)) {
            result.push_back(m);
        }
    }
    return result;
}

std::vector<Medicine> InventoryManager::getExpiredMedicines() const {
    std::vector<Medicine> result;
    for (const auto& m : medicines) {
        if (m.isExpired()) {
            result.push_back(m);
        }
    }
    return result;
}

std::string InventoryManager::generateNextId() const {
    int maxNum = 0;
    for (const auto& m : medicines) {
        std::string idStr = m.getId();
        if (idStr.rfind("MED-", 0) == 0) {
            try {
                int num = std::stoi(idStr.substr(4));
                if (num > maxNum) maxNum = num;
            } catch (...) {}
        }
    }

    std::ostringstream oss;
    oss << "MED-" << std::setw(3) << std::setfill('0') << (maxNum + 1);
    return oss.str();
}
