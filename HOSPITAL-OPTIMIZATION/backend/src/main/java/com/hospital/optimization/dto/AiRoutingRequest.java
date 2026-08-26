package com.hospital.optimization.dto;

import java.util.Map;

public class AiRoutingRequest {
    private String text;
    private String language;
    private Map<String, String> context;

    public AiRoutingRequest() {}

    public AiRoutingRequest(String text, String language, Map<String, String> context) {
        this.text = text;
        this.language = language;
        this.context = context;
    }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Map<String, String> getContext() { return context; }
    public void setContext(Map<String, String> context) { this.context = context; }

    public static AiRoutingRequestBuilder builder() {
        return new AiRoutingRequestBuilder();
    }

    public static class AiRoutingRequestBuilder {
        private String text;
        private String language;
        private Map<String, String> context;

        public AiRoutingRequestBuilder text(String text) { this.text = text; return this; }
        public AiRoutingRequestBuilder language(String language) { this.language = language; return this; }
        public AiRoutingRequestBuilder context(Map<String, String> context) { this.context = context; return this; }

        public AiRoutingRequest build() {
            return new AiRoutingRequest(text, language, context);
        }
    }
}
