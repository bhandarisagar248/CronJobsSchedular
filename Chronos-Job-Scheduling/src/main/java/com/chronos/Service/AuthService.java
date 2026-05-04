package com.chronos.Service;


import com.chronos.DTO.AppConstant;
import com.chronos.DTO.AuthRequestDTO;
import com.chronos.DTO.UserDTO;
import com.chronos.Entity.Role;
import com.chronos.Entity.User;
import com.chronos.Repository.RoleRepo;
import com.chronos.Repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.springframework.context.support.AbstractApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final EmailService emailService;
    private final RoleRepo roleRepo;

    public AuthService(UserRepository repository, PasswordEncoder encoder, EmailService emailService, RoleRepo roleRepo) {
        this.repository = repository;
        this.encoder = encoder;
        this.emailService = emailService;
        this.roleRepo = roleRepo;
    }

    public User Register(AuthRequestDTO dto){
        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user=new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());

        Role role = this.roleRepo.findById(AppConstant.NORMAL_USER).get();
        user.getRoles().add(role);

        user.setPassword(encoder.encode(dto.getPassword()));

        //otp Genration and Sending
        String otp = emailService.generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        user.setVerified(false);

        repository.save(user);


        // 📩 Send OTP

        emailService.sendOtpEmail(user.getEmail(), otp);


        return user;
    }

    public User login(String email, String password) {

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("User not verified");
        }

        if (!encoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return user;
    }

    public User googleLogin(String token) throws Exception {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(),
                new JacksonFactory()
        )
                .setAudience(Collections.singletonList("461612916595-olhggu0coriradspcet40abuducb98og.apps.googleusercontent.com"))
                .build();

        GoogleIdToken idToken = verifier.verify(token);

        if (idToken == null) {
            throw new Exception("Invalid Google token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // 🔹 Check if user exists
        // Handle Optional properly
        User user = repository.findByEmail(email)
                .orElseGet(() -> {
                    String[] names = name.split(" ");

                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(names.length > 0 ? names[0] : "");
                    newUser.setLastName(names.length > 1 ? names[1] : "");
                    newUser.setVerified(true);
                    newUser.setOtp(null);
                    newUser.setOtpExpiry(null);
                    newUser.setPassword("");

                    return repository.save(newUser);
                });

        return user;
    }

    public User verifyOtp(String email, String otp) {

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (otp == null) {
            throw new RuntimeException("No OTP found");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        return repository.save(user);
    }

    public void sendOtp(String email) {
        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = emailService.generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        repository.save(user);

        // TODO: send email (JavaMailSender)
        emailService.sendOtpEmail(email, otp);
        System.out.println("OTP: " + otp);
    }

    public void resetPassword(String email, String otp, String newPassword) {

        User user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setPassword(encoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setVerified(true);
        repository.save(user);
    }
}
