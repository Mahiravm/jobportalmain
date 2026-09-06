package com.jobportal.backend.repository;
import com.jobportal.backend.repository.ApplicationRepository;
import java.util.*;
import com.jobportal.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    boolean existsByUserIdAndJobId(
            Long userId,
            Long jobId
    );
}