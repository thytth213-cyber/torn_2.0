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
              {/* External social links open in a new tab and use rel for security */}
              <a
                href="https://www.facebook.com/tornado"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>

              <a
                href="https://www.youtube.com/@tornado"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>

              <a
                href="https://www.linkedin.com/company/tornado"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </a>

              {/* Chat uses mailto as a fallback contact method */}
              <a href="mailto:contact@tornado.vn" aria-label="Email" rel="noopener noreferrer">
                <i className="fa-solid fa-comment-dots"></i>
              </a>
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
              <a
                href="https://www.google.com/maps/search/?api=1&query=Hanoi%2C+Vietnam"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fa-solid fa-location-dot"></i> HongKong, HongKong
              </a>

              <a href="tel:+84900000000">
                <i className="fa-solid fa-phone"></i> +84 900 000 000
              </a>

              <a href="mailto:contact@tornado.vn">
                <i className="fa-solid fa-envelope"></i> contact@tornado.hk
              </a>
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

/*
  Footer developer comments:

  - Social links currently use `href="#"`. For real external links, open in
    a new tab (`target="_blank"`) and add `rel="noopener noreferrer"` for
    security. If links are internal, use `Link` from react-router-dom.

  - Contact details are static. If they come from an API (or admin panel),
    wire them to the CMS so non-devs can update them without redeploying.

  - Consider making the copyright year derived from a build-time constant
    or environment variable if you need different licensing text per env.
*/