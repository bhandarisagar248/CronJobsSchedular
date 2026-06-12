package com.chronos.DTO;

import com.chronos.Entity.Job;
import com.chronos.Enum.ExecutionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JobHistoryDTO {

    private Long id;
    private Job job;
    private String jobName;
    private ExecutionStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long durationMs;
    private LocalDateTime executedAt;
    private String errorMessage;
}