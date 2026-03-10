import { useEffect, useState } from "react";
import "../styles/header.css";
import { getLogo as apiGetLogo } from "../api/settingsApi";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

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

  // fetch logo from backend settings on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGetLogo();
        if (mounted && data && data.logoUrl) {
          // If the stored logoUrl is a path (e.g. "/uploads/x.jpg")
          // prefix it with the API base so the browser requests the
          // image from the backend server instead of the Vite dev server.
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
          const raw = data.logoUrl || '';
          const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
          setLogoUrl(final);
        }
      } catch (err) {
        // ignore - fallback to static logo
        console.warn('Could not fetch site logo', err);
      }
    })();

    // listen for live updates emitted by admin UI
    const onUpdate = (e) => {
      if (e && e.detail && e.detail.logoUrl) setLogoUrl(e.detail.logoUrl);
    };
    window.addEventListener('siteLogoUpdated', onUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('siteLogoUpdated', onUpdate);
    };
  }, []);

  /*
    Header developer comments:

    - Accessibility: ensure interactive elements have keyboard support (hamburger
      button has aria-expanded but ensure focus styles and keyboard navigation
      for the mobile panel). Consider trapping focus inside the mobile panel
      when it's open, or ensure `tabindex` order is logical.

    - Navigation: when using React Router, prefer `NavLink`/`Link` from
      `react-router-dom` for internal navigation instead of anchor tags with
      hash fragments, unless you intentionally want in-page anchors. Using
      `Link` avoids full-page reloads and integrates with SPA routing.

    - Performance: the `onScroll` handler toggles a class; consider
      debouncing/throttling if heavy work is added. Right now it's light so
      it's acceptable, but keep an eye on reflows caused by complex handlers.

    - Search input: currently uncontrolled and purely visual. If this is a
      functional search, debounce user input before performing queries to avoid
      excessive requests. If it's decorative, mark it with aria-hidden or
      provide an accessible label/placeholder.

    - Images and assets: ensure the `/assets/logo-tornado.jpg` path lives in
      `public/assets` so Vite serves it correctly. Consider adding a small
      `alt` description (you already have alt — keep it meaningful).
  */

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
            <div className="site-logo">
              <a className="brand" href="#top" aria-label="">
                <img className="brand-logo" src={logoUrl || "/assets/logo-tornado.jpg"} alt="" />
              </a>
            </div>

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

              {/* Sign in link - navigates to admin login */}
              <a className="signin" href="/admin">Sign in</a>

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