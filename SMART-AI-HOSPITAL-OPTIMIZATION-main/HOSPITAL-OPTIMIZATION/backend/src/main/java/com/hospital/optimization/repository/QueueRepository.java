package com.hospital.optimization.repository;

import com.hospital.optimization.model.QueueItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends MongoRepository<QueueItem, String> {
    Optional<QueueItem> findByTokenNumber(String tokenNumber);
    List<QueueItem> findByPatientId(String patientId);
    List<QueueItem> findByDoctorId(String doctorId);
    List<QueueItem> findByDoctorIdAndStatusIn(String doctorId, List<String> statuses);
    List<QueueItem> findByDepartment(String department);
    List<QueueItem> findByDepartmentAndStatusIn(String department, List<String> statuses);
    List<QueueItem> findByStatus(String status);
    List<QueueItem> findByStatusIn(List<String> statuses);
    long countByStatus(String status);
    long countByStatusIn(List<String> statuses);
}
