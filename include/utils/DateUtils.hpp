#ifndef DATE_UTILS_HPP
#define DATE_UTILS_HPP

#include <string>
#include <ctime>

namespace DateUtils {

// Get current date string in YYYY-MM-DD format
std::string getCurrentDateStr();

// Get current timestamp string in YYYY-MM-DD HH:MM:SS format
std::string getCurrentTimestampStr();

// Validate YYYY-MM-DD format
bool isValidDate(const std::string& dateStr);

// Parse YYYY-MM-DD to std::tm
bool parseDate(const std::string& dateStr, std::tm& outTm);

// Compare two dates (returns -1 if d1 < d2, 0 if equal, 1 if d1 > d2)
int compareDates(const std::string& d1, const std::string& d2);

// Calculate difference in days (d2 - d1)
int daysBetween(const std::string& d1, const std::string& d2);

// Check if a date string is past current date
bool isExpired(const std::string& expiryDate);

// Check if a date string expires within N days from today
bool isExpiringSoon(const std::string& expiryDate, int withinDays);

} // namespace DateUtils

#endif // DATE_UTILS_HPP
