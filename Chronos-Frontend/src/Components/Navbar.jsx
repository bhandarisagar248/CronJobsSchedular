// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const Navbar = ({ onLoginClick, onSignupClick }) => {
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navLinks = [
//     { label: "Features", path: "/features" },
//     { label: "Examples", path: "/examples" },
//     { label: "Pricing", path: "/pricing" },
//     { label: "Docs", path: "/docs" },
//     { label: "Enterprise", path: "/enterprise" },
//   ];

//   const handleNavClick = (path) => {
//     navigate(path);
//     if (mobileMenuOpen) setMobileMenuOpen(false);
//   };

//   return (
//     <nav className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
//       <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-x-3">
//           <div className="w-9 h-9 bg-[#01d3dc] rounded-2xl flex items-center justify-center shadow-[0_0_25px_-3px] shadow-[#00f5ff]">
//             <i className="fa-solid fa-clock text-[#050505] text-2xl"></i>
//           </div>
//           <h1 className="heading-font text-3xl tracking-[-1px] font-semibold text-[#01d3dc]">
//             chronos
//           </h1>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">
//           {navLinks.map((link) => (
//             <button
//               key={link.path}
//               onClick={() => handleNavClick(link.path)}
//               className="nav-link text-white/90 hover:text-white"
//             >
//               {link.label}
//             </button>
//           ))}
//         </div>

//         {/* Desktop buttons */}
//         <div className="hidden md:flex items-center gap-x-4">
//           <button
//             onClick={onLoginClick}
//             className="px-6 py-2.5 text-sm font-semibold text-white border border-white/30 hover:border-white/60 rounded-3xl flex items-center gap-x-2"
//           >
//             <i className="fa-solid fa-arrow-right-to-bracket"></i> Log in
//           </button>

//           <button
//             onClick={onSignupClick}
//             className="px-6 py-2.5 text-sm font-semibold bg-white text-[#050505] hover:bg-[#00f5ff] rounded-3xl flex items-center gap-x-2"
//           >
//             <i className="fa-solid fa-rocket"></i> Get started free
//           </button>
//         </div>

//         {/* Mobile Hamburger */}
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="md:hidden w-10 h-10 flex items-center justify-center text-2xl"
//         >
//           <i className="fa-solid fa-bars"></i>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden px-8 pb-6 border-t border-white/10">
//           <div className="flex flex-col gap-y-4 pt-4 text-sm font-medium">
//             {navLinks.map((link) => (
//               <button
//                 key={link.path}
//                 onClick={() => handleNavClick(link.path)}
//                 className="py-2 text-white/90 text-left hover:text-white"
//               >
//                 {link.label}
//               </button>
//             ))}

//             <div className="pt-4 border-t border-white/10 flex flex-col gap-y-3">
//               <button
//                 onClick={() => {
//                   onLoginClick();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full py-4 text-left text-white font-medium border border-white/30 rounded-3xl px-6 hover:border-white/60 rounded-3xl flex items-center gap-x-2"
//               >
//                <i className="fa-solid fa-arrow-right-to-bracket"></i> Log in
//               </button>
//               <button
//                 onClick={() => {
//                   onSignupClick();
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full py-4 bg-white text-[#050505] font-semibold rounded-3xl bg-white hover:bg-[#00f5ff]"
//               >
//                 Get started free
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import '../Css/navbar.css';

// export const Navbar = ({ onLoginClick, onSignupClick }) => {
//   const navigate = useNavigate();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   // Check localStorage/session for login status
//   useEffect(() => {
//     const token = localStorage.getItem("authToken"); // or your session key
//     setIsLoggedIn(!!token);
//   }, []);

//   const navLinks = [
//     { label: "Features", path: "/features" },
//     { label: "Examples", path: "/examples" },
//     { label: "Pricing", path: "/pricing" },
//     { label: "Docs", path: "/docs" },
//     { label: "Enterprise", path: "/enterprise" },
//   ];

//   const handleNavClick = (path) => {
//     navigate(path);
//     if (mobileMenuOpen) setMobileMenuOpen(false);
//   };

//   return (
//     <nav className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl">
//       <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-x-3">
//           <div className="w-9 h-9 bg-[#01d3dc] rounded-2xl flex items-center justify-center shadow-[0_0_25px_-3px] shadow-[#00f5ff]">
//             <i className="fa-solid fa-clock text-[#050505] text-2xl"></i>
//           </div>
//           <h1 className="heading-font text-3xl tracking-[-1px] font-semibold text-[#01d3dc]">
//             chronos
//           </h1>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">
//           {navLinks.map((link) => (
//             <button
//               key={link.path}
//               onClick={() => handleNavClick(link.path)}
//               className="nav-link relative text-white/90 hover:text-white transition-colors duration-300"
//             >
//               {link.label}
//               <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#01d3dc] transition-all duration-300 hover:w-full"></span>
//             </button>
//           ))}
//         </div>

//         {/* Desktop buttons */}
//         {!isLoggedIn && (
//           <div className="hidden md:flex items-center gap-x-4">
//             <button
//               onClick={onLoginClick}
//               className="px-6 py-2.5 text-sm font-semibold text-white border border-white/30 hover:border-white/60 rounded-3xl flex items-center gap-x-2 transition"
//             >
//               <i className="fa-solid fa-arrow-right-to-bracket"></i> Log in
//             </button>

//             <button
//               onClick={onSignupClick}
//               className="px-6 py-2.5 text-sm font-semibold bg-white text-[#050505] hover:bg-[#00f5ff] rounded-3xl flex items-center gap-x-2 transition"
//             >
//               <i className="fa-solid fa-rocket"></i> Get started free
//             </button>
//           </div>
//         )}

//         {/* Mobile Hamburger */}
//         <button
//           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//           className="md:hidden w-10 h-10 flex items-center justify-center text-2xl"
//         >
//           <i className="fa-solid fa-bars"></i>
//         </button>
//       </div>

//       {/* Mobile Menu */}
//       {mobileMenuOpen && (
//         <div className="md:hidden px-8 pb-6 border-t border-white/10 bg-[#050505]/90 backdrop-blur-xl rounded-b-xl shadow-lg">
//           <div className="flex flex-col gap-y-4 pt-4 text-sm font-medium">
//             {navLinks.map((link) => (
//               <button
//                 key={link.path}
//                 onClick={() => handleNavClick(link.path)}
//                 className="py-2 text-white/90 text-left hover:text-white relative transition-colors duration-300"
//               >
//                 {link.label}
//                 <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#01d3dc] transition-all duration-300 hover:w-full"></span>
//               </button>
//             ))}

//             {!isLoggedIn && (
//               <div className="pt-4 border-t border-white/10 flex flex-col gap-y-3">
//                 <button
//                   onClick={() => {
//                     onLoginClick();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="w-full py-4 text-left text-white font-medium border border-white/30 rounded-3xl px-6 flex items-center gap-x-2 hover:border-white/60 transition"
//                 >
//                   <i className="fa-solid fa-arrow-right-to-bracket"></i> Log in
//                 </button>
//                 <button
//                   onClick={() => {
//                     onSignupClick();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="w-full py-4 bg-white text-[#050505] font-semibold rounded-3xl hover:bg-[#00f5ff] transition"
//                 >
//                   Get started free
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useContext } from "react";
import '../Css/navbar.css';
import ContextAPI from "../ContextApi/ContextAPI";

export const Navbar = ({ onLoginClick, onSignupClick }) => {
  const navigate = useNavigate();
  const location = useLocation(); // track current page
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const { setIsLoggedIn, isLoggedIn, setUser,user } = useContext(ContextAPI);

  useEffect(() => {
    const user=localStorage.getItem("user");
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const navLinks = [
    { label: "Features", path: "/features" },
    { label: "Examples", path: "/examples" },
    { label: "Docs", path: "/docs" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };
 
  const handleLogout=(e)=>{
    e.preventDefault();
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
     setIsLoggedIn(false);

  }

  return (
    <nav className="sticky top-0 left-0 right-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#050505]/95 to-[#000000]/70 backdrop-blur-xl shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to={user && isLoggedIn ? "/dashboard":"/"} className="flex items-center gap-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#00f5ff] to-[#01d3dc] rounded-3xl flex items-center justify-center shadow-[0_0_30px_-3px] shadow-[#00f5ff] transform hover:scale-105 transition-transform duration-300">
            <i className="fa-solid fa-clock text-[#050505] text-2xl"></i>
          </div>
          <h1 className="heading-font text-3xl tracking-[-1px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] to-[#01d3dc]">
            chronos
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-x-8 text-sm font-medium">
                    { user && (
              <button
                key="/dashboard"
                onClick={() => handleNavClick("/dashboard")}
                className="navbar_link relative text-white/90 hover:text-white transition-colors duration-300"
              >
                Dashboard
                <span 
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#01d3dc] transition-all duration-300 ${
                    location.pathname === "/dashboard" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
              
                    )
          }
          
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className="navbar_link relative text-white/90 hover:text-white transition-colors duration-300"
              >
                {link.label}
                <span 
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#01d3dc] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
            );
          })}

                              { user && (
              <button
                key="/profile"
                onClick={() => handleNavClick("/profile")}
                className="navbar_link relative text-white/90 hover:text-white transition-colors duration-300"
              >
                Profile
                <span 
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#01d3dc] transition-all duration-300 ${
                    location.pathname === "/profile" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
              
                    )
          }
        </div>

        {/* Desktop buttons */}
        {!isLoggedIn && (
          <div className="hidden md:flex items-center gap-x-4">
            <button
              onClick={onLoginClick}
              className="px-6 py-2.5 text-sm font-semibold text-white border border-white/30 hover:border-white/60 rounded-3xl flex items-center gap-x-2 transition-transform transform hover:scale-105"
            >
              <i className="fa-solid fa-arrow-right-to-bracket"></i> Log in
            </button>

            <button
              onClick={onSignupClick}
              className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#00f5ff] to-[#01d3dc] text-[#050505] hover:from-[#01d3dc] hover:to-[#00f5ff] rounded-3xl flex items-center gap-x-2 transition-transform transform hover:scale-105 shadow-lg"
            >
              <i className="fa-solid fa-rocket"></i> Get started free
            </button>
          </div>
        )}
        {isLoggedIn && (
  <button
    onClick={(e) => {handleLogout(e)}}
    className="px-6 py-2.5 text-sm font-semibold text-[#050505] bg-gradient-to-r from-red-500 to-pink-500 hover:from-pink-500 hover:to-red-500 rounded-3xl flex items-center gap-x-2 transition-transform transform hover:scale-105 shadow-lg"
  >
    <i className="fa-solid fa-right-from-bracket"></i> Logout
  </button>
)}

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center text-2xl text-white hover:text-[#01d3dc] transition-colors duration-300"
        >
          <i className={`fa-solid ${mobileMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-8 pb-6 border-t border-white/10 bg-gradient-to-b from-[#050505]/90 to-[#000000]/80 backdrop-blur-xl rounded-b-xl shadow-xl">
          <div className="flex flex-col gap-y-4 pt-4 text-sm font-medium">
                                { user && (
              <button
                key="/dashboard"
                onClick={() => handleNavClick("/dashboard")}
                className="navbar_link relative text-white/90 hover:text-white text-left transition-colors duration-300"
              >
                Dashboard
                <span 
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#01d3dc] transition-all duration-300 ${
                    location.pathname === "/dashboard" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
              
                    )
          }
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className="navbar_link relative py-2 text-white/90 text-left hover:text-white transition-colors duration-300"
                >
                  {link.label}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] bg-[#01d3dc] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  ></span>
                </button>
              );
            })}
                                          { user && (
              <button
                key="/profile"
                onClick={() => handleNavClick("/profile")}
                className="navbar_link relative text-white/90 hover:text-white text-left transition-colors duration-300"
              >
                Profile
                <span 
                  className={`absolute left-0 -bottom-1 h-[2px] bg-[#01d3dc] transition-all duration-300 ${
                    location.pathname === "/profile" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </button>
              
                    )
          }

            {!isLoggedIn && (
              <div className="pt-4 border-t border-white/10 flex flex-col gap-y-3">
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-4 text-left text-white font-medium border border-white/30 rounded-3xl px-6 flex items-center gap-x-2 hover:border-white/60 transition-transform transform hover:scale-105"
                >
                  <i className="fa-solid fa-arrow-right-to-bracket"></i> Log in
                </button>
                <button
                  onClick={() => {
                    onSignupClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-[#00f5ff] to-[#01d3dc] text-[#050505] font-semibold rounded-3xl hover:from-[#01d3dc] hover:to-[#00f5ff] transition-transform transform hover:scale-105 shadow-lg"
                >
                  Get started free
                </button>
              </div>
            )}
            {isLoggedIn && (
  <button
    onClick={(e) => {handleLogout(e)}}
    className="w-full py-4 bg-gradient-to-r from-red-500 to-pink-500 text-[#050505] font-semibold rounded-3xl hover:from-pink-500 hover:to-red-500 transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center gap-x-2"
  >
    <i className="fa-solid fa-right-from-bracket"></i> Logout
  </button>
)}
          </div>
        </div>
      )}
    </nav>
  );
};