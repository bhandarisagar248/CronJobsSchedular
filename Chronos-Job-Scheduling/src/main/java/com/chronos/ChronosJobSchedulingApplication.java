package com.chronos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;


@EnableRetry
@EnableAsync
@EnableScheduling
@SpringBootApplication
public class ChronosJobSchedulingApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChronosJobSchedulingApplication.class, args);
	}

}
