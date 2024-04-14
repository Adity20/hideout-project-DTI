
#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <fstream>
#include <sstream>
#include <functional>
#include <string>
#include <algorithm>
#include <iterator>
#include <memory>
#include <set>
#include <iostream>
#include <cstring>
#include <iomanip>
#include<cmath>
#include <numeric>
#include<User.h>
#include<Course.h>
#include <iostream>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/json.hpp>
#include <mongocxx/client.hpp>
#include <mongocxx/instance.hpp>
#include <mongocxx/uri.hpp>

using namespace std;
using bsoncxx::builder::stream::document;
using bsoncxx::builder::stream::finalize;

using bsoncxx::builder::basic::kvp;
using bsoncxx::builder::basic::make_array;
using bsoncxx::builder::basic::make_document;
using namespace std;
struct UserHash {
    std::size_t operator()(const User& user) const {
        return std::hash<std::string>()(user.username);
    }
};

struct UserEqual {
    bool operator()(const User& lhs, const User& rhs) const {
        return lhs.username == rhs.username;
    }
};
struct CourseHash {
    std::size_t operator()(const Course& course) const {
        return std::hash<std::string>()(course.courseName);
    }
};

struct CourseEqual {
    bool operator()(const Course& lhs, const Course& rhs) const {
        return lhs.courseName == rhs.courseName;
    }
};
using UserCourseMap = std::unordered_map<User, std::vector<Course>, UserHash, UserEqual>;
class RecommendationSystem{
    private:
        unique_ptr<User> currentUser;
    public:
     UserCourseMap userCourseInteraction;
      vector<Course> availableCourses;
     std::unordered_map<Course, std::vector<Course>, CourseHash, CourseEqual> courseInteractions;
    void addUser(User user){
        userCourseInteraction[user]=vector<Course>();
    }
    void addCourseToUser(User user,Course course){
        if (userCourseInteraction.find(user)!=userCourseInteraction.end()){
            userCourseInteraction[user].push_back(course);
        }
    }
    void displayUserCourseInteractions(const User& user){
        if(userCourseInteraction.find(user) != userCourseInteraction.end()){
            cout<<"User: "<<user.username<<endl;
            cout<<"Places: ";
            for (const Course& course:userCourseInteraction[user]){
                cout<<course.courseName<<",";
            }
            cout<<endl;
        }
    }
    vector<Course> loadAvailableCourses(const string& filename) {
    ifstream file(filename);

    if (!file.is_open()) {
        cerr << "Error opening file: " << filename << endl;
        return availableCourses;
    }

    string line;
    while (getline(file, line)) {
        stringstream ss(line);
        string c_name, genre;
        getline(ss, c_name, ',');
        getline(ss, genre, ',');
        Course course(c_name, genre);
        availableCourses.push_back(course);
    }

    file.close();
    return availableCourses;
}
void populateFromMongoDB(const std::string& uri_string, const std::string& db_name, const std::string& user_info_collection, const std::string& visited_places_collection, const std::string& places_collection) {
    mongocxx::instance inst{}; // Initialize MongoDB driver instance
    mongocxx::uri uri("mongodb://localhost:27017");
    try {
        mongocxx::client conn(uri);

        // Retrieve data from user_info collection
        mongocxx::database db = conn[db_name];
        mongocxx::collection coll = db[user_info_collection];
        auto cursor = coll.find({});

        for (auto&& doc : cursor) {
            if ((doc["_id"] && doc["_id"].type() == bsoncxx::type::k_oid) &&
                (doc["username"] && doc["username"].type() == bsoncxx::type::k_utf8)) {
                bsoncxx::oid user_obj_id = doc["_id"].get_oid().value;
                std::string password = std::string(doc["username"].get_utf8().value);
                std::string user_obj_id_str = user_obj_id.to_string();
                User user(user_obj_id_str, password); // Create User with user_obj_id and password
                addUser(user);
            }
            else {
                cout << "user_obj_id or password is not present or not a string" << endl;
            }
        }

        // Retrieve data from visited_places collection
        coll = db[visited_places_collection];
        auto visited_places_cursor = coll.find({});
        for (auto&& doc : visited_places_cursor) {
            if ((doc["user_obj_id"] && doc["user_obj_id"].type() == bsoncxx::type::k_oid) ||
                (doc["places_obj_id"] && doc["places_obj_id"].type() == bsoncxx::type::k_oid)) {
                bsoncxx::oid user_obj_id = doc["user_obj_id"].get_oid().value;
                bsoncxx::oid places_obj_id = doc["places_obj_id"].get_oid().value;
                std::string user_obj_id_str = user_obj_id.to_string();
                std::string places_obj_id_str = places_obj_id.to_string();
                mongocxx::collection places_coll = db[places_collection];
                auto places_result = places_coll.find_one(bsoncxx::from_json("{\"_id\": {\"$oid\": \"" + places_obj_id_str + "\"}}"));
                if (places_result) {
                    auto result_view = places_result->view(); // Convert to a view
                    if (result_view["type"] &&
                        result_view["type"].type() == bsoncxx::type::k_utf8) {
                        std::string type = std::string(result_view["type"].get_utf8().value);
                        Course course(places_obj_id_str, type);
                        addCourseToUser(User(user_obj_id_str, ""), course);
                    }
                    else {
                        std::cerr << "Missing place_name or type in places collection for ID: " << places_obj_id_str << std::endl;
                    }
                }
            }
            else {
                std::cerr << "Missing user_obj_id or places_obj_id in visited_places collection" << std::endl;
            }
        }
    }
    catch (const std::exception& e) {
        std::cerr << "Error during MongoDB population: " << e.what() << std::endl;
    }
}



//     void executePythonScript(const char* pythonInterpreter="python3", const char* pythonScript="p1.py") {
//     // Set up an array to hold the command and its arguments
//     const char* args[] = {pythonInterpreter, pythonScript, NULL};

//     // Execute the Python script using execvp
//     execvp(pythonInterpreter, const_cast<char* const*>(args));

//     // If execvp returns, there was an error
//     std::cerr << "Failed to execute the Python script." << std::endl;
// }

void displayUserConnections(const User& user) {
    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        const User& userObject = userIter->first;
        cout << "Connections for user " << userObject.username << ": ";
        for (const unique_ptr<User>& friendUser : userObject.connections) {
            cout << friendUser->username << ", ";
        }
        cout << endl;
    } else {
        cout << "User not found in the system." << endl;
    }
}

