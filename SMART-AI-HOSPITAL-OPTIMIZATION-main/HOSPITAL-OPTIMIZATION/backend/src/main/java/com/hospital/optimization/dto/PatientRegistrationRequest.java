package com.hospital.optimization.dto;

import java.util.Map;

public class PatientRegistrationRequest {
    private String name;
    private String phone;
    private String email;
    private int age;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String emergencyContact;
    private String language;
    
    private String rawComplaint;
    private String mainSymptom;
    private String duration;
    private String severity;
    private String associatedSymptoms;
    private Map<String, String> extractedDetails;
    
    private String department;
    private String doctorId;
    private String doctorName;
    private String cabin;

    public PatientRegistrationRequest() {}

    public PatientRegistrationRequest(String name, String phone, String email, int age, String gender, String dateOfBirth, String address, String emergencyContact, String language, String rawComplaint, String mainSymptom, String duration, String severity, String associatedSymptoms, Map<String, String> extractedDetails, String department, String doctorId, String doctorName, String cabin) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.language = language;
        this.rawComplaint = rawComplaint;
        this.mainSymptom = mainSymptom;
        this.duration = duration;
        this.severity = severity;
        this.associatedSymptoms = associatedSymptoms;
        this.extractedDetails = extractedDetails;
        this.department = department;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.cabin = cabin;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getRawComplaint() { return rawComplaint; }
    public void setRawComplaint(String rawComplaint) { this.rawComplaint = rawComplaint; }

    public String getMainSymptom() { return mainSymptom; }
    public void setMainSymptom(String mainSymptom) { this.mainSymptom = mainSymptom; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getAssociatedSymptoms() { return associatedSymptoms; }
    public void setAssociatedSymptoms(String associatedSymptoms) { this.associatedSymptoms = associatedSymptoms; }

    public Map<String, String> getExtractedDetails() { return extractedDetails; }
    public void setExtractedDetails(Map<String, String> extractedDetails) { this.extractedDetails = extractedDetails; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getCabin() { return cabin; }
    public void setCabin(String cabin) { this.cabin = cabin; }

    public static PatientRegistrationRequestBuilder builder() {
        return new PatientRegistrationRequestBuilder();
    }

    public static class PatientRegistrationRequestBuilder {
        private String name;
        private String phone;
        private String email;
        private int age;
        private String gender;
        private String dateOfBirth;
        private String address;
        private String emergencyContact;
        private String language;
        private String rawComplaint;
        private String mainSymptom;
        private String duration;
        private String severity;
        private String associatedSymptoms;
        private Map<String, String> extractedDetails;
        private String department;
        private String doctorId;
        private String doctorName;
        private String cabin;

        public PatientRegistrationRequestBuilder name(String name) { this.name = name; return this; }
        public PatientRegistrationRequestBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientRegistrationRequestBuilder email(String email) { this.email = email; return this; }
        public PatientRegistrationRequestBuilder age(int age) { this.age = age; return this; }
        public PatientRegistrationRequestBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientRegistrationRequestBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientRegistrationRequestBuilder address(String address) { this.address = address; return this; }
        public PatientRegistrationRequestBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public PatientRegistrationRequestBuilder language(String language) { this.language = language; return this; }
        public PatientRegistrationRequestBuilder rawComplaint(String rawComplaint) { this.rawComplaint = rawComplaint; return this; }
        public PatientRegistrationRequestBuilder mainSymptom(String mainSymptom) { this.mainSymptom = mainSymptom; return this; }
        public PatientRegistrationRequestBuilder duration(String duration) { this.duration = duration; return this; }
        public PatientRegistrationRequestBuilder severity(String severity) { this.severity = severity; return this; }
        public PatientRegistrationRequestBuilder associatedSymptoms(String associatedSymptoms) { this.associatedSymptoms = associatedSymptoms; return this; }
        public PatientRegistrationRequestBuilder extractedDetails(Map<String, String> extractedDetails) { this.extractedDetails = extractedDetails; return this; }
        public PatientRegistrationRequestBuilder department(String department) { this.department = department; return this; }
        public PatientRegistrationRequestBuilder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public PatientRegistrationRequestBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public PatientRegistrationRequestBuilder cabin(String cabin) { this.cabin = cabin; return this; }

        public PatientRegistrationRequest build() {
            return new PatientRegistrationRequest(name, phone, email, age, gender, dateOfBirth, address, emergencyContact, language, rawComplaint, mainSymptom, duration, severity, associatedSymptoms, extractedDetails, department, doctorId, doctorName, cabin);
        }
    }
}
