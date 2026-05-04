package com.chronos.Repository;

import com.chronos.Entity.Job;
import com.chronos.Entity.JobExecution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobExecutionRepository extends JpaRepository<JobExecution,Long> {
    List<JobExecution> findByJob(Job job);
}
