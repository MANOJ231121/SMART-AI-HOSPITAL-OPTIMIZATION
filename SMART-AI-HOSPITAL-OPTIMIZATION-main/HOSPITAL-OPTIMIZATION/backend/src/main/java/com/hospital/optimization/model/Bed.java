package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "beds")
public class Bed {
    @Id
    private String id;
    private String bedNumber;
    private String wardName;
    private String department;
    private String status; // AVAILABLE, OCCUPIED, MAINTENANCE
    private String assignedPatientId;
    private String assignedPatientName;
    private LocalDateTime updatedAt;

    public Bed() {}

    public Bed(String id, String bedNumber, String wardName, String department, String status, String assignedPatientId, String assignedPatientName, LocalDateTime updatedAt) {
        this.id = id;
        this.bedNumber = bedNumber;
        this.wardName = wardName;
        this.department = department;
        this.status = status;
        this.assignedPatientId = assignedPatientId;
        this.assignedPatientName = assignedPatientName;
        this.updatedAt = updatedAt != null ? updatedAt : LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBedNumber() { return bedNumber; }
    public void setBedNumber(String bedNumber) { this.bedNumber = bedNumber; }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAssignedPatientId() { return assignedPatientId; }
    public void setAssignedPatientId(String assignedPatientId) { this.assignedPatientId = assignedPatientId; }

    public String getAssignedPatientName() { return assignedPatientName; }
    public void setAssignedPatientName(String assignedPatientName) { this.assignedPatientName = assignedPatientName; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static BedBuilder builder() {
        return new BedBuilder();
    }

    public static class BedBuilder {
        private String id;
        private String bedNumber;
        private String wardName;
        private String department;
        private String status;
        private String assignedPatientId;
        private String assignedPatientName;
        private LocalDateTime updatedAt;

        public BedBuilder id(String id) { this.id = id; return this; }
        public BedBuilder bedNumber(String bedNumber) { this.bedNumber = bedNumber; return this; }
        public BedBuilder wardName(String wardName) { this.wardName = wardName; return this; }
        public BedBuilder department(String department) { this.department = department; return this; }
        public BedBuilder status(String status) { this.status = status; return this; }
        public BedBuilder assignedPatientId(String assignedPatientId) { this.assignedPatientId = assignedPatientId; return this; }
        public BedBuilder assignedPatientName(String assignedPatientName) { this.assignedPatientName = assignedPatientName; return this; }
        public BedBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Bed build() {
            return new Bed(id, bedNumber, wardName, department, status, assignedPatientId, assignedPatientName, updatedAt);
        }
    }
}
