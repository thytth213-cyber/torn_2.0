import { useEffect, useState } from "react";
import "../styles/header.css";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header.site-header");
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      header?.classList.toggle("scrolled", y > 10);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Topbar (FULL WIDTH) */}
      <div className="topbar">
        <div className="container">
          <div className="row">
            <div className="left">
              <span className="ico">+84 900 000 000</span>
              <span className="ico">contact@tornado.hk</span>
            </div>
            <div className="right">
              <a href="#projects" className="ico">Projects</a>
              <a href="#contact" className="ico">Support</a>
            </div>
          </div>
        </div>
      </div>

      {/* Header (FULL WIDTH) */}
      <header className="site-header" id="top">
        {/* ✅ container nằm ở đây để nội dung căn giữa, nền vẫn full */}
        <div className="container">
          <div className="navwrap">
            <a className="brand" href="#top" aria-label="TORNADO Home">
              <img className="brand-logo" src="/assets/logo-tornado.jpg" alt="TORNADO logo" />
              <span className="brand-text">TORNADO</span>
            </a>

            <nav className="main-nav" aria-label="Main navigation">
              <a href="#home" className="active">Home</a>
              <a href="#about">About</a>
              <a href="#services">Solutions</a>
              <a href="#projects">Projects</a>
              <a href="#pricing">Pricing</a>
              <a href="#stats">Stats</a>
              <a href="#contact">Contact</a>
            </nav>

            <div className="actions">
              <div className="search" role="search">
                <span className="magnifier" aria-hidden="true" />
                <input placeholder="Quick search: projects, pricing, contact..." />
              </div>

              <a className="btn btn-primary" href="#contact">Get a Quote</a>

              <button
                className={`hamburger ${mobileOpen ? "is-open" : ""}`}
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
              >
                <span className="bars" />
              </button>
            </div>
          </div>

          {/* Mobile panel */}
          {mobileOpen && (
            <div className="mobile-panel">
              <div className="search msearch" role="search">
                <span className="magnifier" aria-hidden="true" />
                <input placeholder="Quick search..." />
              </div>

              <div className="mnav" aria-label="Mobile navigation">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Solutions</a>
                <a href="#projects">Projects</a>
                <a href="#pricing">Pricing</a>
                <a href="#stats">Stats</a>
                <a href="#contact">Contact</a>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}