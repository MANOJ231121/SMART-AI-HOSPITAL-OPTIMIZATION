package com.hospital.optimization.dto;

import com.hospital.optimization.model.UserRole;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private String phone;
    private UserRole role;
    private boolean active;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String emergencyContact;
    private String specialization;
    private String department;
    private String roomNumber;

    public UserDto() {}

    public UserDto(String id, String name, String email, String phone, UserRole role, boolean active, String gender, String dateOfBirth, String address, String emergencyContact, String specialization, String department, String roomNumber) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.active = active;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.specialization = specialization;
        this.department = department;
        this.roomNumber = roomNumber;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

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

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public static UserDtoBuilder builder() {
        return new UserDtoBuilder();
    }

    public static class UserDtoBuilder {
        private String id;
        private String name;
        private String email;
        private String phone;
        private UserRole role;
        private boolean active;
        private String gender;
        private String dateOfBirth;
        private String address;
        private String emergencyContact;
        private String specialization;
        private String department;
        private String roomNumber;

        public UserDtoBuilder id(String id) { this.id = id; return this; }
        public UserDtoBuilder name(String name) { this.name = name; return this; }
        public UserDtoBuilder email(String email) { this.email = email; return this; }
        public UserDtoBuilder phone(String phone) { this.phone = phone; return this; }
        public UserDtoBuilder role(UserRole role) { this.role = role; return this; }
        public UserDtoBuilder active(boolean active) { this.active = active; return this; }
        public UserDtoBuilder gender(String gender) { this.gender = gender; return this; }
        public UserDtoBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public UserDtoBuilder address(String address) { this.address = address; return this; }
        public UserDtoBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public UserDtoBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public UserDtoBuilder department(String department) { this.department = department; return this; }
        public UserDtoBuilder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }

        public UserDto build() {
            return new UserDto(id, name, email, phone, role, active, gender, dateOfBirth, address, emergencyContact, specialization, department, roomNumber);
        }
    }
}
