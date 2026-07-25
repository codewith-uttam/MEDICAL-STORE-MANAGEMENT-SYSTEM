#include "services/ReportGenerator.hpp"
#include "utils/ConsoleUI.hpp"
#include "utils/DateUtils.hpp"
#include <iostream>
#include <iomanip>
#include <sstream>
#include <map>
#include <algorithm>

ReportGenerator::ReportGenerator(const InventoryManager& invMgr,
                                 const SalesManager& salesMgr,
                                 const SupplierManager& supMgr)
    : inventoryManager(invMgr), salesManager(salesMgr), supplierManager(supMgr) {}

InventoryValuation ReportGenerator::getInventoryValuation() const {
    InventoryValuation val = {0, 0, 0.0, 0.0, 0.0};
    auto meds = inventoryManager.getAllMedicines();

    val.totalItems = static_cast<int>(meds.size());
    for (const auto& m : meds) {
        val.totalQuantity += m.getQuantity();
        val.totalCostValue += m.getQuantity() * m.getPurchasePrice();
        val.totalSellingValue += m.getQuantity() * m.getSellingPrice();
    }
    val.totalPotentialProfit = val.totalSellingValue - val.totalCostValue;
    return val;
}

SalesSummary ReportGenerator::getOverallSalesSummary() const {
    SalesSummary s = {0, 0.0, 0.0, 0.0, 0.0};
    auto invoices = salesManager.getAllInvoices();

    s.totalOrders = static_cast<int>(invoices.size());
    for (const auto& inv : invoices) {
        s.totalRevenue += inv.getGrandTotal();
        s.totalProfit += inv.getTotalProfit();
    }
    s.totalCost = s.totalRevenue - s.totalProfit;
    if (s.totalOrders > 0) {
        s.averageOrderValue = s.totalRevenue / s.totalOrders;
    }
    return s;
}

SalesSummary ReportGenerator::getSalesSummaryForDateRange(const std::string& startDate, const std::string& endDate) const {
    SalesSummary s = {0, 0.0, 0.0, 0.0, 0.0};
    auto invoices = salesManager.getInvoicesByDateRange(startDate, endDate);

    s.totalOrders = static_cast<int>(invoices.size());
    for (const auto& inv : invoices) {
        s.totalRevenue += inv.getGrandTotal();
        s.totalProfit += inv.getTotalProfit();
    }
    s.totalCost = s.totalRevenue - s.totalProfit;
    if (s.totalOrders > 0) {
        s.averageOrderValue = s.totalRevenue / s.totalOrders;
    }
    return s;
}

void ReportGenerator::displayInventoryValuationReport() const {
    ConsoleUI::printHeader("INVENTORY STOCK VALUATION REPORT");
    InventoryValuation val = getInventoryValuation();

    std::cout << std::fixed << std::setprecision(2);
    std::cout << ConsoleUI::BOLD << " Total Unique Medicines : " << ConsoleUI::CYAN << val.totalItems << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Total Physical Units   : " << ConsoleUI::CYAN << val.totalQuantity << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Total Asset Cost Value : $" << ConsoleUI::YELLOW << val.totalCostValue << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Total Expected Revenue : $" << ConsoleUI::GREEN << val.totalSellingValue << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Potential Gross Profit : $" << ConsoleUI::MAGENTA << val.totalPotentialProfit << ConsoleUI::RESET << "\n";
    ConsoleUI::printDivider(85, '-');
}

void ReportGenerator::displaySalesReport(const std::string& startDate, const std::string& endDate) const {
    std::string title = "OVERALL SALES & FINANCIAL REPORT";
    SalesSummary summary;

    if (!startDate.empty() && !endDate.empty()) {
        title = "SALES REPORT (" + startDate + " to " + endDate + ")";
        summary = getSalesSummaryForDateRange(startDate, endDate);
    } else {
        summary = getOverallSalesSummary();
    }

    ConsoleUI::printHeader(title);

    std::cout << std::fixed << std::setprecision(2);
    std::cout << ConsoleUI::BOLD << " Total Completed Invoices : " << ConsoleUI::CYAN << summary.totalOrders << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Gross Total Revenue      : $" << ConsoleUI::GREEN << summary.totalRevenue << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Total Goods Cost (COGS)  : $" << ConsoleUI::YELLOW << summary.totalCost << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Net Realized Profit      : $" << ConsoleUI::BOLD << ConsoleUI::GREEN << summary.totalProfit << ConsoleUI::RESET << "\n";
    std::cout << ConsoleUI::BOLD << " Average Invoice Value    : $" << ConsoleUI::CYAN << summary.averageOrderValue << ConsoleUI::RESET << "\n";
    ConsoleUI::printDivider(85, '-');
}

