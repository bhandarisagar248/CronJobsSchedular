package com.chronos.Service;

import com.chronos.Entity.Job;
import org.springframework.stereotype.Service;

@Service
public class JobExecutionService {

    public void execute(Job job) {
        try {
            System.out.println("Executing job: " + job.getName());

            // simulate actual task
            Thread.sleep(2000);

            System.out.println("Job completed: " + job.getName());

        } catch (Exception e) {
            System.out.println("Job failed: " + e.getMessage());
        }
    }
}
