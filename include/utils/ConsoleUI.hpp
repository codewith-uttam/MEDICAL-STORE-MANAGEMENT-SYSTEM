#ifndef CONSOLE_UI_HPP
#define CONSOLE_UI_HPP

#include <string>
#include <vector>

namespace ConsoleUI {

// ANSI Color Codes
extern const std::string RESET;
extern const std::string BOLD;
extern const std::string RED;
extern const std::string GREEN;
extern const std::string YELLOW;
extern const std::string BLUE;
extern const std::string MAGENTA;
extern const std::string CYAN;
extern const std::string WHITE;
extern const std::string BG_BLUE;

// UI Utilities
void clearScreen();
void pauseConsole();
void printHeader(const std::string& title);
void printBanner();
void printSubHeader(const std::string& subtitle);

// Status Messages
void printSuccess(const std::string& message);
void printError(const std::string& message);
void printWarning(const std::string& message);
void printInfo(const std::string& message);

// Table formatting helper
void printDivider(int width = 85, char ch = '-');
void printTableHeader(const std::vector<std::string>& headers, const std::vector<int>& widths);
void printTableRow(const std::vector<std::string>& row, const std::vector<int>& widths);

// Input prompts with validation
std::string promptString(const std::string& promptStr, bool allowEmpty = false);
int promptInt(const std::string& promptStr, int minVal = 0, int maxVal = 1000000);
double promptDouble(const std::string& promptStr, double minVal = 0.0, double maxVal = 1000000.0);
std::string promptDate(const std::string& promptStr);

} // namespace ConsoleUI

#endif // CONSOLE_UI_HPP
