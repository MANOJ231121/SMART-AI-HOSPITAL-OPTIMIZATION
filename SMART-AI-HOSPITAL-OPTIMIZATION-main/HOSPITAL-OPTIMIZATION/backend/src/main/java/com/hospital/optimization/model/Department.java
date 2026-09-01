package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "departments")
public class Department {
    @Id
    private String id;
    private String name;
    private String code;
    private String description;
    private String icon;
    private String headDoctorId;
    private String headDoctorName;
    private int totalBeds;
    private int activeQueues;
    private int doctorsCount;
    private int patientsToday;
    private boolean active = true;

    public Department() {}

    public Department(String id, String name, String code, String description, String icon, String headDoctorId, String headDoctorName, int totalBeds, int activeQueues, int doctorsCount, int patientsToday, boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.description = description;
        this.icon = icon;
        this.headDoctorId = headDoctorId;
        this.headDoctorName = headDoctorName;
        this.totalBeds = totalBeds;
        this.activeQueues = activeQueues;
        this.doctorsCount = doctorsCount;
        this.patientsToday = patientsToday;
        this.active = active;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getHeadDoctorId() { return headDoctorId; }
    public void setHeadDoctorId(String headDoctorId) { this.headDoctorId = headDoctorId; }

    public String getHeadDoctorName() { return headDoctorName; }
    public void setHeadDoctorName(String headDoctorName) { this.headDoctorName = headDoctorName; }

    public int getTotalBeds() { return totalBeds; }
    public void setTotalBeds(int totalBeds) { this.totalBeds = totalBeds; }

    public int getActiveQueues() { return activeQueues; }
    public void setActiveQueues(int activeQueues) { this.activeQueues = activeQueues; }

    public int getDoctorsCount() { return doctorsCount; }
    public void setDoctorsCount(int doctorsCount) { this.doctorsCount = doctorsCount; }

    public int getPatientsToday() { return patientsToday; }
    public void setPatientsToday(int patientsToday) { this.patientsToday = patientsToday; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public static DepartmentBuilder builder() {
        return new DepartmentBuilder();
    }

    public static class DepartmentBuilder {
        private String id;
        private String name;
        private String code;
        private String description;
        private String icon;
        private String headDoctorId;
        private String headDoctorName;
        private int totalBeds;
        private int activeQueues;
        private int doctorsCount;
        private int patientsToday;
        private boolean active = true;

        public DepartmentBuilder id(String id) { this.id = id; return this; }
        public DepartmentBuilder name(String name) { this.name = name; return this; }
        public DepartmentBuilder code(String code) { this.code = code; return this; }
        public DepartmentBuilder description(String description) { this.description = description; return this; }
        public DepartmentBuilder icon(String icon) { this.icon = icon; return this; }
        public DepartmentBuilder headDoctorId(String headDoctorId) { this.headDoctorId = headDoctorId; return this; }
        public DepartmentBuilder headDoctorName(String headDoctorName) { this.headDoctorName = headDoctorName; return this; }
        public DepartmentBuilder totalBeds(int totalBeds) { this.totalBeds = totalBeds; return this; }
        public DepartmentBuilder activeQueues(int activeQueues) { this.activeQueues = activeQueues; return this; }
        public DepartmentBuilder doctorsCount(int doctorsCount) { this.doctorsCount = doctorsCount; return this; }
        public DepartmentBuilder patientsToday(int patientsToday) { this.patientsToday = patientsToday; return this; }
        public DepartmentBuilder active(boolean active) { this.active = active; return this; }

        public Department build() {
            return new Department(id, name, code, description, icon, headDoctorId, headDoctorName, totalBeds, activeQueues, doctorsCount, patientsToday, active);
        }
    }
}
