package com.hospital.optimization.service;

import com.hospital.optimization.dto.*;
import com.hospital.optimization.model.User;
import com.hospital.optimization.model.UserRole;
import com.hospital.optimization.repository.UserRepository;
import com.hospital.optimization.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenProvider.generateToken(
                authentication,
                user.getId(),
                user.getEmail(),
                user.getRole().name(),
                user.getName()
        );

        UserDto userDto = mapToUserDto(user);

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .message("Login successful")
                .user(userDto)
                .build();
    }

    public AuthResponse registerPatient(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return AuthResponse.builder()
                    .success(false)
                    .message("Email is already registered")
                    .build();
        }

        // STRICT ENFORCEMENT: Public registration ALWAYS assigns PATIENT role
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .address(request.getAddress())
                .emergencyContact(request.getEmergencyContact())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.PATIENT)
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        // Auto authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = tokenProvider.generateToken(
                authentication,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getName()
        );

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .message("Patient registration successful")
                .user(mapToUserDto(savedUser))
                .build();
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserDto(user);
    }

    public UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .address(user.getAddress())
                .emergencyContact(user.getEmergencyContact())
                .specialization(user.getSpecialization())
                .department(user.getDepartment())
                .roomNumber(user.getRoomNumber())
                .build();
    }
}
