#include "utils/DateUtils.hpp"
#include <sstream>
#include <iomanip>
#include <chrono>

namespace DateUtils {

std::string getCurrentDateStr() {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time = std::chrono::system_clock::to_time_t(now);
    std::tm tm_now = *std::localtime(&now_time);

    std::ostringstream oss;
    oss << std::put_time(&tm_now, "%Y-%m-%d");
    return oss.str();
}

std::string getCurrentTimestampStr() {
    auto now = std::chrono::system_clock::now();
    std::time_t now_time = std::chrono::system_clock::to_time_t(now);
    std::tm tm_now = *std::localtime(&now_time);

    std::ostringstream oss;
    oss << std::put_time(&tm_now, "%Y-%m-%d %H:%M:%S");
    return oss.str();
}

bool parseDate(const std::string& dateStr, std::tm& outTm) {
    if (dateStr.length() < 10) return false;
    outTm = {};
    std::istringstream ss(dateStr);
    ss >> std::get_time(&outTm, "%Y-%m-%d");
    return !ss.fail();
}

bool isValidDate(const std::string& dateStr) {
    if (dateStr.length() != 10) return false;
    if (dateStr[4] != '-' || dateStr[7] != '-') return false;

    try {
        int year = std::stoi(dateStr.substr(0, 4));
        int month = std::stoi(dateStr.substr(5, 2));
        int day = std::stoi(dateStr.substr(8, 2));

        if (year < 2000 || year > 2100) return false;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > 31) return false;

        // Simple month-length check
        if ((month == 4 || month == 6 || month == 9 || month == 11) && day > 30) return false;
        if (month == 2) {
            bool isLeap = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);
            if (day > (isLeap ? 29 : 28)) return false;
        }
        return true;
    } catch (...) {
        return false;
    }
}

int compareDates(const std::string& d1, const std::string& d2) {
    // Standard ISO format YYYY-MM-DD allows direct string comparison!
    std::string s1 = d1.substr(0, 10);
    std::string s2 = d2.substr(0, 10);
    if (s1 < s2) return -1;
    if (s1 > s2) return 1;
    return 0;
}

int daysBetween(const std::string& d1, const std::string& d2) {
    std::tm tm1 = {};
    std::tm tm2 = {};

    if (!parseDate(d1, tm1) || !parseDate(d2, tm2)) {
        return 0;
    }

    std::time_t t1 = std::mktime(&tm1);
    std::time_t t2 = std::mktime(&tm2);

    double diffSeconds = std::difftime(t2, t1);
    return static_cast<int>(diffSeconds / (60 * 60 * 24));
}

bool isExpired(const std::string& expiryDate) {
    std::string today = getCurrentDateStr();
    return compareDates(expiryDate, today) < 0;
}

bool isExpiringSoon(const std::string& expiryDate, int withinDays) {
    std::string today = getCurrentDateStr();
    int days = daysBetween(today, expiryDate);
    return days >= 0 && days <= withinDays;
}

} // namespace DateUtils
