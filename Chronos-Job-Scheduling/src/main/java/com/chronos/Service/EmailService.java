package com.chronos.Service;


import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromEmail;

    // 🔐 Secure OTP
    public String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    // 🚀 Async + Retry + Logging
    @Async
    @Retryable(
            value = { MailException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public CompletableFuture<Boolean> sendOtpEmail(String to, String otp) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🔐 Verify Your Account - OTP");

            String htmlContent = buildOtpTemplate(otp);

            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("✅ OTP email sent successfully to {}", to);
            return CompletableFuture.completedFuture(true); // Indicate success asynchronously

        } catch (Exception e) {
            log.error("❌ Failed to send OTP email to {}: {}", to, e.getMessage());
            return CompletableFuture.completedFuture(false); // Indicate failure asynchronously
//            throw new MailSendException("Email sending failed", e);
        }

    }
  // 🚀 Async + Retry + Logging
    @Async
    @Retryable(
            value = { MailException.class },
            maxAttempts = 3,
            backoff = @Backoff(delay = 2000)
    )
    public CompletableFuture<Boolean> sendReminder(String to, String payload) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("🔐 REMAINDER -JOB SCHEDULAR ");

            helper.setText("This is a reminder email for the job: " + payload);

            mailSender.send(message);

            log.info("✅ Remadiner sent successfully to {}", to);
            return CompletableFuture.completedFuture(true); // Indicate success asynchronously

        } catch (Exception e) {
            log.error("❌ Failed to send remainder email to {}: {}", to, e.getMessage());
            return CompletableFuture.completedFuture(false); // Indicate failure asynchronously
//            throw new MailSendException("Email sending failed", e);
        }

    }

    // 💥 Retry fallback
    @Recover
    public void recover(MailException ex, String to, String otp) {
        log.error("🚨 FINAL FAILURE: Could not send email to {} after retries", to);
    }

    // 🎨 HTML Template
    private String buildOtpTemplate(String otp) {
        return """
            <html>
            <body style="font-family: Arial; background-color:#f4f4f4; padding:20px;">
                <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px;">
                    <h2 style="color:#333;">Verify Your Account</h2>
                    <p>Your OTP code is:</p>
                    <h1 style="color:#2e6cff; letter-spacing:5px;">%s</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                    <br/>
                    <p>If you didn’t request this, please ignore.</p>
                    <hr/>
                    <small>© Chronos  App</small>
                </div>
            </body>
            </html>
            """.formatted(otp);
    }
}
