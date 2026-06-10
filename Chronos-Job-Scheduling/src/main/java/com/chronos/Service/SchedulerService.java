package com.chronos.Service;

import com.chronos.Entity.Job;
import com.chronos.Enum.JobStatus;
import com.chronos.Repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.quartz.CronExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulerService {

    @Autowired
    private final JobRepository jobRepository;
    @Autowired
    private final KafkaTemplate<String, Job> kafkaTemplate;

    @Autowired
    private final RedisLockService lockService;


    // Scheduled method to check jobs and push them to Kafka every minute
//    @Scheduled(cron = "0 * * * * ?") // Every minute
    @Scheduled(fixedRate = 10000)
    public void scanAndPublishJobs() {
        List<Job> jobs = jobRepository
                .findByStatusAndNextRunTimeBefore(JobStatus.ACTIVE, LocalDateTime.now());


        for (Job job : jobs) {

            if (isJobDue(job)) {

                String lockKey = "job-lock:" + job.getId();

                // 🔒 prevent duplicate execution
                if (!lockService.acquireLock(lockKey, 10)) {
                    continue;
                }
                try {
                    System.out.println("Job is due for execution: " + job.getName());

                    kafkaTemplate.send("job-topic", job);
                    updateJobNextRunTime(job);
                    jobRepository.save(job);
                }
                finally {
                    lockService.releaseLock(lockKey);
                }
            }
        }
    }


    // Check if the job is due based on cron expression and next run time
    private boolean isJobDue(Job job) {
        try {
            // Validate the cron expression
            if (!CronExpression.isValidExpression(job.getCronExpression())) {
                System.out.println("Invalid Cron Expression: " + job.getCronExpression());
                return false;
            }

            return true;
        } catch (Exception e) {
            System.out.println("Error parsing cron expression: " + e.getMessage());
            return false;
        }
    }

    // Update the job's next run time after execution
    private void updateJobNextRunTime(Job job) {
        try {
            CronExpression cronExpression = new CronExpression(job.getCronExpression());
            java.util.Date next = cronExpression.getNextValidTimeAfter(new java.util.Date());

            job.setNextRunTime(
                    next.toInstant()
                            .atZone(java.time.ZoneId.systemDefault())
                            .toLocalDateTime()
            );
        } catch (Exception e) {
            System.out.println("Error updating job's next run time: " + e.getMessage());
        }
    }
}