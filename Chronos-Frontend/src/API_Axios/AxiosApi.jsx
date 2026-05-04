import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // 🔗 Spring Boot base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // 🔥 important if using cookies / auth
});

// ✅ Request interceptor (attach token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.url.includes("/auth/")) { // skip auth endpoints
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      // 🔐 Unauthorized → logout user
      localStorage.removeItem("token");
      window.location = "/";
    }

    return Promise.reject(error);
  }
);

export default api;