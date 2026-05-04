package com.chronos.Components;
//import io.micrometer.core.instrument.*;
//import lombok.Data;
//import org.springframework.stereotype.Component;
//
//import java.util.concurrent.atomic.AtomicInteger;
//
//@Component
//@Data
//public class JobMetrics {
//
//    private final Counter jobCreatedCounter;
//    private final Counter jobFailureCounter;
//    private final Timer jobExecutionTimer;
//    private final Gauge activeJobsGauge;
//
//    private int activeJobs=0 ;
//
//    public JobMetrics(MeterRegistry registry) {
//
//        this.jobCreatedCounter = Counter.builder("jobs_created_total")
//                .description("Total jobs created")
//                .register(registry);
//
//        this.jobFailureCounter = Counter.builder("jobs_failed_total")
//                .description("Total failed jobs")
//                .register(registry);
//
//        this.jobExecutionTimer = Timer.builder("job_execution_time")
//                .description("Job execution time")
//                .register(registry);
//
//        this.activeJobsGauge = Gauge.builder("active_jobs", this, JobMetrics::getActiveJobs)
//                .description("Current active jobs")
//                .register(registry);
//    }
//
//    public void incrementJobsCreated() {
//        jobCreatedCounter.increment();
//        activeJobs++;
//    }
//
//    public void decrementActiveJobs() {
//        activeJobs--;
//    }
//
//    public void recordFailure() {
//        jobFailureCounter.increment();
//    }
//
//    public Timer.Sample startTimer() {
//        return Timer.start();
//    }
//
//    public void stopTimer(Timer.Sample sample) {
//        sample.stop(jobExecutionTimer);
//    }
//
//}

import io.micrometer.core.instrument.*;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.concurrent.atomic.AtomicInteger;

@Component
@Getter  // FIX: @Getter only — NOT @Data.
// @Data generates setters on all fields. This conflicts with the Gauge's
// weak reference: if Spring proxies the bean or any code calls a generated
// setter, the Gauge can silently detach and stop reporting.
public class JobMetrics {

    // Stored so startTimer() can use the registry-aware clock
    private final MeterRegistry registry;

    private final Counter jobCreatedCounter;
    private final Counter jobFailureCounter;
    private final Counter jobRetryCounter;
    private final Timer   jobExecutionTimer;
    private final Gauge   activeJobsGauge;

    // FIX 1: AtomicInteger instead of plain int
    // -----------------------------------------
    // Plain `int activeJobs` is NOT thread-safe. Cron jobs can start and finish
    // concurrently. `activeJobs++` is a read-modify-write that is NOT atomic on
    // the JVM — two threads can both read the same stale value, both increment,
    // and both write back, losing one update. AtomicInteger uses CPU-level
    // compare-and-swap (CAS) to guarantee correctness with no external locking.
    private final AtomicInteger activeJobs = new AtomicInteger(0);

    public JobMetrics(MeterRegistry registry) {
        this.registry = registry;

        this.jobCreatedCounter = Counter.builder("jobs_created_total")
                .description("Total jobs created")
                .register(registry);

        this.jobFailureCounter = Counter.builder("jobs_failed_total")
                .description("Total failed jobs")
                .register(registry);

        this.jobRetryCounter=Counter.builder("jobs_retry_total")
                .description("Total job retry")
                .register(registry);

        this.jobExecutionTimer = Timer.builder("job_execution_time")
                .description("Job execution time")
                .publishPercentileHistogram()   // 🔥 REQUIRED
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry);

        this.activeJobsGauge = Gauge.builder("active_jobs", activeJobs, AtomicInteger::get)
                .description("Current active jobs")
                .register(registry);
    }

    /**
     * Call when a new cron job is created / starts executing.
     */
    public void incrementJobsCreated() {
        jobCreatedCounter.increment();
        activeJobs.incrementAndGet(); // atomic — safe under concurrent job starts
    }

    /**
     * Call when a job finishes (success or failure).
     */
    public void decrementActiveJobs() {
        activeJobs.decrementAndGet(); // atomic — prevents negative counts under concurrency
    }

    /**
     * Call when a job fails.
     */
    public void recordFailure() {
        jobFailureCounter.increment();
    }

    public Timer.Sample startTimer() {
        return Timer.start(registry);
    }

    /**
     * Call at the end of a job to record elapsed time.
     */
    public void stopTimer(Timer.Sample sample) {
        sample.stop(jobExecutionTimer);
    }
}