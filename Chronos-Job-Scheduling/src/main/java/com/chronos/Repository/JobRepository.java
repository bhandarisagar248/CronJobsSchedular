package com.chronos.Repository;

import com.chronos.Entity.Job;
import com.chronos.Enum.ExecutionStatus;
import com.chronos.Enum.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface JobRepository extends JpaRepository<Job,Long> {
    List<Job> findByStatusAndNextRunTimeBefore(JobStatus status, LocalDateTime time);
    List<Job> findByEmail(String email);
    long countByStatus(JobStatus status);
    long countByUser_Email(String email);

    long countByUser_EmailAndStatus(String email, JobStatus status);

    List<Job> findByUser_EmailAndStatusAndNextRunTimeBefore(
            String email,
            JobStatus status,
            LocalDateTime time
    );

}
