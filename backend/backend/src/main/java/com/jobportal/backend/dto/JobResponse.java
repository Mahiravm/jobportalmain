package com.jobportal.backend.dto;

import java.time.LocalDateTime;

public class JobResponse {
    private Long id;
    private String title;
    private String company;
    private String location;
    private Double salary;
    private String description;
    private String skills;
    private Long recruiterId;
    private LocalDateTime postedDate;
    private long applicantCount;

    public JobResponse() {}

    public JobResponse(Long id, String title, String company, String location, Double salary,
                       String description, String skills, Long recruiterId,
                       LocalDateTime postedDate, long applicantCount) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.location = location;
        this.salary = salary;
        this.description = description;
        this.skills = skills;
        this.recruiterId = recruiterId;
        this.postedDate = postedDate;
        this.applicantCount = applicantCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public LocalDateTime getPostedDate() { return postedDate; }
    public void setPostedDate(LocalDateTime postedDate) { this.postedDate = postedDate; }

    public long getApplicantCount() { return applicantCount; }
    public void setApplicantCount(long applicantCount) { this.applicantCount = applicantCount; }
}
