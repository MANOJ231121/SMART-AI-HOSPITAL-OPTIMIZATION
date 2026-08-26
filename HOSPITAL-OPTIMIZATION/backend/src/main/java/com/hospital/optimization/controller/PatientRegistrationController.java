package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.dto.PatientRegistrationRequest;
import com.hospital.optimization.dto.PatientRegistrationUpdateRequest;
import com.hospital.optimization.model.PatientRegistration;
import com.hospital.optimization.model.User;
import com.hospital.optimization.model.UserRole;
import com.hospital.optimization.repository.PatientRegistrationRepository;
import com.hospital.optimization.repository.UserRepository;
import com.hospital.optimization.service.PatientRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PatientRegistrationController {

    @Autowired
    private PatientRegistrationService registrationService;

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<PatientRegistration>> registerPatient(@RequestBody PatientRegistrationRequest request) {
        try {
            PatientRegistration registration = registrationService.registerPatient(request);
            return ResponseEntity.ok(ApiResponse.<PatientRegistration>builder()
                    .success(true)
                    .message("Patient registered successfully with token " + registration.getTokenNumber())
                    .data(registration)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<PatientRegistration>builder()
                    .success(false)
                    .message("Registration failed: " + e.getMessage())
                    .build());
        }
    }

    @GetMapping("/registration/{id}")
    public ResponseEntity<ApiResponse<PatientRegistration>> getRegistrationById(@PathVariable String id) {
        Optional<PatientRegistration> opt = registrationRepository.findById(id);
        return opt.map(reg -> ResponseEntity.ok(ApiResponse.<PatientRegistration>builder()
                .success(true)
                .message("Registration details found")
                .data(reg)
                .build()))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.<PatientRegistration>builder()
                        .success(false)
                        .message("Registration not found")
                        .build()));
    }

    @GetMapping("/registrations")
    public ResponseEntity<ApiResponse<List<PatientRegistration>>> getAllRegistrations() {
        List<PatientRegistration> list = registrationRepository.findAll();
        return ResponseEntity.ok(ApiResponse.<List<PatientRegistration>>builder()
                .success(true)
                .message("All registrations retrieved")
                .data(list)
                .build());
    }

    @PutMapping("/registration/{id}")
    public ResponseEntity<ApiResponse<PatientRegistration>> updateRegistration(
            @PathVariable String id,
            @RequestBody PatientRegistrationUpdateRequest updateRequest) {
        
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        UserRole callerRole = null;
        String callerEmail = null;

        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            callerEmail = auth.getName();
            Optional<User> userOpt = userRepository.findByEmail(callerEmail);
            if (userOpt.isPresent()) {
                callerRole = userOpt.get().getRole();
            }
        }

        // Fallback check from granted authorities
        if (callerRole == null && auth != null) {
            boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("ADMIN"));
            boolean isDoctor = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("DOCTOR"));
            if (isAdmin) callerRole = UserRole.ADMIN;
            else if (isDoctor) callerRole = UserRole.DOCTOR;
        }

        if (callerRole != UserRole.ADMIN && callerRole != UserRole.DOCTOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.<PatientRegistration>builder()
                    .success(false)
                    .message("Access Denied: Only Doctors and Administrators are authorized to modify patient registration details.")
                    .build());
        }

        try {
            PatientRegistration updated = registrationService.updateRegistration(id, updateRequest, callerEmail, callerRole);
            return ResponseEntity.ok(ApiResponse.<PatientRegistration>builder()
                    .success(true)
                    .message("Patient registration details updated successfully")
                    .data(updated)
                    .build());
        } catch (AccessDeniedException ade) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.<PatientRegistration>builder()
                    .success(false)
                    .message(ade.getMessage())
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<PatientRegistration>builder()
                    .success(false)
                    .message("Failed to update patient record: " + e.getMessage())
                    .build());
        }
    }

    @DeleteMapping("/registration/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRegistration(@PathVariable String id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().contains("ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("Access Denied: Only Administrators can delete patient records.")
                    .build());
        }

        boolean deleted = registrationService.deleteRegistration(id);
        if (deleted) {
            return ResponseEntity.ok(ApiResponse.<Void>builder()
                    .success(true)
                    .message("Patient record deleted successfully")
                    .build());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.<Void>builder()
                    .success(false)
                    .message("Patient record not found")
                    .build());
        }
    }
}
