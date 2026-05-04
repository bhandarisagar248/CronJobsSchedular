package com.chronos.Controller;


import com.chronos.DTO.*;
import com.chronos.Entity.Job;
import com.chronos.Entity.User;
import com.chronos.Repository.JobRepository;
import com.chronos.Service.AuthService;
import com.chronos.Service.EmailService;
import com.chronos.Utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JobRepository jobRepository;


    @PostMapping("/signup")
    public ResponseEntity<?> RegisterUser(@RequestBody AuthRequestDTO payload) {

        log.info("Signup request email={}", payload.getEmail());

        try {
            User user = authService.Register(payload);
            UserDTO userDTO = mapper.map(user, UserDTO.class);
            // 🔐 Generate token immediately after signup
            String token = jwtUtil.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userDTO
            ));

        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", "User already exists",
                            "status", 400
                    ));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequestDTO payload) {

        log.info("Login attempt for email={}", payload.getEmail());

        try {
            User user = authService.login(payload.getEmail(), payload.getPassword());
            UserDTO userDTO = mapper.map(user, UserDTO.class);

            // 🔐 Generate token from DB user (trusted)
            String token = jwtUtil.generateToken(user.getEmail());

            // ✅ Send both token + user
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userDTO
            ));

        } catch (Exception e) {
            log.info("User not found " + e.getMessage());
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            User user = authService.googleLogin(request.getToken());
            UserDTO userDTO=mapper.map(user,UserDTO.class);
            String token = jwtUtil.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "user", userDTO
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Google login failed");
        }
    }

//    @PostMapping("/google")
//    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
//        try {
//            User user = authService.googleLogin(request.getToken());
//            return ResponseEntity.ok(user);
//        } catch (Exception e) {
//            e.printStackTrace(); // 👈 ADD THIS
//            return ResponseEntity.badRequest().body(e.getMessage());
////            return ResponseEntity.badRequest().body("Google login failed");
//        }
//    }

@PostMapping("/verify-otp")
public ResponseEntity<?> verifyOtp(@RequestBody TokenVerifyDTO dto) {
    log.info("Email={}, OTP={}", dto.getEmail(), dto.getOtp());

    try {
        User user = authService.verifyOtp(dto.getEmail(), dto.getOtp().trim());
        UserDTO userDTO = mapper.map(user, UserDTO.class);
        // 🔐 Generate token from DB user (trusted)
        String token = jwtUtil.generateToken(user.getEmail());

        if (user.isVerified()) {
            //if user is verified then update email of the job too
            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "user", userDTO
                    ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired OTP");
        }
    } catch (Exception e) {
        log.error("Error verifying OTP for email {}: {}", dto.getEmail(), e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Server error while verifying OTP");
    }
}
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String,String> req) {
        log.info("Email={}",req.get("email"));
        authService.sendOtp(req.get("email"));
        return ResponseEntity.ok("OTP sent");
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDTO req) {

        authService.resetPassword(
                req.getEmail(),
                req.getOtp(),
                req.getPassword()
        );
        return ResponseEntity.ok("Password reset successful");
    }


}
