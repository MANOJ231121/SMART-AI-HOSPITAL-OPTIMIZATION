package com.hospital.optimization.controller;

import com.hospital.optimization.dto.AiRoutingRequest;
import com.hospital.optimization.dto.AiRoutingResponse;
import com.hospital.optimization.service.SymptomRoutingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AiRoutingController {

    @Autowired
    private SymptomRoutingService routingService;

    @PostMapping("/route")
    public ResponseEntity<AiRoutingResponse> analyzeAndRoute(@RequestBody AiRoutingRequest request) {
        AiRoutingResponse response = routingService.analyzeAndRoute(request);
        return ResponseEntity.ok(response);
    }
}
