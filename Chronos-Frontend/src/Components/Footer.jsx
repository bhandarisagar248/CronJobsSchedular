import { Link } from "react-router-dom";
const Footer = () => {
  // <footer className="bg-black border-t border-white/10 py-16">
  //   <div className="max-w-screen-2xl mx-auto px-8 text-white/60 text-sm">
  //     <p>© 2026 Chronos Technologies, Inc.<br />All rights reserved.</p>
  //   </div>
  // </footer>
  return(
    <>
    
<footer className="footer">
  <div className="footer-container">
    <div className="footer-grid">

      <div className="footer-brand">
        <div className="footer-logo">
          <div className="footer-logo-icon">
            <i className="fa-solid fa-clock text-black"></i>
          </div>
          <span className="text-[#ffffffe6]">chronos</span>
        </div>
        <p>Distributed job scheduling that just works.</p>
      </div>

      <div>
        <div className="footer-title" style={{color:'#ffffffe6'}}>Product</div>
        <div className="footer-links">
          <Link to="/features">Features</Link>
          <Link to="/examples">Examples</Link>
          <Link to="/docs">Documentation</Link>
          <a href="#">Templates</a>
        </div>
      </div>

      <div>
        <div className="footer-title" style={{color:'#ffffffe6'}}>Developers</div>
        <div className="footer-links">
          <a href="#">Documentation</a>
          <a href="#">API Reference</a>
          <a href="#">SDKs & CLI</a>
          <a href="#">Status</a>
        </div>
      </div>

      <div>
        <div className="footer-title" style={{color:'#ffffffe6'}}>Company</div>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Blog</a>
          <a href="#">Careers</a>
          <a href="#">Contact sales</a>
        </div>
      </div>

      <div className="footer-right">
        <div className="footer-title" style={{color:'#ffffffe6'}}>Secure • Compliant</div>
        <div className="footer-badges">
          <div className="footer-badge">SOC 2</div>
          <div className="footer-badge">GDPR</div>
          <div className="footer-badge">ISO 27001</div>
        </div>
        <p>© 2026 Chronos Technologies, Inc.<br />All rights reserved.</p>
      </div>
    </div>
  </div>
</footer>
    </>
  )
};
export default Footer;