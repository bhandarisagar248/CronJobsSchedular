package com.chronos.Service;


import com.chronos.DTO.UserProfileDTO;
import com.chronos.Entity.Job;
import com.chronos.Entity.User;
import com.chronos.Repository.JobRepository;
import com.chronos.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private OTPService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JobRepository jobRepository;

    // Get User Profile
    public User getUserProfile(Long userId,String email) {

        try {
            return userRepository.findByEmailAndId(email, userId);
        }catch (Exception e){
            throw  new RuntimeException("Unable to find user With email and id");
        }
    }
public boolean changePassword(Long id,String password){
        try{
    User user=userRepository.findById(id).orElseThrow();
    if(user.isVerified()){
        if(password!=null){
            user.setPassword(encoder.encode(password));
            userRepository.save(user);
            return true;
        }
    }

        }catch (Exception e){
            throw new RuntimeException("User not found");
        }
        return false;

}
    // Update Profile
    public User updateUserProfile(UserProfileDTO userProfile){
        try {
            User user=userRepository.findById(userProfile.getId()).orElseThrow();

            if(user.isVerified()){
                if (userProfile.getPhoneNumber() != null && !userProfile.getPhoneNumber().isEmpty()) {
                    String otp = otpService.generateOTP();
                    boolean otpSent = otpService.sendOTP(userProfile.getPhoneNumber(), otp);
                    if (otpSent) {
                        // Store OTP in session or database for verification (not implemented here)
                        user.setPhoneOtp(otp);
                        user.setPhoneOtpExpiry(LocalDateTime.now().plusMinutes(5));

                        user.setPhoneNumber(userProfile.getPhoneNumber());
                    } else {
                        throw new RuntimeException("Unable to send OTP");
                    }
                }
                if (userProfile.getFirstName() != null && !userProfile.getFirstName().isEmpty()) {
                    user.setFirstName(userProfile.getFirstName());
                }

                if(userProfile.getLastName()!=null && !userProfile.getLastName().isEmpty()){
                    user.setLastName(userProfile.getLastName());
                }

                   return userRepository.save(user);
            };
        } catch (Exception e) {
            System.out.println("exception"+e);
            throw new RuntimeException("Unable to update profile");
        }
        return null;
    }

    // Change Email
    public User updateEmail(Long id, String newEmail) throws ExecutionException, InterruptedException {
        User user=userRepository.findById(id).orElseThrow();

        String userEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        //otp Genration and Sending
        if (user.isVerified()) {
            if (newEmail != null && !newEmail.isEmpty()) {
            String otp = emailService.generateOtp();
            //send otp to email for verification
                CompletableFuture<Boolean> isSentFuture = emailService.sendOtpEmail(newEmail, otp);
            if(isSentFuture.get()) {

                // Update the Job's email field with the old email before changing the user's email
                List<Job> jobs = jobRepository.findByEmail(userEmail);
                if (jobs != null) {
                    for (Job job : jobs) {
                        if (job.getEmail().equals(userEmail)) {
                            job.setEmail(newEmail);  // Update the job with the old email
                        }
                    }
                    jobRepository.saveAll(jobs); // Save the updated jobs
                }

                    user.setEmail(newEmail);

                    user.setOtp(otp);
                    user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
                    user.setVerified(false);


                    userRepository.save(user);

                    return user;
                }
            }

        }
           throw  new RuntimeException("User is not Verified");
    }

    // Upload Profile Image
    public String uploadProfileImage(Long userId, MultipartFile file) throws IOException {
        // Store file on server or cloud storage and return the image URL
//        String imageUrl = "https://storage-service.com/" + file.getOriginalFilename();

        // Convert the file to a byte array
            byte[] imageBytes = file.getBytes();

        User userProfile = userRepository.findById(userId).orElseThrow();
        if (userProfile.isVerified()) {

            // Optionally, set a profile image URL (you can generate a URL from the ID or use it for metadata)
//            String imageUrl = "https://example.com/profile-image/" + userId;
//            userProfile.setProfileImageUrl(imageUrl);

            userProfile.setProfileImage(imageBytes);
            userRepository.save(userProfile);
        return "Image upload Successfully.";
        }
        return null;
    }

    // Get Profile Image from the database
    @Transactional
    public byte[] getProfileImage(Long userId) {
        // Fetch the user profile
        User userProfile = userRepository.findById(userId).orElseThrow();
        if(userProfile.isVerified()){
            return userProfile.getProfileImage();
        }

        // Return the image as a byte array
        return null;
    }
    public boolean verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (otp == null) {
            throw new RuntimeException("No OTP found");
        }

        if (user.getPhoneOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!user.getPhoneOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setPhoneOtp(null);
        user.setPhoneOtpExpiry(null);

        userRepository.save(user);

        return true;
    }



}
