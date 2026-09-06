//package com.jobportal.backend.service;
//
//import com.jobportal.backend.dto.ApplyJobRequest;
//import com.jobportal.backend.entity.Application;
//import com.jobportal.backend.repository.ApplicationRepository;
//import com.jobportal.backend.repository.UserRepository;
//import org.springframework.stereotype.Service;
//import com.jobportal.backend.dto.ApplicantResponse;
//import java.time.LocalDateTime;
//import java.util.*;
//import com.jobportal.backend.entity.User;
//import com.jobportal.backend.entity.Job;
//import com.jobportal.backend.repository.JobRepository;
//
//@Service
//public class ApplicationService {
//
//    private final ApplicationRepository applicationRepository;
//    private final UserRepository userRepository;
//    private final ResumeMatchService resumeMatchService;
//
//    private final JobRepository jobRepository;
//
//
////
////    public ApplicationService(
////            ApplicationRepository applicationRepository,
////            UserRepository userRepository) {
////
////        this.applicationRepository = applicationRepository;
////        this.userRepository = userRepository;
////    }
//
//
//    public ApplicationService(
//            ApplicationRepository applicationRepository,
//            UserRepository userRepository,
//            JobRepository jobRepository,
//            ResumeMatchService resumeMatchService
//    )
//    {
//        this.applicationRepository =
//                applicationRepository;
//
//        this.userRepository =
//                userRepository;
//
//        this.jobRepository =
//                jobRepository;
//
//        this.resumeMatchService =
//                resumeMatchService;
//    }
//
//
//
//    public List<ApplicantResponse> getApplicantDetails(Long jobId) {
//
//        List<Application> applications =
//                applicationRepository.findByJobId(jobId);
//
//        List<ApplicantResponse> response =
//                new ArrayList<>();
//
//        for (Application app : applications) {
//
//            User user =
//                    userRepository.findById(
//                                    app.getUserId())
//                            .orElse(null);
//
//            if (user != null) {
//
//                response.add(
//                        new ApplicantResponse(
//                                user.getId(),
//                                user.getName(),
//                                user.getEmail(),
//                                app.getStatus()
//                        )
//                );
//            }
//        }
//
//        return response;
//    }
//
//
//
//
//
//
//
//
//    public Application applyJob(
//            ApplyJobRequest request) {
//
//        Application application =
//                new Application();
//
//        if(applicationRepository
//                .existsByUserIdAndJobId(
//                        request.getUserId(),
//                        request.getJobId())) {
//
//            throw new RuntimeException(
//                    "Already Applied");
//        }
//
//        application.setUserId(
//                request.getUserId());
//
//        application.setJobId(
//                request.getJobId());
//
//        application.setStatus(
//                "APPLIED");
//
//        application.setAppliedAt(
//                LocalDateTime.now());
//
//
//        User user =
//                userRepository.findById(
//                        request.getUserId()
//                ).get();
//
//
//        Job job =
//                jobRepository.findById(
//                        request.getJobId()
//                ).get();
//
//
//        int score =
//                resumeMatchService.calculateScore(
//                        user.getResumeText(),
//                        job.getSkills()
//                );
//
//
//        application.setMatchScore(score);
//
//
//        return applicationRepository.save(
//                application);
//
//
//
//
//
//    }
//
//    public List<Application> getAllApplications() {
//
//        return applicationRepository.findAll();
//    }
//
//    public List<Application> getApplicationsByJobId(Long jobId) {
//        return applicationRepository.findByJobId(jobId);
//    }
//}











package com.jobportal.backend.service;

import com.jobportal.backend.dto.ApplyJobRequest;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.jobportal.backend.dto.ApplicantResponse;
import java.time.LocalDateTime;
import java.util.*;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.JobRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ResumeMatchService resumeMatchService;
    private final JobRepository jobRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            UserRepository userRepository,
            JobRepository jobRepository,
            ResumeMatchService resumeMatchService
    ) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.resumeMatchService = resumeMatchService;
    }

    // 1. Updated getApplicantDetails with new ApplicantResponse fields
    public List<ApplicantResponse> getApplicantDetails(Long jobId) {
        List<Application> applications = applicationRepository.findByJobId(jobId);
        List<ApplicantResponse> response = new ArrayList<>();

        for (Application app : applications) {
            User user = userRepository.findById(app.getUserId()).orElse(null);

            if (user != null) {
                response.add(
                        new ApplicantResponse(
                                app.getId(),          // Application ID Added
                                user.getId(),          // User ID Added
                                user.getName(),
                                user.getEmail(),
                                app.getStatus(),
                                app.getMatchScore()   // Match Score Added
                        )
                );
            }
        }
        return response;
    }

    public Application applyJob(ApplyJobRequest request) {
        Application application = new Application();

        if (applicationRepository.existsByUserIdAndJobId(request.getUserId(), request.getJobId())) {
            throw new RuntimeException("Already Applied");
        }

        application.setUserId(request.getUserId());
        application.setJobId(request.getJobId());
        application.setStatus("APPLIED");
        application.setAppliedAt(LocalDateTime.now());

        User user = userRepository.findById(request.getUserId()).get();
        Job job = jobRepository.findById(request.getJobId()).get();
        System.out.println("DEBUG - Resume Text: " + user.getResumeText()); // 👈 இத போடுங்க
        System.out.println("DEBUG - Job Skills: " + job.getSkills());
        int score = resumeMatchService.calculateScore(
                user.getResumeText(),
                job.getSkills()
        );

        application.setMatchScore(score);

        return applicationRepository.save(application);
    }

    // 2. Updated getAllApplications to return List<ApplicantResponse> instead of List<Application>
    public List<ApplicantResponse> getAllApplications() {
        List<Application> applications = applicationRepository.findAll();
        List<ApplicantResponse> response = new ArrayList<>();

        for (Application app : applications) {
            User user = userRepository.findById(app.getUserId()).orElse(null);

            if (user != null) {
                response.add(
                        new ApplicantResponse(
                                app.getId(),          // Application ID Added
                                user.getId(),          // User ID Added
                                user.getName(),
                                user.getEmail(),
                                app.getStatus(),
                                app.getMatchScore()   // Match Score Added
                        )
                );
            }
        }
        return response;
    }

    public List<Application> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
}