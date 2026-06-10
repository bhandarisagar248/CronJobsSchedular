package com.chronos.Entity;

import com.chronos.Enum.JobStatus;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "jobs")

public class Job implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(
            mappedBy = "job",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<JobExecution> jobExecutions;



    private String email;

    private String name;

    private String cronExpression;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private LocalDateTime nextRunTime;

    private Integer retryCount = 0;

    private Integer maxRetries = 3;

    private String payload;

    private LocalDateTime createdAt = LocalDateTime.now();

}
