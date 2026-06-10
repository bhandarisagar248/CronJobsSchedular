package com.chronos.Service;

import com.chronos.Components.JobMetrics;
import com.chronos.DTO.JobDto;
import com.chronos.Entity.Job;
import com.chronos.Enum.JobStatus;
import com.chronos.Repository.JobRepository;
import com.chronos.Utils.CronUtils;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.scheduling.support.CronExpression;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final JobMetrics jobMetrics;

    public JobService(JobRepository jobRepository, JobMetrics jobMetrics) {
        this.jobRepository = jobRepository;
        this.jobMetrics = jobMetrics;
    }


    @Transactional
    public Job createJob(Job job) {

        Timer.Sample sample = jobMetrics.startTimer();
try {
    String userEmail = SecurityContextHolder.getContext()
            .getAuthentication()
            .getName();
    String normailzedCronExpression = CronUtils.normalizeCron(job.getCronExpression());

    job.setEmail(userEmail);
    job.setStatus(JobStatus.ACTIVE);
    job.setNextRunTime(CronUtils.nextExecution(normailzedCronExpression));

    Job saved = jobRepository.save(job);

    jobMetrics.incrementJobsCreated();

    return saved;
}catch (Exception e){
    log.error("Failed to create job for user [{}]: {}", e.getMessage(), e);
    jobMetrics.recordFailure();
    throw e;
} finally {
    jobMetrics.stopTimer(sample);
}
    }


    @Transactional
    public Job updateJob(Long jobId, Job updatedJob) {

        Timer.Sample sample = jobMetrics.startTimer();

        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();

            Job job = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            if (!job.getEmail().equals(email)) {
                throw new RuntimeException("Unauthorized");
            }

            // update fields
            return jobRepository.save(job);
    } catch (Exception e) {
        jobMetrics.recordFailure();
        log.error("Failed to update job id=[{}]: {}", jobId, e.getMessage(), e);
        throw e;
    } finally {
        jobMetrics.stopTimer(sample);
    }
    }

    @Transactional(readOnly = true)
    public List<Job> getUserJobs() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return jobRepository.findByEmail(email);
    }


    @Transactional
    public Job updateJob(Long id, JobDto dto) {

        Timer.Sample sample = jobMetrics.startTimer();

        try {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        // ✅ Update only if values exist (safe update)
        if (dto.getName() != null) {
            job.setName(dto.getName());
        }

        if (dto.getCronExpression() != null) {
            // ✅ validate cron before saving
            CronExpression.parse(dto.getCronExpression());
            job.setCronExpression(dto.getCronExpression());
        }

        if (dto.getStatus() != null) {
            job.setStatus(JobStatus.valueOf(dto.getStatus()));
        }

        if (dto.getPayload() != null) {
            job.setPayload(dto.getPayload());
        }

        if (dto.getMaxRetries() != null) {
            job.setMaxRetries(dto.getMaxRetries());
        }

        // ✅ Optional: recalculate next execution
        job.setNextRunTime(
                CronUtils.nextExecution(job.getCronExpression())
        );

        return jobRepository.save(job);
        } catch (Exception e) {
            jobMetrics.recordFailure();
            log.error("Failed to update job id=[{}]: {}", id, e.getMessage(), e);
            throw e;
        } finally {
            jobMetrics.stopTimer(sample);
        }
    }


    @Transactional
    public void deleteJob(Long id) {
        Timer.Sample sample = jobMetrics.startTimer();
        try{
        if (!jobRepository.existsById(id)) {
            throw new RuntimeException("Job with id " + id + " not found");
        }

        jobRepository.deleteById(id);
        // Optional: add audit log here
        System.out.println("Job deleted: " + id);
        } catch (Exception e) {
            jobMetrics.recordFailure();
            log.error("Failed to delete job id=[{}]: {}", id, e.getMessage(), e);
            throw e;
        } finally {
            jobMetrics.stopTimer(sample);
        }
    }


    @Transactional(readOnly = true)
    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job with id not found"));
    }

}