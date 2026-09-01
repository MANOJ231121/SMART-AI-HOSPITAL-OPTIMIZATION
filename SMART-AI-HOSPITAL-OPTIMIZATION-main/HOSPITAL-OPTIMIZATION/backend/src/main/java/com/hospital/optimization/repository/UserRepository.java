package com.hospital.optimization.repository;

import com.hospital.optimization.model.User;
import com.hospital.optimization.model.UserRole;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByRoleAndDepartmentIgnoreCase(UserRole role, String department);
    List<User> findByRoleAndAvailableTrue(UserRole role);
    long countByRole(UserRole role);
}