void addConnection(User user, unique_ptr<User> friendUser) {
    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        // Make sure that 'userIter->second' is a 'User' object, not a vector
        User& userObject = const_cast<User&>(userIter->first);
        userObject.connections.push_back(std::move(friendUser));
        cout << "Friend added successfully!" << endl;
    } else {
        cout << "User not found in the system. Make sure the user is registered." << endl;
    }
}
    void saveToCSV(const string& filename) {
        ofstream file(filename);
        if (!file.is_open()) {
            cerr << "Error opening file for writing: " << filename << endl;
            return;
        }

        for (const auto& entry : userCourseInteraction) {
            for (const Course& course : entry.second) {
                file << entry.first.username << "," << entry.first.password << "," << course.courseName <<course.genre<< endl;
            }
        }
        file.close();
    }
bool loginUser(const string& username, const string& password) {
    User inputUser(username, password);
    auto userIter = userCourseInteraction.find(inputUser);
    if (userIter != userCourseInteraction.end()) {
        const User& storedUser = userIter->first;
        if (storedUser.password == password) {
            currentUser = std::make_unique<User>(storedUser);
            return true;
        }
    }
    return false;
}
void saveUserCourseInteractionToCSV(const string& filename) {
    ofstream file(filename);
    if (!file.is_open()) {
        cerr << "Error opening file for writing: " << filename << endl;
        return;
    }
     file << "Username,Password,Course,Genre" << endl;
    // Write user and course data, excluding entries with username "Course"
    for (const auto& entry : userCourseInteraction) {
        if (entry.first.username != "Username") {
            for (const Course& course : entry.second) {
                file << entry.first.username << "," << entry.first.password << ","
                     << course.courseName << "," << course.genre << endl;
            }
        }
    }

    file.close();
}


void displayAvailableCourses() {
    cout << "Available Courses:" << endl;
    cout << left << setw(5) << "No." << setw(20) << "Course" << "Genre" << endl;
    
    int courseNumber = 1;
    for (const Course& course : availableCourses) {
        cout << left << setw(5) << courseNumber << setw(20) << course.courseName << course.genre << endl;
        courseNumber++;
    }
}

