package com.hospital.optimization.dto;

import java.util.List;

public class QueueStatusResponse {
    private String yourToken;
    private String patientName;
    private String department;
    private String doctorName;
    private String cabin;
    private String status;
    private String currentlyServing;
    private int patientsAhead;
    private int estimatedMinutes;
    private List<QueueRowDto> queue;

    public QueueStatusResponse() {}

    public QueueStatusResponse(String yourToken, String patientName, String department, String doctorName, String cabin, String status, String currentlyServing, int patientsAhead, int estimatedMinutes, List<QueueRowDto> queue) {
        this.yourToken = yourToken;
        this.patientName = patientName;
        this.department = department;
        this.doctorName = doctorName;
        this.cabin = cabin;
        this.status = status;
        this.currentlyServing = currentlyServing;
        this.patientsAhead = patientsAhead;
        this.estimatedMinutes = estimatedMinutes;
        this.queue = queue;
    }

    public String getYourToken() { return yourToken; }
    public void setYourToken(String yourToken) { this.yourToken = yourToken; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getCabin() { return cabin; }
    public void setCabin(String cabin) { this.cabin = cabin; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCurrentlyServing() { return currentlyServing; }
    public void setCurrentlyServing(String currentlyServing) { this.currentlyServing = currentlyServing; }

    public int getPatientsAhead() { return patientsAhead; }
    public void setPatientsAhead(int patientsAhead) { this.patientsAhead = patientsAhead; }

    public int getEstimatedMinutes() { return estimatedMinutes; }
    public void setEstimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; }

    public List<QueueRowDto> getQueue() { return queue; }
    public void setQueue(List<QueueRowDto> queue) { this.queue = queue; }

    public static QueueStatusResponseBuilder builder() {
        return new QueueStatusResponseBuilder();
    }

    public static class QueueStatusResponseBuilder {
        private String yourToken;
        private String patientName;
        private String department;
        private String doctorName;
        private String cabin;
        private String status;
        private String currentlyServing;
        private int patientsAhead;
        private int estimatedMinutes;
        private List<QueueRowDto> queue;

        public QueueStatusResponseBuilder yourToken(String yourToken) { this.yourToken = yourToken; return this; }
        public QueueStatusResponseBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public QueueStatusResponseBuilder department(String department) { this.department = department; return this; }
        public QueueStatusResponseBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public QueueStatusResponseBuilder cabin(String cabin) { this.cabin = cabin; return this; }
        public QueueStatusResponseBuilder status(String status) { this.status = status; return this; }
        public QueueStatusResponseBuilder currentlyServing(String currentlyServing) { this.currentlyServing = currentlyServing; return this; }
        public QueueStatusResponseBuilder patientsAhead(int patientsAhead) { this.patientsAhead = patientsAhead; return this; }
        public QueueStatusResponseBuilder estimatedMinutes(int estimatedMinutes) { this.estimatedMinutes = estimatedMinutes; return this; }
        public QueueStatusResponseBuilder queue(List<QueueRowDto> queue) { this.queue = queue; return this; }

        public QueueStatusResponse build() {
            return new QueueStatusResponse(yourToken, patientName, department, doctorName, cabin, status, currentlyServing, patientsAhead, estimatedMinutes, queue);
        }
    }

    public static class QueueRowDto {
        private String token;
        private String initials;
        private String status;
        private String priority;

        public QueueRowDto() {}

        public QueueRowDto(String token, String initials, String status, String priority) {
            this.token = token;
            this.initials = initials;
            this.status = status;
            this.priority = priority;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }

        public String getInitials() { return initials; }
        public void setInitials(String initials) { this.initials = initials; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }

        public static QueueRowDtoBuilder builder() {
            return new QueueRowDtoBuilder();
        }

        public static class QueueRowDtoBuilder {
            private String token;
            private String initials;
            private String status;
            private String priority;

            public QueueRowDtoBuilder token(String token) { this.token = token; return this; }
            public QueueRowDtoBuilder initials(String initials) { this.initials = initials; return this; }
            public QueueRowDtoBuilder status(String status) { this.status = status; return this; }
            public QueueRowDtoBuilder priority(String priority) { this.priority = priority; return this; }

            public QueueRowDto build() {
                return new QueueRowDto(token, initials, status, priority);
            }
        }
    }
}
