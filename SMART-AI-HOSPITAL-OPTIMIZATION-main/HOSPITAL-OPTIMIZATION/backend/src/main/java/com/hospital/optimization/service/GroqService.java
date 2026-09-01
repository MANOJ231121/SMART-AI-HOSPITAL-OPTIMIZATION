package com.hospital.optimization.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hospital.optimization.dto.AiRoutingRequest;
import com.hospital.optimization.dto.AiRoutingResponse;
import com.hospital.optimization.dto.GroqChatRequest;
import com.hospital.optimization.dto.GroqChatResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

/**
 * Wraps the Groq API (OpenAI-compatible /chat/completions) for the SmartCare
 * voice assistant.
 *
 * - The patient's spoken answer is sent to a Groq-hosted LLM with a strict
 *   system prompt.
 * - The model returns a short, natural, conversational spoken reply (so the TTS
 *   does not sound robotic) plus structured extracted fields and routing.
 * - If the key is not configured or the call fails, we gracefully fall back to
 *   the existing rule-based {@link SymptomRoutingService} so the kiosk still works.
 */
@Service
public class GroqService {

    private static final Logger log = LoggerFactory.getLogger(GroqService.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final RestTemplate restTemplate;
    private final SymptomRoutingService routingService;

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    public GroqService(RestTemplateBuilder builder, SymptomRoutingService routingService) {
        this.restTemplate = builder
                .setConnectTimeout(Duration.ofSeconds(15))
                .setReadTimeout(Duration.ofSeconds(45))
                .build();
        this.routingService = routingService;
    }

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }

    @PostConstruct
    void logConfig() {
        log.info("GroqService config -> key configured: {}, model: {}, apiUrl: {}",
                isConfigured(), model, apiUrl);
    }

    /**
     * Main entry point used by the controller.
     */
    public GroqChatResponse chat(GroqChatRequest request) {
        if (!isConfigured()) {
            log.warn("Groq API key is not configured. Falling back to rule-based routing.");
            return fallback(request);
        }

        try {
            String systemPrompt = buildSystemPrompt(request);
            String raw = callGroq(systemPrompt);
            return parseResponse(raw, request);
        } catch (Exception e) {
            log.error("Groq call failed; falling back to rule-based routing.", e);
            return fallback(request);
        }
    }

    private String callGroq(String userPrompt) throws Exception {
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "system", "content",
                        "You are the warm, friendly Hindi/English speaking voice assistant of SmartCare, a hospital kiosk. " +
                        "Answer exactly as described in the user message. Return ONLY valid JSON, with no markdown fences and no extra text."),
                Map.of("role", "user", "content", userPrompt)
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", model);
        requestBody.put("messages", messages);
        requestBody.put("temperature", 0.4);
        requestBody.put("max_tokens", 900);
        requestBody.put("response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                apiUrl, HttpMethod.POST, entity, String.class);

        if (response.getBody() == null) {
            throw new IllegalStateException("Empty Groq response");
        }

        JsonNode root = MAPPER.readTree(response.getBody());
        return extractText(root);
    }

    /**
     * Pulls the model's JSON text out of the OpenAI-compatible response.
     */
    private String extractText(JsonNode root) {
        JsonNode choices = root.path("choices");
        if (choices.isArray() && !choices.isEmpty()) {
            String content = choices.get(0).path("message").path("content").asText(null);
            if (content != null && !content.isBlank()) {
                return content.trim();
            }
        }
        throw new IllegalStateException("No text found in Groq response");
    }

