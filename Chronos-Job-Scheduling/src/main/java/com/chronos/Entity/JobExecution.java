package com.chronos.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_execution")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobExecution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id")
    @JsonBackReference
    private Job job;

    private String status; // SUCCESS, FAILED
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String errorMessage;

    // Getters and Setters
}