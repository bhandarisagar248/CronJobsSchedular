package com.chronos.Components;

import com.chronos.Enum.JobStatus;
import com.chronos.Repository.JobRepository;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SchedulerMetrics {

    private final JobRepository jobRepository;

    @Autowired
    public SchedulerMetrics(
            MeterRegistry registry,
            JobRepository repository, JobRepository jobRepository
    ) {
        this.jobRepository = jobRepository;

        Gauge.builder(
                "chronojobs_active_jobs",
                repository,
                r -> r.countByStatus(JobStatus.ACTIVE)
        ).register(registry);

        Gauge.builder(
                "chronojobs_paused_jobs",
                repository,
                r -> r.countByStatus(JobStatus.PAUSED)
        ).register(registry);

        Gauge.builder(
                "chronojobs_total_jobs",
                repository,
                JobRepository::count
        ).register(registry);
    }
}
