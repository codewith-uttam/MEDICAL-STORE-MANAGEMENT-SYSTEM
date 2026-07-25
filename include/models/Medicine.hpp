#ifndef MEDICINE_HPP
#define MEDICINE_HPP

#include <string>
#include <vector>

class Medicine {
private:
    std::string id;
    std::string name;
    std::string genericName;
    std::string category;      // e.g. Tablet, Syrup, Injection, Ointment, Equipment
    std::string supplierId;
    std::string batchNumber;
    std::string mfgDate;        // YYYY-MM-DD
    std::string expDate;        // YYYY-MM-DD
    double purchasePrice;
    double sellingPrice;
    int quantity;
    std::string rackLocation;

public:
    Medicine();
    Medicine(std::string id, std::string name, std::string genericName, std::string category,
             std::string supplierId, std::string batchNumber, std::string mfgDate, std::string expDate,
             double purchasePrice, double sellingPrice, int quantity, std::string rackLocation);

    // Getters
    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getGenericName() const { return genericName; }
    std::string getCategory() const { return category; }
    std::string getSupplierId() const { return supplierId; }
    std::string getBatchNumber() const { return batchNumber; }
    std::string getMfgDate() const { return mfgDate; }
    std::string getExpDate() const { return expDate; }
    double getPurchasePrice() const { return purchasePrice; }
    double getSellingPrice() const { return sellingPrice; }
    int getQuantity() const { return quantity; }
    std::string getRackLocation() const { return rackLocation; }

    // Setters
    void setName(const std::string& n) { name = n; }
    void setGenericName(const std::string& gn) { genericName = gn; }
    void setCategory(const std::string& c) { category = c; }
    void setSupplierId(const std::string& sId) { supplierId = sId; }
    void setBatchNumber(const std::string& b) { batchNumber = b; }
    void setMfgDate(const std::string& mfg) { mfgDate = mfg; }
    void setExpDate(const std::string& exp) { expDate = exp; }
    void setPurchasePrice(double pp) { purchasePrice = pp; }
    void setSellingPrice(double sp) { sellingPrice = sp; }
    void setQuantity(int q) { quantity = q; }
    void setRackLocation(const std::string& loc) { rackLocation = loc; }

    // Stock modification
    bool reduceStock(int amount);
    void addStock(int amount);

    // Helper queries
    bool isExpired() const;
    bool isExpiringSoon(int withinDays = 30) const;
    bool isLowStock(int threshold = 10) const;
    double calculateProfitMargin() const; // Per unit profit

    // CSV Persistence
    std::string toCSV() const;
    static Medicine fromCSV(const std::string& csvLine);
};

#endif // MEDICINE_HPP
