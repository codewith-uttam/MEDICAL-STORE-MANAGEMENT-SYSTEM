#ifndef FILE_UTILS_HPP
#define FILE_UTILS_HPP

#include <string>
#include <vector>

namespace FileUtils {

// Helper to check if file exists
bool fileExists(const std::string& filepath);

// Ensure directory exists (creates directory if missing)
bool ensureDirectoryExists(const std::string& dirpath);

// CSV parsing utilities
std::vector<std::string> parseCSVLine(const std::string& line);
std::string escapeCSVField(const std::string& field);

// File I/O helpers
std::vector<std::string> readLines(const std::string& filepath);
bool writeLines(const std::string& filepath, const std::vector<std::string>& lines);
bool appendLine(const std::string& filepath, const std::string& line);

} // namespace FileUtils

#endif // FILE_UTILS_HPP
