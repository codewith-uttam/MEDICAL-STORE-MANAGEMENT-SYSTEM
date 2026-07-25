#ifndef SUPPLIER_HPP
#define SUPPLIER_HPP

#include <string>

class Supplier {
private:
    std::string id;
    std::string name;
    std::string contactPerson;
    std::string phone;
    std::string email;
    std::string address;

public:
    Supplier();
    Supplier(std::string id, std::string name, std::string contactPerson,
             std::string phone, std::string email, std::string address);

    // Getters
    std::string getId() const { return id; }
    std::string getName() const { return name; }
    std::string getContactPerson() const { return contactPerson; }
    std::string getPhone() const { return phone; }
    std::string getEmail() const { return email; }
    std::string getAddress() const { return address; }

    // Setters
    void setName(const std::string& n) { name = n; }
    void setContactPerson(const std::string& c) { contactPerson = c; }
    void setPhone(const std::string& p) { phone = p; }
    void setEmail(const std::string& e) { email = e; }
    void setAddress(const std::string& a) { address = a; }

    // CSV Persistence
    std::string toCSV() const;
    static Supplier fromCSV(const std::string& csvLine);
};

#endif // SUPPLIER_HPP
