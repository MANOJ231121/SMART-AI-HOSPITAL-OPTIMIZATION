package com.hospital.optimization.service;

import com.hospital.optimization.dto.AiRoutingRequest;
import com.hospital.optimization.dto.AiRoutingResponse;
import com.hospital.optimization.dto.PatientRegistrationRequest;
import com.hospital.optimization.dto.PatientRegistrationUpdateRequest;
import com.hospital.optimization.model.*;
import com.hospital.optimization.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PatientRegistrationService {

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private SymptomRoutingService routingService;

    public PatientRegistration registerPatient(PatientRegistrationRequest request) {
        String patientName = (request.getName() != null && !request.getName().trim().isEmpty())
                ? request.getName().trim() : "Patient";
        
        String phone = (request.getPhone() != null && !request.getPhone().trim().isEmpty())
                ? request.getPhone().trim() : "9876543210";

        // AI-Assisted Symptom Analysis & Department Routing
        String complaintText = request.getRawComplaint() != null ? request.getRawComplaint() :
                (request.getMainSymptom() != null ? request.getMainSymptom() : "General checkup");

        AiRoutingResponse routing = routingService.analyzeAndRoute(
                AiRoutingRequest.builder()
                        .text(complaintText)
                        .language(request.getLanguage() != null ? request.getLanguage() : "hi")
                        .context(request.getExtractedDetails())
                        .build()
        );

        String deptName = (request.getDepartment() != null && !request.getDepartment().trim().isEmpty())
                ? request.getDepartment().trim() : routing.getRecommendedDepartment();

        // Find or match doctor in the department
        User assignedDoctor = findBestDoctorForDepartment(deptName, request.getDoctorId());

        String doctorId = assignedDoctor != null ? assignedDoctor.getId() : "doc-default";
        String doctorName = assignedDoctor != null ? assignedDoctor.getName() : "Dr. On Duty";
        String cabin = assignedDoctor != null && assignedDoctor.getCabin() != null
                ? assignedDoctor.getCabin() : (assignedDoctor != null && assignedDoctor.getRoomNumber() != null ? assignedDoctor.getRoomNumber() : "Cabin 101");

        // Generate Token Number
        String deptCode = getDepartmentCode(deptName);
        String tokenNumber = generateNextToken(deptCode);

        int priorityInt = routing.isEmergency() ? 3 : ("Priority".equalsIgnoreCase(routing.getPriority()) ? 2 : 1);

        // Build and save PatientRegistration
        PatientRegistration registration = PatientRegistration.builder()
                .name(patientName)
                .phone(phone)
                .email(request.getEmail())
                .age(request.getAge() > 0 ? request.getAge() : 30)
                .gender(request.getGender() != null ? request.getGender() : "Not Specified")
                .dateOfBirth(request.getDateOfBirth())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .language(request.getLanguage() != null ? request.getLanguage() : "hi")
                .rawComplaint(complaintText)
                .mainSymptom(routing.getExtractedMainSymptom())
                .duration(routing.getExtractedDuration())
                .severity(routing.getExtractedSeverity())
                .associatedSymptoms(request.getAssociatedSymptoms())
                .extractedKeywords(routing.getExtractedKeywords())
                .extractedDetails(routing.getExtractedDetails())
                .recommendedDepartment(deptName)
                .departmentId(routing.getDepartmentId())
                .routingConfidence(routing.getConfidence())
                .routingReason(routing.getReasoning())
                .priority(routing.getPriority())
                .emergency(routing.isEmergency())
                .doctorId(doctorId)
                .doctorName(doctorName)
                .cabin(cabin)
                .tokenNumber(tokenNumber)
                .status("WAITING")
                .createdAt(LocalDateTime.now())
                .build();

        PatientRegistration savedRegistration = registrationRepository.save(registration);

        // Count waiting queue items ahead
        List<QueueItem> waitingItems = queueRepository.findByDoctorIdAndStatusIn(doctorId, List.of("WAITING", "CALLED"));
        int queuePosition = waitingItems.size() + 1;
        int estimatedWaitMinutes = queuePosition * 10;

        // Build and save QueueItem
        QueueItem queueItem = QueueItem.builder()
                .tokenNumber(tokenNumber)
                .registrationId(savedRegistration.getId())
                .patientId(savedRegistration.getId())
                .patientName(patientName)
                .age(savedRegistration.getAge())
                .gender(savedRegistration.getGender())
                .complaint(complaintText)
                .doctorId(doctorId)
                .doctorName(doctorName)
                .cabin(cabin)
                .department(deptName)
                .departmentId(routing.getDepartmentId())
                .priority(priorityInt)
                .priorityLabel(routing.getPriority())
                .status("WAITING")
                .queuePosition(queuePosition)
                .estimatedWaitMinutes(estimatedWaitMinutes)
                .createdAt(LocalDateTime.now())
                .build();

        queueRepository.save(queueItem);

        // Update Doctor Queue Length
        if (assignedDoctor != null) {
            assignedDoctor.setCurrentQueueLength(assignedDoctor.getCurrentQueueLength() + 1);
            userRepository.save(assignedDoctor);
        }

        return savedRegistration;
    }

    public PatientRegistration updateRegistration(String id, PatientRegistrationUpdateRequest req, String userEmail, UserRole role) {
        // Enforce role authorization: only ADMIN or DOCTOR can modify patient details
        if (role != UserRole.ADMIN && role != UserRole.DOCTOR) {
            throw new AccessDeniedException("Access Denied: Only Doctors and Administrators are authorized to modify patient registration records");
        }

        PatientRegistration reg = registrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient registration record not found with id: " + id));

        // Update patient demographic details
        if (req.getName() != null && !req.getName().trim().isEmpty()) reg.setName(req.getName().trim());
        if (req.getPhone() != null && !req.getPhone().trim().isEmpty()) reg.setPhone(req.getPhone().trim());
        if (req.getEmail() != null) reg.setEmail(req.getEmail().trim());
        if (req.getAge() > 0) reg.setAge(req.getAge());
        if (req.getGender() != null && !req.getGender().trim().isEmpty()) reg.setGender(req.getGender().trim());
        if (req.getDateOfBirth() != null) reg.setDateOfBirth(req.getDateOfBirth());
        if (req.getAddress() != null) reg.setAddress(req.getAddress());
        if (req.getEmergencyContact() != null) reg.setEmergencyContact(req.getEmergencyContact());

        // Update symptoms and routing details
        if (req.getRawComplaint() != null) reg.setRawComplaint(req.getRawComplaint());
        if (req.getMainSymptom() != null) reg.setMainSymptom(req.getMainSymptom());
        if (req.getDuration() != null) reg.setDuration(req.getDuration());
        if (req.getSeverity() != null) reg.setSeverity(req.getSeverity());
        if (req.getAssociatedSymptoms() != null) reg.setAssociatedSymptoms(req.getAssociatedSymptoms());
        if (req.getRecommendedDepartment() != null) reg.setRecommendedDepartment(req.getRecommendedDepartment());
        if (req.getDoctorId() != null) reg.setDoctorId(req.getDoctorId());
        if (req.getDoctorName() != null) reg.setDoctorName(req.getDoctorName());
        if (req.getCabin() != null) reg.setCabin(req.getCabin());
        if (req.getPriority() != null) reg.setPriority(req.getPriority());

        // Update clinical notes and status
        if (req.getDiagnosis() != null) reg.setDiagnosis(req.getDiagnosis());
        if (req.getPrescription() != null) reg.setPrescription(req.getPrescription());
        if (req.getDoctorNotes() != null) reg.setDoctorNotes(req.getDoctorNotes());

        if (req.getStatus() != null && !req.getStatus().trim().isEmpty()) {
            reg.setStatus(req.getStatus().trim().toUpperCase());
            if ("IN_CONSULTATION".equalsIgnoreCase(req.getStatus()) && reg.getCalledAt() == null) {
                reg.setCalledAt(LocalDateTime.now());
            } else if ("COMPLETED".equalsIgnoreCase(req.getStatus()) && reg.getCompletedAt() == null) {
                reg.setCompletedAt(LocalDateTime.now());
            }
        }

        reg.setUpdatedAt(LocalDateTime.now());
        reg.setLastModifiedBy(userEmail != null ? userEmail : (role != null ? role.name() : "AUTHORIZED_STAFF"));

        PatientRegistration saved = registrationRepository.save(reg);

        // Synchronize with QueueItem
        try {
            Optional<QueueItem> queueItemOpt = queueRepository.findByTokenNumber(reg.getTokenNumber());
            if (queueItemOpt.isPresent()) {
                QueueItem q = queueItemOpt.get();
                q.setPatientName(reg.getName());
                q.setAge(reg.getAge());
                q.setGender(reg.getGender());
                q.setComplaint(reg.getMainSymptom() != null ? reg.getMainSymptom() : reg.getRawComplaint());
                if (reg.getDoctorId() != null) q.setDoctorId(reg.getDoctorId());
                if (reg.getDoctorName() != null) q.setDoctorName(reg.getDoctorName());
                if (reg.getCabin() != null) q.setCabin(reg.getCabin());
                if (reg.getRecommendedDepartment() != null) q.setDepartment(reg.getRecommendedDepartment());
                if (reg.getPriority() != null) q.setPriorityLabel(reg.getPriority());
                if (reg.getStatus() != null) q.setStatus(reg.getStatus());
                queueRepository.save(q);
            }
        } catch (Exception e) {
            System.err.println("Queue sync warning: " + e.getMessage());
        }

        return saved;
    }

    public boolean deleteRegistration(String id) {
        if (registrationRepository.existsById(id)) {
            registrationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private User findBestDoctorForDepartment(String deptName, String preferredDoctorId) {
        if (preferredDoctorId != null && !preferredDoctorId.isEmpty()) {
            Optional<User> preferred = userRepository.findById(preferredDoctorId);
            if (preferred.isPresent()) return preferred.get();
        }

        List<User> doctors = userRepository.findByRoleAndDepartmentIgnoreCase(UserRole.DOCTOR, deptName);
        if (doctors.isEmpty()) {
            doctors = userRepository.findByRole(UserRole.DOCTOR);
        }

        if (doctors.isEmpty()) {
            return null;
        }

        // Pick available doctor with shortest queue
        return doctors.stream()
                .sorted((d1, d2) -> {
                    if (d1.isAvailable() != d2.isAvailable()) {
                        return d1.isAvailable() ? -1 : 1;
                    }
                    return Integer.compare(d1.getCurrentQueueLength(), d2.getCurrentQueueLength());
                })
                .findFirst()
                .orElse(doctors.get(0));
    }

    private String getDepartmentCode(String deptName) {
        if (deptName == null) return "GEN";
        String lower = deptName.toLowerCase();
        if (lower.contains("ortho")) return "ORTHO";
        if (lower.contains("cardio")) return "CARD";
        if (lower.contains("derma")) return "DERMA";
        if (lower.contains("neuro")) return "NEURO";
        if (lower.contains("eye") || lower.contains("ophthal")) return "EYE";
        if (lower.contains("pediatric")) return "PED";
        if (lower.contains("emerg")) return "EMERG";
        return "GEN";
    }

    private synchronized String generateNextToken(String deptCode) {
        long count = queueRepository.count();
        long tokenNum = (count % 900) + 101;
        return deptCode + "-" + String.format("%03d", tokenNum);
    }
}
