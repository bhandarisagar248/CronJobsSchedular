package com.chronos.Service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import jakarta.annotation.PostConstruct;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
@Data
public class MetricsService {
    private final Counter jobsCreatedCounter;
    private final Counter jobsSucceededCounter;
    private final Counter jobsFailedCounter;
    private final Counter jobsDeletedCounter;

    private final Timer apiExecutionTimer;

    private final AtomicInteger activeJobsGauge;
    private final AtomicInteger pausedJobsGauge;
    private final AtomicInteger totalJobsGauge;

    public MetricsService(MeterRegistry registry) {

        jobsCreatedCounter = Counter.builder("chronos.jobs.created")
                .description("Total jobs created")
                .register(registry);

        jobsSucceededCounter = Counter.builder("chronos.jobs.success")
                .description("Successful job executions")
                .register(registry);

        jobsFailedCounter = Counter.builder("chronos.jobs.failed")
                .description("Failed job executions")
                .register(registry);

        jobsDeletedCounter = Counter.builder("chronos.jobs.deleted")
                .description("Deleted jobs")
                .register(registry);

        apiExecutionTimer = Timer.builder("chronos.api.execution")
                .description("Job service execution time")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry);

        totalJobsGauge = registry.gauge(
                "chronos.jobs.total",
                new AtomicInteger(0)
        );

        activeJobsGauge = registry.gauge(
                "chronos.jobs.active",
                new AtomicInteger(0)
        );

        pausedJobsGauge = registry.gauge(
                "chronos.jobs.paused",
                new AtomicInteger(0)
        );
    }

    public void incrementCreated() {
        jobsCreatedCounter.increment();
    }

    public void incrementSuccess() {
        jobsSucceededCounter.increment();
    }

    public void incrementFailure() {
        jobsFailedCounter.increment();
    }

    public void incrementDeleted() {
        jobsDeletedCounter.increment();
    }

    public Timer.Sample startTimer() {
        return Timer.start();
    }

    public void stopTimer(Timer.Sample sample) {
        sample.stop(apiExecutionTimer);
    }

    public void updateDashboardMetrics(
            long total,
            long active,
            long paused
    ) {
        totalJobsGauge.set((int) total);
        activeJobsGauge.set((int) active);
        pausedJobsGauge.set((int) paused);
    }
}
