package com.hospital.optimization.controller;

import com.hospital.optimization.dto.ApiResponse;
import com.hospital.optimization.model.Department;
import com.hospital.optimization.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DepartmentController {

    @Autowired
    private DepartmentRepository departmentRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.<List<Department>>builder()
                .success(true)
                .message("Departments retrieved")
                .data(departmentRepository.findAll())
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable String id) {
        Optional<Department> dept = departmentRepository.findById(id);
        return dept.map(department -> ResponseEntity.ok(ApiResponse.<Department>builder()
                .success(true)
                .message("Department found")
                .data(department)
                .build()))
                .orElseGet(() -> ResponseEntity.status(404).body(ApiResponse.<Department>builder()
                        .success(false)
                        .message("Department not found")
                        .build()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department department) {
        department.setActive(true);
        Department saved = departmentRepository.save(department);
        return ResponseEntity.ok(ApiResponse.<Department>builder()
                .success(true)
                .message("Department created successfully")
                .data(saved)
                .build());
    }
}
