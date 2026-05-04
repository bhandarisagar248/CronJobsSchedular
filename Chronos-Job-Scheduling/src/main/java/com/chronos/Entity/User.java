package com.chronos.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String firstName;

    @Column(nullable = false)
    public String lastName;

    @Column(nullable = false,unique = true)
    public String email;

    @Column(nullable = false)
    public String password;

    @Column(unique = true)
    private String phoneNumber;

    // Store the profile image as a byte array
    @Column(name = "profile_image", columnDefinition = "BYTEA")
    @Basic(fetch = FetchType.LAZY)
    private byte[] profileImage;

    private String profileImageUrl;

    private boolean isVerified;

    private String otp;

    private String phoneOtp;

    private LocalDateTime PhoneOtpExpiry;

    private LocalDateTime otpExpiry;

    // Define the ManyToMany relationship
    @ManyToMany(fetch = FetchType.EAGER) // EAGER ensures roles are loaded with user details
    @JoinTable(
            name = "user_roles", // This is the join table
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
}
