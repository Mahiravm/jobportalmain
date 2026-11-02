package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ApplicantResponse;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.service.ApplicationService;
import com.jobportal.backend.service.JobService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin(origins = "http://localhost:5173")
public class RecruiterController {

    private final JobService jobService;
    private final ApplicationService applicationService;

    public RecruiterController(JobService jobService, ApplicationService applicationService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobResponse>> getRecruiterJobs(@RequestParam(required = false) Long recruiterId) {
        if (recruiterId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(jobService.getJobsByRecruiter(recruiterId));
    }

    @GetMapping("/jobs/{jobId}/applicants")
    public ResponseEntity<?> getJobApplicants(
            @PathVariable Long jobId,
            @RequestParam(required = false) Long recruiterId) {
        try {
            List<ApplicantResponse> applicants = applicationService.getApplicantDetailsForRecruiter(jobId, recruiterId);
            return ResponseEntity.ok(applicants);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().startsWith("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
