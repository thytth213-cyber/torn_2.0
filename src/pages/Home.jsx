import { useEffect, useRef } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Autoplay, Pagination, EffectFade, Navigation } from "swiper/modules";
import "../styles/home.css";

export default function Home() {
  const heroSwiperRef = useRef(null);
  const projectSwiperRef = useRef(null);

  useEffect(() => {
    // HERO Swiper
    heroSwiperRef.current = new Swiper("#heroSwiper", {
      modules: [Autoplay, Pagination, EffectFade],
      loop: true,
      effect: "fade",
      fadeEffect: { crossFade: true },
      speed: 900,
      autoplay: { delay: 4200, disableOnInteraction: false },
      pagination: { el: "#heroPagination", clickable: true },
    });

    const animateHeroText = () => {
      document.querySelectorAll(".animate-on-slide").forEach((el) => el.classList.remove("is-animate"));
      const active = document.querySelector("#heroSwiper .swiper-slide-active .animate-on-slide");
      if (!active) return;
      void active.offsetWidth; 
      active.classList.add("is-animate");
    };

    heroSwiperRef.current.on("init", animateHeroText);
    heroSwiperRef.current.on("slideChangeTransitionStart", animateHeroText);
    animateHeroText();

    // Projects Swiper
    projectSwiperRef.current = new Swiper("#projectSwiper", {
      modules: [Pagination, Navigation],
      slidesPerView: 1,
      spaceBetween: 16,
      loop: true,
      pagination: { el: "#projectSwiper .swiper-pagination", clickable: true },
      navigation: { nextEl: "#nextBtn", prevEl: "#prevBtn" },
      breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
    });

    // Counter
    const statsGrid = document.getElementById("statsGrid");
    let counted = false;

    function countUp(el, target, durationMs) {
      const start = 0;
      const startTime = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - startTime) / durationMs);
        const val = Math.floor(start + (target - start) * p);
        el.textContent = val.toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !counted) {
            counted = true;
            document.querySelectorAll(".count").forEach((el) => {
              const target = Number(el.dataset.target || 0);
              countUp(el, target, 1400);
            });
          }
        });
      },
      { threshold: 0.35 }
    );

    if (statsGrid) io.observe(statsGrid);

    return () => {
      io.disconnect();
      heroSwiperRef.current?.destroy?.(true, true);
      projectSwiperRef.current?.destroy?.(true, true);
    };
  }, []);

  return (
    <main className="app-main">
      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="hero-section">
        <div className="swiper" id="heroSwiper">
          <div className="swiper-wrapper">
            {/* Slide 1 */}
            <div className="swiper-slide hero-slide">
              <div className="container">
                <div className="hero-slide-content">
                  <div className="hero-content">
                    <div className="animate-on-slide">
                      <h1>Digital Solutions That Drive Growth</h1>
                    </div>
                    <div className="animate-on-slide" style={{ transitionDelay: "0.1s" }}>
                      <p>Transform your business with cutting-edge technology and innovative strategies</p>
                    </div>
                    <div className="animate-on-slide" style={{ transitionDelay: "0.2s" }}>
                      <a href="#contact" className="btn btn-primary">Get Started Now</a>
                    </div>
                  </div>
                  <div className="hero-image">
                    <div className="placeholder-image">01</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="swiper-slide hero-slide">
              <div className="container">
                <div className="hero-slide-content">
                  <div className="hero-content">
                    <div className="animate-on-slide">
                      <h1>Custom Development Services</h1>
                    </div>
                    <div className="animate-on-slide" style={{ transitionDelay: "0.1s" }}>
                      <p>Build scalable applications tailored to your exact business needs</p>
                    </div>
                    <div className="animate-on-slide" style={{ transitionDelay: "0.2s" }}>
                      <a href="#contact" className="btn btn-primary">Learn More</a>
                    </div>
                  </div>
                  <div className="hero-image">
                    <div className="placeholder-image">02</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="swiper-slide hero-slide">
              <div className="container">
                <div className="hero-slide-content">
                  <div className="hero-content">
                    <div className="animate-on-slide">
                      <h1>Expert Tech Consulting</h1>
                    </div>
                    <div className="animate-on-slide" style={{ transitionDelay: "0.1s" }}>
                      <p>Strategic guidance to optimize your digital infrastructure</p>
                    </div>
                    <div className="animate-on-slide" style={{ transitionDelay: "0.2s" }}>
                      <a href="#contact" className="btn btn-primary">Consult Now</a>
                    </div>
                  </div>
                  <div className="hero-image">
                    <div className="placeholder-image">03</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="swiper-pagination" id="heroPagination"></div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>About TORNADO</h2>
            <p>Leading digital innovation since 2020</p>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <h3>Who We Are</h3>
              <p>TORNADO is a forward-thinking technology company specializing in digital transformation, custom software development, and strategic consulting for businesses of all sizes.</p>
              <p>Our mission is to empower organizations through innovative technology solutions that drive real business value and sustainable growth.</p>
              <ul className="about-list">
                <li>✓ 100+ Successful Projects</li>
                <li>✓ 50+ Team Members</li>
                <li>✓ 20+ Years Combined Experience</li>
                <li>✓ 95% Client Satisfaction Rate</li>
              </ul>
            </div>
            <div className="about-image">
              <div className="placeholder-large">About Image</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOLUTIONS SECTION ===== */}
      <section id="services" className="solutions-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Solutions</h2>
            <p>Comprehensive services tailored to your needs</p>
          </div>
          <div className="solutions-grid">
            <div className="solution-card">
              <div className="solution-icon">💻</div>
              <h3>Web Development</h3>
              <p>Modern, responsive websites and web applications built with latest technologies</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📱</div>
              <h3>Mobile Apps</h3>
              <p>Native and cross-platform mobile applications for iOS and Android</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">☁️</div>
              <h3>Cloud Solutions</h3>
              <p>Scalable cloud infrastructure and migration services for enterprises</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🔐</div>
              <h3>Cybersecurity</h3>
              <p>Comprehensive security solutions to protect your digital assets</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📊</div>
              <h3>Data Analytics</h3>
              <p>Advanced analytics and business intelligence for data-driven decisions</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🤖</div>
              <h3>AI & Automation</h3>
              <p>Artificial intelligence and automation solutions for efficiency</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section id="projects" className="projects-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Projects</h2>
            <p>Showcase of our recent work</p>
          </div>
          <div className="swiper" id="projectSwiper">
            <div className="swiper-wrapper">
              <div className="swiper-slide project-slide">
                <div className="project-card">
                  <div className="project-image">
                    <div className="placeholder-project">Project 1</div>
                  </div>
                  <div className="project-info">
                    <h3>E-Commerce Platform</h3>
                    <p>Full-featured e-commerce solution with payment integration</p>
                    <a href="#" className="project-link">View Case Study →</a>
                  </div>
                </div>
              </div>
              <div className="swiper-slide project-slide">
                <div className="project-card">
                  <div className="project-image">
                    <div className="placeholder-project">Project 2</div>
                  </div>
                  <div className="project-info">
                    <h3>Mobile Health App</h3>
                    <p>Healthcare mobile application with telemedicine features</p>
                    <a href="#" className="project-link">View Case Study →</a>
                  </div>
                </div>
              </div>
              <div className="swiper-slide project-slide">
                <div className="project-card">
                  <div className="project-image">
                    <div className="placeholder-project">Project 3</div>
                  </div>
                  <div className="project-info">
                    <h3>Enterprise Dashboard</h3>
                    <p>Advanced analytics dashboard for corporate clients</p>
                    <a href="#" className="project-link">View Case Study →</a>
                  </div>
                </div>
              </div>
              <div className="swiper-slide project-slide">
                <div className="project-card">
                  <div className="project-image">
                    <div className="placeholder-project">Project 4</div>
                  </div>
                  <div className="project-info">
                    <h3>SaaS Management Tool</h3>
                    <p>Cloud-based software as a service platform</p>
                    <a href="#" className="project-link">View Case Study →</a>
                  </div>
                </div>
              </div>
            </div>
            <button id="prevBtn" className="project-nav prev">❮</button>
            <button id="nextBtn" className="project-nav next">❯</button>
            <div className="swiper-pagination"></div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2>Pricing Plans</h2>
            <p>Flexible options for every budget</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <h3>Starter</h3>
              <div className="price">$2,999</div>
              <p className="price-note">One-time project</p>
              <ul className="pricing-features">
                <li>✓ Web Design & Development</li>
                <li>✓ 5 Pages</li>
                <li>✓ Mobile Responsive</li>
                <li>✓ 1 Month Support</li>
                <li>✗ SSL Certificate</li>
              </ul>
              <button className="btn btn-outline">Choose Plan</button>
            </div>
            <div className="pricing-card featured">
              <div className="badge">Most Popular</div>
              <h3>Professional</h3>
              <div className="price">$9,999</div>
              <p className="price-note">One-time project</p>
              <ul className="pricing-features">
                <li>✓ Full Web Solution</li>
                <li>✓ Unlimited Pages</li>
                <li>✓ E-Commerce Ready</li>
                <li>✓ 6 Months Support</li>
                <li>✓ SSL Certificate</li>
              </ul>
              <button className="btn btn-primary">Choose Plan</button>
            </div>
            <div className="pricing-card">
              <h3>Enterprise</h3>
              <div className="price">Custom</div>
              <p className="price-note">Tailored solution</p>
              <ul className="pricing-features">
                <li>✓ Complete Custom Solution</li>
                <li>✓ Dedicated Team</li>
                <li>✓ Advanced Features</li>
                <li>✓ 12 Months Support</li>
                <li>✓ Priority Support</li>
              </ul>
              <button className="btn btn-outline">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARTNERS SECTION ===== */}
      <section id="partners" className="partners-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Partners & Clients</h2>
            <p>Trusted by industry-leading companies</p>
          </div>
          <div className="partners-grid">
            <div className="partner-card">
              <div className="partner-logo">
                <span>Partner 1</span>
              </div>
            </div>
            <div className="partner-card">
              <div className="partner-logo">
                <span>Partner 2</span>
              </div>
            </div>
            <div className="partner-card">
              <div className="partner-logo">
                <span>Partner 3</span>
              </div>
            </div>
            <div className="partner-card">
              <div className="partner-logo">
                <span>Partner 4</span>
              </div>
            </div>
            <div className="partner-card">
              <div className="partner-logo">
                <span>Partner 5</span>
              </div>
            </div>
            <div className="partner-card">
              <div className="partner-logo">
                <span>Partner 6</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section id="stats" className="stats-section">
        <div className="container">
          <div id="statsGrid" className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">
                <span className="count" data-target="150">0</span>+
              </div>
              <div className="stat-label">Projects Delivered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <span className="count" data-target="50">0</span>+
              </div>
              <div className="stat-label">Happy Clients</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <span className="count" data-target="100">0</span>+
              </div>
              <div className="stat-label">Team Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                <span className="count" data-target="15">0</span>+
              </div>
              <div className="stat-label">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>Have a project in mind? Let's talk!</p>
          </div>
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="info-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <h4>Location</h4>
                  <p>Hanoi, Vietnam</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <h4>Phone</h4>
                  <p>+84 900 000 000</p>
                </div>
              </div>
              <div className="info-item">
                <i className="fa-solid fa-envelope"></i>
                <div>
                  <h4>Email</h4>
                  <p>contact@tornado.vn</p>
                </div>
              </div>
            </div>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" rows="5" required></textarea>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}