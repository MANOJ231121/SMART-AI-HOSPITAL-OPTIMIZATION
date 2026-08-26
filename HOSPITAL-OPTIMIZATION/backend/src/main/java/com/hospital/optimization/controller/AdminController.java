package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.dto.UserDto;
import com.hospital.optimization.model.PatientRegistration;
import com.hospital.optimization.model.QueueItem;
import com.hospital.optimization.model.User;
import com.hospital.optimization.model.UserRole;
import com.hospital.optimization.repository.PatientRegistrationRepository;
import com.hospital.optimization.repository.QueueRepository;
import com.hospital.optimization.repository.UserRepository;
import com.hospital.optimization.service.AuthService;
import com.hospital.optimization.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.hospital.optimization.service.PatientRegistrationService registrationService;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAdminStats() {
        Map<String, Object> stats = dashboardService.getAdminDashboardStats();
        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Admin statistics retrieved")
                .data(stats)
                .build());
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(authService::mapToUserDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.<List<UserDto>>builder()
                .success(true)
                .message("All users listed")
                .data(users)
                .build());
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<PatientRegistration>>> getAllPatients() {
        List<PatientRegistration> patients = registrationRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<PatientRegistration>>builder()
                .success(true)
                .message("All registered patients listed")
                .data(patients)
                .build());
    }

    @PutMapping("/patients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PatientRegistration>> updatePatient(
            @PathVariable String id,
            @RequestBody com.hospital.optimization.dto.PatientRegistrationUpdateRequest updateRequest) {
        try {
            com.hospital.optimization.service.PatientRegistrationService regService = 
                new com.hospital.optimization.service.PatientRegistrationService();
            PatientRegistration updated = registrationService.updateRegistration(id, updateRequest, "admin@hospital.com", UserRole.ADMIN);
            return ResponseEntity.ok(ApiResponse.<PatientRegistration>builder()
                    .success(true)
                    .message("Patient details successfully updated by Administrator")
                    .data(updated)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<PatientRegistration>builder()
                    .success(false)
                    .message("Failed to update patient: " + e.getMessage())
                    .build());
        }
    }

    @DeleteMapping("/patients/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable String id) {
        boolean deleted = registrationService.deleteRegistration(id);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Patient deleted successfully")
                    .build());
        }
        return ResponseEntity.status(404).body(ApiResponse.<Void>builder()
                .success(false)
                .message("Patient record not found")
                .build());
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<User>>> getDoctors() {
        List<User> doctors = userRepository.findByRole(UserRole.DOCTOR);
        return ResponseEntity.ok(ApiResponse.<List<User>>builder()
                .success(true)
                .message("Doctors list retrieved")
                .data(doctors)
                .build());
    }

    @GetMapping("/queues")
    public ResponseEntity<ApiResponse<List<QueueItem>>> getLiveQueues() {
        List<QueueItem> queues = queueRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<QueueItem>>builder()
                .success(true)
                .message("Live queue records retrieved")
                .data(queues)
                .build());
    }

    @PostMapping("/users/staff")
    public ResponseEntity<ApiResponse<UserDto>> createStaffUser(@RequestBody User staffUser) {
        if (userRepository.existsByEmail(staffUser.getEmail())) {
            return ResponseEntity.badRequest().body(ApiResponse.<UserDto>builder()
                    .success(false)
                    .message("User with this email already exists")
                    .build());
        }

        staffUser.setPassword(passwordEncoder.encode(staffUser.getPassword()));
        staffUser.setActive(true);
        staffUser.setAvailable(true);
        User saved = userRepository.save(staffUser);

        return ResponseEntity.ok(ApiResponse.<UserDto>builder()
                .success(true)
                .message("Staff member created successfully")
                .data(authService.mapToUserDto(saved))
                .build());
    }
}
