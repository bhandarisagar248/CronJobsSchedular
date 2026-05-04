import { useState, useEffect, use } from "react";
import ContextAPI from "./ContextAPI";
import { loginUser,signupUser } from "../API_Axios/auth";
import { VerifyOtp } from "../Components/VerifyOtp";
import { useNavigate } from "react-router-dom";

const ContextState = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh,setRefresh]=useState(false);
  const [IsError,SetIsError]=useState(false);
  const [Error,SetError]=useState("");
  const navigate=useNavigate();
 const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [showLogin, setShowLogin] = useState(false);

   const [notification, setNotification] = useState({
    message: "",
    type: "", // success, error, info
    visible: false,
  });



  //Auto login
useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (savedUser && token) {
        try {
            const user = JSON.parse(savedUser);
            setUser(user);
            setIsLoggedIn(true);
            // You can optionally validate the token here by calling an API endpoint or checking expiration

            console.log("Auto-login successful:", user);
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setShowLogin(true);
            
        }
    } else {
        setIsLoggedIn(false);
    }
}, []);

// LOGIN
  const login = async (payload) => {
    setLoading(true);
    try {
      const data = await loginUser(payload);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);

    console.log("The token is"+data.token);
    
      setUser(data.user);
          SetIsError(false);
          SetError("");
           setIsLoggedIn(true);

           //navigate to dashboard page 
           navigate("/dashboard");
    } 
    
catch (err) {
   setIsLoggedIn(false);
  throw err; // 🔥 pass error to component
}
     finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const signup = async (payload) => {
    setLoading(true);
    try {
      const data = await signupUser(payload);

    localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
    setUser(data.user);
      SetIsError(false);
SetError("");

      // navigate to the verify-opt componenet 
      navigate("/verify-otp", { state: { email: data.user?.email } });

    } 
catch (err) {
  throw err; // 🔥 pass error to component
}
    finally {
      setLoading(false);
    }
  };


  //for notification Model 
      const showNotification = (message, type) => {
    setNotification({
      message: message,
      type: type,
      visible: true,
    });
      };
        // Automatically hide the notification after 5 seconds
    setTimeout(() => {
      setNotification({
        message: "",
        type: "",
        visible: false,
      });
    }, 7000);


  return (
       <ContextAPI.Provider value={{ loading, login, signup, isLoggedIn, setIsLoggedIn, IsError, Error, SetIsError, SetError, user, setUser, setRefresh, showNotification, setNotification, notification, showLogin, setShowLogin }}>
      {children}
    </ContextAPI.Provider>
  );
};

export default ContextState;