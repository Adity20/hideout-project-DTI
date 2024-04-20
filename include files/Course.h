#pragma once
#include <string>

class Course {
public:
    std::string courseName;
    std::string genre;

    Course(std::string name, std::string b) : courseName(name), genre(b) {}
    bool operator==(const Course& other) const {
        return this->courseName == other.courseName;
    }
    bool operator<(const Course& other) const {
        return this->courseName < other.courseName;
    }
};