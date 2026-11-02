package com.jobportal.backend.repository;

import com.jobportal.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByJobIdOrderByMatchScoreDesc(Long jobId);
    List<Application> findByUserId(Long userId);
    List<Application> findByUserIdOrderByAppliedAtDesc(Long userId);
    long countByJobId(Long jobId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
