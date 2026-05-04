package com.chronos.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDto {

    private String name;
    private String cronExpression;
    private String status;
    private String payload;
    private Integer maxRetries;
}
