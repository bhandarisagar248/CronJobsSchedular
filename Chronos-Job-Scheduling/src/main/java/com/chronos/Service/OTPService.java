package com.chronos.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OTPService {

    @Value("${twilio.accountSid}")
    private String ACCOUNT_SID;

    @Value("${twilio.authToken}")
    private String AUTH_TOKEN;

    @Value("${twilio.phoneNumber}")
    private String TWILIO_PHONE_NUMBER;

    @PostConstruct
    public void init() {
        System.out.println("SID = " + ACCOUNT_SID); // debug
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
    }

    // Generate OTP
    public String generateOTP() {
        Random random = new Random();
        int otp = random.nextInt(999999);
        return String.format("%06d", otp); // Return 6 digit OTP
    }

    // Send OTP via Twilio SMS
    public boolean sendOTP(String phoneNumber, String otp) {
        try {
            Message.creator(
                    new com.twilio.type.PhoneNumber(phoneNumber),
                    new com.twilio.type.PhoneNumber(TWILIO_PHONE_NUMBER),
                    "Your OTP is: " + otp
            ).create();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Verify OTP (In a real-world scenario, store OTPs in database with expiration)
    public boolean verifyOTP(String phoneNumber, String otp) {
        // Logic for verifying OTP - Here, we simply check if the OTP matches the last sent OTP (In real-world applications, use database or cache storage).
        // Assuming OTP is stored or valid for a session
        return "123456".equals(otp); // For demo, we're using a static OTP (123456)
    }
}
