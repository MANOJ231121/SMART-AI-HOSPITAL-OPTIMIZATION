package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "appointments")
public class Appointment {
    @Id
    private String id;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String department;
    private LocalDateTime appointmentTime;
    private String status; // SCHEDULED, COMPLETED, CANCELLED, IN_PROGRESS
    private String reason;
    private String notes;

    public Appointment() {}

    public Appointment(String id, String patientId, String patientName, String doctorId, String doctorName, String department, LocalDateTime appointmentTime, String status, String reason, String notes) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.department = department;
        this.appointmentTime = appointmentTime;
        this.status = status;
        this.reason = reason;
        this.notes = notes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public LocalDateTime getAppointmentTime() { return appointmentTime; }
    public void setAppointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public static AppointmentBuilder builder() {
        return new AppointmentBuilder();
    }

    public static class AppointmentBuilder {
        private String id;
        private String patientId;
        private String patientName;
        private String doctorId;
        private String doctorName;
        private String department;
        private LocalDateTime appointmentTime;
        private String status;
        private String reason;
        private String notes;

        public AppointmentBuilder id(String id) { this.id = id; return this; }
        public AppointmentBuilder patientId(String patientId) { this.patientId = patientId; return this; }
        public AppointmentBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public AppointmentBuilder doctorId(String doctorId) { this.doctorId = doctorId; return this; }
        public AppointmentBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public AppointmentBuilder department(String department) { this.department = department; return this; }
        public AppointmentBuilder appointmentTime(LocalDateTime appointmentTime) { this.appointmentTime = appointmentTime; return this; }
        public AppointmentBuilder status(String status) { this.status = status; return this; }
        public AppointmentBuilder reason(String reason) { this.reason = reason; return this; }
        public AppointmentBuilder notes(String notes) { this.notes = notes; return this; }

        public Appointment build() {
            return new Appointment(id, patientId, patientName, doctorId, doctorName, department, appointmentTime, status, reason, notes);
        }
    }
}
