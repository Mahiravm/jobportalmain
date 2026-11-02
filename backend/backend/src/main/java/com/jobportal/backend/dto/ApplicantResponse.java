package com.jobportal.backend.dto;

import java.time.LocalDateTime;

public class ApplicantResponse {
    private Long id; // Application ID
    private Long userId;
    private String name;
    private String email;
    private String status;
    private Integer matchScore;
    private String matchingSkills;
    private String missingSkills;
    private String aiExplanation;
    private LocalDateTime appliedAt;
    private String resumePath;

    public ApplicantResponse() {}

    public ApplicantResponse(Long id, Long userId, String name, String email, String status, Integer matchScore) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.status = status;
        this.matchScore = matchScore;
    }

    public ApplicantResponse(Long id, Long userId, String name, String email, String status, Integer matchScore,
                             String matchingSkills, String missingSkills, String aiExplanation,
                             LocalDateTime appliedAt, String resumePath) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.status = status;
        this.matchScore = matchScore;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.aiExplanation = aiExplanation;
        this.appliedAt = appliedAt;
        this.resumePath = resumePath;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public String getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(String matchingSkills) { this.matchingSkills = matchingSkills; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getAiExplanation() { return aiExplanation; }
    public void setAiExplanation(String aiExplanation) { this.aiExplanation = aiExplanation; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }
}
