package com.jobportal.backend.dto;

public class AiMatchResult {
    private Integer matchScore;
    private String matchingSkills;
    private String missingSkills;
    private String experienceAnalysis;
    private String explanation;
    private String improvementSuggestions;

    public AiMatchResult() {}

    public AiMatchResult(Integer matchScore, String matchingSkills, String missingSkills,
                         String experienceAnalysis, String explanation, String improvementSuggestions) {
        this.matchScore = matchScore;
        this.matchingSkills = matchingSkills;
        this.missingSkills = missingSkills;
        this.experienceAnalysis = experienceAnalysis;
        this.explanation = explanation;
        this.improvementSuggestions = improvementSuggestions;
    }

    public Integer getMatchScore() { return matchScore; }
    public void setMatchScore(Integer matchScore) { this.matchScore = matchScore; }

    public String getMatchingSkills() { return matchingSkills; }
    public void setMatchingSkills(String matchingSkills) { this.matchingSkills = matchingSkills; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getExperienceAnalysis() { return experienceAnalysis; }
    public void setExperienceAnalysis(String experienceAnalysis) { this.experienceAnalysis = experienceAnalysis; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }

    public String getFullFormattedExplanation() {
        StringBuilder sb = new StringBuilder();
        if (explanation != null && !explanation.isEmpty()) {
            sb.append(explanation).append("\n\n");
        }
        if (experienceAnalysis != null && !experienceAnalysis.isEmpty()) {
            sb.append("Experience Analysis: ").append(experienceAnalysis).append("\n\n");
        }
        if (improvementSuggestions != null && !improvementSuggestions.isEmpty()) {
            sb.append("Suggestions for Improvement: ").append(improvementSuggestions);
        }
        return sb.toString().trim();
    }
}
