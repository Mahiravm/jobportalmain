package com.jobportal.backend.dto;

public class ApplyJobRequest {

    private Long userId;
    private Long jobId;

    public Long getUserId() {
        return userId;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }
}