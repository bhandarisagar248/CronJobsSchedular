// // export const ForgotPassword=()=>{
            
// //         function showForgotModal() {
// //             hideLoginModal()
// //             setTimeout(() => {
// //                 document.getElementById('forgot-modal').classList.remove('hidden')
// //                 document.getElementById('forgot-modal').classList.add('flex')
// //             }, 300)
// //         }
        
// //         function hideForgotModal() {
// //             const modal = document.getElementById('forgot-modal')
// //             modal.classList.add('hidden')
// //             modal.classList.remove('flex')
// //         }
        
        
// //         function handleForgotPassword(e) {
// //             e.preventDefault()
// //             const email = document.getElementById('forgot-email').value
// //             console.log('%c🔑 Password reset requested for:', 'color:#00f5ff', email)
            
// //             const btn = e.target.querySelector('button')
// //             const original = btn.textContent
// //             btn.innerHTML = `Sending magic link <i className="fa-solid fa-spinner fa-spin ml-2"></i>`
// //             btn.disabled = true
            
// //             setTimeout(() => {
// //                 btn.innerHTML = original
// //                 btn.disabled = false
// //                 hideForgotModal()
// //                 alert(`✅ Magic link sent to ${email}\n\n(Production-ready email flow ready)`)
// //             }, 1250)
// //         }
// //     return (
// //         <>
        
// //             {/* <!-- Forgot Password Modal --> */}
// //     <div onclick="if(event.target.id === 'forgot-modal')hideForgotModal()" 
// //          id="forgot-modal"
// //          className="hidden fixed inset-0 bg-black/80 backdrop-blur-xl z-[10000] flex items-center justify-center">
// //         <div onclick="event.stopImmediatePropagation()" 
// //              className="w-full max-w-md mx-4 bg-[#111] rounded-3xl p-8 border border-white/10">
// //             <div className="text-center mb-8">
// //                 <i className="fa-solid fa-key text-6xl text-[#00f5ff] mb-4"></i>
// //                 <h2 className="text-3xl font-semibold">Reset your password</h2>
// //                 <p className="text-white/60 mt-2">We’ll send a magic link to your inbox</p>
// //             </div>
            
// //             <form onsubmit="handleForgotPassword(event)" className="space-y-6">
// //                 <div>
// //                     <label className="text-xs uppercase font-medium tracking-widest text-white/60 block mb-2">Email address</label>
// //                     <input id="forgot-email" type="email" placeholder="you@company.com" 
// //                            className="w-full bg-white/5 border border-white/20 focus:border-[#00f5ff] rounded-3xl px-6 py-4 outline-none text-white"/>
// //                 </div>
                
// //                 <button type="submit"
// //                         className="w-full h-14 bg-white text-black font-semibold rounded-3xl flex items-center justify-center">
// //                     Send magic link
// //                 </button>
// //             </form>
            
// //             <button onclick="hideForgotModal();showLoginModal()" 
// //                     className="mt-6 text-sm text-white/60 hover:text-white flex items-center justify-center w-full">
// //                 ← Back to sign in
// //             </button>
// //         </div>
// //     </div>

        
// //         </>
// //     )
// // }

import { useState } from "react";
import { forgotPassword, resetPassword } from "../API_Axios/auth";

