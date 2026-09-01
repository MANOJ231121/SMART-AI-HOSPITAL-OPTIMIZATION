package com.hospital.optimization.dto;

import java.util.List;
import java.util.Map;

/**
 * Response returned by the SmartCare voice assistant after the patient answers.
 *
 * reply    : a short, natural, conversational spoken response (used for TTS).
 * mode     : echoes the request mode.
 * extracted: structured fields extracted from the answer (Name, Age, Gender,
 *            "Main Symptom", Duration, Severity, Contact, ...).
 * routing  : optional department recommendation when mode is extract/both.
 */
public class GroqChatResponse {
    private boolean success;
    private String reply;
    private String nextQuestion;
    private boolean done;
    private String mode;
    private Map<String, String> extracted;
    private String recommendedDepartment;
    private String departmentId;
    private String confidence;
    private String reasoning;
    private String priority;
    private boolean emergency;
    private String disclaimer;

    public GroqChatResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getNextQuestion() { return nextQuestion; }
    public void setNextQuestion(String nextQuestion) { this.nextQuestion = nextQuestion; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public Map<String, String> getExtracted() { return extracted; }
    public void setExtracted(Map<String, String> extracted) { this.extracted = extracted; }

    public String getRecommendedDepartment() { return recommendedDepartment; }
    public void setRecommendedDepartment(String recommendedDepartment) { this.recommendedDepartment = recommendedDepartment; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getConfidence() { return confidence; }
    public void setConfidence(String confidence) { this.confidence = confidence; }

    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public boolean isEmergency() { return emergency; }
    public void setEmergency(boolean emergency) { this.emergency = emergency; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public String[] routingKeys() {
        return new String[] {
            "recommendedDepartment", "departmentId", "confidence",
            "reasoning", "priority", "emergency"
        };
    }

    public static final List<String> STANDARD_KEYS = List.of(
        "Name", "Age", "Gender", "Contact", "Main Symptom",
        "Duration", "Severity", "Associated Symptoms"
    );
}