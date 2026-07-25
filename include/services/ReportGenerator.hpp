#ifndef REPORT_GENERATOR_HPP
#define REPORT_GENERATOR_HPP

#include "services/InventoryManager.hpp"
#include "services/SalesManager.hpp"
#include "services/SupplierManager.hpp"
#include <string>
#include <vector>

struct InventoryValuation {
    int totalItems;
    int totalQuantity;
    double totalCostValue;
    double totalSellingValue;
    double totalPotentialProfit;
};

struct SalesSummary {
    int totalOrders;
    double totalRevenue;
    double totalCost;
    double totalProfit;
    double averageOrderValue;
};

class ReportGenerator {
private:
    const InventoryManager& inventoryManager;
    const SalesManager& salesManager;
    const SupplierManager& supplierManager;

public:
    ReportGenerator(const InventoryManager& invMgr,
                    const SalesManager& salesMgr,
                    const SupplierManager& supMgr);

    // Business Reports
    InventoryValuation getInventoryValuation() const;
    SalesSummary getOverallSalesSummary() const;
    SalesSummary getSalesSummaryForDateRange(const std::string& startDate, const std::string& endDate) const;

    // Formatting methods for console display
    void displayInventoryValuationReport() const;
    void displaySalesReport(const std::string& startDate = "", const std::string& endDate = "") const;
    void displayExpiredStockLossReport() const;
    void displayTopSellingMedicinesReport(int topN = 5) const;
    void displaySupplierSummaryReport() const;
};

#endif // REPORT_GENERATOR_HPP
