package com.hospital.optimization.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;
    private String userId;
    private String title;
    private String message;
    private String type; // INFO, APPOINTMENT, QUEUE, EMERGENCY
    private boolean read;
    private LocalDateTime timestamp;

    public Notification() {}

    public Notification(String id, String userId, String title, String message, String type, boolean read, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.message = message;
        this.type = type;
        this.read = read;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public static NotificationBuilder builder() {
        return new NotificationBuilder();
    }

    public static class NotificationBuilder {
        private String id;
        private String userId;
        private String title;
        private String message;
        private String type;
        private boolean read;
        private LocalDateTime timestamp;

        public NotificationBuilder id(String id) { this.id = id; return this; }
        public NotificationBuilder userId(String userId) { this.userId = userId; return this; }
        public NotificationBuilder title(String title) { this.title = title; return this; }
        public NotificationBuilder message(String message) { this.message = message; return this; }
        public NotificationBuilder type(String type) { this.type = type; return this; }
        public NotificationBuilder read(boolean read) { this.read = read; return this; }
        public NotificationBuilder timestamp(LocalDateTime timestamp) { this.timestamp = timestamp; return this; }

        public Notification build() {
            return new Notification(id, userId, title, message, type, read, timestamp);
        }
    }
}