    /**
     * Builds the instruction that asks the model for a short natural reply and/or
     * structured extraction depending on the requested mode.
     */
    private String buildSystemPrompt(GroqChatRequest req) {
        String text = req.getText() == null ? "" : req.getText().trim();
        String lang = req.getLanguage() == null ? "hi" : req.getLanguage();
        String mode = req.getMode() == null ? "chat" : req.getMode();
        String question = req.getQuestion() == null ? "" : req.getQuestion();
        String context = req.getContext() == null ? "{}" : req.getContext().toString();
        String langName = langName(lang);

        if ("knowledge".equalsIgnoreCase(mode)) {
            return "You are the voice assistant of SmartCare, a hospital registration kiosk. "
                    + "The patient asked a general health question, NOT ongoing registration. "
                    + "Answer helpfully and conversationally in 1-3 short sentences in " + langName + ". "
                    + "Always add: this is general information, not a medical diagnosis; please consult a doctor. "
                    + "Return JSON: {\"reply\":\"...\",\"mode\":\"knowledge\",\"extracted\":{}} \n\n"
                    + "Patient's question: \"" + text + "\"\n\nRespond ONLY with the JSON object.";
        }

        return new StringBuilder()
                .append("You are \"Sahayak\", the warm, friendly voice assistant of the SmartCare Hospital kiosk. ")
                .append("You speak to the patient in ").append(langName).append(". ")
                .append("Keep every spoken line to 1-2 short, natural sentences, like a real receptionist talking out loud. ")
                .append("You register a patient by having a real conversation. Never read a fixed list of questions. ")

                .append("\n\nContext already collected: ").append(context)
                .append("\nPrevious question you asked: \"").append(question).append("\"")
                .append("\nPatient just said: \"").append(text).append("\"")

                .append("\n\nRules:")
                .append("\n1. If the patient asked a general health question (advice, home remedies, meaning of a term), answer it helpfully and conversationally, then continue registration by asking your next registration question.")
                .append("\n2. Extract any structured details the patient gave into these exact keys if present: Name, Age, Gender, Contact (10-digit mobile), Main Symptom, Duration, Severity, Associated Symptoms. ")
                .append("Merge them into \"extracted\" together with every value already listed in the Context that is still valid. Never invent values.")
                .append("\n3. Essential fields: Name, Age, Contact, Main Symptom, Duration. ")
                .append("If ALL of them are present, set \"done\": true and write a warm completion \"reply\" (thank the patient; registration finished; a token is being generated). Set \"nextQuestion\" to empty.")
                .append("\n4. Otherwise set \"done\": false. \"reply\" briefly acknowledges or answers what the patient said. \"nextQuestion\" is your single next natural, spoken question in ").append(langName).append(" for the single most important missing essential field. ")
                .append("Even after answering a general question you must still provide one \"nextQuestion\" to keep the registration moving.")
                .append("\n5. Route the Main Symptom to the best department from exactly one of: Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, Ophthalmology, General Medicine, Emergency. ")
                .append("departmentId from exactly one of: cardio, neuro, ortho, derma, ped, eye, gen, emerg. ")
                .append("confidence is High, Medium or Low. priority is Emergency, Priority or Normal. ")
                .append("reasoning is one short sentence in ").append(langName).append(" explaining the routing.")
                .append("\n6. Set \"emergency\": true ONLY for life-threatening symptoms (chest pain, breathlessness, fainting, severe bleeding, stroke, unconsciousness). ")
                .append("\n7. If the patient's speech was not understood, politely ask them to repeat their last answer, keeping \"done\": false.")

                .append("\n\nRespond with ONLY this exact JSON object, with no markdown fences and no extra text: ")
                .append("{\"reply\":\"...\",\"nextQuestion\":\"...\",\"done\":true|false,\"extracted\":{...},\"recommendedDepartment\":\"...\",\"departmentId\":\"...\",\"confidence\":\"High|Medium|Low\",\"reasoning\":\"...\",\"priority\":\"Emergency|Priority|Normal\",\"emergency\":true|false}")
                .toString();
    }

    private String langName(String code) {
        switch (code == null ? "" : code.toLowerCase()) {
            case "gu": return "Gujarati";
            case "en": return "English";
            default: return "Hindi";
        }
    }

