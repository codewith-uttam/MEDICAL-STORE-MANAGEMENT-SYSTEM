#include "utils/ConsoleUI.hpp"
#include "utils/DateUtils.hpp"
#include <iostream>
#include <iomanip>
#include <limits>
#include <algorithm>

namespace ConsoleUI {

const std::string RESET   = "\033[0m";
const std::string BOLD    = "\033[1m";
const std::string RED     = "\033[31m";
const std::string GREEN   = "\033[32m";
const std::string YELLOW  = "\033[33m";
const std::string BLUE    = "\033[34m";
const std::string MAGENTA = "\033[35m";
const std::string CYAN    = "\033[36m";
const std::string WHITE   = "\033[37m";
const std::string BG_BLUE = "\033[44m\033[37m";

void clearScreen() {
    #ifdef _WIN32
        std::system("cls");
    #else
        std::cout << "\033[2J\033[1;1H";
    #endif
}

void pauseConsole() {
    std::cout << "\n" << CYAN << "Press Enter to continue..." << RESET;
    std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
}

void printBanner() {
    std::cout << BOLD << CYAN;
    std::cout << "=================================================================================\n";
    std::cout << "               MEDICAL STORE MANAGEMENT SYSTEM (C++17)                           \n";
    std::cout << "=================================================================================\n";
    std::cout << RESET;
}

void printHeader(const std::string& title) {
    std::cout << "\n" << BOLD << BG_BLUE << "  " << title << "  " << RESET << "\n";
    printDivider(85, '=');
}

void printSubHeader(const std::string& subtitle) {
    std::cout << "\n" << BOLD << YELLOW << ">> " << subtitle << RESET << "\n";
}

void printSuccess(const std::string& message) {
    std::cout << GREEN << BOLD << "[SUCCESS] " << RESET << GREEN << message << RESET << "\n";
}

void printError(const std::string& message) {
    std::cout << RED << BOLD << "[ERROR] " << RESET << RED << message << RESET << "\n";
}

void printWarning(const std::string& message) {
    std::cout << YELLOW << BOLD << "[WARNING] " << RESET << YELLOW << message << RESET << "\n";
}

void printInfo(const std::string& message) {
    std::cout << CYAN << BOLD << "[INFO] " << RESET << message << "\n";
}

void printDivider(int width, char ch) {
    std::cout << std::string(width, ch) << "\n";
}

void printTableHeader(const std::vector<std::string>& headers, const std::vector<int>& widths) {
    printDivider(85, '-');
    std::cout << BOLD << CYAN;
    for (size_t i = 0; i < headers.size() && i < widths.size(); ++i) {
        std::cout << std::left << std::setw(widths[i]) << headers[i];
    }
    std::cout << RESET << "\n";
    printDivider(85, '-');
}

void printTableRow(const std::vector<std::string>& row, const std::vector<int>& widths) {
    for (size_t i = 0; i < row.size() && i < widths.size(); ++i) {
        std::string cell = row[i];
        if (static_cast<int>(cell.length()) > widths[i] - 1 && widths[i] > 3) {
            cell = cell.substr(0, widths[i] - 4) + "...";
        }
        std::cout << std::left << std::setw(widths[i]) << cell;
    }
    std::cout << "\n";
}

std::string promptString(const std::string& promptStr, bool allowEmpty) {
    std::string input;
    while (true) {
        std::cout << BOLD << promptStr << RESET << ": ";
        std::getline(std::cin, input);

        // Trim leading and trailing whitespace
        size_t start = input.find_first_not_of(" \t\r\n");
        if (start == std::string::npos) {
            input = "";
        } else {
            size_t end = input.find_last_not_of(" \t\r\n");
            input = input.substr(start, end - start + 1);
        }

        if (!input.empty() || allowEmpty) {
            return input;
        }
        printError("Input cannot be empty. Please try again.");
    }
}

int promptInt(const std::string& promptStr, int minVal, int maxVal) {
    std::string input;
    while (true) {
        std::cout << BOLD << promptStr << RESET << " (" << minVal << "-" << maxVal << "): ";
        std::getline(std::cin, input);

        try {
            int val = std::stoi(input);
            if (val >= minVal && val <= maxVal) {
                return val;
            }
            printError("Value out of allowed range (" + std::to_string(minVal) + " to " + std::to_string(maxVal) + ").");
        } catch (...) {
            printError("Invalid integer entered. Please try again.");
        }
    }
}

double promptDouble(const std::string& promptStr, double minVal, double maxVal) {
    std::string input;
    while (true) {
        std::cout << BOLD << promptStr << RESET << " (" << minVal << "-" << maxVal << "): ";
        std::getline(std::cin, input);

        try {
            double val = std::stod(input);
            if (val >= minVal && val <= maxVal) {
                return val;
            }
            printError("Value out of allowed range.");
        } catch (...) {
            printError("Invalid numeric value entered. Please try again.");
        }
    }
}

std::string promptDate(const std::string& promptStr) {
    while (true) {
        std::string d = promptString(promptStr + " (YYYY-MM-DD)");
        if (DateUtils::isValidDate(d)) {
            return d;
        }
        printError("Invalid date format or value. Must be YYYY-MM-DD.");
    }
}

} // namespace ConsoleUI
