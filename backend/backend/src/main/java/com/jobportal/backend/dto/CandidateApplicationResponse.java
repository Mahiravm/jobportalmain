package com.jobportal.backend.dto;

import java.time.LocalDateTime;

public class CandidateApplicationResponse {
    private Long applicationId;
    private Long jobId;
    private String jobTitle;
    private String company;
    private String location;
    private Double salary;
    private LocalDateTime appliedAt;
    private String status;
    private Integer matchScore;
    private String matchingSkills;
    private String missingSkills;
    private String aiExplanation;
    private String resumePath;

    public CandidateApplicationResponse() {}

    public CandidateApplicationResponse(Long applicationId, Long jobId, String jobTitle, String company,
                                        String location, Double salary, LocalDateTime appliedAt,
                                        String status, Integer matchScore, String matchingSkills,
                                        String missingSkills, String aiExplanation, String resumePath) {
        this.applicationId = applicationId;
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.location = location;
        this.salary = salary;
        this.appliedAt = appliedAt;
        this.status = status;
        this.matchScore = matchScore;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.aiExplanation = aiExplanation;
        this.resumePath = resumePath;
    }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

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

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }
}
