package com.chronos.Utils;

import org.springframework.scheduling.support.CronExpression;

import java.time.LocalDateTime;

public class CronUtils {

    public static LocalDateTime nextExecution(String cron) {
        CronExpression expression = CronExpression.parse(cron);
        return expression.next(LocalDateTime.now());
    }
    public static String normalizeCron(String cron) {
        String[] parts = cron.trim().split("\\s+");

        if (parts.length != 6) {
            throw new IllegalArgumentException("Invalid Quartz cron expression");
        }

        // Force Quartz rule: day-of-week must be ?
        parts[5] = "?";

        return String.join(" ", parts);
    }
}
