package com.chronos.Service;

import com.chronos.Configuration.SecurityConfig;
import com.chronos.Entity.Job;
import com.chronos.Entity.JobExecution;
import com.chronos.Repository.JobExecutionRepository;
import com.chronos.Repository.JobRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.MeterRegistry;

import java.time.LocalDateTime;

@Service
public class WorkerService {

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private JobExecutionRepository jobExecutionRepository;

    @Autowired
    private MetricsService metricsService;

    @Autowired
    private MeterRegistry meterRegistry;

    @Autowired
    private KafkaTemplate<String, Job> kafkaTemplate;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private EmailService emailService;

    private static final int MAX_RETRIES = 3;

    // Kafka listener to consume jobs from the queue
    @KafkaListener(topics = "job-topic", groupId = "worker-group")
    public void consumeJob(@Payload Job job) {
        System.out.println("Consuming job: " + job.getName());

        // Create JobExecution entry in the DB
        JobExecution jobExecution = new JobExecution();
        jobExecution.setJob(job);
        jobExecution.setStartTime(LocalDateTime.now());

        Timer.Sample sample = Timer.start(meterRegistry);


        try {
//            emailService.sendReminder(job.getEmail(), job.getName());
//            sendReminderEmail(job);
            // Execute the job
            executeJob(job);
            metricsService.success();
            jobExecution.setStatus("SUCCESS");
            meterRegistry.counter(
                    "chronojobs_job_success_total",
                    "jobName",
                    job.getName()
            ).increment();
            // ✅ RESET retry count after success
            job.setRetryCount(0);
            jobExecution.setErrorMessage(null);

        } catch (Exception e) {
            // Retry logic and job failure handling
            metricsService.failure();
            meterRegistry.counter(
                    "chronojobs_job_failure_total",
                    "jobName",
                    job.getName()
            ).increment();
            handleJobFailure(job, jobExecution, e.getMessage());
        } finally {
            jobExecution.setEndTime(LocalDateTime.now());
            sample.stop(
                    Timer.builder("chronojobs_execution_duration")
                            .description("Job execution duration")
                            .register(meterRegistry)
            );
            jobExecutionRepository.save(jobExecution);
        }
    }

    // Actual job execution logic (for example, sending an email)
    private void executeJob(Job job) throws MessagingException {

        meterRegistry.counter(
                "chronojobs_job_execution_total",
                "jobName",
                job.getName()
        ).increment();

        // Simulate job execution (send an email)
        if (job.getName().trim().equalsIgnoreCase("SendReminderEmail")) {
            sendReminderEmail(job);
        }
    }

    // Simulate sending a reminder email (you can customize the email body, subject, etc.)
    private void sendReminderEmail(Job job) throws MessagingException {

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

//        String userEmail = SecurityContextHolder.getContext()
//                .getAuthentication()
//                .getName();
        String userEmail = job.getEmail();

        String htmlContent = """
        <html>
        <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;">
        
        <div style="max-width:600px;margin:40px auto;background:#111827;border-radius:12px;
                    overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.5);">

            <!-- Header -->
            <div style="background:linear-gradient(90deg,#06b6d4,#3b82f6);padding:20px;text-align:center;">
                <h1 style="margin:0;color:white;">🚀 Job Executed Successfully</h1>
            </div>

            <!-- Body -->
            <div style="padding:30px;">
                <p style="font-size:16px;">Hello,</p>

                <p style="font-size:15px;color:#cbd5f5;">
                    Your scheduled job has been executed successfully.
                </p>

                <div style="background:#1e293b;padding:20px;border-radius:10px;margin-top:20px;">
                    <p><strong>Job Name:</strong> %s</p>
                    <p><strong>Status:</strong> <span style="color:#22c55e;">SUCCESS</span></p>
                    <p><strong>Executed At:</strong> %s</p>
                    <p><strong>Retries:</strong> %d / %d</p>
                </div>

                <p style="margin-top:20px;color:#94a3b8;">
                    Everything is running smoothly. No action is required.
                </p>
            </div>

            <!-- Footer -->
            <div style="background:#020617;padding:15px;text-align:center;font-size:12px;color:#64748b;">
                Chronos Scheduler • Reliable Job Execution System
            </div>
        </div>

        </body>
        </html>
        """.formatted(
                job.getName(),
                java.time.LocalDateTime.now(),
                job.getRetryCount(),
                job.getMaxRetries()
        );

        helper.setTo(userEmail);
        helper.setSubject("✅ Job Success: " + job.getName());
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
    // Handle job failure, retry the job, and increase retry count
    private void handleJobFailure(Job job, JobExecution jobExecution, String errorMessage) {
        int retryCount = job.getRetryCount();

        if (retryCount < MAX_RETRIES) {
            // Increase retry count and try again
            job.setRetryCount(retryCount + 1);
            jobRepository.save(job);

            System.out.println("Retrying job: " + job.getName() + " | Attempt: " + (retryCount + 1));

            // Add back to Kafka for retry (simple retry logic)
            kafkaTemplate.send("job-topic", job); // ✅ correct retry
        } else {
            meterRegistry.counter(
                    "chronojobs_dead_letter_total"
            ).increment();
            jobExecution.setStatus("FAILED");
            jobExecution.setErrorMessage("Failed after " + MAX_RETRIES + " attempts: " + errorMessage);
            // 💀 Send to Dead Letter Queue
            kafkaTemplate.send("job-failed", job);
            System.out.println("Job failed after maximum retries: " + job.getName());
        }
    }
}