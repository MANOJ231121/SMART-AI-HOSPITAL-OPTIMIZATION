package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.dto.PatientRegistrationRequest;
import com.hospital.optimization.model.PatientRegistration;
import com.hospital.optimization.model.QueueItem;
import com.hospital.optimization.model.UserRole;
import com.hospital.optimization.repository.PatientRegistrationRepository;
import com.hospital.optimization.repository.QueueRepository;
import com.hospital.optimization.repository.UserRepository;
import com.hospital.optimization.service.PatientRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReceptionistController {

    @Autowired
    private PatientRegistrationService registrationService;

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReceptionistDashboard() {
        Map<String, Object> data = new HashMap<>();
        data.put("opdRegistrationsToday", registrationRepository.count());
        data.put("activeTokensGenerated", queueRepository.count());
        data.put("doctorsAvailable", userRepository.findByRoleAndAvailableTrue(UserRole.DOCTOR).size());
        data.put("pendingBillingInvoices", 4);

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Receptionist dashboard metrics")
                .data(data)
                .build());
    }

    @PostMapping("/register-walkin")
    public ResponseEntity<ApiResponse<PatientRegistration>> registerWalkin(@RequestBody PatientRegistrationRequest request) {
        PatientRegistration registration = registrationService.registerPatient(request);
        return ResponseEntity.ok(ApiResponse.<PatientRegistration>builder()
                .success(true)
                .message("Walk-in patient registered with Token " + registration.getTokenNumber())
                .data(registration)
                .build());
    }

    @GetMapping("/queue")
    public ResponseEntity<ApiResponse<List<QueueItem>>> getQueueDispenser() {
        return ResponseEntity.ok(ApiResponse.<List<QueueItem>>builder()
                .success(true)
                .message("Active queue dispenser list")
                .data(queueRepository.findAll())
                .build());
    }
}