export const ForgotPassword = ({ isOpen, onClose, onLoginOpen }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const[isError,SetisError]=useState(false);


  // 🔹 Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    SetisError(false);
    setError("");

    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError("Email not found");
      SetisError(true);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Reset password
  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    SetisError(false);
    setError("");

    try {
      await resetPassword({ email, otp, password });

      alert("✅ Password reset successful");
      onClose();
      onLoginOpen();
    } catch (err) {
      setError("Invalid OTP or expired");
      SetisError(true);
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div
      onClick={()=>{onClose();setError("");SetisError(false)}}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center"
      // className="w-full max-w-md mx-auto mt-4 h-14 bg-white text-black font-semibold rounded-3xl flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        // className="w-full max-w-md mx-4 bg-[#111] rounded-3xl p-8 border border-white/10 text-white"
        className="[position:inherit] w-full max-w-md mx-4 bg-[#111] rounded-3xl p-8 border border-white/10 text-white flex flex-col items-center"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <i className="fa-solid fa-key text-5xl text-[#00f5ff] mb-4"></i>
          <h2 className="text-3xl font-semibold">{step === 1 ? "Reset your password" : "Enter OTP"}</h2>
          <p className="text-white/60 mt-2">
            We’ll send a OTP to your email.
          </p>
        </div>

        {/* FORM */}

{isError && (
  <p className="text-red-500 mb-3 text-center w-full">{error}</p>
)}
          {/* STEP 1 */}
         {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col items-center gap-4">
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full max-w-sm bg-white/5 border border-white/20 focus:border-[#00f5ff] rounded-3xl px-6 py-4 outline-none text-white text-center"
              required
            />
          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-sm h-12 bg-white text-black font-semibold rounded-2xl flex items-center justify-center mt-4"
          >
            {loading ? (
              <>
                Sending...
                <i className="fa-solid fa-spinner fa-spin ml-2"></i>
              </>
            ) : (
              "Send OTP"
            )}
          </button>
 
          </form>
        )}
         {/* STEP 2 */}
       {step === 2 && (
          <form onSubmit={handleReset} className="flex flex-col items-center gap-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full max-w-sm bg-white/5 border border-white/20 focus:border-[#00f5ff] rounded-3xl px-6 py-4 outline-none text-white text-center mt-4"
              required
            />

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full max-w-sm bg-white/5 border border-white/20 focus:border-[#00f5ff] rounded-3xl px-6 py-4 outline-none text-white text-center mt-4"
              required
            />

            <button disabled={step==1?true:false} className="w-full max-w-sm h-12 bg-white text-black font-semibold rounded-2xl flex items-center justify-center mt-4">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
 



        {/* Back to login */}
        <button
          onClick={() => {
            onClose();
            onLoginOpen();
            setError("");
            SetisError(false)
          }}
          className="mt-6 text-sm text-white/60 hover:text-white flex items-center justify-center w-full"
        >
          ← Back to sign in
        </button>
      </div>
  </div>
  );
};

// import { useState } from "react";
// import { forgotPassword, resetPassword } from "../api/auth"; // your API

// export const ForgotPassword = ({ isOpen, onClose, onLoginOpen }) => {
//   const [step, setStep] = useState(1); // 1=email, 2=otp
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const[isError,SetisError]=useState(false);

//   // 🔹 Step 1: Send OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     SetisError(false);
//     setError("");

//     try {
//       await forgotPassword(email);
//       setStep(2);
//     } catch (err) {
//       setError("Email not found");
//       SetisError(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Step 2: Reset password
//   const handleReset = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     SetisError(false);
//     setError("");

//     try {
//       await resetPassword({ email, otp, password });

//       alert("✅ Password reset successful");
//       onClose();
//       onLoginOpen();
//     } catch (err) {
//       setError("Invalid OTP or expired");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div onClick={onClose} className="fixed inset-0 bg-black/80 flex justify-center items-center">
//       <div onClick={(e) => e.stopPropagation()} className="bg-[#111] p-8 rounded-3xl w-full max-w-md text-white">



//         {/* STEP 1 */}
//         {step === 1 && (
//           <form onSubmit={handleSendOtp}>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full mb-4 p-3 rounded bg-black border"
//               required
//             />

//             <button disabled={loading} className="w-full bg-white text-black p-3 rounded">
//               {loading ? "Sending..." : "Send OTP"}
//             </button>
//           </form>
//         )}

//         {/* STEP 2 */}
//         {step === 2 && (
//           <form onSubmit={handleReset}>
//             <input
//               type="text"
//               placeholder="Enter OTP"
//               value={otp}
//               onChange={(e) => setOtp(e.target.value)}
//               className="w-full mb-3 p-3 rounded bg-black border"
//               required
//             />

//             <input
//               type="password"
//               placeholder="New Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full mb-4 p-3 rounded bg-black border"
//               required
//             />

//             <button disabled={loading} className="w-full bg-white text-black p-3 rounded">
//               {loading ? "Resetting..." : "Reset Password"}
//             </button>
//           </form>
//         )}

//         <button
//           onClick={() => {
//             onClose();
//             onLoginOpen();
//           }}
//           className="mt-4 text-sm text-gray-400"
//         >
//           ← Back to login
//         </button>
//       </div>
//     </div>
//   );
// };