void convertCSVToGEXFWithoutSourceTarget(const std::string& csvFile, const std::string& gexfFile) {
    std::ifstream inputFile(csvFile);
    std::ofstream outputFile(gexfFile);

    if (!inputFile.is_open() || !outputFile.is_open()) {
        std::cerr << "Error opening files." << std::endl;
        return;
    }

    // Write the GEXF file header
    outputFile << "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" << std::endl;
    outputFile << "<gexf xmlns=\"http://www.gexf.net/1.3draft\" xmlns:viz=\"http://www.gexf.net/1.3draft/viz\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.gexf.net/1.3draft http://www.gexf.net/1.3draft/gexf.xsd\">" << std::endl;
    outputFile << "  <graph defaultedgetype=\"directed\" mode=\"static\">" << std::endl;

    std::unordered_set<std::string> uniqueNodes;

    // Write node data
    outputFile << "    <attributes class=\"node\" mode=\"static\">" << std::endl;
    outputFile << "      <attribute id=\"0\" title=\"name\" type=\"string\" />" << std::endl;
    outputFile << "    </attributes>" << std::endl;

    // Write the graph data
    std::string line;
    while (std::getline(inputFile, line)) {
        std::string source, target;
        std::istringstream iss(line);
        if (std::getline(iss, source, ',') && std::getline(iss, target, ',')) {
            if (uniqueNodes.find(source) == uniqueNodes.end()) {
                if (source != "Source" && source != "Target") {
                    outputFile << "    <node id=\"" << source << "\" label=\"" << source << "\">" << std::endl;
                    outputFile << "      <attvalues>" << std::endl;
                    outputFile << "        <attvalue for=\"0\" value=\"" << source << "\" />" << std::endl;
                    outputFile << "      </attvalues>" << std::endl;
                    outputFile << "    </node>" << std::endl;
                }
                uniqueNodes.insert(source);
            }
            if (uniqueNodes.find(target) == uniqueNodes.end()) {
                if (target != "Source" && target != "Target") {
                    outputFile << "    <node id=\"" << target << "\" label=\"" << target << "\">" << std::endl;
                    outputFile << "      <attvalues>" << std::endl;
                    outputFile << "        <attvalue for=\"0\" value=\"" << target << "\" />" << std::endl;
                    outputFile << "      </attvalues>" << std::endl;
                    outputFile << "    </node>" << std::endl;
                }
                uniqueNodes.insert(target);
            }
        }
    }

    // Write the graph data (edges) after node creation
    inputFile.clear();
    inputFile.seekg(0);

    while (std::getline(inputFile, line)) {
        std::string source, target;
        std::istringstream iss(line);
        if (std::getline(iss, source, ',') && std::getline(iss, target, ',')) {
            if (source != "Source" && target != "Target") {
                outputFile << "    <edge source=\"" << source << "\" target=\"" << target << "\" />" << std::endl;
            }
        }
    }

    // Write the GEXF file footer
    outputFile << "  </graph>" << std::endl;
    outputFile << "</gexf>" << std::endl;

    inputFile.close();
    outputFile.close();
}


void exportGraphData(const UserCourseMap& userCourseInteraction, const string& filename) {
    set<pair<string, string>> writtenConnections;

    // Load existing connections from the CSV file
    ifstream existingFile(filename);
    if (existingFile.is_open()) {
        string line;
        while (getline(existingFile, line)) {
            stringstream ss(line);
            string source, target;
            getline(ss, source, ',');
            getline(ss, target, ',');
            writtenConnections.insert({source, target});
        }
        existingFile.close();
    }

    ofstream file(filename, ios::app); // Open the file in append mode
    if (!file.is_open()) {
        cerr << "Error opening file for writing: " << filename << endl;
        return;
    }


    for (const auto& entry : userCourseInteraction) {
        const User& user = entry.first;
        for (const unique_ptr<User>& friendUser : user.connections) {
            pair<string, string> connection(user.username, friendUser->username);
            if (writtenConnections.find(connection) == writtenConnections.end()) {
                // Export the relationship between the user and their friend
                file << user.username << "," << friendUser->username << endl;
            }
        }
    }

    file.close();
}

void establishCourseInteractions() {
    // Clear the existing course interactions
    courseInteractions.clear();

    for (const auto& userEntry : userCourseInteraction) {
        const vector<Course>& userCourses = userEntry.second;
        
        for (const Course& userCourse : userCourses) {
            for (const auto& otherUserEntry : userCourseInteraction) {
                if (userEntry.first.username != otherUserEntry.first.username) {  // Use != for comparison
                    const vector<Course>& otherUserCourses = otherUserEntry.second;
                    for (const Course& otherCourse : otherUserCourses) {
                        if (userCourse.genre == otherCourse.genre) {
                            courseInteractions[userCourse].push_back(otherCourse);
                        }
                    }
                }
            }
        }
    }
}


