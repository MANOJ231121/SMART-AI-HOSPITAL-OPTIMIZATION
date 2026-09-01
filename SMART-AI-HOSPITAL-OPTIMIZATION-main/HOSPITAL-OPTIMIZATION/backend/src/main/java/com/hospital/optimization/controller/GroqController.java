package com.hospital.optimization.controller;

import com.hospital.optimization.dto.GroqChatRequest;
import com.hospital.optimization.dto.GroqChatResponse;
import com.hospital.optimization.service.GroqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoint used by the SmartCare kiosk voice assistant to get a natural
 * LLM-powered reply and symptom routing for the patient's spoken answer.
 */
@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*", maxAge = 3600)
public class GroqController {

    @Autowired
    private GroqService groqService;

    @PostMapping("/groq/chat")
    public ResponseEntity<GroqChatResponse> chat(@RequestBody GroqChatRequest request) {
        return ResponseEntity.ok(groqService.chat(request));
    }
}