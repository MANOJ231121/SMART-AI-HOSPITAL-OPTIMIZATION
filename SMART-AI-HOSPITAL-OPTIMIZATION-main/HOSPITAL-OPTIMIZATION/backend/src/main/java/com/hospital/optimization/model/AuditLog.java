package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String userId;
    private String userName;
    private String role;
    private String action;
    private String resource;
    private String details;
    private LocalDateTime timestamp;

    public AuditLog() {}

    public AuditLog(String id, String userId, String userName, String role, String action, String resource, String details, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.role = role;
        this.action = action;
        this.resource = resource;
        this.details = details;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static AuditLogBuilder builder() {
        return new AuditLogBuilder();
    }

    public static class AuditLogBuilder {
        private String id;
        private String userId;
        private String userName;
        private String role;
        private String action;
        private String resource;
        private String details;
        private LocalDateTime timestamp;

        public AuditLogBuilder id(String id) { this.id = id; return this; }
        public AuditLogBuilder userId(String userId) { this.userId = userId; return this; }
        public AuditLogBuilder userName(String userName) { this.userName = userName; return this; }
        public AuditLogBuilder role(String role) { this.role = role; return this; }
        public AuditLogBuilder action(String action) { this.action = action; return this; }
        public AuditLogBuilder resource(String resource) { this.resource = resource; return this; }
        public AuditLogBuilder details(String details) { this.details = details; return this; }
        public AuditLogBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public AuditLog build() {
            return new AuditLog(id, userId, userName, role, action, resource, details, timestamp);
        }
    }
}
