//package com.jobportal.backend.controller;
//
//import com.jobportal.backend.dto.ApplyJobRequest;
//import com.jobportal.backend.entity.Application;
//import com.jobportal.backend.service.ApplicationService;
//import com.jobportal.backend.dto.ApplicantResponse;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/applications")
//@CrossOrigin(origins = "http://localhost:5173")
//public class ApplicationController {
//
//    private final ApplicationService applicationService;
//
//    public ApplicationController(
//            ApplicationService applicationService) {
//
//        this.applicationService =
//                applicationService;
//    }
//
//    @PostMapping
//    public Application applyJob(
//            @RequestBody ApplyJobRequest request) {
//
//        return applicationService.applyJob(
//                request);
//    }
//
//    @GetMapping
//    public List<Application> getAllApplications() {
//
//        return applicationService
//                .getAllApplications();
//    }
////
////    @GetMapping("/job/{jobId}")
////    public List<Application> getByJob(@PathVariable Long jobId) {
////        return applicationService.getApplicationsByJobId(jobId);
////    }
//@GetMapping("/job/{jobId}")
//public List<ApplicantResponse> getByJob(
//        @PathVariable Long jobId) {
//
//    return applicationService
//            .getApplicantDetails(jobId);
//}
//
//
//}


package com.jobportal.backend.controller;

import com.jobportal.backend.dto.ApplyJobRequest;
import com.jobportal.backend.entity.Application;
import com.jobportal.backend.service.ApplicationService;
import com.jobportal.backend.dto.ApplicantResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "http://localhost:5173")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public Application applyJob(@RequestBody ApplyJobRequest request) {
        return applicationService.applyJob(request);
    }

    // 🛠️ இந்த இடத்துல தான் மாத்தியிருக்கேன்: List<Application>க்கு பதிலா List<ApplicantResponse>
    @GetMapping
    public List<ApplicantResponse> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/job/{jobId}")
    public List<ApplicantResponse> getByJob(@PathVariable Long jobId) {
        return applicationService.getApplicantDetails(jobId);
    }
}


