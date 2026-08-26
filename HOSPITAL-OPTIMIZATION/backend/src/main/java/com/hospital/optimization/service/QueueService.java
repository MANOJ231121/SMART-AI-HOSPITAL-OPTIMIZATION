package com.hospital.optimization.service;

import com.hospital.optimization.dto.QueueStatusResponse;
import com.hospital.optimization.dto.QueueStatusResponse.QueueRowDto;
import com.hospital.optimization.model.PatientRegistration;
import com.hospital.optimization.model.QueueItem;
import com.hospital.optimization.model.User;
import com.hospital.optimization.model.UserRole;
import com.hospital.optimization.repository.PatientRegistrationRepository;
import com.hospital.optimization.repository.QueueRepository;
import com.hospital.optimization.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QueueService {

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private PatientRegistrationRepository registrationRepository;

    @Autowired
    private UserRepository userRepository;

    public QueueStatusResponse getTokenStatus(String tokenNumber) {
        if (tokenNumber == null || tokenNumber.trim().isEmpty()) {
            return null;
        }

        Optional<QueueItem> targetOpt = queueRepository.findByTokenNumber(tokenNumber.trim());
        if (targetOpt.isEmpty()) {
            return null;
        }

        QueueItem target = targetOpt.get();
        String doctorId = target.getDoctorId();
        String department = target.getDepartment();

        // Get queue items for this doctor / department
        List<QueueItem> relatedItems;
        if (doctorId != null && !doctorId.isEmpty() && !"doc-default".equals(doctorId)) {
            relatedItems = queueRepository.findByDoctorId(doctorId);
        } else {
            relatedItems = queueRepository.findByDepartment(department);
        }

        // Identify currently serving token
        Optional<QueueItem> inConsultation = relatedItems.stream()
                .filter(q -> "IN_CONSULTATION".equalsIgnoreCase(q.getStatus()) || "CALLED".equalsIgnoreCase(q.getStatus()) || "Serving".equalsIgnoreCase(q.getStatus()))
                .findFirst();

        String currentlyServing = inConsultation.map(QueueItem::getTokenNumber).orElse("None");

        // Count patients ahead (status == WAITING created before target)
        long patientsAhead = relatedItems.stream()
                .filter(q -> "WAITING".equalsIgnoreCase(q.getStatus()) && q.getCreatedAt() != null && target.getCreatedAt() != null && q.getCreatedAt().isBefore(target.getCreatedAt()))
                .count();

        if ("IN_CONSULTATION".equalsIgnoreCase(target.getStatus()) || "CALLED".equalsIgnoreCase(target.getStatus())) {
            patientsAhead = 0;
        }

        int estimatedMinutes = (int) (patientsAhead * 8 + 4);

        // Build privacy-safe queue rows (anonymized initials only)
        List<QueueRowDto> rows = relatedItems.stream()
                .map(item -> QueueRowDto.builder()
                        .token(item.getTokenNumber())
                        .initials(toInitials(item.getPatientName()))
                        .status(formatStatus(item.getStatus()))
                        .priority(item.getPriorityLabel() != null ? item.getPriorityLabel() : "Normal")
                        .build())
                .collect(Collectors.toList());

        return QueueStatusResponse.builder()
                .yourToken(target.getTokenNumber())
                .patientName(target.getPatientName())
                .department(target.getDepartment())
                .doctorName(target.getDoctorName())
                .cabin(target.getCabin())
                .status(target.getStatus())
                .currentlyServing(currentlyServing)
                .patientsAhead((int) patientsAhead)
                .estimatedMinutes(estimatedMinutes)
                .queue(rows)
                .build();
    }

    public QueueItem callNextPatient(String doctorId) {
        List<QueueItem> waitingItems = queueRepository.findByDoctorIdAndStatusIn(doctorId, List.of("WAITING"));
        if (waitingItems.isEmpty()) {
            return null;
        }

        // Sort by priority (descending: 3=Emergency, 2=Priority, 1=Normal), then creation time
        waitingItems.sort((a, b) -> {
            if (a.getPriority() != b.getPriority()) {
                return Integer.compare(b.getPriority(), a.getPriority());
            }
            if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                return a.getCreatedAt().compareTo(b.getCreatedAt());
            }
            return 0;
        });

        QueueItem nextPatient = waitingItems.get(0);
        nextPatient.setStatus("IN_CONSULTATION");
        nextPatient.setCalledAt(LocalDateTime.now());
        queueRepository.save(nextPatient);

        // Update registration status
        if (nextPatient.getRegistrationId() != null) {
            registrationRepository.findById(nextPatient.getRegistrationId()).ifPresent(reg -> {
                reg.setStatus("IN_CONSULTATION");
                reg.setCalledAt(LocalDateTime.now());
                registrationRepository.save(reg);
            });
        }

        return nextPatient;
    }

    public QueueItem completeConsultation(String queueId) {
        Optional<QueueItem> opt = queueRepository.findById(queueId);
        if (opt.isEmpty()) return null;

        QueueItem item = opt.get();
        item.setStatus("COMPLETED");
        item.setCompletedAt(LocalDateTime.now());
        queueRepository.save(item);

        // Update registration status
        if (item.getRegistrationId() != null) {
            registrationRepository.findById(item.getRegistrationId()).ifPresent(reg -> {
                reg.setStatus("COMPLETED");
                reg.setCompletedAt(LocalDateTime.now());
                registrationRepository.save(reg);
            });
        }

        // Update doctor active queue count
        if (item.getDoctorId() != null) {
            userRepository.findById(item.getDoctorId()).ifPresent(doc -> {
                if (doc.getCurrentQueueLength() > 0) {
                    doc.setCurrentQueueLength(doc.getCurrentQueueLength() - 1);
                    userRepository.save(doc);
                }
            });
        }

        return item;
    }

    public QueueItem updateStatus(String queueId, String newStatus) {
        Optional<QueueItem> opt = queueRepository.findById(queueId);
        if (opt.isEmpty()) return null;

        QueueItem item = opt.get();
        item.setStatus(newStatus.toUpperCase());
        if ("IN_CONSULTATION".equalsIgnoreCase(newStatus)) {
            item.setCalledAt(LocalDateTime.now());
        } else if ("COMPLETED".equalsIgnoreCase(newStatus)) {
            item.setCompletedAt(LocalDateTime.now());
        }
        return queueRepository.save(item);
    }

    public List<QueueItem> getAllQueues() {
        return queueRepository.findAll();
    }

    public List<QueueItem> getDoctorQueue(String doctorId) {
        return queueRepository.findByDoctorId(doctorId);
    }

    public List<QueueItem> getDepartmentQueue(String department) {
        return queueRepository.findByDepartment(department);
    }

    private String toInitials(String name) {
        if (name == null || name.trim().isEmpty()) return "P.";
        String[] parts = name.trim().split("\\s+");
        if (parts.length == 1) return parts[0].substring(0, 1).toUpperCase() + ".";
        return (parts[0].substring(0, 1) + "." + parts[parts.length - 1].substring(0, 1) + ".").toUpperCase();
    }

    private String formatStatus(String status) {
        if (status == null) return "Waiting";
        switch (status.toUpperCase()) {
            case "IN_CONSULTATION":
            case "CALLED":
                return "Serving";
            case "COMPLETED":
                return "Completed";
            case "CANCELLED":
                return "Cancelled";
            default:
                return "Waiting";
        }
    }
}
