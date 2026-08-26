package com.hospital.optimization.repository;

import com.hospital.optimization.model.PatientRegistration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRegistrationRepository extends MongoRepository<PatientRegistration, String> {
    Optional<PatientRegistration> findByTokenNumber(String tokenNumber);
    List<PatientRegistration> findByPhone(String phone);
    List<PatientRegistration> findByRecommendedDepartment(String recommendedDepartment);
    List<PatientRegistration> findByDepartmentId(String departmentId);
    List<PatientRegistration> findByDoctorId(String doctorId);
    List<PatientRegistration> findByStatus(String status);
    List<PatientRegistration> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    long countByStatus(String status);
    long countByEmergencyTrue();
    long countByCreatedAtAfter(LocalDateTime date);
}
