import { useEffect, useRef, useState } from "react";
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
  const heroAutoplayFallbackRef = useRef(null);
  const [heroSlides, setHeroSlides] = useState([]);
  const [projectItems, setProjectItems] = useState([]);
  const [aboutItem, setAboutItem] = useState(null);

  // Safe local fallback slides used only to ensure the hero always shows 3 slides
  const fallbackSlides = [
    {
      _id: 'f-1',
      title: 'Digital Solutions That Drive Growth',
      body: 'Transform your business with cutting-edge technology and innovative strategies',
      resolvedMediaUrl:
        'https://images.unsplash.com/photo-1529336953123-6fa0b3f1a5f9?auto=format&fit=crop&w=1920&q=80',
    },
    {
      _id: 'f-2',
      title: 'Custom Development Services',
      body: 'Build scalable applications tailored to your exact business needs',
      resolvedMediaUrl:
        'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1920&q=80',
    },
    {
      _id: 'f-3',
      title: 'Expert Tech Consulting',
      body: 'Strategic guidance to optimize your digital infrastructure',
      resolvedMediaUrl:
        'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1920&q=80',
    },
  ];

  // heroToRender is the array actually rendered: prefer DB slides, but supplement with fallbacks up to 3 slides
  const heroToRender = (heroSlides && heroSlides.length > 0)
    ? [...heroSlides, ...fallbackSlides].slice(0, 3)
    : [];

  useEffect(() => {
    // Fetch dynamic content (hero slides, projects) from the content API
    // so uploaded images saved in the admin panel appear on the home page.
    let mounted = true;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    (async () => {
      try {
        const { fetchContent } = await import("../api/contentApi");
        const all = await fetchContent();
        if (!mounted) return;
        // robust section matching: trim + lowercase to avoid casing/whitespace issues
        const normalizedSection = (s) => (s || "").toString().trim().toLowerCase();
        const heroes = all.filter((c) => normalizedSection(c.section) === "home-hero");
        const projects = all
          .filter((c) => normalizedSection(c.section) === "home-projects")
          .sort((a, b) => (Number(a.order || 0) - Number(b.order || 0)));
        const about = all.find((c) => normalizedSection(c.section) === "home-about") || null;

        // Normalize media URLs to absolute when necessary
        const normalize = (item) => {
          if (!item) return item;
          const raw = item.mediaUrl || item.image || "";
          const final = raw && !/^https?:\/\//i.test(raw) ? `${API_URL}${raw}` : raw;
          return Object.assign({}, item, { resolvedMediaUrl: final });
        };

  setHeroSlides(heroes.map(normalize));
  setProjectItems(projects.map(normalize));
  setAboutItem(about ? normalize(about) : null);
      } catch (err) {
        console.warn("Failed to load home content:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // initialize Swiper instances once slides are rendered/updated
  useEffect(() => {
    // HERO Swiper
  if (heroToRender.length > 0) {
      heroSwiperRef.current?.destroy?.(true, true);

      const animateHeroText = () => {
        document.querySelectorAll(".animate-on-slide").forEach((el) => el.classList.remove("is-animate"));
        const active = document.querySelector("#heroSwiper .swiper-slide-active .animate-on-slide");
        if (!active) return;
        void active.offsetWidth;
        active.classList.add("is-animate");
      };

      heroSwiperRef.current = new Swiper("#heroSwiper", {
        modules: [Autoplay, Pagination, EffectFade],
        loop: true,
        effect: "fade",
        fadeEffect: { crossFade: true },
        speed: 900,
        autoplay: { delay: 4200, disableOnInteraction: false },
        pagination: { el: "#heroPagination", clickable: true },
        // Observe DOM changes so Swiper updates when React renders slides
        observer: true,
        observeParents: true,
        // register event handlers early via the `on` option
        on: {
          init() {
            animateHeroText();
          },
          slideChangeTransitionStart() {
            animateHeroText();
          },
        },
      });

      // ensure Swiper recalculates sizes and starts autoplay
      setTimeout(() => {
        try {
          heroSwiperRef.current.update?.();
          // ensure first animation runs
          animateHeroText();

          // Try to start autoplay; if autoplay isn't running (CSS or module issues),
          // fall back to a safe interval that calls slideNext so slides advance.
          const delay = (heroSwiperRef.current.params?.autoplay?.delay) || 4200;
          // clear any previous fallback
          if (heroAutoplayFallbackRef.current) {
            clearInterval(heroAutoplayFallbackRef.current);
            heroAutoplayFallbackRef.current = null;
          }

          // Only attempt autoplay if there's more than one slide
          const slideCount = document.querySelectorAll('#heroSwiper .swiper-slide').length;
          if (slideCount > 1) {
            // prefer the built-in autoplay if available
            try {
              if (heroSwiperRef.current.autoplay && typeof heroSwiperRef.current.autoplay.start === 'function') {
                heroSwiperRef.current.autoplay.start();
              }
            } catch (e) {
              // ignore
            }

            // if autoplay still not active after a short delay, use fallback interval
            setTimeout(() => {
              const autoplayRunning = !!(heroSwiperRef.current && heroSwiperRef.current.autoplay && heroSwiperRef.current.autoplay.running);
              if (!autoplayRunning) {
                heroAutoplayFallbackRef.current = setInterval(() => {
                  try { heroSwiperRef.current.slideNext(); } catch (e) { /* ignore */ }
                }, delay + 100);
              }
            }, 200);
          }
        } catch (e) {
          console.warn('Swiper hero update failed', e);
        }
  }, 120);
    }

    // Projects Swiper
    if (projectItems.length > 0) {
      projectSwiperRef.current?.destroy?.(true, true);
      projectSwiperRef.current = new Swiper("#projectSwiper", {
        modules: [Pagination, Navigation],
        slidesPerView: 1,
        spaceBetween: 16,
        loop: true,
        pagination: { el: "#projectSwiper .swiper-pagination", clickable: true },
        navigation: { nextEl: "#nextBtn", prevEl: "#prevBtn" },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
        observer: true,
        observeParents: true,
      });

      // update sizes after render
      setTimeout(() => {
        try {
          projectSwiperRef.current.update?.();
        } catch (e) {
          console.warn('Swiper project update failed', e);
        }
      }, 50);
    }

    return () => {
      // cleanup: destroy swipers and clear fallback interval
      try {
        heroSwiperRef.current?.destroy?.(true, true);
      } catch (e) { /* ignore */ }
      try {
        projectSwiperRef.current?.destroy?.(true, true);
      } catch (e) { /* ignore */ }
      if (heroAutoplayFallbackRef.current) {
        clearInterval(heroAutoplayFallbackRef.current);
        heroAutoplayFallbackRef.current = null;
      }
    };
  }, [heroSlides, projectItems]);

  useEffect(() => {
    // debug logs so you can inspect arrays in the browser console
    console.debug("Home content - heroSlides:", heroSlides);
    console.debug("Home content - projectItems:", projectItems);
    console.debug("Home content - aboutItem:", aboutItem);
  }, [heroSlides, projectItems, aboutItem]);

  // Stats count-up: animate numbers when the stats section scrolls into view
  useEffect(() => {
    let observer = null;

    const animateCounts = () => {
      const counts = Array.from(document.querySelectorAll('.count'));
      counts.forEach((el) => {
        const target = Number(el.getAttribute('data-target')) || 0;
        const duration = 1500; // ms
        const start = 0;
        let startTime = null;

        const step = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const value = Math.floor(progress * (target - start) + start);
          el.textContent = value;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target;
          }
        };

        // start animation
        requestAnimationFrame(step);
      });
    };

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounts();
            if (observer) observer.disconnect();
          }
        });
      }, { threshold: 0.3 });

      const el = document.querySelector('#stats');
      if (el) observer.observe(el);
    } else {
      // fallback: run immediately
      animateCounts();
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <main className="app-main">
      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="hero-section">
        <div className="swiper" id="heroSwiper">
          <div className="swiper-wrapper">
            {heroToRender.length > 0 ? (
              heroToRender.map((item, idx) => (
                <div key={item._id || `hero-${idx}`} className="swiper-slide hero-slide">
                  {/* Background div (no <img> tags) */}
                  <div
                    className="hero-bg"
                    style={{
                      backgroundImage: item.resolvedMediaUrl ? `url(${item.resolvedMediaUrl})` : undefined,
                    }}
                  />

                  <div className="container">
                    <div className="hero-slide-content">
                      <div className="hero-content">
                        <div className="animate-on-slide">
                          <h1>{item.title || ""}</h1>
                        </div>
                        <div className="animate-on-slide" style={{ transitionDelay: "0.1s" }}>
                          <p>{item.body || ""}</p>
                        </div>
                        <div className="animate-on-slide" style={{ transitionDelay: "0.2s" }}>
                          <a href="#contact" className="btn btn-primary">Learn More</a>
                        </div>
                      </div>
                      <div className="hero-image">
                        {/* show numbered placeholder if no image */}
                        {!item.resolvedMediaUrl && (
                          <div className="placeholder-image">{String(idx + 1).padStart(2, "0")}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // fallback: keep original static slides if no dynamic content
              <>
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
              </>
            )}
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
              {aboutItem && aboutItem.resolvedMediaUrl ? (
                <img className="about-image-img" src={aboutItem.resolvedMediaUrl} alt={aboutItem.title || "About"} />
              ) : (
                <div className="placeholder-large">About Image</div>
              )}
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
              {projectItems.length > 0 ? (
                projectItems.map((p, i) => (
                  <div key={p._id || i} className="swiper-slide project-slide">
                    <div className="project-card">
                      <div className="project-image">
                        {p.resolvedMediaUrl ? (
                          <img className={`project-image-${i + 1}`} src={p.resolvedMediaUrl} alt={p.title || `Project ${i + 1}`} />
                        ) : (
                          <div className="placeholder-project">Project {i + 1}</div>
                        )}
                      </div>
                      <div className="project-info">
                        <h3>{p.title || `Project ${i + 1}`}</h3>
                        <p>{p.body || ""}</p>
                        <a href="#" className="project-link">View Case Study →</a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // fallback static slides
                <>
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
                </>
              )}
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