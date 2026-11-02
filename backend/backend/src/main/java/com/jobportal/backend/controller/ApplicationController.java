package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ApplicantResponse;
import com.jobportal.backend.dto.ApplyJobRequest;
import com.jobportal.backend.dto.CandidateApplicationResponse;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.service.ApplicationService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Existing apply endpoint with JSON body
    @PostMapping
    public ResponseEntity<?> applyJob(@RequestBody ApplyJobRequest request) {
        try {
            Application application = applicationService.applyJob(request);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Direct apply endpoint with optional resume file
    @PostMapping(value = "/{jobId}/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> applyJobWithFile(
            @PathVariable Long jobId,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Application application = applicationService.applyJobWithFile(jobId, userId, file);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Existing get by job endpoint (now sorted by AI score DESC)
    @GetMapping("/job/{jobId}")
    public List<ApplicantResponse> getByJob(@PathVariable Long jobId) {
        return applicationService.getApplicantDetails(jobId);
    }

    // Candidate view: retrieve all applications submitted by candidate
    @GetMapping("/my-applications")
    public List<CandidateApplicationResponse> getMyApplications(@RequestParam Long userId) {
        return applicationService.getApplicationsByUserId(userId);
    }

    // Candidate view alternate path
    @GetMapping("/user/{userId}")
    public List<CandidateApplicationResponse> getApplicationsByUser(@PathVariable Long userId) {
        return applicationService.getApplicationsByUserId(userId);
    }

    // Get specific AI analysis result for an application
    @GetMapping("/{applicationId}/ai-result")
    public ResponseEntity<?> getAiResult(@PathVariable Long applicationId) {
        try {
            Application app = applicationService.getApplicationById(applicationId);
            Map<String, Object> result = new HashMap<>();
            result.put("applicationId", app.getId());
            result.put("jobId", app.getJobId());
            result.put("userId", app.getUserId());
            result.put("matchScore", app.getMatchScore());
            result.put("matchingSkills", app.getMatchingSkills());
            result.put("missingSkills", app.getMissingSkills());
            result.put("aiExplanation", app.getAiExplanation());
            result.put("status", app.getStatus());
            result.put("appliedAt", app.getAppliedAt());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Download/view resume associated with a specific application
    @GetMapping("/{applicationId}/resume")
    public ResponseEntity<byte[]> viewApplicationResume(@PathVariable Long applicationId) {
        try {
            Application app = applicationService.getApplicationById(applicationId);
            String resumePath = app.getResumePath();
            if (resumePath == null || resumePath.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Path path = Paths.get(resumePath);
            if (!Files.exists(path)) {
                return ResponseEntity.notFound().build();
            }

            byte[] fileBytes = Files.readAllBytes(path);
            String filename = path.getFileName().toString();
            String contentType = filename.toLowerCase().endsWith(".pdf")
                    ? "application/pdf"
                    : "application/octet-stream";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(fileBytes);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Existing get all applications
    @GetMapping
    public List<ApplicantResponse> getAllApplications() {
        return applicationService.getAllApplications();
    }
}
