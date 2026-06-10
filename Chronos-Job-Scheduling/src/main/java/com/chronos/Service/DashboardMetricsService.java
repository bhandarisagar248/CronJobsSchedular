package com.chronos.Service;

import com.chronos.DTO.DashboardMetricsDTO;
import com.chronos.Enum.ExecutionStatus;
import com.chronos.Enum.JobStatus;
import com.chronos.Repository.JobExecutionHistoryRepository;
import com.chronos.Repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardMetricsService {


    @Autowired
        private final JobRepository jobRepository;
    @Autowired
        private final JobExecutionHistoryRepository executionRepository;

    private String getCurrentUserEmail() {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            return null; // or throw custom exception
        }

        return auth.getName();
    }

        public DashboardMetricsDTO getMetrics() {

        String email=getCurrentUserEmail();
            long totalJobs =
                    jobRepository.countByUser_Email(email);

            long activeJobs =
                    jobRepository.countByUser_EmailAndStatus(
                            email,
                            JobStatus.ACTIVE
                    );

            long pausedJobs =
                    jobRepository.countByStatus(JobStatus.PAUSED);


            long success =
                    executionRepository
                            .countByJob_User_EmailAndStatus(
                                    email,
                                    ExecutionStatus.SUCCESS
                            );

            long failed =
                    executionRepository
                            .countByJob_User_EmailAndStatus(
                                    email,
                                    ExecutionStatus.FAILED
                            );
            double successRate =
                    success + failed == 0
                            ? 0
                            : ((double) success
                            / (success + failed))
                            * 100;

            return DashboardMetricsDTO.builder()
                    .totalJobs(totalJobs)
                    .activeJobs(activeJobs)
                    .pausedJobs(pausedJobs)
                    .successfulExecutions(success)
                    .failedExecutions(failed)
                    .successRate(successRate)
                    .build();
        }
    }
