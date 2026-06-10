package com.chronos.Controller;

import com.chronos.DTO.DashboardMetricsDTO;
import com.chronos.DTO.JobDto;
import com.chronos.Entity.Job;
import com.chronos.Enum.ExecutionStatus;
import com.chronos.Enum.JobStatus;
import com.chronos.Repository.JobExecutionHistoryRepository;
import com.chronos.Repository.JobRepository;
import com.chronos.Service.DashboardMetricsService;
import com.chronos.Service.JobService;
import lombok.RequiredArgsConstructor;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job")
@RequiredArgsConstructor
public class JobController {


    @Autowired
    private final JobService jobService;

    @Autowired
    private final DashboardMetricsService dashboardMetricsService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Job>> getJobs() {
        return ResponseEntity.ok(jobService.getUserJobs());
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<Job> updateJob(
            @PathVariable Long id,
            @RequestBody JobDto dto
    ) {
        Job updatedJob = jobService.updateJob(id, dto);
        return ResponseEntity.ok(updatedJob);
    }

    @DeleteMapping("/delete/{id}")
//    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        try {
            jobService.deleteJob(id);
            return ResponseEntity.ok().body("Job deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Internal server error");
        }
    }


    //implementation of grafana to get Metrices

    @GetMapping("/dashboard/metrics")
    public ResponseEntity<?> getMetrics() {
        try{

            DashboardMetricsDTO metrices= dashboardMetricsService.getMetrics();
            return ResponseEntity.ok(metrices);
        }catch (Exception e){
            System.out.println("The error is"+e);
            return ResponseEntity.status(500).body("Internal server error");
        }

    }
}
