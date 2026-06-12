package com.chronos.Entity;
import ch.qos.logback.classic.spi.Configurator;
import com.chronos.Enum.ExecutionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "job_execution_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobExecutionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    private String jobName;

    @Enumerated(EnumType.STRING)
    private ExecutionStatus status;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Long durationMs;

    private LocalDateTime executedAt;

    @Column(length = 5000)
    private String errorMessage;

}
