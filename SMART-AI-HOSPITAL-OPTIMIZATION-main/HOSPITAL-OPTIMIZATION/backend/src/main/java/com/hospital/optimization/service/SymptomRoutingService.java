package com.hospital.optimization.service;

import com.hospital.optimization.dto.AiRoutingRequest;
import com.hospital.optimization.dto.AiRoutingResponse;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class SymptomRoutingService {

    public static final String DISCLAIMER = "AI-assisted routing recommendation, not a medical diagnosis. Medical decisions remain with qualified clinical staff.";

    private static final Pattern DURATION_PATTERN = Pattern.compile(
            "(\\d+|[૦-૯]+)\\s*(din|दिन|days?|hafte|हफ्ते|weeks?|mahine|महीने|months?|divas|દિવસ|divaso|દિવસે|athvadiya|અઠવાડિયા|mahina|મહિના|hours?|ghante|घंटे|કલાક)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    private static final Pattern SEVERE_PATTERN = Pattern.compile(
            "severe|zyada|bahut zyada|tez|गंभीर|ज्यादा|बहुत ज्यादा|तेज़|extreme|unbearable|વધારે|તીવ્ર|ખૂબ વધારે|અસહ્ય|vadhare|khub vadhare|asahiya", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );
    private static final Pattern MILD_PATTERN = Pattern.compile(
            "mild|halka|thoda|हल्का|थोड़ा|slight|little|હળવો|થોડો|સામાન્ય|thodu|samanya", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    private static final Pattern EMERGENCY_PATTERN = Pattern.compile(
            "chest pain|seene.*dard|saans.*(dikkat|problem|takleef|phool)|breathless|faint|unconscious|behoshi|chhati.*dard|heart attack|stroke|severe bleeding|khoon|छाती.*દુખાવો|શ્વાસ.*(તકલીફ|ચઢવો)|બેભાન|લોહી|सीने.*दर्द|सांस.*(तकलीफ|दिक्कत|फूल)|बेहोश|खून|chhatima.*dukhavo|shwas.*nathi|bebhan", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE
    );

    public AiRoutingResponse analyzeAndRoute(AiRoutingRequest request) {
        String text = (request != null && request.getText() != null) ? request.getText().trim() : "";
        Map<String, String> context = (request != null && request.getContext() != null) ? request.getContext() : new HashMap<>();

        if (text.isEmpty()) {
            return AiRoutingResponse.builder()
                    .success(true)
                    .recommendedDepartment("General Medicine")
                    .departmentId("gen")
                    .confidence("Low")
                    .reasoning("No specific symptoms were reported. Routed to General Medicine for an initial clinical evaluation.")
                    .priority("Normal")
                    .emergency(false)
                    .disclaimer(DISCLAIMER)
                    .build();
        }

        boolean isEmergency = EMERGENCY_PATTERN.matcher(text).find();
        String duration = extractDuration(text);
        String severity = extractSeverity(text);

        if (context.containsKey("Duration") && (duration == null || duration.isEmpty())) {
            duration = context.get("Duration");
        }
        if (context.containsKey("Severity") && (severity == null || severity.isEmpty())) {
            severity = context.get("Severity");
        }

        String lower = text.toLowerCase();
        String recommendedDept;
        String deptId;
        String confidence;
        String reasoning;
        String mainSymptom;
        String priority;

        List<String> keywords = new ArrayList<>();

        if (isEmergency) {
            recommendedDept = "Emergency";
            deptId = "emerg";
            confidence = "High";
            priority = "Emergency";
            mainSymptom = "Critical / Urgent Symptoms";
            reasoning = "Reported symptoms indicate possible emergency or critical state requiring immediate human medical evaluation.";
            keywords.add("Emergency Triage");
        } else if (matchesPattern(lower, "knee|ghutn|joint|jod|bone|fracture|back.*pain|kamar|sprain|musculoskeletal|ankle|shoulder|leg.*pain|arm.*pain|हड्डी|घुटन|कमर|जोड़|मोच|ઘૂંટણ|સાંધા|હાડકા|કમર|દુખાવો|સોજો|મોચ|ghuntan|sandha|hadka|dukhavo|sojo")) {
            recommendedDept = "Orthopedics";
            deptId = "ortho";
            confidence = "High";
            priority = "Severe".equalsIgnoreCase(severity) ? "Priority" : "Normal";
            mainSymptom = "Joint / Knee / Musculoskeletal Pain";
            reasoning = "Complaint appears related to musculoskeletal, joint, or bone discomfort.";
            keywords.addAll(List.of("Joint Pain", "Musculoskeletal"));
        } else if (matchesPattern(lower, "skin|rash|khujli|itch|daan|pimple|acne|allergy|fungal|त्वचा|खुजली|दाने|ચામડી|ખંજવાળ|ધાબળા|ખીલ|એલર્જી|chamdi|khanjwal|dhabla")) {
            recommendedDept = "Dermatology";
            deptId = "derma";
            confidence = "High";
            priority = "Normal";
            mainSymptom = "Dermatological / Skin Issue";
            reasoning = "Complaint relates to dermatological conditions, rash, or skin irritation.";
            keywords.addAll(List.of("Dermatology", "Skin Condition"));
        } else if (matchesPattern(lower, "chest|heart|cardio|palpitation|sin|chhati|heart attack|hypertension|blood pressure|bp|छाती|दिल|धड़कन|सीने|હૃદય|ધબકારા|શ્વાસ|chhati|hriday|dhabkara|shwas")) {
            recommendedDept = "Cardiology";
            deptId = "cardio";
            confidence = "High";
            priority = "Priority";
            mainSymptom = "Cardiovascular / Heart Concern";
            reasoning = "Complaint relates to cardiovascular symptoms or blood pressure regulation.";
            keywords.addAll(List.of("Cardiovascular", "Heart"));
        } else if (matchesPattern(lower, "headache|migraine|sar.*dard|sir.*dard|dizzy|chakkar|faint|numbness|seizure|stroke|brain|दौरा|सिरदर्द|चक्कर|माथा|માથું|માથાનો.*દુખાવો|ચક્કર|આંચકી|બેભાન|mathano.*dukhavo|mathu.*dukhe|aanchki|bebhan")) {
            recommendedDept = "Neurology";
            deptId = "neuro";
            confidence = "High";
            priority = "Priority";
            mainSymptom = "Headache / Neurological Complaint";
            reasoning = "Symptoms indicate central nervous system, persistent headache, or neurological condition.";
            keywords.addAll(List.of("Neurology", "Headache"));
        } else if (matchesPattern(lower, "eye|vision|aankh|dhundhla|blur|conjunctivitis|blind|retina|sight|आंख|दृष्टि|धुंधला|આંખ|ઝાખું|દ્રષ્ટિ|લાલાશ|મોતિયો|aankh|jhakhu|drashti|lalash")) {
            recommendedDept = "Ophthalmology";
            deptId = "eye";
            confidence = "High";
            priority = "Normal";
            mainSymptom = "Eye / Vision Problem";
            reasoning = "Symptoms relate to ophthalmic care, vision disturbances, or eye irritation.";
            keywords.addAll(List.of("Ophthalmology", "Vision"));
        } else if (matchesPattern(lower, "child|baby|infant|kid|baccha|bacha|toddler|pediatric|newborn|बच्चा|शिशु|બાળક|નાનું બાળક|છોકરો|છોકરી|બચ્ચું|balak|nanu.*balak|chhokro|chhokri|bachchu")) {
            recommendedDept = "Pediatrics";
            deptId = "ped";
            confidence = "High";
            priority = "Normal";
            mainSymptom = "Pediatric Condition";
            reasoning = "Patient is an infant or child, routing to Pediatrics.";
            keywords.addAll(List.of("Pediatrics", "Child Care"));
        } else if (matchesPattern(lower, "fever|bukhar|cough|khasi|cold|sardi|gala|throat|vomit|ulti|stomach|pet|viral|flu|weakness|कमजोरी|बुखार|खांसी|सर्दी|उल्टी|पेट|गला|તાવ|ખાંસી|શરદી|ઉલટી|પેટ|નબળાઈ|ઝાડા|ગળું|tav|khasi|shardi|ulti|pet|nablai")) {
            recommendedDept = "General Medicine";
            deptId = "gen";
            confidence = "High";
            priority = "Severe".equalsIgnoreCase(severity) ? "Priority" : "Normal";
            mainSymptom = "General / Viral Symptoms";
            reasoning = "Symptoms align with general internal medicine, viral fevers, or common ailments.";
            keywords.addAll(List.of("Fever/Cold", "General Consultation"));
        } else {
            recommendedDept = "General Medicine";
            deptId = "gen";
            confidence = "Medium";
            priority = "Normal";
            mainSymptom = "General Consultation";
            reasoning = "Based on stated complaints, General Medicine is recommended for initial assessment and triaging.";
            keywords.add("General Assessment");
        }

        Map<String, String> details = new HashMap<>(context);
        if (duration != null) details.put("Duration", duration);
        if (severity != null) details.put("Severity", severity);
        details.put("Main Symptom", mainSymptom);

        return AiRoutingResponse.builder()
                .success(true)
                .recommendedDepartment(recommendedDept)
                .departmentId(deptId)
                .confidence(confidence)
                .reasoning(reasoning)
                .priority(priority)
                .emergency(isEmergency)
                .extractedMainSymptom(mainSymptom)
                .extractedDuration(duration != null ? duration : "Not specified")
                .extractedSeverity(severity != null ? severity : "Moderate")
                .extractedKeywords(keywords)
                .extractedDetails(details)
                .disclaimer(DISCLAIMER)
                .build();
    }

    private boolean matchesPattern(String text, String regexKeywords) {
        Pattern pattern = Pattern.compile(regexKeywords, Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
        return pattern.matcher(text).find();
    }

    public String extractDuration(String text) {
        if (text == null) return null;
        Matcher m = DURATION_PATTERN.matcher(text);
        if (m.find()) {
            String rawNum = m.group(1);
            String normalizedNum = normalizeDigits(rawNum);
            return normalizedNum + " " + m.group(2);
        }
        return null;
    }

    public String extractSeverity(String text) {
        if (text == null) return null;
        if (SEVERE_PATTERN.matcher(text).find()) return "Severe";
        if (MILD_PATTERN.matcher(text).find()) return "Mild";
        return "Moderate";
    }

    private String normalizeDigits(String input) {
        if (input == null) return "";
        char[] gujaratiDigits = {'૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'};
        StringBuilder sb = new StringBuilder();
        for (char c : input.toCharArray()) {
            boolean matched = false;
            for (int i = 0; i < gujaratiDigits.length; i++) {
                if (c == gujaratiDigits[i]) {
                    sb.append(i);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
