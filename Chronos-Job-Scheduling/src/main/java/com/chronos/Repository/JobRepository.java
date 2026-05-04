package com.chronos.Repository;

import com.chronos.Entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByStatusAndNextRunTimeBefore(String status, LocalDateTime time);
    List<Job> findByEmail(String email);
    List<Job> findByStatus(String status);
}
