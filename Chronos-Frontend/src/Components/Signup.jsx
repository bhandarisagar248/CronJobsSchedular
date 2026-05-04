import { useState, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import ContextAPI from "../ContextApi/ContextAPI";

export const Signup = ({ isOpen, onClose, onLoginOpen }) => {
  const { signup, loading,IsError,Error,SetIsError,SetError } = useContext(ContextAPI);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  //to signup with google
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const token = credentialResponse.credential;

    const res = await axios.post("http://localhost:8080/api/auth/google", {
      token,
    });

    console.log("Login success:", res.data);

    // You can store JWT or user here
    onClose();

  } catch (err) {
    console.error(err);
    SetIsError(true);
    SetError("Google login failed");
  }
};

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      alert("You must agree to terms.");
      return;
    }
      const payload = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    password: form.password,
  };

try{
  
  await signup(payload);
  //reset after login
setForm({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: true,
  })
}
catch (e) {
  const backendMessage =
    e.response?.data?.message ||  // from backend JSON
    e.response?.data ||           // fallback string
    "Unable to create account";

  SetError(backendMessage);
  SetIsError(true);
  return; // prevent modal close
}
    onClose();
  };

  const demoSocialLogin = (provider) => () => {
    alert(`✅ ${provider} signup successful!`);
  };

  if (!isOpen) return null;

  return (
    <div
        onClick={()=>{onClose(),SetIsError(false),SetError(""),setForm({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: true,
  })}}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md mx-4 bg-[#111] rounded-3xl p-8 border border-white/10 text-white"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">chronos</h2>
          <button  onClick={()=>{onClose(),SetIsError(false),SetError(""),setForm({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: true,
  })}} className="text-white/40 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <h1 className="text-3xl font-semibold mb-2">
          Start scheduling in seconds
        </h1>
        <p className="text-white/60 mb-8">
          No credit card required • Free tier forever
        </p>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-6">

          <div className="grid grid-cols-2 gap-4">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="w-full bg-white/5 border border-white/20 rounded-3xl px-4 py-3 outline-none"
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="w-full bg-white/5 border border-white/20 rounded-3xl px-4 py-3 outline-none"
              required
            />
          </div>

          <input
            name="email"
            type="email"
            value={form.email}
            autoComplete="email"
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full bg-white/5 border border-white/20 rounded-3xl px-6 py-4 outline-none"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            autoComplete="new-password"
            onChange={handleChange}
            placeholder="••••••••••••"
            className="w-full bg-white/5 border border-white/20 rounded-3xl px-6 py-4 outline-none"
            required
          />
          {IsError&& <div><span style={{color:'red'}}>{Error}</span></div>}
          <label className="flex items-center text-xs text-white/60 gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="accent-[#00f5ff]"
              required
            />
            I agree to Terms & Privacy Policy
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-[#00f5ff] hover:bg-white text-black font-semibold text-lg rounded-3xl flex items-center justify-center"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "Create my free account"
            )}
          </button>
        </form>

        {/* SOCIAL */}
        <div className="text-center text-xs text-white/40 mt-8">
          or continue with
        </div>

        <div className="mt-6 grid grid-cols-1 m-6">
  <GoogleLogin
    onSuccess={handleGoogleSuccess}
    onError={() => {
      SetIsError(true);
      SetError("Google login failed");
    }}
  />
        </div>

        {/* SWITCH TO LOGIN */}
        <div className="text-center mt-8 text-sm text-white/60">
          Already have an account?{" "}
          <button
            onClick={() => {
              onClose();
              onLoginOpen();
            }}
            className="text-[#00f5ff]"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};