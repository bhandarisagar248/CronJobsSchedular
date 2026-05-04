package com.chronos.Components;

import com.chronos.Entity.Job;
import com.chronos.Service.JobExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobConsumer {

    private final JobExecutionService executionService;

    @KafkaListener(topics = "job-topic", groupId = "workers")
    public void consume(Job job) {
        executionService.execute(job);
    }
}
