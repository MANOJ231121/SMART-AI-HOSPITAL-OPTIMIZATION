package com.hospital.optimization.dto;

import java.util.Map;

/**
 * Request payload for the SmartCare voice-assistant LLM chat (Groq).
 *
 * mode: "both" (default) -> extract symptoms/routing AND give a natural reply
 *       "extract"        -> only extract structured fields
 *       "knowledge"      -> the patient asked a general health question; answer it
 */
public class GroqChatRequest {
    private String text;
    private String language;
    private String mode;
    private String question;
    private Map<String, String> context;

    public GroqChatRequest() {}

    public GroqChatRequest(String text, String language, String mode, String question, Map<String, String> context) {
        this.text = text;
        this.language = language;
        this.mode = mode;
        this.question = question;
        this.context = context;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public Map<String, String> getContext() { return context; }
    public void setContext(Map<String, String> context) { this.context = context; }
}