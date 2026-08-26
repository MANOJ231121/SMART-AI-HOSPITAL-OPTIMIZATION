package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "patient_registrations")
public class PatientRegistration {
    @Id
    private String id;
    private String patientId;
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
    private List<String> extractedKeywords;
    private Map<String, String> extractedDetails;
    
    private String recommendedDepartment;
    private String departmentId;
    private String routingConfidence;
    private String routingReason;
    private String priority;
    private boolean emergency;
    
    private String doctorId;
    private String doctorName;
    private String cabin;
    private String tokenNumber;
    
    private String status;
    private String diagnosis;
    private String prescription;
    private String doctorNotes;

    private LocalDateTime createdAt;
    private LocalDateTime calledAt;
    private LocalDateTime completedAt;
    private LocalDateTime updatedAt;
    private String lastModifiedBy;

    public PatientRegistration() {}

    public PatientRegistration(String id, String patientId, String name, String phone, String email, int age, String gender, String dateOfBirth, String address, String emergencyContact, String language, String rawComplaint, String mainSymptom, String duration, String severity, String associatedSymptoms, List<String> extractedKeywords, Map<String, String> extractedDetails, String recommendedDepartment, String departmentId, String routingConfidence, String routingReason, String priority, boolean emergency, String doctorId, String doctorName, String cabin, String tokenNumber, String status, String diagnosis, String prescription, String doctorNotes, LocalDateTime createdAt, LocalDateTime calledAt, LocalDateTime completedAt, LocalDateTime updatedAt, String lastModifiedBy) {
        this.id = id;
        this.patientId = patientId;
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
        this.extractedKeywords = extractedKeywords;
        this.extractedDetails = extractedDetails;
        this.recommendedDepartment = recommendedDepartment;
        this.departmentId = departmentId;
        this.routingConfidence = routingConfidence;
        this.routingReason = routingReason;
        this.priority = priority;
        this.emergency = emergency;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.cabin = cabin;
        this.tokenNumber = tokenNumber;
        this.status = status;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.doctorNotes = doctorNotes;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.calledAt = calledAt;
        this.completedAt = completedAt;
        this.updatedAt = updatedAt;
        this.lastModifiedBy = lastModifiedBy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

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

    public List<String> getExtractedKeywords() { return extractedKeywords; }
    public void setExtractedKeywords(List<String> extractedKeywords) { this.extractedKeywords = extractedKeywords; }

    public Map<String, String> getExtractedDetails() { return extractedDetails; }
    public void setExtractedDetails(Map<String, String> extractedDetails) { this.extractedDetails = extractedDetails; }

    public String getRecommendedDepartment() { return recommendedDepartment; }
    public void setRecommendedDepartment(String recommendedDepartment) { this.recommendedDepartment = recommendedDepartment; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getRoutingConfidence() { return routingConfidence; }
    public void setRoutingConfidence(String routingConfidence) { this.routingConfidence = routingConfidence; }

    public String getRoutingReason() { return routingReason; }
    public void setRoutingReason(String routingReason) { this.routingReason = routingReason; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public boolean isEmergency() { return emergency; }
    public void setEmergency(boolean emergency) { this.emergency = emergency; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getCabin() { return cabin; }
    public void setCabin(String cabin) { this.cabin = cabin; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }

    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCalledAt() { return calledAt; }
    public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getLastModifiedBy() { return lastModifiedBy; }
    public void setLastModifiedBy(String lastModifiedBy) { this.lastModifiedBy = lastModifiedBy; }

    public static PatientRegistrationBuilder builder() {
        return new PatientRegistrationBuilder();
    }

    public static class PatientRegistrationBuilder {
        private String id;
        private String patientId;
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
        private List<String> extractedKeywords;
        private Map<String, String> extractedDetails;
        private String recommendedDepartment;
        private String departmentId;
        private String routingConfidence;
        private String routingReason;
        private String priority;
        private boolean emergency;
        private String doctorId;
        private String doctorName;
        private String cabin;
        private String tokenNumber;
        private String status;
        private String diagnosis;
        private String prescription;
        private String doctorNotes;
        private LocalDateTime createdAt;
        private LocalDateTime calledAt;
        private LocalDateTime completedAt;
        private LocalDateTime updatedAt;
        private String lastModifiedBy;

        public PatientRegistrationBuilder id(String id) { this.id = id; return this; }
        public PatientRegistrationBuilder patientId(String patientId) { this.patientId = patientId; return this; }
        public PatientRegistrationBuilder name(String name) { this.name = name; return this; }
        public PatientRegistrationBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientRegistrationBuilder email(String email) { this.email = email; return this; }
        public PatientRegistrationBuilder age(int age) { this.age = age; return this; }
        public PatientRegistrationBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientRegistrationBuilder dateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientRegistrationBuilder address(String address) { this.address = address; return this; }
        public PatientRegistrationBuilder emergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; return this; }
        public PatientRegistrationBuilder language(String language) { this.language = language; return this; }
        public PatientRegistrationBuilder rawComplaint(String rawComplaint) { this.rawComplaint = rawComplaint; return this; }
        public PatientRegistrationBuilder mainSymptom(String mainSymptom) { this.mainSymptom = mainSymptom; return this; }
        public PatientRegistrationBuilder duration(String duration) { this.duration = duration; return this; }
        public PatientRegistrationBuilder severity(String severity) { this.severity = severity; return this; }
        public PatientRegistrationBuilder associatedSymptoms(String associatedSymptoms) { this.associatedSymptoms = associatedSymptoms; return this; }
        public PatientRegistrationBuilder extractedKeywords(List<String> keywords) { this.extractedKeywords = keywords; return this; }
        public PatientRegistrationBuilder extractedDetails(Map<String, String> details) { this.extractedDetails = details; return this; }
        public PatientRegistrationBuilder recommendedDepartment(String dept) { this.recommendedDepartment = dept; return this; }
        public PatientRegistrationBuilder departmentId(String deptId) { this.departmentId = deptId; return this; }
        public PatientRegistrationBuilder routingConfidence(String conf) { this.routingConfidence = conf; return this; }
        public PatientRegistrationBuilder routingReason(String reason) { this.routingReason = reason; return this; }
        public PatientRegistrationBuilder priority(String priority) { this.priority = priority; return this; }
        public PatientRegistrationBuilder emergency(boolean emergency) { this.emergency = emergency; return this; }
        public PatientRegistrationBuilder doctorId(String docId) { this.doctorId = docId; return this; }
        public PatientRegistrationBuilder doctorName(String docName) { this.doctorName = docName; return this; }
        public PatientRegistrationBuilder cabin(String cabin) { this.cabin = cabin; return this; }
        public PatientRegistrationBuilder tokenNumber(String token) { this.tokenNumber = token; return this; }
        public PatientRegistrationBuilder status(String status) { this.status = status; return this; }
        public PatientRegistrationBuilder diagnosis(String diagnosis) { this.diagnosis = diagnosis; return this; }
        public PatientRegistrationBuilder prescription(String prescription) { this.prescription = prescription; return this; }
        public PatientRegistrationBuilder doctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; return this; }
        public PatientRegistrationBuilder createdAt(LocalDateTime time) { this.createdAt = time; return this; }
        public PatientRegistrationBuilder calledAt(LocalDateTime time) { this.calledAt = time; return this; }
        public PatientRegistrationBuilder completedAt(LocalDateTime time) { this.completedAt = time; return this; }
        public PatientRegistrationBuilder updatedAt(LocalDateTime time) { this.updatedAt = time; return this; }
        public PatientRegistrationBuilder lastModifiedBy(String by) { this.lastModifiedBy = by; return this; }

        public PatientRegistration build() {
            return new PatientRegistration(id, patientId, name, phone, email, age, gender, dateOfBirth, address, emergencyContact, language, rawComplaint, mainSymptom, duration, severity, associatedSymptoms, extractedKeywords, extractedDetails, recommendedDepartment, departmentId, routingConfidence, routingReason, priority, emergency, doctorId, doctorName, cabin, tokenNumber, status, diagnosis, prescription, doctorNotes, createdAt, calledAt, completedAt, updatedAt, lastModifiedBy);
        }
    }
}
