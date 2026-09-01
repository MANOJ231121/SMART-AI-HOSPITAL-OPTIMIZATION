package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.model.PatientRegistration;
import com.hospital.optimization.model.QueueItem;
import com.hospital.optimization.model.User;
import com.hospital.optimization.model.UserRole;
import com.hospital.optimization.repository.PatientRegistrationRepository;
import com.hospital.optimization.repository.QueueRepository;
import com.hospital.optimization.repository.UserRepository;
import com.hospital.optimization.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class DoctorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private QueueService queueService;

    @Autowired
    private com.hospital.optimization.service.PatientRegistrationService registrationService;

    // ================= PUBLIC DOCTOR LOOKUP ENDPOINTS =================

    @GetMapping("/api/doctors")
    public ResponseEntity<ApiResponse<List<User>>> getAllDoctors() {
        List<User> doctors = userRepository.findByRole(UserRole.DOCTOR);
        return ResponseEntity.ok(ApiResponse.<List<User>>builder()
                .success(true)
                .message("Doctors retrieved")
                .data(doctors)
                .build());
    }

    @GetMapping("/api/doctors/department/{dept}")
    public ResponseEntity<ApiResponse<List<User>>> getDoctorsByDepartment(@PathVariable String dept) {
        List<User> doctors = userRepository.findByRoleAndDepartmentIgnoreCase(UserRole.DOCTOR, dept);
        if (doctors.isEmpty()) {
            doctors = userRepository.findByRole(UserRole.DOCTOR);
        }
        return ResponseEntity.ok(ApiResponse.<List<User>>builder()
                .success(true)
                .message("Doctors in " + dept)
                .data(doctors)
                .build());
    }

    @GetMapping("/api/doctors/available")
    public ResponseEntity<ApiResponse<List<User>>> getAvailableDoctors() {
        List<User> doctors = userRepository.findByRoleAndAvailableTrue(UserRole.DOCTOR);
        return ResponseEntity.ok(ApiResponse.<List<User>>builder()
                .success(true)
                .message("Available doctors retrieved")
                .data(doctors)
                .build());
    }

    @PutMapping("/api/doctors/{id}/availability")
    public ResponseEntity<ApiResponse<User>> toggleDoctorAvailability(@PathVariable String id) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(404).body(ApiResponse.<User>builder()
                    .success(false)
                    .message("Doctor not found")
                    .build());
        }
        User doc = opt.get();
        doc.setAvailable(!doc.isAvailable());
        userRepository.save(doc);
        return ResponseEntity.ok(ApiResponse.<User>builder()
                .success(true)
                .message("Doctor availability toggled to " + doc.isAvailable())
                .data(doc)
                .build());
    }

    // ================= DOCTOR PORTAL DASHBOARD ENDPOINTS =================

    @GetMapping("/api/doctor/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDoctorDashboard() {
        User currentDoctor = getCurrentDoctorUser();
        String doctorId = currentDoctor != null ? currentDoctor.getId() : "doc1";
        String doctorDept = currentDoctor != null && currentDoctor.getDepartment() != null ? currentDoctor.getDepartment() : "Cardiology";

        List<QueueItem> myQueue = queueRepository.findByDoctorId(doctorId);
        if (myQueue.isEmpty()) {
            myQueue = queueRepository.findByDepartment(doctorDept);
        }

        long waiting = myQueue.stream().filter(q -> "WAITING".equalsIgnoreCase(q.getStatus())).count();
        long inConsultation = myQueue.stream().filter(q -> "IN_CONSULTATION".equalsIgnoreCase(q.getStatus())).count();
        long completed = myQueue.stream().filter(q -> "COMPLETED".equalsIgnoreCase(q.getStatus())).count();

        Optional<QueueItem> currentServing = myQueue.stream()
                .filter(q -> "IN_CONSULTATION".equalsIgnoreCase(q.getStatus()))
                .findFirst();

        Map<String, Object> data = new HashMap<>();
        data.put("assignedPatientsCount", myQueue.size());
        data.put("todayAppointments", myQueue.size());
        data.put("pendingConsultations", waiting);
        data.put("completedConsultations", completed);
        data.put("currentQueueToken", currentServing.map(QueueItem::getTokenNumber).orElse("None"));
        data.put("department", doctorDept);
        data.put("doctorName", currentDoctor != null ? currentDoctor.getName() : "Dr. Sarah Jenkins");

        return ResponseEntity.ok(ApiResponse.<Map<String, Object>>builder()
                .success(true)
                .message("Doctor dashboard metrics")
                .data(data)
                .build());
    }

    @GetMapping("/api/doctor/queue")
    public ResponseEntity<ApiResponse<List<QueueItem>>> getDoctorQueue() {
        User currentDoctor = getCurrentDoctorUser();
        String doctorId = currentDoctor != null ? currentDoctor.getId() : "doc1";
        List<QueueItem> queue = queueRepository.findByDoctorId(doctorId);
        if (queue.isEmpty() && currentDoctor != null && currentDoctor.getDepartment() != null) {
            queue = queueRepository.findByDepartment(currentDoctor.getDepartment());
        }
        if (queue.isEmpty()) {
            queue = queueRepository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.<List<QueueItem>>builder()
                .success(true)
                .message("Doctor queue retrieved")
                .data(queue)
                .build());
    }

    @GetMapping("/api/doctor/patients")
    public ResponseEntity<ApiResponse<List<PatientRegistration>>> getDoctorPatients() {
        User currentDoctor = getCurrentDoctorUser();
        String doctorId = currentDoctor != null ? currentDoctor.getId() : "doc1";
        List<PatientRegistration> patients = registrationRepository.findByDoctorId(doctorId);
        if (patients.isEmpty() && currentDoctor != null && currentDoctor.getDepartment() != null) {
            patients = registrationRepository.findByRecommendedDepartment(currentDoctor.getDepartment());
        }
        if (patients.isEmpty()) {
            patients = registrationRepository.findAll();
        }
        return ResponseEntity.ok(ApiResponse.<List<PatientRegistration>>builder()
                .success(true)
                .message("Assigned patients list")
                .data(patients)
                .build());
    }

    @PutMapping("/api/doctor/patients/{id}")
    public ResponseEntity<ApiResponse<PatientRegistration>> updateDoctorPatient(
            @PathVariable String id,
            @RequestBody com.hospital.optimization.dto.PatientRegistrationUpdateRequest updateRequest) {
        User currentDoctor = getCurrentDoctorUser();
        String email = currentDoctor != null ? currentDoctor.getEmail() : "doctor@hospital.com";
        try {
            PatientRegistration updated = registrationService.updateRegistration(id, updateRequest, email, UserRole.DOCTOR);
            return ResponseEntity.ok(ApiResponse.<PatientRegistration>builder()
                    .success(true)
                    .message("Patient consultation details updated successfully")
                    .data(updated)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.<PatientRegistration>builder()
                    .success(false)
                    .message("Failed to update patient: " + e.getMessage())
                    .build());
        }
    }

    @RequestMapping(value = "/api/doctor/call-next", method = {RequestMethod.POST, RequestMethod.PUT, RequestMethod.GET})
    public ResponseEntity<ApiResponse<QueueItem>> callNextPatient() {
        User currentDoctor = getCurrentDoctorUser();
        String doctorId = currentDoctor != null ? currentDoctor.getId() : "doc1";
        QueueItem next = queueService.callNextPatient(doctorId);
        if (next == null) {
            return ResponseEntity.ok(ApiResponse.<QueueItem>builder()
                    .success(false)
                    .message("No more waiting patients in queue")
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.<QueueItem>builder()
                .success(true)
                .message("Called next patient " + next.getPatientName() + " (Token: " + next.getTokenNumber() + ")")
                .data(next)
                .build());
    }

    @RequestMapping(value = "/api/doctor/complete-consultation", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<ApiResponse<QueueItem>> completeConsultation(
            @RequestParam(required = false) String queueId,
            @RequestBody(required = false) Map<String, String> body) {
        String targetQueueId = queueId;
        if (targetQueueId == null && body != null) {
            targetQueueId = body.get("queueId");
        }
        if (targetQueueId == null || targetQueueId.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<QueueItem>builder()
                    .success(false)
                    .message("Queue ID is required")
                    .build());
        }
        QueueItem completed = queueService.completeConsultation(targetQueueId);
        return ResponseEntity.ok(ApiResponse.<QueueItem>builder()
                .success(true)
                .message("Consultation completed successfully")
                .data(completed)
                .build());
    }

    private User getCurrentDoctorUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !auth.getName().equals("anonymousUser")) {
            return userRepository.findByEmail(auth.getName()).orElse(null);
        }
        return null;
    }
}
