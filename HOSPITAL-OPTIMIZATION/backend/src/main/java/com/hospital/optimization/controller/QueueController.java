package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.dto.QueueStatusResponse;
import com.hospital.optimization.model.QueueItem;
import com.hospital.optimization.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QueueController {

    @Autowired
    private QueueService queueService;

    @GetMapping("/status/{token}")
    public ResponseEntity<QueueStatusResponse> getQueueStatusByToken(@PathVariable String token) {
        QueueStatusResponse status = queueService.getTokenStatus(token);
        if (status == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(status);
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<QueueItem>>> getAllQueues() {
        return ResponseEntity.ok(ApiResponse.<List<QueueItem>>builder()
                .success(true)
                .message("All queue items retrieved")
                .data(queueService.getAllQueues())
                .build());
    }

    @GetMapping("/department/{department}")
    public ResponseEntity<ApiResponse<List<QueueItem>>> getDepartmentQueue(@PathVariable String department) {
        return ResponseEntity.ok(ApiResponse.<List<QueueItem>>builder()
                .success(true)
                .message("Department queue retrieved")
                .data(queueService.getDepartmentQueue(department))
                .build());
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<QueueItem>>> getDoctorQueue(@PathVariable String doctorId) {
        return ResponseEntity.ok(ApiResponse.<List<QueueItem>>builder()
                .success(true)
                .message("Doctor queue retrieved")
                .data(queueService.getDoctorQueue(doctorId))
                .build());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<QueueItem>> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        QueueItem item = queueService.updateStatus(id, status);
        if (item == null) {
            return ResponseEntity.status(404).body(ApiResponse.<QueueItem>builder()
                    .success(false)
                    .message("Queue item not found")
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.<QueueItem>builder()
                .success(true)
                .message("Queue status updated to " + status)
                .data(item)
                .build());
    }

    @PutMapping("/{id}/call")
    public ResponseEntity<ApiResponse<QueueItem>> callPatient(@PathVariable String id) {
        QueueItem item = queueService.updateStatus(id, "IN_CONSULTATION");
        return ResponseEntity.ok(ApiResponse.<QueueItem>builder()
                .success(true)
                .message("Patient called for consultation")
                .data(item)
                .build());
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<QueueItem>> completePatient(@PathVariable String id) {
        QueueItem item = queueService.completeConsultation(id);
        return ResponseEntity.ok(ApiResponse.<QueueItem>builder()
                .success(true)
                .message("Consultation completed")
                .data(item)
                .build());
    }
}
