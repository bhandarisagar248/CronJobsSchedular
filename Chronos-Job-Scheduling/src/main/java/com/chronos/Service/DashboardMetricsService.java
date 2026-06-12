package com.chronos.Service;

import com.chronos.DTO.DashboardMetricsDTO;
import com.chronos.DTO.JobHistoryDTO;
import com.chronos.Entity.JobExecutionHistory;
import com.chronos.Enum.ExecutionStatus;
import com.chronos.Enum.HealthStatus;
import com.chronos.Enum.JobStatus;
import com.chronos.Repository.JobExecutionHistoryRepository;
import com.chronos.Repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

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
                    jobRepository.countByUser_EmailAndStatus(
                            email,
                            JobStatus.PAUSED
                    );


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

            LocalDate today = LocalDate.now();

            long executionsToday =
                    executionRepository
                            .countByJob_User_EmailAndExecutedAtBetween(
                                    email,
                                    today.atStartOfDay(),
                                    today.plusDays(1).atStartOfDay()
                            );

            double successRate =
                    success + failed == 0
                            ? 0
                            : ((double) success
                            / (success + failed))
                            * 100;
            double failureRate =
                    success + failed == 0
                            ? 0
                            : ((double) failed / (success + failed)) * 100;

            double activeJobsPercentage =
                    totalJobs == 0
                            ? 0
                            : ((double) activeJobs / totalJobs) * 100;

            double executionReliability =
                    success + failed == 0
                            ? 100
                            : ((double) success / (success + failed)) * 100;


            double healthScore =
                    (successRate * 0.7)
                            + (activeJobsPercentage * 0.2)
                            + (executionReliability * 0.1);

            HealthStatus healthStatus;

            if (healthScore >= 90) {
                healthStatus = HealthStatus.EXCELLENT;
            } else if (healthScore >= 70) {
                healthStatus = HealthStatus.GOOD;
            } else if (healthScore >= 50) {
                healthStatus = HealthStatus.WARNING;
            } else {
                healthStatus = HealthStatus.CRITICAL;
            }

            return DashboardMetricsDTO.builder()
                    .totalJobs(totalJobs)
                    .activeJobs(activeJobs)
                    .pausedJobs(pausedJobs)
                    .successfulExecutions(success)
                    .failedExecutions(failed)
                    .successRate(successRate)
                    .failureRate(failureRate)
                    .executionsToday(executionsToday)
                    .healthScore(healthScore)
                    .healthStatus(healthStatus)
                    .build();
        }


    public List<JobHistoryDTO> getJobHistory() {

        String email = getCurrentUserEmail();

        return executionRepository
                .findTop20ByJob_User_EmailOrderByExecutedAtDesc(email)
                .stream()
                .map(history -> JobHistoryDTO.builder()
                        .id(history.getId())
                        .jobName(history.getJobName())
                        .status(history.getStatus())
                        .startTime(history.getStartTime())
                        .endTime(history.getEndTime())
                        .executedAt(history.getExecutedAt())
                        .durationMs(history.getDurationMs())
                        .build())
                .toList();
    }
    }
