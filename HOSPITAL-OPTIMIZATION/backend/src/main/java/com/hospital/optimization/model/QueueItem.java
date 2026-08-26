package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "queues")
public class QueueItem {
    @Id
    private String id;
    private String tokenNumber;
    private String registrationId;
    private String patientId;
    private String patientName;
    private int age;
    private String gender;
    private String complaint;
    private String doctorId;
    private String doctorName;
    private String cabin;
    private String department;
    private String departmentId;
    private int priority;
    private String priorityLabel;
    private String status;
    private int queuePosition;
    private int estimatedWaitMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime calledAt;
    private LocalDateTime completedAt;

    public QueueItem() {}

    public QueueItem(String id, String tokenNumber, String registrationId, String patientId, String patientName, int age, String gender, String complaint, String doctorId, String doctorName, String cabin, String department, String departmentId, int priority, String priorityLabel, String status, int queuePosition, int estimatedWaitMinutes, LocalDateTime createdAt, LocalDateTime calledAt, LocalDateTime completedAt) {
        this.id = id;
        this.tokenNumber = tokenNumber;
        this.registrationId = registrationId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.age = age;
        this.gender = gender;
        this.complaint = complaint;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.cabin = cabin;
        this.department = department;
        this.departmentId = departmentId;
        this.priority = priority;
        this.priorityLabel = priorityLabel;
        this.status = status;
        this.queuePosition = queuePosition;
        this.estimatedWaitMinutes = estimatedWaitMinutes;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
        this.calledAt = calledAt;
        this.completedAt = completedAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTokenNumber() { return tokenNumber; }
    public void setTokenNumber(String tokenNumber) { this.tokenNumber = tokenNumber; }

    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getComplaint() { return complaint; }
    public void setComplaint(String complaint) { this.complaint = complaint; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getCabin() { return cabin; }
    public void setCabin(String cabin) { this.cabin = cabin; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public int getPriority() { return priority; }
    public void setPriority(int priority) { this.priority = priority; }

    public String getPriorityLabel() { return priorityLabel; }
    public void setPriorityLabel(String priorityLabel) { this.priorityLabel = priorityLabel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getQueuePosition() { return queuePosition; }
    public void setQueuePosition(int queuePosition) { this.queuePosition = queuePosition; }

    public int getEstimatedWaitMinutes() { return estimatedWaitMinutes; }
    public void setEstimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCalledAt() { return calledAt; }
    public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public static QueueItemBuilder builder() {
        return new QueueItemBuilder();
    }

    public static class QueueItemBuilder {
        private String id;
        private String tokenNumber;
        private String registrationId;
        private String patientId;
        private String patientName;
        private int age;
        private String gender;
        private String complaint;
        private String doctorId;
        private String doctorName;
        private String cabin;
        private String department;
        private String departmentId;
        private int priority;
        private String priorityLabel;
        private String status;
        private int queuePosition;
        private int estimatedWaitMinutes;
        private LocalDateTime createdAt;
        private LocalDateTime calledAt;
        private LocalDateTime completedAt;

        public QueueItemBuilder id(String id) { this.id = id; return this; }
        public QueueItemBuilder tokenNumber(String token) { this.tokenNumber = token; return this; }
        public QueueItemBuilder registrationId(String regId) { this.registrationId = regId; return this; }
        public QueueItemBuilder patientId(String patientId) { this.patientId = patientId; return this; }
        public QueueItemBuilder patientName(String name) { this.patientName = name; return this; }
        public QueueItemBuilder age(int age) { this.age = age; return this; }
        public QueueItemBuilder gender(String gender) { this.gender = gender; return this; }
        public QueueItemBuilder complaint(String complaint) { this.complaint = complaint; return this; }
        public QueueItemBuilder doctorId(String docId) { this.doctorId = docId; return this; }
        public QueueItemBuilder doctorName(String docName) { this.doctorName = docName; return this; }
        public QueueItemBuilder cabin(String cabin) { this.cabin = cabin; return this; }
        public QueueItemBuilder department(String dept) { this.department = dept; return this; }
        public QueueItemBuilder departmentId(String deptId) { this.departmentId = deptId; return this; }
        public QueueItemBuilder priority(int priority) { this.priority = priority; return this; }
        public QueueItemBuilder priorityLabel(String priorityLabel) { this.priorityLabel = priorityLabel; return this; }
        public QueueItemBuilder status(String status) { this.status = status; return this; }
        public QueueItemBuilder queuePosition(int queuePosition) { this.queuePosition = queuePosition; return this; }
        public QueueItemBuilder estimatedWaitMinutes(int estimatedWaitMinutes) { this.estimatedWaitMinutes = estimatedWaitMinutes; return this; }
        public QueueItemBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public QueueItemBuilder calledAt(LocalDateTime calledAt) { this.calledAt = calledAt; return this; }
        public QueueItemBuilder completedAt(LocalDateTime completedAt) { this.completedAt = completedAt; return this; }

        public QueueItem build() {
            return new QueueItem(id, tokenNumber, registrationId, patientId, patientName, age, gender, complaint, doctorId, doctorName, cabin, department, departmentId, priority, priorityLabel, status, queuePosition, estimatedWaitMinutes, createdAt, calledAt, completedAt);
        }
    }
}
