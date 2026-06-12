package com.chronos.DTO;

import com.chronos.Enum.HealthStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardMetricsDTO {

    private long totalJobs;

    private long activeJobs;

    private long pausedJobs;

    private long successfulExecutions;

    private long failedExecutions;

    private double successRate;

    private double failureRate;

    private long executionsToday;

    private double healthScore;

    private HealthStatus healthStatus;
}
