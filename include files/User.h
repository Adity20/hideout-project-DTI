#pragma once
#include <string>
#include <vector>
#include <memory>

class User {
public:
    std::string username;
    std::string password;
    std::vector<std::unique_ptr<User>> connections;

    User() = default;
    User(std::string name, std::string pwd) : username(name), password(pwd) {}
    User(const User& other) : username(other.username), password(other.password) {
        for (const auto& connection : other.connections) {
            connections.push_back(std::make_unique<User>(*connection));
        }
    }
};