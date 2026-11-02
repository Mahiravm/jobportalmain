package com.jobportal.backend.service;

import com.jobportal.backend.dto.ApplicantResponse;
import com.jobportal.backend.dto.ApplyJobRequest;
import com.jobportal.backend.dto.CandidateApplicationResponse;
import com.jobportal.backend.dto.AiMatchResult;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final GroqAiService groqAiService;
    private final ResumeParserService resumeParserService;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            GroqAiService groqAiService,
            ResumeParserService resumeParserService
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.groqAiService = groqAiService;
        this.resumeParserService = resumeParserService;
    }

    // Apply job with existing user resume
    public Application applyJob(ApplyJobRequest request) {
        if (applicationRepository.existsByUserIdAndJobId(request.getUserId(), request.getJobId())) {
            throw new RuntimeException("You have already applied for this job opening.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Applicant user not found."));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found."));

        String resumeText = user.getResumeText();
        String resumePath = user.getResumePath();

        // If resumeText was not cached on user, try reading it from resumePath
        if ((resumeText == null || resumeText.trim().isEmpty()) && resumePath != null) {
            resumeText = resumeParserService.extractTextFromPath(resumePath);
            if (resumeText != null && !resumeText.trim().isEmpty()) {
                user.setResumeText(resumeText);
                userRepository.save(user);
            }
        }

        // Call Groq AI service for comprehensive matching
        AiMatchResult aiResult = groqAiService.matchResumeWithJob(resumeText, job);

        Application application = new Application();
        application.setUserId(user.getId());
        application.setJobId(job.getId());
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());
        application.setResumePath(resumePath);
        application.setMatchScore(aiResult.getMatchScore());
        application.setMatchingSkills(aiResult.getMatchingSkills());
        application.setMissingSkills(aiResult.getMissingSkills());
        application.setAiExplanation(aiResult.getFullFormattedExplanation());

        return applicationRepository.save(application);
    }

    // Apply job with optional newly uploaded resume file
    public Application applyJobWithFile(Long jobId, Long userId, MultipartFile file) {
        if (applicationRepository.existsByUserIdAndJobId(userId, jobId)) {
            throw new RuntimeException("You have already applied for this job opening.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Applicant user not found."));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        String resumeText = null;
        String resumePath = null;

        if (file != null && !file.isEmpty()) {
            try {
                resumePath = resumeParserService.saveFile(file);
                resumeText = resumeParserService.extractText(file);
                // Update user profile resume as well
                user.setResumePath(resumePath);
                user.setResumeText(resumeText);
                userRepository.save(user);
            } catch (Exception e) {
                System.err.println("Error saving new resume: " + e.getMessage());
            }
        } else {
            resumeText = user.getResumeText();
            resumePath = user.getResumePath();
            if ((resumeText == null || resumeText.trim().isEmpty()) && resumePath != null) {
                resumeText = resumeParserService.extractTextFromPath(resumePath);
            }
        }

        AiMatchResult aiResult = groqAiService.matchResumeWithJob(resumeText, job);

        Application application = new Application();
        application.setUserId(user.getId());
        application.setJobId(job.getId());
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());
        application.setResumePath(resumePath);
        application.setMatchScore(aiResult.getMatchScore());
        application.setMatchingSkills(aiResult.getMatchingSkills());
        application.setMissingSkills(aiResult.getMissingSkills());
        application.setAiExplanation(aiResult.getFullFormattedExplanation());

        return applicationRepository.save(application);
    }

    // Retrieve applicants for a job, sorted by AI matchScore DESC
    public List<ApplicantResponse> getApplicantDetails(Long jobId) {
        List<Application> applications = applicationRepository.findByJobIdOrderByMatchScoreDesc(jobId);
        List<ApplicantResponse> response = new ArrayList<>();

        for (Application app : applications) {
            User user = userRepository.findById(app.getUserId()).orElse(null);
            if (user != null) {
                String resumePath = app.getResumePath() != null ? app.getResumePath() : user.getResumePath();
                response.add(new ApplicantResponse(
                        app.getId(),
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        app.getStatus(),
                        app.getMatchScore(),
                        app.getMatchingSkills(),
                        app.getMissingSkills(),
                        app.getAiExplanation(),
                        app.getAppliedAt(),
                        resumePath
                ));
            }
        }
        return response;
    }

    // Retrieve applicants with recruiter authorization check
    public List<ApplicantResponse> getApplicantDetailsForRecruiter(Long jobId, Long recruiterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found."));

        if (recruiterId != null && job.getRecruiterId() != null && !job.getRecruiterId().equals(recruiterId)) {
            throw new RuntimeException("Unauthorized: You do not have permission to view applicants for this job opening.");
        }

        return getApplicantDetails(jobId);
    }

    // Retrieve all applications for a specific candidate (for Candidate Dashboard)
    public List<CandidateApplicationResponse> getApplicationsByUserId(Long userId) {
        List<Application> applications = applicationRepository.findByUserIdOrderByAppliedAtDesc(userId);
        List<CandidateApplicationResponse> responses = new ArrayList<>();

        for (Application app : applications) {
            Job job = jobRepository.findById(app.getJobId()).orElse(null);
            responses.add(new CandidateApplicationResponse(
                    app.getId(),
                    app.getJobId(),
                    job != null ? job.getTitle() : "Job #" + app.getJobId(),
                    job != null ? job.getCompany() : "N/A",
                    job != null ? job.getLocation() : "N/A",
                    job != null ? job.getSalary() : null,
                    app.getAppliedAt(),
                    app.getStatus(),
                    app.getMatchScore(),
                    app.getMatchingSkills(),
                    app.getMissingSkills(),
                    app.getAiExplanation(),
                    app.getResumePath()
            ));
        }
        return responses;
    }

    public List<ApplicantResponse> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();
        List<ApplicantResponse> response = new ArrayList<>();

        for (Application app : applications) {
            User user = userRepository.findById(app.getUserId()).orElse(null);
            if (user != null) {
                response.add(new ApplicantResponse(
                        app.getId(),
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        app.getStatus(),
                        app.getMatchScore(),
                        app.getMatchingSkills(),
                        app.getMissingSkills(),
                        app.getAiExplanation(),
                        app.getAppliedAt(),
                        app.getResumePath()
                ));
            }
        }
        return response;
    }

    public Application getApplicationById(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found."));
    }
}
