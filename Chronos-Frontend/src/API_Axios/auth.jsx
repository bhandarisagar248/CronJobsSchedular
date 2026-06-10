import api from "./AxiosApi";

// 🔐 LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// 🆕 SIGNUP
export const signupUser = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

//verify otp
export const VerifyOpt=async(data)=>{
  const res=await api.post("/auth/verify-otp",data);
  return res;
}

// 🔑 FORGOT PASSWORD
export const forgotPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", {email:email});
  return res.data;
};

// 🔁 RESET PASSWORD
export const resetPassword = async (data) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};