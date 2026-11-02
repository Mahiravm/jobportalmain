package com.jobportal.backend.service;

import com.jobportal.backend.dto.CreateJobRequest;
import com.jobportal.backend.dto.JobResponse;
import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public Job createJob(CreateJobRequest request) {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setSalary(request.getSalary());
        job.setDescription(request.getDescription());
        job.setSkills(request.getSkills());
        job.setRecruiterId(request.getRecruiterId());
        job.setPostedDate(LocalDateTime.now());
        return jobRepository.save(job);
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<JobResponse> getJobsByRecruiter(Long recruiterId) {
        List<Job> jobs = jobRepository.findByRecruiterIdOrderByPostedDateDesc(recruiterId);
        List<JobResponse> responses = new ArrayList<>();
        for (Job job : jobs) {
            long count = applicationRepository.countByJobId(job.getId());
            responses.add(new JobResponse(
                    job.getId(),
                    job.getTitle(),
                    job.getCompany(),
                    job.getLocation(),
                    job.getSalary(),
                    job.getDescription(),
                    job.getSkills(),
                    job.getRecruiterId(),
                    job.getPostedDate(),
                    count
            ));
        }
        return responses;
    }

    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId).orElse(null);
    }
}
