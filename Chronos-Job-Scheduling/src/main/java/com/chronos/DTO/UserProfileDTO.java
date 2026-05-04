package com.chronos.DTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
        private Long id;
        public String firstName;
        public String lastName;
        private String email;
        private String currentPassword;
        private String password;
        private String phoneNumber;
        private String profileImageUrl;

        // Getters and Setters
    }
