#include "utils/FileUtils.hpp"
#include <fstream>
#include <sstream>
#include <sys/stat.h>

namespace FileUtils {

bool fileExists(const std::string& filepath) {
    struct stat buffer;
    return (stat(filepath.c_str(), &buffer) == 0);
}

bool ensureDirectoryExists(const std::string& dirpath) {
    if (dirpath.empty() || dirpath == ".") return true;
    struct stat info;
    if (stat(dirpath.c_str(), &info) != 0) {
        // Directory does not exist, attempt to create it
        #ifdef _WIN32
            return _mkdir(dirpath.c_str()) == 0;
        #else
            return mkdir(dirpath.c_str(), 0755) == 0;
        #endif
    }
    return (info.st_mode & S_IFDIR) != 0;
}

std::vector<std::string> parseCSVLine(const std::string& line) {
    std::vector<std::string> fields;
    std::string currentField;
    bool inQuotes = false;

    for (size_t i = 0; i < line.length(); ++i) {
        char c = line[i];

        if (c == '"') {
            if (inQuotes && i + 1 < line.length() && line[i + 1] == '"') {
                currentField += '"';
                ++i; // Skip escaped quote
            } else {
                inQuotes = !inQuotes;
            }
        } else if (c == ',' && !inQuotes) {
            fields.push_back(currentField);
            currentField.clear();
        } else {
            currentField += c;
        }
    }
    fields.push_back(currentField);
    return fields;
}

std::string escapeCSVField(const std::string& field) {
    bool needsQuotes = false;
    if (field.find(',') != std::string::npos ||
        field.find('"') != std::string::npos ||
        field.find('\n') != std::string::npos) {
        needsQuotes = true;
    }

    if (!needsQuotes) {
        return field;
    }

    std::string escaped = "\"";
    for (char c : field) {
        if (c == '"') {
            escaped += "\"\"";
        } else {
            escaped += c;
        }
    }
    escaped += "\"";
    return escaped;
}

std::vector<std::string> readLines(const std::string& filepath) {
    std::vector<std::string> lines;
    std::ifstream file(filepath);
    if (!file.is_open()) return lines;

    std::string line;
    while (std::getline(file, line)) {
        if (!line.empty() && line.back() == '\r') {
            line.pop_back(); // Clean windows carriage return
        }
        lines.push_back(line);
    }
    file.close();
    return lines;
}

bool writeLines(const std::string& filepath, const std::vector<std::string>& lines) {
    std::ofstream file(filepath);
    if (!file.is_open()) return false;

    for (const auto& line : lines) {
        file << line << "\n";
    }
    file.close();
    return true;
}

bool appendLine(const std::string& filepath, const std::string& line) {
    std::ofstream file(filepath, std::ios::app);
    if (!file.is_open()) return false;

    file << line << "\n";
    file.close();
    return true;
}

} // namespace FileUtils
