package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasAnyRole('PATIENT', 'ADMIN')")
public class PatientController {

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPatientDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("upcomingAppointments", 1);
        data.put("currentQueueToken", "PAT-104");
        data.put("estimatedWaitTimeMinutes", 15);
        data.put("assignedDoctor", "Dr. Sarah Jenkins");
        data.put("department", "Cardiology");

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Patient dashboard metrics")
                .data(data)
                .build());
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAppointments() {
        List<Map<String, Object>> appointments = List.of(
                Map.of("id", "app-101", "doctor", "Dr. Sarah Jenkins", "department", "Cardiology", "date", "2026-08-22 10:30 AM", "status", "CONFIRMED")
        );

        return ResponseEntity.ok(ApiResponse.<List<Map<String, Object>>>builder()
                .success(true)
                .message("Patient appointments")
                .data(appointments)
                .build());
    }
}
