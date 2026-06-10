package com.chronos.Repository;

import com.chronos.Entity.JobExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobExecutionRepository extends JpaRepository<JobExecution, Long> {

//    // count SUCCESS executions for a user
//    long countByJob_User_EmailAndStatus(String email, String status);
//
//    // count FAILED executions for a user
//    long countByJob_User_EmailAndStatus(String email, String status);

    // all executions for dashboard
    List<JobExecution> findByJob_User_Email(String email);
}