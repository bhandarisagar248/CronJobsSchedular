
import { useEffect, useState, useCallback } from "react";
import { Features_Example } from "./Fetures_Example";
import { Router,Link } from "react-router-dom";
import '../Css/footer.css';

export const Home = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Initialize (replaces window.onload)
  useEffect(() => {
    console.log(
      "%c✅ Chronos frontend ready for production",
      "color:#00f5ff; font-family:Space Grotesk; font-size:18px;"
    );

    const handleKeyDown = (e) => {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        console.log("Open login modal"); // replace with real modal
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ✅ Handlers (memoized)
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const navigateToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  const showSignupModal = useCallback(() => {
    console.log("Show signup modal"); // integrate modal system here
  }, []);

  const watchDemo = useCallback(() => {
    alert(
      "📽️ Demo video would play here.\n\nUse YouTube/Loom embed in production."
    );
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="pt-24 hero-bg min-h-screen flex items-center relative overflow-hidden">
        <div className="max-w-screen-2xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-center">
          
          {/* LEFT */}
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-x-2 bg-white/5 text-white/70 text-sm font-medium px-4 h-9 rounded-3xl mb-6 border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              Now supporting 12 regions • 99.99% uptime SLA
            </div>

            <h1 className="heading-font text-7xl md:text-8xl leading-[1.05] tracking-[-3px] font-semibold mb-6">
              Jobs that<br />never miss.<br />Ever.
            </h1>

            <p className="text-2xl text-white/70 mb-8 max-w-md">
              The distributed job scheduler trusted by scale-ups. Cron,
              workflows, retries, and millions of tasks — handled with zero
              downtime.
            </p>

            <div className="flex items-center gap-x-4 mb-12">
              <button
                onClick={showSignupModal}
                className="px-8 py-4 text-lg font-semibold bg-[#01d3dc] text-black rounded-3xl hover:scale-105 flex items-center gap-x-3"
              >
                <i className="fa-solid fa-play"></i>
                Start for free
              </button>

              <button
                onClick={watchDemo}
                className=" bg-[#dcdcdd] px-8 py-4 text-lg font-semibold border border-white/30 hover:border-white/60 rounded-3xl flex items-center gap-x-3"
              >
                <i className="fa-solid fa-circle-play text-[#00f5ff]"></i>
                Watch 87-second demo
              </button>
            </div>

            <div className="flex items-center gap-x-8 text-sm">
              <div className="flex -space-x-4">
                {["🇺🇸", "🇪🇺", "🇮🇳"].map((flag, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-[#1a1a1a] border-2 border-[#050505] rounded-2xl flex items-center justify-center text-xs"
                  >
                    {flag}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex text-emerald-400 text-xl">★★★★☆</div>
                <p className="text-white/60 text-sm">
                  Trusted by 4,872 engineering teams
                </p>
              </div>

              <div className="h-8 w-px bg-white/10"></div>

              <div className="text-sm">
                <span className="font-mono text-[#00f5ff]">99.99%</span>{" "}
                <span className="text-white/60">
                  uptime last 90 days
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="relative hidden md:block">
            <DashboardCard />
          </div>
        </div>

        {/* TRUST BAR */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-x-12 text-white/30 text-sm font-medium">
          {["STRIPE", "NOTION", "AIRBNB", "OPENAI", "VERCEL", "LINEAR"].map(
            (item) => (
              <div key={item}>{item}</div>
            )
          )}
        </div>
      </section>

      <Features_Example />

      {/* <Footer /> */}
    </>
  );
};

/* ================= COMPONENTS ================= */

const DashboardCard = () => {
  const jobs = [
    {
      icon: "fa-envelope",
      title: "send-welcome-email",
      desc: "Every day at 09:00 UTC • 1.2M executions",
      status: "RUNNING",
      color: "emerald",
    },
    {
      icon: "fa-credit-card",
      title: "retry-failed-payments",
      desc: "Exponential backoff • 42 retries today",
      status: "3s AGO",
      color: "amber",
    },
    {
      icon: "fa-chart-simple",
      title: "daily-analytics-pipeline",
      desc: "Finished in 14m 22s",
      status: "COMPLETED",
      color: "purple",
    },
  ];

  return (
    <div className="glass border border-white/10 rounded-3xl p-2 shadow-2xl">
      <div className="bg-[#0a0a0a] rounded-3xl p-8 relative">
        <div className="flex justify-between mb-6 text-xs uppercase tracking-widest font-mono text-white/40">
          <div className="flex items-center justify-center gap-4" style={{color:'#ffffffe6'}}>chronos <p style={{color:'red'}}> • live</p></div>
          <div style={{color:'#ffffffe6'}} className="flex items-center gap-x-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            14,872 jobs running
          </div>
        </div>

        <div className="space-y-6">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-white/5 rounded-2xl px-6 py-4"
            >
              <div style={{color:'#ffffffe6'}} className="flex items-center gap-x-4">
                <i className={`fa-solid ${job.icon}`}></i>
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-xs text-white/50">{job.desc}</p>
                </div>
              </div>
              <div className="text-xs font-mono">{job.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// const Footer = () => (
//   // <footer className="bg-black border-t border-white/10 py-16">
//   //   <div className="max-w-screen-2xl mx-auto px-8 text-white/60 text-sm">
//   //     <p>© 2026 Chronos Technologies, Inc.<br />All rights reserved.</p>
//   //   </div>
//   // </footer>
// <footer className="footer">
//   <div className="footer-container">
//     <div className="footer-grid">

//       <div className="footer-brand">
//         <div className="footer-logo">
//           <div className="footer-logo-icon">
//             <i className="fa-solid fa-clock text-black"></i>
//           </div>
//           <span className="text-[#ffffffe6]">chronos</span>
//         </div>
//         <p>Distributed job scheduling that just works.</p>
//       </div>

//       <div>
//         <div className="footer-title" style={{color:'#ffffffe6'}}>Product</div>
//         <div className="footer-links">
//           <Link to="/features">Features</Link>
//           <Link to="/examples">Examples</Link>
//           <Link to="/docs">Documentation</Link>
//           <a href="#">Templates</a>
//         </div>
//       </div>

//       <div>
//         <div className="footer-title" style={{color:'#ffffffe6'}}>Developers</div>
//         <div className="footer-links">
//           <a href="#">Documentation</a>
//           <a href="#">API Reference</a>
//           <a href="#">SDKs & CLI</a>
//           <a href="#">Status</a>
//         </div>
//       </div>

//       <div>
//         <div className="footer-title" style={{color:'#ffffffe6'}}>Company</div>
//         <div className="footer-links">
//           <a href="#">About</a>
//           <a href="#">Blog</a>
//           <a href="#">Careers</a>
//           <a href="#">Contact sales</a>
//         </div>
//       </div>

//       <div className="footer-right">
//         <div className="footer-title" style={{color:'#ffffffe6'}}>Secure • Compliant</div>
//         <div className="footer-badges">
//           <div className="footer-badge">SOC 2</div>
//           <div className="footer-badge">GDPR</div>
//           <div className="footer-badge">ISO 27001</div>
//         </div>
//         <p>© 2026 Chronos Technologies, Inc.<br />All rights reserved.</p>
//       </div>

//     </div>
//   </div>
// </footer>
// );