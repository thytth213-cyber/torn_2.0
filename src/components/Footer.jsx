import "../styles/footer.css";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src="/assets/logo-tornado.jpg"
                alt="TORNADO logo"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: "#fff",
                  padding: 3,
                  border: "1px solid rgba(255,255,255,.14)",
                }}
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div style={{ fontWeight: 900, color: "#fff", letterSpacing: ".4px" }}>TORNADO</div>
            </div>

            <p style={{ marginTop: 10 }}>
              Full one-page template: header, hero slider, projects slider, pricing, counter, newsletter, contact, footer.
            </p>

            <div className="social" style={{ marginTop: 14 }}>
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube"></i></a>
              <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" aria-label="Chat"><i className="fa-solid fa-comment-dots"></i></a>
            </div>
          </div>

          <div>
            <h4>Links</h4>
            <div className="f-links">
              <a href="#about">About</a>
              <a href="#services">Solutions</a>
              <a href="#projects">Projects</a>
              <a href="#pricing">Pricing</a>
            </div>
          </div>

          <div>
            <h4>Resources</h4>
            <div className="f-links">
              <a href="#stats">Stats</a>
              <a href="#contact">Support</a>
              <a href="#top">Back to top</a>
            </div>
          </div>

          <div>
            <h4>Contact</h4>
            <div className="f-links">
              <a href="#"><i className="fa-solid fa-location-dot"></i> Hanoi, Vietnam</a>
              <a href="#"><i className="fa-solid fa-phone"></i> +84 900 000 000</a>
              <a href="#"><i className="fa-solid fa-envelope"></i> contact@tornado.vn</a>
            </div>
          </div>
        </div>

        <div className="copyright">
          <span>© {new Date().getFullYear()} TORNADO. All rights reserved.</span>
          <span>Single file • React + Vite</span>
        </div>
      </div>
    </footer>
  );
}