void displayCourseInteractions(const UserCourseMap& userCourseInteraction, const std::unordered_map<Course, std::vector<Course>, CourseHash, CourseEqual>& courseInteractions) {
    for (const auto& entry : courseInteractions) {
        const Course& course = entry.first;
        const std::vector<Course>& relatedCourses = entry.second;

        cout << "Course: " << course.courseName << " (Genre: " << course.genre << ")" << endl;
        cout << "Related Courses: ";

        for (const Course& relatedCourse : relatedCourses) {
            cout << relatedCourse.courseName << " (Genre: " << relatedCourse.genre << "), ";
        }

        cout << endl;
    }
}


vector<Course> getUserEnrolledCourses(const User& user) {
    vector<Course> enrolledCourses;

    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        enrolledCourses = userIter->second;
    }

    return enrolledCourses;
}
void displayCourseRecommendations(const User& user, const UserCourseMap& userCourseInteraction, const std::unordered_map<Course, std::vector<Course>, CourseHash, CourseEqual>& courseInteractions) {
    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        const std::vector<Course>& userEnrolledCourses = userIter->second;

        for (const Course& enrolledCourse : userEnrolledCourses) {
            cout << "Because you visited " << enrolledCourse.courseName << " (Type: " << enrolledCourse.genre << "), we recommend the following Places:" << endl;

            auto recommendationsIter = courseInteractions.find(enrolledCourse);
            if (recommendationsIter != courseInteractions.end()) {
                const std::vector<Course>& recommendedCourses = recommendationsIter->second;
                for (const Course& recommendedCourse : recommendedCourses) {
                    cout << "  - " << recommendedCourse.courseName << " (Type: " << recommendedCourse.genre << ")" << endl;
                }
                break;
            }
        }
    } else {
        cout << "User not found in the system or not enrolled in any courses." << endl;
    }
}
double computeJaccardSimilarity(const vector<Course>& set1, const vector<Course>& set2) {
    set<Course> intersectionSet, unionSet;

    // Calculate intersection
    for (const Course& course : set1) {
        if (find(set2.begin(), set2.end(), course) != set2.end()) {
            intersectionSet.insert(course);
        }
    }

    // Calculate union
    unionSet.insert(set1.begin(), set1.end());
    unionSet.insert(set2.begin(), set2.end());

    // Calculate Jaccard similarity
    if (!unionSet.empty()) {
        return static_cast<double>(intersectionSet.size()) / unionSet.size();
    } else {
        // Handle the case where the union is empty to avoid division by zero
        return 0.0;
    }
}
void calc(const User& user){
    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        const User& userObject = userIter->first;

        for (const unique_ptr<User>& friendUser : userObject.connections) {
            auto friendIter = userCourseInteraction.find(*friendUser);
            if (friendIter != userCourseInteraction.end()) {
                const vector<Course>& friendCourses = friendIter->second;

                double similarity = computeJaccardSimilarity(userIter->second, friendCourses);
                cout<<"User:"<<friendIter->first.username;
                cout<<"----similarity: "<<similarity<<endl;}
        }
}
}
double computeCosineSimilarity(const std::vector<Course>& vector1, const std::vector<Course>& vector2) {
    // Calculate the dot product of the two vectors
    double dotProduct = 0.0;
    for (const Course& course : vector1) {
        if (std::find(vector2.begin(), vector2.end(), course) != vector2.end()) {
            dotProduct += 1.0;
        }
    }

    // Calculate the magnitudes of the vectors
    double magnitude1 = std::sqrt(vector1.size());
    double magnitude2 = std::sqrt(vector2.size());

    // Calculate the cosine similarity
    double similarity = dotProduct / (magnitude1 * magnitude2);

    return similarity;
}

