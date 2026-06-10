package com.chronos.Service;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final MeterRegistry registry;

    private Counter successCounter;
    private Counter failureCounter;

    @PostConstruct
    public void init() {

        successCounter =
                Counter.builder("chronojobs_success_total")
                        .description("Successful executions")
                        .register(registry);

        failureCounter =
                Counter.builder("chronojobs_failed_total")
                        .description("Failed executions")
                        .register(registry);
    }

    public void success() {
        successCounter.increment();
    }

    public void failure() {
        failureCounter.increment();
    }
}