    /**
     * Parses the model JSON response into a GroqChatResponse and normalizes it.
     */
    private GroqChatResponse parseResponse(String raw, GroqChatRequest req) throws Exception {
        String cleaned = raw.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceFirst("^```[a-zA-Z]*\\n?", "").replaceFirst("```$", "").trim();
        }
        JsonNode node = MAPPER.readTree(cleaned);
        GroqChatResponse resp = new GroqChatResponse();
        resp.setSuccess(true);
        resp.setMode(req.getMode() == null ? "chat" : req.getMode());
        resp.setReply(node.path("reply").asText(""));
        resp.setNextQuestion(node.path("nextQuestion").asText(null));
        resp.setDone(node.path("done").asBoolean(false));

        // extracted fields
        Map<String, String> extracted = new HashMap<>();
        JsonNode ext = node.path("extracted");
        if (ext.isObject()) {
            ext.fields().forEachRemaining(e -> {
                String val = e.getValue() != null && !e.getValue().isNull() ? e.getValue().asText() : null;
                if (val != null && !val.isBlank()) extracted.put(e.getKey(), val.trim());
            });
        }
        // Also accept flat keys as extracted fields
        if (extracted.isEmpty()) {
            for (String key : GroqChatResponse.STANDARD_KEYS) {
                JsonNode v = node.path(key);
                if (!v.isMissingNode() && !v.isNull() && v.asText() != null && !v.asText().isBlank()) {
                    extracted.put(key, v.asText().trim());
                }
            }
        }
        resp.setExtracted(extracted);

        resp.setRecommendedDepartment(node.path("recommendedDepartment").asText(null));
        resp.setDepartmentId(node.path("departmentId").asText(null));
        resp.setConfidence(node.path("confidence").asText("Medium"));
        resp.setReasoning(node.path("reasoning").asText(""));
        resp.setPriority(node.path("priority").asText("Normal"));
        resp.setEmergency(node.path("emergency").asBoolean(false));
        resp.setDisclaimer(SymptomRoutingService.DISCLAIMER);

        // If the model returned no routing for a routing mode, fall back to rule-based.
        if (resp.getRecommendedDepartment() == null && !"knowledge".equalsIgnoreCase(resp.getMode())) {
            AiRoutingRequest routeReq = AiRoutingRequest.builder()
                    .text(req.getText())
                    .language(req.getLanguage())
                    .context(req.getContext() == null ? new HashMap<>() : req.getContext())
                    .build();
            AiRoutingResponse routeResp = routingService.analyzeAndRoute(routeReq);
            resp.setRecommendedDepartment(routeResp.getRecommendedDepartment());
            resp.setDepartmentId(routeResp.getDepartmentId());
            resp.setConfidence(routeResp.getConfidence());
            resp.setReasoning(routeResp.getReasoning());
            resp.setPriority(routeResp.getPriority());
            resp.setEmergency(routeResp.isEmergency());
        }

        return resp;
    }

    /**
     * Rule-based fallback so the kiosk keeps working without an API key.
     */
    private GroqChatResponse fallback(GroqChatRequest req) {
        AiRoutingRequest routeReq = AiRoutingRequest.builder()
                .text(req == null ? "" : req.getText())
                .language(req == null ? "hi" : req.getLanguage())
                .context(req != null && req.getContext() != null ? req.getContext() : new HashMap<>())
                .build();
        AiRoutingResponse route = routingService.analyzeAndRoute(routeReq);

        GroqChatResponse resp = new GroqChatResponse();
        resp.setSuccess(true);
        resp.setMode(req != null && req.getMode() != null ? req.getMode() : "both");
        resp.setRecommendedDepartment(route.getRecommendedDepartment());
        resp.setDepartmentId(route.getDepartmentId());
        resp.setConfidence(route.getConfidence());
        resp.setReasoning(route.getReasoning());
        resp.setPriority(route.getPriority());
        resp.setEmergency(route.isEmergency());
        resp.setDisclaimer(route.getDisclaimer());
        resp.setReply(route.getReasoning());
        resp.setExtracted(route.getExtractedDetails());
        return resp;
    }
}