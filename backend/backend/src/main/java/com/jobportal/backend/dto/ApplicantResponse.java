//package com.jobportal.backend.dto;
//
//public class ApplicantResponse {
//    private Long userId;
//    private String name;
//    private String email;
//    private String status;
//
//    public ApplicantResponse(
//            Long userId,
//            String name,
//            String email,
//            String status) {
//        this.userId=userId;
//        this.name = name;
//        this.email = email;
//        this.status = status;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//    public Long getUserId() {
//        return userId;
//    }
//}




package com.jobportal.backend.dto;
import com.jobportal.backend.dto.ApplicantResponse;
public class ApplicantResponse {
    private Long id; // Application ID
    private Long userId;
    private String name;
    private String email;
    private String status;
    private Integer matchScore; // For AI Score

    // Full Constructor Update பண்ணியாச்சு
    public ApplicantResponse(Long id, Long userId, String name, String email, String status, Integer matchScore) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.status = status;
        this.matchScore = matchScore;
    }

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getStatus() { return status; }
    public Integer getMatchScore() { return matchScore; }
}