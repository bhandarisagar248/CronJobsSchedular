import { useState, useRef, useContext } from "react";
import { VerifyOpt } from "../API_Axios/auth";
import { useLocation, useNavigate } from "react-router-dom";
import ContextAPI from "../ContextApi/ContextAPI";

export const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

    const { user,showNotification,setUser }=useContext(ContextAPI);

  const navigate=useNavigate();
const location = useLocation();
const email = location.state?.email;

 const { setIsLoggedIn,isLoggedIn } = useContext(ContextAPI);

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
        "email":email,
        "otp":finalOtp
    }

    const res = await VerifyOpt(payload);

// axios success → no need res.ok
if (!res || res.status !== 200) {
  setIsLoggedIn(false);
  showNotification("Invalid OTP or Expired.","error");
  throw new Error("Invalid OTP");
}else{
      //update user
    setUser(res.user);
    localStorage.setItem("user",JSON.stringify(res.user));
     localStorage.setItem("token", res.token);

     console.log("User after token verification is:"+localStorage.getItem("user"));
            console.log("Token is after email update:"+res.token)


  showNotification("✅ Verified successfully!.","success");
    // window.alert("✅ Verified successfully!");


  
    setIsLoggedIn(true);
     //navigate to dashboard page 
    navigate("/metrics");
    
}

      //navigate to home page after successfull login
    } catch (err) {
        showNotification("Invalid OTP or Expired.","error");
      setError("Invalid or expired OTP");
      setIsLoggedIn(false);
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
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
      <div className="glass border border-white/10 rounded-3xl p-10 w-full max-w-md shadow-2xl">

        {/* HEADER */}
        <h2 className="heading-font text-3xl mb-2">
          Verify your email
        </h2>
        <p className="text-white/60 mb-8 text-sm">
          Enter the 6-digit code sent to <br />
          <span className="text-[#00f5ff] font-mono">{email}</span>
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

        {/* BUTTON */}
        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-4 bg-[#01d3dc] text-black font-semibold rounded-3xl hover:scale-105 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">Verifying...</span>
          ) : (
            <>
              <i className="fa-solid fa-shield-check"></i>
              Verify OTP
            </>
          )}
        </button>

        {/* RESEND */}
        <div className="text-center mt-6 text-sm text-white/50">
          Didn’t receive code?{" "}
          <span className="text-[#00f5ff] cursor-pointer hover:underline">
            Resend
          </span>
        </div>
      </div>
    </div>
  );
};