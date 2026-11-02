package com.jobportal.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.backend.dto.AiMatchResult;
import com.jobportal.backend.entity.Job;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.*;

@Service
public class GroqAiService {

    @Value("${groq.api.key:}")
    private String apiKey;

    @Value("${groq.api.url:https://api.groq.com/openai/v1/chat/completions}")
    private String apiUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(15))
            .build();

    public AiMatchResult matchResumeWithJob(String resumeText, Job job) {
        if (resumeText == null || resumeText.trim().isEmpty()) {
            return new AiMatchResult(
                    0,
                    "None",
                    job.getSkills() != null ? job.getSkills() : "None",
                    "No resume text provided or resume could not be parsed.",
                    "Resume text was empty. Please re-upload a valid resume document.",
                    "Please upload a comprehensive resume detailing your skills and work experience."
            );
        }

        // Check if API key is present
        String effectiveApiKey = getApiKey();
        if (effectiveApiKey == null || effectiveApiKey.trim().isEmpty()) {
            System.err.println("WARN: GROQ_API_KEY is not configured. Using fallback local matching.");
            return createFallbackResult(resumeText, job, "Groq API key not configured. Evaluated with fallback parser.");
        }

        try {
            String systemPrompt = "You are an expert Technical Recruiter and ATS (Applicant Tracking System) AI evaluator. "
                    + "Analyze the candidate's resume against the target job posting thoroughly and objectively. "
                    + "Evaluate technical skills, programming languages, frameworks, work experience relevance, education, projects, and missing skills. "
                    + "You MUST reply ONLY with a valid, single JSON object containing exact keys: "
                    + "{\"matchScore\": <integer 0-100>, "
                    + "\"matchingSkills\": \"<comma-separated list of candidate skills that match job requirements>\", "
                    + "\"missingSkills\": \"<comma-separated list of required job skills missing in resume>\", "
                    + "\"experienceAnalysis\": \"<concise assessment of relevant work & project experience>\", "
                    + "\"explanation\": \"<detailed breakdown and rationale for the awarded score>\", "
                    + "\"improvementSuggestions\": \"<actionable advice to improve resume/profile for this job>\"}. "
                    + "Do not include markdown code fences (like ```json), do not include any preamble or postscript.";

            String userPrompt = "JOB DETAILS:\n"
                    + "Title: " + (job.getTitle() != null ? job.getTitle() : "N/A") + "\n"
                    + "Company: " + (job.getCompany() != null ? job.getCompany() : "N/A") + "\n"
                    + "Required Skills: " + (job.getSkills() != null ? job.getSkills() : "N/A") + "\n"
                    + "Job Description: " + (job.getDescription() != null ? job.getDescription() : "N/A") + "\n\n"
                    + "CANDIDATE RESUME TEXT:\n"
                    + (resumeText.length() > 6000 ? resumeText.substring(0, 6000) : resumeText);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("temperature", 0.2);
            requestBody.put("response_format", Map.of("type", "json_object"));

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user", "content", userPrompt));
            requestBody.put("messages", messages);

            String requestJson = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + effectiveApiKey.trim())
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && !choices.isEmpty()) {
                    String content = choices.get(0).path("message").path("content").asText();
                    return parseAiContent(content, resumeText, job);
                }
            } else {
                System.err.println("Groq API returned HTTP error: " + response.statusCode() + " - " + response.body());
            }
        } catch (Exception e) {
            System.err.println("Exception calling Groq API: " + e.getMessage());
        }

        // Graceful fallback so the applicant's application is never lost
        return createFallbackResult(resumeText, job, "AI service temporarily unavailable. Evaluated with keyword matching.");
    }

    private String getApiKey() {
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            return apiKey;
        }
        return System.getenv("GROQ_API_KEY");
    }

    private AiMatchResult parseAiContent(String content, String resumeText, Job job) {
        try {
            // Clean up possible markdown fences
            String cleaned = content.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            }
            if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            JsonNode node = objectMapper.readTree(cleaned);
            int score = node.path("matchScore").asInt(50);
            if (score < 0) score = 0;
            if (score > 100) score = 100;

            String matchingSkills = extractStringOrArray(node.get("matchingSkills"));
            String missingSkills = extractStringOrArray(node.get("missingSkills"));
            String experienceAnalysis = node.path("experienceAnalysis").asText("");
            String explanation = node.path("explanation").asText("");
            String suggestions = node.path("improvementSuggestions").asText("");

            return new AiMatchResult(
                    score,
                    matchingSkills.isEmpty() ? "None identified" : matchingSkills,
                    missingSkills.isEmpty() ? "None identified" : missingSkills,
                    experienceAnalysis,
                    explanation,
                    suggestions
            );
        } catch (Exception e) {
            System.err.println("Error parsing Groq AI JSON response: " + e.getMessage() + "\nRaw: " + content);
            return createFallbackResult(resumeText, job, "Groq AI response parsed with fallback.");
        }
    }

    private String extractStringOrArray(JsonNode node) {
        if (node == null || node.isNull()) {
            return "";
        }
        if (node.isArray()) {
            List<String> list = new ArrayList<>();
            for (JsonNode item : node) {
                list.add(item.asText());
            }
            return String.join(", ", list);
        }
        return node.asText("");
    }

    private AiMatchResult createFallbackResult(String resumeText, Job job, String note) {
        String skillsStr = job.getSkills() != null ? job.getSkills() : "";
        String[] requiredSkills = skillsStr.split("[,\\n;]+");

        String lowerResume = resumeText.toLowerCase();
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        int validCount = 0;
        for (String s : requiredSkills) {
            String trimmed = s.trim();
            if (!trimmed.isEmpty()) {
                validCount++;
                if (lowerResume.contains(trimmed.toLowerCase())) {
                    matched.add(trimmed);
                } else {
                    missing.add(trimmed);
                }
            }
        }

        int score = validCount > 0 ? (int) Math.round(((double) matched.size() / validCount) * 100) : 60;
        if (score > 100) score = 100;

        return new AiMatchResult(
                score,
                matched.isEmpty() ? "None detected" : String.join(", ", matched),
                missing.isEmpty() ? "None" : String.join(", ", missing),
                "Candidate resume contains " + matched.size() + " of " + validCount + " recognized key requirements.",
                note + " Evaluated " + matched.size() + "/" + validCount + " matching skills.",
                missing.isEmpty() ? "Strong alignment with posted skills."
                        : "Consider gaining or highlighting experience in: " + String.join(", ", missing)
        );
    }
}
