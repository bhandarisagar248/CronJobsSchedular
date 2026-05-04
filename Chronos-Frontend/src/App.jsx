import { useContext, useState } from 'react'
import { Navbar } from './Components/Navbar'
import { Home } from './Components/Home'
import './App.css'
import "./index.css";
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import { ForgotPassword } from './Components/ForgotPassword';
import ContextState from './ContextApi/ContextState';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VerifyOtp } from './Components/VerifyOtp';
import { Dashboard } from './Components/Dashboard';
import { CreateJobModal } from './Components/CreateJobModal';
import { CronEditor } from './Components/CronEditor';
import Features from './Components/Features';
import Examples from './Components/Examples';
import Docs from './Components/Doc';
import Footer  from './Components/Footer';
import Profile from './Components/Profile';
import ContextAPI from './ContextApi/ContextAPI';

function App() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const[showCreateJob,SetShowCreatejob]=useState(false);
    const[viewJob,setViewJob]=useState(false);

    //  const { showLogin, setShowLogin } = useContext(ContextAPI);

  return (
    <ContextState>

      <Navbar  onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
          
          />
          <CronEditor isOpen={viewJob} onClose={()=>setViewJob(false)} />

      {/* Login modal */}
      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSignupOpen={() => setShowSignup(true)}
        onForgotOpen={() => setShowForgot(true)}
      />
      <Signup
  isOpen={showSignup}
  onClose={() => setShowSignup(false)}
  onLoginOpen={() => setShowLogin(true)}
/>

<ForgotPassword
  isOpen={showForgot}
  onClose={() => setShowForgot(false)}
  onLoginOpen={() => setShowLogin(true)}
/>
<CreateJobModal isOpen={showCreateJob}
onClose={()=>SetShowCreatejob(false)} />

<Routes>
< Route path='/dashboard' element={< Dashboard onviewJob={()=>setViewJob(true)} onJobCreate={()=>SetShowCreatejob(true)} setShowLogin={()=>setShowLogin(true)} />} />
  
        
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={ <Profile />} />
        </Routes>
      <Footer />
    </ContextState>
  )
}

export default App
