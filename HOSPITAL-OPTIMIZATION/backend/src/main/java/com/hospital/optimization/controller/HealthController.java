package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HealthController {

    @Autowired(required = false)
    private MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", "Smart Hospital Manager & SmartCare API");
        health.put("timestamp", LocalDateTime.now().toString());

        boolean dbConnected = false;
        try {
            if (mongoTemplate != null) {
                mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
                dbConnected = true;
            }
        } catch (Exception e) {
            dbConnected = false;
        }

        health.put("database", dbConnected ? "CONNECTED" : "DISCONNECTED");
        health.put("version", "1.0.0");

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Service is operational")
                .data(health)
                .build());
    }
}
