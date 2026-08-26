package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.model.Bed;
import com.hospital.optimization.repository.BedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NurseController {

    @Autowired
    private BedRepository bedRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getNurseDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("assignedWard", "ICU & General Ward");
        data.put("patientsUnderCare", 8);
        data.put("availableBedsCount", bedRepository.findByStatus("AVAILABLE").size());
        data.put("occupiedBedsCount", bedRepository.findByStatus("OCCUPIED").size());
        data.put("totalBeds", bedRepository.count());

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Nurse dashboard metrics")
                .data(data)
                .build());
    }

    @GetMapping("/beds")
    public ResponseEntity<ApiResponse<List<Bed>>> getBedsStatus() {
        return ResponseEntity.ok(ApiResponse.<List<Bed>>builder()
                .success(true)
                .message("Beds information")
                .data(bedRepository.findAll())
                .build());
    }

    @RequestMapping(value = "/beds/{id}/status", method = {RequestMethod.PUT, RequestMethod.POST})
    public ResponseEntity<ApiResponse<Bed>> updateBedStatus(
            @PathVariable String id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assignedPatientName,
            @RequestBody(required = false) Map<String, String> body) {
        Optional<Bed> opt = bedRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.<Bed>builder()
                    .success(false)
                    .message("Bed not found")
                    .build());
        }
        Bed bed = opt.get();
        String newStatus = status;
        if (newStatus == null && body != null) {
            newStatus = body.getOrDefault("status", "AVAILABLE");
        }
        if (newStatus == null) newStatus = "AVAILABLE";

        bed.setStatus(newStatus.toUpperCase());
        if (assignedPatientName != null) {
            bed.setAssignedPatientName(assignedPatientName);
        } else if (body != null && body.containsKey("patientName")) {
            bed.setAssignedPatientName(body.get("patientName"));
        } else if (body != null && body.containsKey("assignedPatientName")) {
            bed.setAssignedPatientName(body.get("assignedPatientName"));
        }
        bed.setUpdatedAt(LocalDateTime.now());
        bedRepository.save(bed);

        return ResponseEntity.ok(ApiResponse.<Bed>builder()
                .success(true)
                .message("Bed status updated to " + newStatus)
                .data(bed)
                .build());
    }
}
