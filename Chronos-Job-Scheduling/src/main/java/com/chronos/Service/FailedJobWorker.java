package com.chronos.Service;

import com.chronos.Entity.Job;
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

@Service
public class FailedJobWorker {

    @Autowired
    private JobRepository jobRepository;
    @Autowired
    private JobExecutionRepository jobExecutionRepository;

    @Autowired
    private KafkaTemplate<String, Job> kafkaTemplate;

    @Autowired
    private JavaMailSender mailSender;


    @KafkaListener(topics = "job-failed", groupId = "dlq-group")
    public void handleFailedJobs(@Payload Job job) throws MessagingException {

        System.out.println("💀 FAILED JOB: " + job.getName());

        // store in DB / alert / manual retry
        sendJobFailedEmail(job);
    }

    private void sendJobFailedEmail(Job job) throws MessagingException {

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
            <div style="background:linear-gradient(90deg,#ef4444,#dc2626);padding:20px;text-align:center;">
                <h1 style="margin:0;color:white;">❌ Job Execution Failed</h1>
            </div>

            <!-- Body -->
            <div style="padding:30px;">
                <p style="font-size:16px;">Hello,</p>

                <p style="font-size:15px;color:#cbd5f5;">
                    Unfortunately, your scheduled job execution has failed.
                </p>

                <div style="background:#1e293b;padding:20px;border-radius:10px;margin-top:20px;">
                    <p><strong>Job Name:</strong> %s</p>
                    <p><strong>Status:</strong> <span style="color:#ef4444;">FAILED</span></p>
                    <p><strong>Time:</strong> %s</p>
                    <p><strong>Retries Used:</strong> %d / %d</p>
                </div>

                <div style="margin-top:20px;padding:15px;background:#7f1d1d;border-radius:8px;color:#fecaca;">
                    Please review your job configuration or logs and retry if necessary.
                </div>

                <p style="margin-top:20px;color:#94a3b8;">
                    If this issue persists, consider checking your cron expression or service dependencies.
                </p>
            </div>

            <!-- Footer -->
            <div style="background:#020617;padding:15px;text-align:center;font-size:12px;color:#64748b;">
                Chronos Scheduler • Monitoring & Alerting System
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
        helper.setSubject("❌ Job Failed: " + job.getName());
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }

}
