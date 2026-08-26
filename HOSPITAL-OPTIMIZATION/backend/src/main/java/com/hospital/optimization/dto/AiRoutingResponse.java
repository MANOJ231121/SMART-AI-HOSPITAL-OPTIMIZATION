package com.hospital.optimization.dto;

import java.util.List;
import java.util.Map;

public class AiRoutingResponse {
    private boolean success;
    private String recommendedDepartment;
    private String departmentId;
    private String confidence;
    private String reasoning;
    private String priority;
    private boolean emergency;
    private String extractedMainSymptom;
    private String extractedDuration;
    private String extractedSeverity;
    private List<String> extractedKeywords;
    private Map<String, String> extractedDetails;
    private String disclaimer;

    public AiRoutingResponse() {}

    public AiRoutingResponse(boolean success, String recommendedDepartment, String departmentId, String confidence,
                             String reasoning, String priority, boolean emergency, String extractedMainSymptom,
                             String extractedDuration, String extractedSeverity, List<String> extractedKeywords,
                             Map<String, String> extractedDetails, String disclaimer) {
        this.success = success;
        this.recommendedDepartment = recommendedDepartment;
        this.departmentId = departmentId;
        this.confidence = confidence;
        this.reasoning = reasoning;
        this.priority = priority;
        this.emergency = emergency;
        this.extractedMainSymptom = extractedMainSymptom;
        this.extractedDuration = extractedDuration;
        this.extractedSeverity = extractedSeverity;
        this.extractedKeywords = extractedKeywords;
        this.extractedDetails = extractedDetails;
        this.disclaimer = disclaimer;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

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

    public String getExtractedMainSymptom() { return extractedMainSymptom; }
    public void setExtractedMainSymptom(String extractedMainSymptom) { this.extractedMainSymptom = extractedMainSymptom; }

    public String getExtractedDuration() { return extractedDuration; }
    public void setExtractedDuration(String extractedDuration) { this.extractedDuration = extractedDuration; }

    public String getExtractedSeverity() { return extractedSeverity; }
    public void setExtractedSeverity(String extractedSeverity) { this.extractedSeverity = extractedSeverity; }

    public List<String> getExtractedKeywords() { return extractedKeywords; }
    public void setExtractedKeywords(List<String> extractedKeywords) { this.extractedKeywords = extractedKeywords; }

    public Map<String, String> getExtractedDetails() { return extractedDetails; }
    public void setExtractedDetails(Map<String, String> extractedDetails) { this.extractedDetails = extractedDetails; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public static AiRoutingResponseBuilder builder() {
        return new AiRoutingResponseBuilder();
    }

    public static class AiRoutingResponseBuilder {
        private boolean success;
        private String recommendedDepartment;
        private String departmentId;
        private String confidence;
        private String reasoning;
        private String priority;
        private boolean emergency;
        private String extractedMainSymptom;
        private String extractedDuration;
        private String extractedSeverity;
        private List<String> extractedKeywords;
        private Map<String, String> extractedDetails;
        private String disclaimer;

        public AiRoutingResponseBuilder success(boolean success) { this.success = success; return this; }
        public AiRoutingResponseBuilder recommendedDepartment(String dept) { this.recommendedDepartment = dept; return this; }
        public AiRoutingResponseBuilder departmentId(String deptId) { this.departmentId = deptId; return this; }
        public AiRoutingResponseBuilder confidence(String confidence) { this.confidence = confidence; return this; }
        public AiRoutingResponseBuilder reasoning(String reasoning) { this.reasoning = reasoning; return this; }
        public AiRoutingResponseBuilder priority(String priority) { this.priority = priority; return this; }
        public AiRoutingResponseBuilder emergency(boolean emergency) { this.emergency = emergency; return this; }
        public AiRoutingResponseBuilder extractedMainSymptom(String symptom) { this.extractedMainSymptom = symptom; return this; }
        public AiRoutingResponseBuilder extractedDuration(String duration) { this.extractedDuration = duration; return this; }
        public AiRoutingResponseBuilder extractedSeverity(String severity) { this.extractedSeverity = severity; return this; }
        public AiRoutingResponseBuilder extractedKeywords(List<String> keywords) { this.extractedKeywords = keywords; return this; }
        public AiRoutingResponseBuilder extractedDetails(Map<String, String> details) { this.extractedDetails = details; return this; }
        public AiRoutingResponseBuilder disclaimer(String disclaimer) { this.disclaimer = disclaimer; return this; }

        public AiRoutingResponse build() {
            return new AiRoutingResponse(success, recommendedDepartment, departmentId, confidence, reasoning, priority,
                    emergency, extractedMainSymptom, extractedDuration, extractedSeverity, extractedKeywords, extractedDetails, disclaimer);
        }
    }
}
