package com.chronos.Controller;


import com.chronos.DTO.PasswordChangeDTO;
import com.chronos.DTO.TokenVerifyDTO;
import com.chronos.DTO.UserDTO;
import com.chronos.DTO.UserProfileDTO;
import com.chronos.Entity.User;
import com.chronos.Service.ProfileService;
import com.chronos.Utils.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/user")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PutMapping("/update")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileDTO userProfile){

        log.info("UserUpadateProfile={}", userProfile);
        User updatedUser=profileService.updateUserProfile(userProfile);

        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unable to update profile.");
    }
    @PutMapping("/email")
    public ResponseEntity<?> UpdateUserEmail(@RequestBody UserDTO dto){

        log.info("ID={} ,Email={}", dto.getId(),dto.getEmail());

        try {
            User updatedUser = profileService.updateEmail(dto.getId(), dto.getEmail());
            // 🔐 Generate token immediately after signup
            String token = jwtUtil.generateToken(dto.getEmail());

            if (updatedUser != null) {
                return ResponseEntity.ok(
                        Map.of(
                        "token", token,
                        "user", updatedUser
                ));
            }
        } catch (Exception e) {

            throw new RuntimeException(e);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unable to update profile.");
    }

    // Endpoint to upload profile image
    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("userId") Long userId, @RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = profileService.uploadProfileImage(userId, file);
            if(imageUrl!=null){
            return ResponseEntity.ok(imageUrl);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image:");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload image: " + e.getMessage());
        }
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> ChangePassword(@RequestBody PasswordChangeDTO dto){
            User user = profileService.getUserProfile(dto.getId(), dto.getEmail());

        if(!encoder.matches(dto.getCurrentPassword(),user.getPassword())){

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        };
        boolean updatedUser=profileService.changePassword(dto.getId(), dto.getNewPassword());

        if (updatedUser) {
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unable to Change password.");
    }

    // Endpoint to retrieve profile image as byte[] (this would return the raw image data)
    @GetMapping("/profile-image")
    public ResponseEntity<?> getProfileImage(@RequestParam("userId") Long userId) {
        try {
            byte[] image = profileService.getProfileImage(userId);
            if(image!=null){
            return ResponseEntity.ok().contentType(org.springframework.http.MediaType.IMAGE_JPEG).body(image);
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile image not found.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile image not found.");
        }
    }

}
