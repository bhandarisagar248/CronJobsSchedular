import React, { useContext, useState } from "react";
import ContextAPI from "../ContextApi/ContextAPI";
import { useRef } from "react";

const OTPModal = ({ onVerify, onClose }) => {
   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const { user,showNotification }=useContext(ContextAPI);

  const inputsRef = useRef([]);



    // 🔢 Handle OTP input
    const handleChange = (value, index) => {
      if (!/^[0-9]?$/.test(value)) return;
  
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
  
      // Auto focus next
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
  
      //auto submit after 6 digits 
  // if (newOtp.join("").length === 6) {
  //    handleVerify(newOtp.join(""));
  // }
    };
  
    // ⬅️ Backspace navigation
    const handleKeyDown = (e, index) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
    };
  
    // 📩 Submit OTP
  const handleVerify = async () => {
    const finalOtp = otp.join("");
  
      if (finalOtp.length !== 6) {
        window.alert("Enter complete OTP");
        setError("Enter complete OTP");
        return;
      }

      setLoading(true);
      setError("");
  
      try {

      const payload={
          "email":user?.email,
          "otp":finalOtp
      }


    const res = await api.post(`/user/verify-otp`,payload);

  
  // axios success → no need res.ok
  if (!res || res.status !== 200) {
    setError("Invalid OTP or Expired");
    showNotification("Invalid OTP or Expired","error");
    throw new Error("Invalid OTP");
    console.log("No profile image found or error:", error);
  }else{
      showNotification("✅ Verified successfully!","success");
      onClose();
      window.alert("✅ Verified successfully!");
       //navigate to dashboard page 
      // navigate("/dashboard");
      
  }
  
        //navigate to home page after successfull login
      } catch (err) {
            showNotification("Invalid OTP or Expired","error");
        setError("Invalid or expired OTP");
      } finally {
        setLoading(false);
      }
    };
  
    //handle paste event 
    const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;
  
    const newOtp = paste.split("");
    setOtp(newOtp);
  
    inputsRef.current[5].focus();
  };


  return (

    
    <div className="otp-modal">

 {/* HEADER */}
        <h2 className="heading-font text-3xl mb-2">
          Verify your email
        </h2>
        <p className="text-white/60 mb-8 text-sm">
          Enter the 6-digit code sent to <br />
          <span className="text-[#00f5ff] font-mono">{user?.email}</span>
        </p>
                {/* OTP INPUT */}
        <div onPaste={handlePaste} className="flex justify-between gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className="w-12 h-14 text-center text-xl font-mono bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-[#00f5ff] transition"
            />
          ))}
        </div>

                {/* ERROR */}
        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}


        <div className="otp-actions">
          <button onClick={handleVerify} className="btn-primary">Verify</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>

                {/* RESEND */}
        <div className="text-center mt-6 text-sm text-white/50">
          Didn’t receive code?{" "}
          <span className="text-[#00f5ff] cursor-pointer hover:underline">
            Resend
          </span>
        </div>
    </div>
  );
};

export default OTPModal;