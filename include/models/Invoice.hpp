#ifndef INVOICE_HPP
#define INVOICE_HPP

#include <string>
#include <vector>

struct InvoiceItem {
    std::string medicineId;
    std::string medicineName;
    std::string batchNumber;
    int quantity;
    double unitPrice;      // Selling price per unit
    double purchasePrice;   // Purchase price per unit (for profit tracking)
    double totalPrice;      // quantity * unitPrice

    std::string toCSV() const;
    static InvoiceItem fromCSV(const std::string& csvLine);
};

class Invoice {
private:
    std::string invoiceId;
    std::string dateStr;         // YYYY-MM-DD HH:MM:SS
    std::string customerName;
    std::string customerPhone;
    std::string doctorName;
    std::vector<InvoiceItem> items;
    double subtotal;
    double discountPercentage;
    double discountAmount;
    double taxPercentage;
    double taxAmount;
    double grandTotal;
    double totalProfit;

public:
    Invoice();
    Invoice(std::string invoiceId, std::string customerName, std::string customerPhone, std::string doctorName = "");

    void addItem(const InvoiceItem& item);
    void recalculateTotals(double discountPct = 0.0, double taxPct = 5.0);

    // Getters
    std::string getInvoiceId() const { return invoiceId; }
    std::string getDateStr() const { return dateStr; }
    void setDateStr(const std::string& d) { dateStr = d; }
    std::string getCustomerName() const { return customerName; }
    std::string getCustomerPhone() const { return customerPhone; }
    std::string getDoctorName() const { return doctorName; }
    const std::vector<InvoiceItem>& getItems() const { return items; }
    double getSubtotal() const { return subtotal; }
    double getDiscountPercentage() const { return discountPercentage; }
    double getDiscountAmount() const { return discountAmount; }
    double getTaxPercentage() const { return taxPercentage; }
    double getTaxAmount() const { return taxAmount; }
    double getGrandTotal() const { return grandTotal; }
    double getTotalProfit() const { return totalProfit; }

    // Serialization
    std::string toHeaderCSV() const;
    static Invoice headerFromCSV(const std::string& csvLine);
};

#endif // INVOICE_HPP
