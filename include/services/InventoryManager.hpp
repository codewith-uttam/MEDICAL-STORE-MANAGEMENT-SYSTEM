#ifndef INVENTORY_MANAGER_HPP
#define INVENTORY_MANAGER_HPP

#include "models/Medicine.hpp"
#include <vector>
#include <string>
#include <memory>

class InventoryManager {
private:
    std::vector<Medicine> medicines;
    std::string dataFilePath;

public:
    explicit InventoryManager(std::string dataPath = "data/medicines.csv");

    // Load & Save
    bool loadData();
    bool saveData() const;

    // CRUD
    bool addMedicine(const Medicine& med);
    bool updateMedicine(const Medicine& med);
    bool deleteMedicine(const std::string& id);
    const Medicine* getMedicineById(const std::string& id) const;
    Medicine* getMedicineByIdMutable(const std::string& id);

    // Queries & Search
    std::vector<Medicine> getAllMedicines() const;
    std::vector<Medicine> searchByName(const std::string& nameQuery) const;
    std::vector<Medicine> searchByGenericName(const std::string& genericQuery) const;
    std::vector<Medicine> searchByCategory(const std::string& category) const;
    std::vector<Medicine> getLowStockMedicines(int threshold = 10) const;
    std::vector<Medicine> getExpiringMedicines(int withinDays = 30) const;
    std::vector<Medicine> getExpiredMedicines() const;

    // Utility ID Generator
    std::string generateNextId() const;
    size_t getTotalCount() const { return medicines.size(); }
};

#endif // INVENTORY_MANAGER_HPP