void ReportGenerator::displayExpiredStockLossReport() const {
    ConsoleUI::printHeader("EXPIRED MEDICINES LOSS REPORT");
    auto expired = inventoryManager.getExpiredMedicines();

    if (expired.empty()) {
        ConsoleUI::printSuccess("No expired medicines found in current inventory!");
        return;
    }

    std::vector<std::string> headers = {"ID", "Name", "Batch", "Exp Date", "Qty", "Cost Price ($)", "Total Loss ($)"};
    std::vector<int> widths = {10, 24, 14, 12, 8, 14, 14};

    ConsoleUI::printTableHeader(headers, widths);

    double totalLoss = 0.0;
    for (const auto& m : expired) {
        double loss = m.getQuantity() * m.getPurchasePrice();
        totalLoss += loss;

        std::ostringstream ppStr, lossStr;
        ppStr << std::fixed << std::setprecision(2) << m.getPurchasePrice();
        lossStr << std::fixed << std::setprecision(2) << loss;

        std::vector<std::string> row = {
            m.getId(), m.getName(), m.getBatchNumber(), m.getExpDate(),
            std::to_string(m.getQuantity()), ppStr.str(), lossStr.str()
        };
        ConsoleUI::printTableRow(row, widths);
    }

    ConsoleUI::printDivider(85, '-');
    std::cout << ConsoleUI::BOLD << ConsoleUI::RED << " TOTAL INVENTORY LOSS DUE TO EXPIRY: $"
              << std::fixed << std::setprecision(2) << totalLoss << ConsoleUI::RESET << "\n";
    ConsoleUI::printDivider(85, '=');
}

void ReportGenerator::displayTopSellingMedicinesReport(int topN) const {
    ConsoleUI::printHeader("TOP SELLING MEDICINES REPORT");

    std::map<std::string, std::pair<std::string, int>> salesCount; // ID -> <Name, QtySold>
    auto invoices = salesManager.getAllInvoices();

    for (const auto& inv : invoices) {
        for (const auto& item : inv.getItems()) {
            salesCount[item.medicineId].first = item.medicineName;
            salesCount[item.medicineId].second += item.quantity;
        }
    }

    if (salesCount.empty()) {
        ConsoleUI::printInfo("No sales records available yet.");
        return;
    }

    std::vector<std::pair<std::string, std::pair<std::string, int>>> sortedList(salesCount.begin(), salesCount.end());
    std::sort(sortedList.begin(), sortedList.end(),
              [](const auto& a, const auto& b) {
                  return a.second.second > b.second.second;
              });

    std::vector<std::string> headers = {"Rank", "Medicine ID", "Medicine Name", "Total Units Sold"};
    std::vector<int> widths = {8, 16, 40, 20};
    ConsoleUI::printTableHeader(headers, widths);

    int rank = 1;
    for (const auto& entry : sortedList) {
        if (rank > topN) break;
        std::vector<std::string> row = {
            std::to_string(rank++),
            entry.first,
            entry.second.first,
            std::to_string(entry.second.second)
        };
        ConsoleUI::printTableRow(row, widths);
    }
    ConsoleUI::printDivider(85, '-');
}

void ReportGenerator::displaySupplierSummaryReport() const {
    ConsoleUI::printHeader("SUPPLIER & INVENTORY SOURCES SUMMARY");
    auto suppliers = supplierManager.getAllSuppliers();
    auto medicines = inventoryManager.getAllMedicines();

    std::map<std::string, int> supMedCount;
    for (const auto& m : medicines) {
        supMedCount[m.getSupplierId()]++;
    }

    std::vector<std::string> headers = {"Supplier ID", "Supplier Name", "Contact Person", "Phone", "Medicines Supplied"};
    std::vector<int> widths = {14, 26, 20, 16, 20};
    ConsoleUI::printTableHeader(headers, widths);

    for (const auto& sup : suppliers) {
        int count = supMedCount[sup.getId()];
        std::vector<std::string> row = {
            sup.getId(), sup.getName(), sup.getContactPerson(), sup.getPhone(), std::to_string(count)
        };
        ConsoleUI::printTableRow(row, widths);
    }
    ConsoleUI::printDivider(85, '-');
}
