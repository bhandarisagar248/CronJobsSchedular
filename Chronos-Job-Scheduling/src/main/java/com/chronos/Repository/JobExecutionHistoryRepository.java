package com.chronos.Repository;

import com.chronos.Entity.JobExecutionHistory;
import com.chronos.Enum.ExecutionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobExecutionHistoryRepository extends JpaRepository<JobExecutionHistory, Long> {

    long countByStatus(ExecutionStatus status);
    long countByJob_User_EmailAndStatus(
            String email,
            ExecutionStatus status
    );
    List<JobExecutionHistory>
    findTop20ByOrderByStartTimeDesc();
}
