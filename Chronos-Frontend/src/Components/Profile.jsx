

import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OTPModal from "./OTPModel"; // OTP Modal for phone verification
import "../Css/profile.css";
import axios from "axios";
import api from "../API_Axios/AxiosApi";
import ContextAPI from "../ContextApi/ContextAPI";

const Profile = () => {
  const navigate = useNavigate();

  const { user,setUser,showNotification }=useContext(ContextAPI);

  const imRef=useRef();

const [selectedFile, setSelectedFile] = useState(null);

const [editProfile, setEditProfile] = useState(false);
const [editEmail, setEditEmail] = useState(false);
const [editPassword, setEditPassword] = useState(false);

  // States for profile info
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);

  const countries = [
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "US", dial: "+1", name: "USA" },
  { code: "UK", dial: "+44", name: "UK" },
];

const [dialCode, setDialCode] = useState("+977");
const [open, setOpen] = useState(false);
const [selected, setSelected] = useState(countries[0]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  useEffect(() => {
  if (user) {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");

    fetchProfileImage(); // ✅ auto load image
  }
}, [user]);

useEffect(() => {
  return () => {
    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }
  };
}, [profileImage]);


  const fetchProfileImage = async () => {
  if (!user?.id) return;

  try {
    const response = await api.get(
      `/user/profile-image?userId=${user.id}`,
      {
        responseType: "blob", // ✅ VERY IMPORTANT
      }
    );

    const imageUrl = URL.createObjectURL(response.data);
    setProfileImage(imageUrl);
  } catch (error) {
    console.log("No profile image found or error:", error);
  }
};

  const handleProfileImageChange = (e) => {

    console.log("User id is"+user.id)
    console.log("User is"+user)
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleOTPVerify = () => {
    setIsPhoneVerified(true);
    setShowOTPModal(false);
  };

  const handleProfileUpdate = async () => {
  var fullPhoneNumber;
    if(phoneNumber && dialCode && phoneNumber.trim()!=="")
    {
      fullPhoneNumber = dialCode + phoneNumber;
console.log("phoneNumber::"+fullPhoneNumber);
    }
    try {
      const profileData = {
        id:user?.id,
        firstName,
        lastName,
        email:user?.email,
        phoneNumber:fullPhoneNumber ? (fullPhoneNumber):(phoneNumber),
      };

     const res= await api.put("/user/update", profileData);

      if (phoneNumber!==null && phoneNumber.trim() !== ""){
        if (!fullPhoneNumber.startsWith("+")) {
  showNotification("Please select country code", "error");
  return;
}
        setShowOTPModal(true);
        // navigate("/verify-top");
      }
      showNotification("Profile Updated Successfully","success");

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      setIsProfileUpdated(true);
      fetchProfileImage();
    } catch (error) {
        showNotification("Error updating profile:","error");
      alert("Error updating profile: " + error.message);
    }
  };
  const handleEmailUpdate = async () => {
    if(email==null || email.trim()==""){
      return;
      showNotification("Please Enter Correct Email.","error");
    }
    try {
      const profileData = {
        id:user?.id,
        email:email,
      };

    const res= await api.put("/user/email", profileData);

       localStorage.setItem("token", res.token);
       console.log("Token is after email update:"+res.token)
     showNotification("Please Verify your Email.","info");
     
      setIsProfileUpdated(true);
      fetchProfileImage();

    //  aftrer successfully update email,Go to verify otp for verification;
        navigate("/verify-otp",{ state: { email: email } });

    } catch (error) {
        showNotification("Error updating eamil:","error");
      alert("Error updating Email: " + error.message);
    }
  };

  const handlePasswordUpdate = async () => {

    if(password==null || password.trim()==""){
      showNotification("Please Enter old Password","info");
      return;
    }
    if(newPassword==null || newPassword.trim()==""){
            showNotification("Please Enter new Password","info");
      return;
    }
    try {
      const passwordData = {
        id:user?.id,
        email:user?.email,
        currentPassword: password,
        newPassword,
      };

      await api.post("/user/changePassword", passwordData);
       showNotification("Password Changed Successfully:","success");
      alert("Password updated!");
    } catch (error) {
    showNotification("Error Changing Password:","error");
      alert("Error changing password: " + error.message);
    }
  };

  const handleImageUpload = async () => {

    if(!user){
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", user.id); // Use the actual userId here

    try {
      const response = await api.post("/user/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
         showNotification("Image uploaded successfully:","success");
      setSelectedFile(null);
    } catch (error) {
             showNotification("Error uploading Image:","success");
      alert("Error uploading image: " + error.message);
    }
  };

  return (
    <div className="profile-container bg-gradient-to-b from-[#050505]/95 to-[#000000]/70 backdrop-blur-xl p-8">
      <div className="profile-card bg-[#1f1f1f] rounded-lg shadow-xl p-8 max-w-xl mx-auto">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Profile Settings</h2>

        <div className="profile-image-container mb-6 flex justify-center">
  <div className="profile-image-wrapper">
    <img
      src={profileImage || "https://via.placeholder.com/150"}
      alt="Profile"
      className="profile-image"
      onClick={() => imRef.current.click()}
    />

    <input
      ref={imRef}
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          setSelectedFile(file);

          const reader = new FileReader();
          reader.onloadend = () => setProfileImage(reader.result);
          reader.readAsDataURL(file);
        }
      }}
      hidden
    />

    {selectedFile && (
      <button onClick={handleImageUpload} className="btn-primary upload-btn">
        Upload Image
      </button>
    )}
  </div>
</div>


        
        <div className="profile-section">
  <div className="section-header">
    <h3>Personal Info</h3>
    <span onClick={() => setEditProfile(!editProfile)} className="edit-icon">✎</span>
  </div>

  {editProfile ? (
    <>
      <input type="text" value={firstName} onChange={handleFirstNameChange} className="profile-input" placeholder="First Name" />
      <input type="text" value={lastName} onChange={handleLastNameChange} className="profile-input" placeholder="Last Name" />
      {/* <input type="tel" value={phoneNumber} onChange={handlePhoneNumberChange} className="profile-input" placeholder="Phone Number" /> */}
      <div style={{ display: "flex", gap: "10px" }}>
  
<div style={{ position: "relative", width: "35%" }}>

  <div
    onClick={() => setOpen(!open)}
    className="profile-input"
    style={{ background: "#0006", cursor: "pointer" }}
  >
    {selected.name} ({selected.dial})
  </div>

  {open && (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        background: "#111",
        border: "1px solid #333",
        zIndex: 999,
      }}
    >
      {countries.map((c) => (
        <div
          key={c.code}
          onClick={() => {
            setSelected(c);
            setDialCode(c.dial);
            setOpen(false);
          }}
          style={{
            padding: "10px",
            cursor: "pointer",
            color: "white",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#222")}
          onMouseLeave={(e) => (e.target.style.background = "transparent")}
        >
          {c.name} ({c.dial})
        </div>
      ))}
    </div>
  )}
</div>

  {/* Phone Input */}
  <input
    type="tel"
    value={phoneNumber}
    onChange={(e) => {
      const raw = e.target.value.replace(/\D/g, "");
      setPhoneNumber(raw);
    }}
    className="profile-input bg-[#0006]"
    style={{ width: "65%",background:"#0006" }}
    placeholder="Enter phone number"
  />
</div>

      <button onClick={handleProfileUpdate} className="btn-primary">Save</button>
    </>
  ) : (
    <div className="profile-view">
      <p>{firstName} {lastName}</p>
      <p>{phoneNumber}</p>
    </div>
  )}
</div>



<div className="profile-section">
  <div className="section-header">
    <h3>Email</h3>
    <span onClick={() => setEditEmail(!editEmail)} className="edit-icon">✎</span>
  </div>

  {editEmail ? (
    <>
      <input type="email" value={email} onChange={handleEmailChange} className="profile-input" />
      <button onClick={handleEmailUpdate} className="btn-primary">Update Email</button>
    </>
  ) : (
    <div className="profile-view">
      <p>{email}</p>
    </div>
  )}
</div>

<div className="profile-section">
  <div className="section-header">
    <h3>Password</h3>
    <span onClick={() => setEditPassword(!editPassword)} className="edit-icon">✎</span>
  </div>

  {editPassword ? (
    <>
      <input type="password" value={password} onChange={handlePasswordChange} className="profile-input" placeholder="Current Password" />
      <input type="password" value={newPassword} onChange={handleNewPasswordChange} className="profile-input" placeholder="New Password" />

      <button onClick={handlePasswordUpdate} className="btn-primary">Change Password</button>
    </>
  ) : (
    <div className="profile-view">
      <p>••••••••••</p>
    </div>
  )}
</div>

      </div>

      {showOTPModal && <OTPModal onVerify={handleOTPVerify} onClose={() => setShowOTPModal(false)} />}
    </div>
  );
};

export default Profile;