#ifndef SUPPLIER_MANAGER_HPP
#define SUPPLIER_MANAGER_HPP

#include "models/Supplier.hpp"
#include <vector>
#include <string>

class SupplierManager {
private:
    std::vector<Supplier> suppliers;
    std::string dataFilePath;

public:
    explicit SupplierManager(std::string dataPath = "data/suppliers.csv");

    bool loadData();
    bool saveData() const;

    bool addSupplier(const Supplier& supplier);
    bool updateSupplier(const Supplier& supplier);
    bool deleteSupplier(const std::string& id);
    const Supplier* getSupplierById(const std::string& id) const;

    std::vector<Supplier> getAllSuppliers() const;
    std::vector<Supplier> searchByName(const std::string& query) const;

    std::string generateNextId() const;
    size_t getTotalCount() const { return suppliers.size(); }
};

#endif // SUPPLIER_MANAGER_HPP