// Function to get user recommendations based on cosine similarity
std::vector<Course> getUserRecommendations(const User& user, const UserCourseMap& userCourseInteraction) {
    std::vector<Course> recommendations;

    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        const User& userObject = userIter->first;

        for (const auto& otherUserEntry : userCourseInteraction) {
            if (userObject.username != otherUserEntry.first.username) {
                const User& otherUserObject = otherUserEntry.first;
                const std::vector<Course>& otherUserCourses = otherUserEntry.second;

                double similarity = computeCosineSimilarity(userIter->second, otherUserCourses);

                // Check if the other user has a higher cosine similarity
                if (similarity > 0.1) {
                    // Loop through the courses of the other user
                    for (const Course& recommendedCourse : otherUserCourses) {
                        // Check if the recommended course is not already in recommendations
                        if (std::find(recommendations.begin(), recommendations.end(), recommendedCourse) == recommendations.end()) {
                            recommendations.push_back(recommendedCourse);
                        }
                    }
                }
            }
        }
    }

    // Remove courses the user is already enrolled in
    auto userEnrolledCourses = userCourseInteraction.at(user);
    recommendations.erase(std::remove_if(recommendations.begin(), recommendations.end(),
        [&userEnrolledCourses](const Course& course) {
            return std::find(userEnrolledCourses.begin(), userEnrolledCourses.end(), course) != userEnrolledCourses.end();
        }), recommendations.end());

    return recommendations;
}
vector<Course> getRec(const User& user) {
    vector<Course> recommendations;

    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        const User& userObject = userIter->first;

        for (const unique_ptr<User>& friendUser : userObject.connections) {
            auto friendIter = userCourseInteraction.find(*friendUser);
            if (friendIter != userCourseInteraction.end()) {
                const vector<Course>& friendCourses = friendIter->second;

                double similarity = computeJaccardSimilarity(userIter->second, friendCourses);

                // Check if the friend has a higher Jaccard similarity
                if (similarity > 0.1) {
                    // Loop through the courses of the friendUser
                    for (const Course& recommendedCourse : friendCourses) {
                        // Check if the recommended course is not already in recommendations
                        if (find(recommendations.begin(), recommendations.end(), recommendedCourse) == recommendations.end()) {
                            recommendations.push_back(recommendedCourse);
                        }
                    }
                }
            }
        }
    }

    // Remove courses the user is already enrolled in
    auto userEnrolledCourses = userCourseInteraction[user];
    recommendations.erase(std::remove_if(recommendations.begin(), recommendations.end(),
        [&userEnrolledCourses](const Course& course) {
            return std::find(userEnrolledCourses.begin(), userEnrolledCourses.end(), course) != userEnrolledCourses.end();
        }), recommendations.end());

    return recommendations;
}
void displayUserSimilarities(const User& currentUser) {
    // Display all users and their similarity to the current user
     auto userIter = userCourseInteraction.find(currentUser);
    if (userIter != userCourseInteraction.end()) {
        const User& userObject = userIter->first;

        for (const auto& otherUserEntry : userCourseInteraction) {
            if (userObject.username != otherUserEntry.first.username) {
                const User& otherUserObject = otherUserEntry.first;
                const std::vector<Course>& otherUserCourses = otherUserEntry.second;

                double similarity = computeCosineSimilarity(userIter->second, otherUserCourses);
                cout<<"User:"<<otherUserObject.username;
                cout<<"---Similarity: "<<similarity<<endl;
                }
        }
    }


}

vector<Course> getRecommendations(const User& user) {
    vector<Course> recommendations;

    auto userIter = userCourseInteraction.find(user);
    if (userIter != userCourseInteraction.end()) {
        const User& userObject = userIter->first;

        for (const unique_ptr<User>& friendUser : userObject.connections) {
            // Loop through the courses of the friendUser
            auto it = userCourseInteraction.find(*friendUser);
            if (it != userCourseInteraction.end()) {
                const vector<Course>& friendCourses = it->second;
                for (const Course& recommendedCourse : friendCourses) {
                    // Check if the recommended course is not already in recommendations
                    if (find(recommendations.begin(), recommendations.end(), recommendedCourse) == recommendations.end()) {
                        recommendations.push_back(recommendedCourse);
                    }
                }
            }
        }
    }

    // Remove courses the user is already enrolled in
    auto userEnrolledCourses = userCourseInteraction[user];
    recommendations.erase(std::remove_if(recommendations.begin(), recommendations.end(),
        [&userEnrolledCourses](const Course& course) {
            return std::find(userEnrolledCourses.begin(), userEnrolledCourses.end(), course) != userEnrolledCourses.end();
        }), recommendations.end());


    return recommendations;
}

    unique_ptr<User>& getCurrentUser() {
        return currentUser;
    }
};