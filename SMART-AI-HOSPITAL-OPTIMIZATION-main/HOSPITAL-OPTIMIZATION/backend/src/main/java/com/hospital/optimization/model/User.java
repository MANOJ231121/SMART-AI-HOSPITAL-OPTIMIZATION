package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;

    @Indexed(unique = true)
    private String email;
    private String password;
    private String phone;
    private UserRole role;
    private boolean active = true;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String emergencyContact;

    // Doctor/Staff metadata
    private String specialization;
    private String department;
    private String departmentId;
    private String roomNumber;
    private String cabin;
    private boolean available = true;
    private int currentQueueLength;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public User() {}

    public User(String id, String name, String email, String password, String phone, UserRole role, boolean active, String gender, String dateOfBirth, String address, String emergencyContact, String specialization, String department, String departmentId, String roomNumber, String cabin, boolean available, int currentQueueLength, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.role = role;
        this.active = active;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.specialization = specialization;
        this.department = department;
        this.departmentId = departmentId;
        this.roomNumber = roomNumber;
        this.cabin = cabin;
        this.available = available;
        this.currentQueueLength = currentQueueLength;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getCabin() { return cabin; }
    public void setCabin(String cabin) { this.cabin = cabin; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public int getCurrentQueueLength() { return currentQueueLength; }
    public void setCurrentQueueLength(int currentQueueLength) { this.currentQueueLength = currentQueueLength; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String id;
        private String name;
        private String email;
        private String password;
        private String phone;
        private UserRole role;
        private boolean active = true;
        private String gender;
        private String dateOfBirth;
        private String address;
        private String emergencyContact;
        private String specialization;
        private String department;
        private String departmentId;
        private String roomNumber;
        private String cabin;
        private boolean available = true;
        private int currentQueueLength;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserBuilder id(String id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder phone(String phone) { this.phone = phone; return this; }
        public UserBuilder role(UserRole role) { this.role = role; return this; }
        public UserBuilder active(boolean active) { this.active = active; return this; }
        public UserBuilder gender(String gender) { this.gender = gender; return this; }
        public UserBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public UserBuilder address(String address) { this.address = address; return this; }
        public UserBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public UserBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public UserBuilder department(String department) { this.department = department; return this; }
        public UserBuilder departmentId(String departmentId) { this.departmentId = departmentId; return this; }
        public UserBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public UserBuilder cabin(String cabin) { this.cabin = cabin; return this; }
        public UserBuilder available(boolean available) { this.available = available; return this; }
        public UserBuilder currentQueueLength(int currentQueueLength) { this.currentQueueLength = currentQueueLength; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public UserBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public User build() {
            return new User(id, name, email, password, phone, role, active, gender, dateOfBirth, address, emergencyContact, specialization, department, departmentId, roomNumber, cabin, available, currentQueueLength, createdAt, updatedAt);
        }
    }
}
