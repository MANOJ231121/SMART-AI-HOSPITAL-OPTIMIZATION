package com.hospital.optimization.repository;

import com.hospital.optimization.model.Bed;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BedRepository extends MongoRepository<Bed, String> {
    List<Bed> findByStatus(String status);
    List<Bed> findByDepartment(String department);
}
