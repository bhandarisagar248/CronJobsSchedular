import { useState, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import ContextAPI from "../ContextApi/ContextAPI";
import { useNavigate } from "react-router-dom";

export const Login = ({ isOpen, onClose, onSignupOpen,onForgotOpen }) => {
  const { login,setUser,loading,IsError,Error,SetIsError,SetError,setIsLoggedIn } = useContext(ContextAPI);

  // Controlled form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate=useNavigate();

  // const [IsError,SetIsError]=useState(false);
  // const [Error,SetError]=useState("");

  // Handle login
  const handleLogin = async (e) => {
      e.preventDefault();
if(! email){
    window.alert("Please Enter Email !!!");
    return false;
}
if(!password){
  window.alert("Enter password !!!");
  return false;
}
const payload = { email, password };
   
try{
  
  await login(payload);

  //reset after lgoin
  setEmail(null);
  setPassword(null);
}
catch(e){
  SetIsError(true);
  SetError("Invalid email or password.");
  return;
}
// close modal on success
SetIsError(false);
SetError("");
onClose(); 
  };

//to login with google
const handleGoogleSuccess = async (credentialResponse) => {
  console.log(credentialResponse); //
  try {
    const token = credentialResponse.credential;

    const res = await axios.post("http://localhost:8080/api/auth/google", {
      token,
    });

    console.log("Login success:", res.data);

    // You can store JWT or user here
localStorage.setItem("user", JSON.stringify(res.data.user));
localStorage.setItem("token", res.data.token);

setUser(res.data.user);


    onClose();
    navigate("/metrics");
    setIsLoggedIn(true);

  } catch (err) {
    console.error(err);
    SetIsError(true);
    SetError("Google login failed");
    setIsLoggedIn(false);
  }
};

  if (!isOpen) return null;

  return (
    <div
      onClick={()=>{onClose(),SetIsError(false),SetError(""),setEmail(""),setPassword("null")}}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 bg-[#111] rounded-3xl p-8 border border-white/10 text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 bg-[#00f5ff] rounded-2xl flex items-center justify-center">
              <i className="fa-solid fa-clock text-black"></i>
            </div>
            <h2 className="heading-font text-3xl">chronos</h2>
          </div>
          <button  onClick={()=>{onClose(),SetIsError(false),SetError(""),setEmail(""),setPassword("")}} className="text-white/40 hover:text-white text-3xl">
            ×
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-white/60 mb-8">Sign in to manage your distributed jobs</p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs uppercase font-medium tracking-widest text-white/60 block mb-2">
              Work email
            </label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourcompany.com"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00f5ff] rounded-3xl px-6 py-4 outline-none text-white placeholder:text-white/40"
              required
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs uppercase font-medium tracking-widest text-white/60">
                Password
              </label>
              <button type="button" onClick={()=>{onForgotOpen()}} className="text-xs text-[#00f5ff] hover:underline">
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/20 focus:border-[#00f5ff] rounded-3xl px-6 py-4 outline-none text-white"
              required
            />
          </div>
          {IsError&& <div><span style={{color:'red'}}>{Error}</span></div>}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 accent-[#00f5ff]"
              />
              <span>Keep me signed in</span>
            </label>
            <span className="text-white/40 text-xs">
              Need help? <a href="#" className="text-[#00f5ff]">Contact support</a>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#00f5ff] hover:bg-white text-black font-semibold text-lg rounded-3xl flex items-center justify-center"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "Sign in securely"
            )}
          </button>
        </form>

        {/* Signup link */}
        <div className="mt-8 text-center text-sm text-white/60">
          Don’t have an account?{" "}
          <button
            onClick={() => {
              onClose();
              onSignupOpen();
            }}
            className="text-[#00f5ff] font-medium"
          >
            Create one free →
          </button>
        </div>

        {/* Social login */}
        <div className="mt-6 grid grid-cols-1 m-6">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      SetIsError(true);
      SetError("Google login failed");
    }}
  />
        </div>
      </div>
    </div>
  );
};