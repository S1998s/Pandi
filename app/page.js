"use client";

import { useMemo, useState } from "react";

const areas = [
  "T. Nagar",
  "Nungambakkam",
  "Mylapore",
  "Egmore",
  "Central Chennai",
  "Chetpet",
  "Gopalapuram",
  "Mandaveli",
  "Nandanam",
  "R.A. Puram (Raja Annamalaipuram)",
  "Besant Nagar",
  "Adyar",
  "Thiruvanmiyur",
  "Velachery",
  "Madipakkam",
  "Pallikaranai",
  "Medavakkam",
  "Kovilambakkam",
  "Nanmangalam",
  "Keelkattalai",
  "Nanganallur",
  "Adambakkam",
  "Meenambakkam",
  "St. Thomas Mount",
  "Ekkatuthangal",
  "Guindy",
  "Saidapet",
  "Teynampet",
  "Alwarpet",
  "Jafferkhanpet",
  "Kottivakkam",
  "Palavakkam",
  "Neelankarai",
  "Injambakkam",
  "Vettuvankeni",
  "Panaiyur",
  "Pattinapakkam",
  "Marina Beach",
  "Taramani",
  "Perungudi",
  "Thoraipakkam",
  "Sholinganallur",
  "Semmancheri",
  "Navalur",
  "Padur",
  "Siruseri",
  "Kelambakkam",
  "Thaiyur",
  "Thalambur",
  "Perumbakkam",
  "Karapakkam",
  "Thiruporur",
  "Pudupakkam",
  "Vengadamangalam",
  "Rathinamangalam",
  "Kandigai",
  "Melakottaiyur",
  "Mambakkam",
  "Selaiyur",
  "Rajakilpakkam",
  "Chitlapakkam",
  "Hasthinapuram",
  "Pammal",
  "Pallavaram",
  "Chrompet",
  "Nemilichery",
  "Perungalathur",
  "Vandalur",
  "Mudichur",
  "Tambaram",
  "Urapakkam",
  "Guduvanchery",
  "Potheri",
  "Kattankulathur",
  "Maraimalai Nagar",
  "Mahindra City",
  "Padappai",
  "Avadi",
  "Pattabiram",
  "Thiruninravur",
  "Thirumazhisai",
  "Poonamallee",
  "Mangadu",
  "Kundrathur",
  "Kovur",
  "Porur",
  "Ramapuram",
  "Moulivakkam",
  "Gerugambakkam",
  "Kolapakkam",
  "Iyyappanthangal",
  "Madanandapuram",
  "Valasaravakkam",
  "Alapakkam",
  "Nerkundram",
  "Madhuravoyal",
  "Koyambedu",
  "Anna Nagar",
  "Arumbakkam",
  "Kilpauk",
  "Aminjikarai",
  "Kodambakkam",
  "Vadapalani",
  "Ashok Nagar",
  "K.K. Nagar",
  "West Mambalam",
  "Villivakkam",
  "Padi",
  "Ambattur",
  "Kolathur",
  "Madhavaram",
  "Perambur",
  "Vyasarpadi",
  "Tondiarpet",
  "Washermanpet",
  "Royapuram",
  "Triplicane",
  "Thiruvottiyur",
  "Ennore",
  "Nedunkundram",
  "Mappedu",
  "Karanai",
  "Puducherry",
  "Cosmo City",
  "West and Suburban Chennai",
];

const services = [
  {
    title: "Drum and Bearing Repair",
    desc: "Fix loud noise, grinding, and heavy spin vibration.",
    href: "services/drum-bearing-repair.html",
    badge: "Most Booked",
  },
  {
    title: "Control Board Repair",
    desc: "Fix display errors, random reset, and no-response panel faults.",
    href: "services/control-board-repair.html",
    badge: "Electronics",
  },
  {
    title: "Motor and Drive Belt",
    desc: "Fix no-spin and weak drum rotation problems quickly.",
    href: "services/motor-drive-belt-repair.html",
    badge: "Same-Day",
  },
  {
    title: "Water Pump and Drainage",
    desc: "Fix drainage blockage, pump failure, and standing water.",
    href: "services/water-pump-drainage-repair.html",
    badge: "Fast Fix",
  },
  {
    title: "Door Seal and Lock",
    desc: "Fix front-door leakage and lock mechanism issues.",
    href: "services/door-seal-lock-repair.html",
    badge: "No Leakage",
  },
  {
    title: "Heating Element Repair",
    desc: "Restore proper hot-wash cycles and temperature control.",
    href: "services/heating-element-repair.html",
    badge: "Performance",
  },
];

const processSteps = [
  ["1", "Quick Check", "Tell us the issue by call or WhatsApp."],
  ["2", "Clear Quote", "Technician confirms fault and price."],
  ["3", "Repair at Home", "Work is done with warranty support."],
];

const issues = [
  ["Water leakage", "Usually from hose, pump, or door gasket."],
  ["Not spinning", "Often motor, belt, or drum balance problem."],
  ["Power not coming", "Can be board, fuse, plug, or wiring fault."],
  ["Loud vibration", "Mostly bearing wear or suspension damage."],
  ["Not draining", "Drain pump jam or pipe blockage is common."],
  ["Error code on display", "Machine diagnostics needs code-level repair."],
];

const brandLogos = [
  ["Samsung", "/images/brands/samsung.svg"],
  ["LG", "/images/brands/lg.svg"],
  ["Whirlpool", "/images/brands/whirlpool.svg"],
  ["Bosch", "/images/brands/bosch.svg"],
  ["IFB", "/images/brands/ifb.svg"],
  ["Haier", "/images/brands/haier.svg"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllAreas, setShowAllAreas] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitFallback, setSubmitFallback] = useState(null);

  const visibleAreas = useMemo(() => {
    return showAllAreas ? areas : areas.slice(0, 12);
  }, [showAllAreas]);

  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919445959685";
  const callNumber = "+919445959685";

  const whatsappMessage =
    "Hi Wash Fix Service Chennai, I want to book a washing machine repair.";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const sendBooking = async (payload) => {
    const response = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let message = "Unable to send booking request";
      try {
        const data = await response.json();
        if (data?.message) {
          message = data.message;
        }
      } catch {
        // Keep default message when response body is not JSON.
      }
      throw new Error(message);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitFallback(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const brand = String(form.get("brand") || "").trim();
    const email = String(form.get("email") || "").trim();
    const website = String(form.get("website") || "").trim();

    if (name.length < 2 || !/^[6-9][0-9]{9}$/.test(phone)) {
      window.alert("Please enter a valid name and 10 digit mobile number.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      window.alert("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name,
      phone,
      brand,
      email,
      website,
      source: "Website Quick Booking",
    };

    try {
      try {
        await sendBooking(payload);
      } catch {
        // Retry once for temporary SMTP/network issues.
        await new Promise((resolve) => setTimeout(resolve, 800));
        await sendBooking(payload);
      }

      setSubmitted(true);
    } catch (error) {
      const fallbackMessage = `Hi Wash Fix Service Chennai, booking failed on website. Name: ${name}, Phone: ${phone}, Brand: ${brand || "Not selected"}, Email: ${email || "Not provided"}. Please confirm my booking.`;
      const fallbackWhatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(fallbackMessage)}`;
      setSubmitFallback({
        whatsapp: fallbackWhatsappUrl,
        call: `tel:${callNumber}`,
      });
      setSubmitError(error instanceof Error ? error.message : "Booking was not sent. Please use WhatsApp or call now.");

      // Auto-open WhatsApp as fallback so lead is not missed.
      window.open(fallbackWhatsappUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="site-header" id="top">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Wash Fix Service Chennai Home">
            <img src="/images/logoOnly.jpeg?v=6" alt="Wash Fix Service Chennai logo" className="brand-logo" width="56" height="56" />
            <span className="brand-name">Wash Fix Service Chennai</span>
          </a>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <a href="#services">Services</a>
            <a href="#issues">Problems</a>
            <a href="#service-areas">Areas</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="header-actions">
            <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Book on WhatsApp
            </a>
            <button
              className="menu-toggle"
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#issues" onClick={() => setMenuOpen(false)}>Problems</a>
          <a href="#service-areas" onClick={() => setMenuOpen(false)}>Areas</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            Book on WhatsApp
          </a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="pill">Same-Day Visit Available in Chennai</p>
              <h1>Washing Machine Repair at Home by Wash Fix Service</h1>
              <p>
                Quick diagnosis, transparent price, and skilled technicians for all major brands. Simple process.
                Fast response. Reliable repair.
              </p>
              <div className="hero-cta">
                <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp Now
                </a>
                <a className="btn btn-outline" href="tel:+919445959685">
                  Call +91 94459 59685
                </a>
              </div>
              <ul className="quick-points">
                <li>Checkup starts at Rs. 99</li>
                <li>180-day service warranty</li>
                <li>Support for top-load and front-load machines</li>
              </ul>
            </div>

            <aside className="hero-card" id="booking-card" aria-label="Quick booking form">
              <h2>Quick Booking</h2>
              <p>Share basic details. We will call you soon.</p>
              {!submitted && (
                <form className="booking-form" onSubmit={onSubmit}>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ display: "none" }}
                  />

                  <label htmlFor="name">Name</label>
                  <input id="name" name="name" type="text" placeholder="Your name" required />

                  <label htmlFor="phone">Phone</label>
                  <input id="phone" name="phone" type="tel" inputMode="numeric" maxLength={10} placeholder="10 digit mobile number" required />

                  <label htmlFor="email">Email (optional)</label>
                  <input id="email" name="email" type="email" placeholder="yourmail@example.com" />

                  <label htmlFor="brand">Machine Brand</label>
                  <select id="brand" name="brand">
                    <option value="">Select brand</option>
                    <option>Samsung</option>
                    <option>LG</option>
                    <option>Whirlpool</option>
                    <option>Bosch</option>
                    <option>IFB</option>
                    <option>Haier</option>
                    <option>Godrej</option>
                    <option>Other</option>
                  </select>

                  <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Confirm Booking"}
                  </button>
                  {submitError && <small className="booking-error">{submitError}</small>}
                  {submitFallback && (
                    <div className="booking-fallback-actions">
                      <a className="btn btn-outline" href={submitFallback.whatsapp} target="_blank" rel="noopener noreferrer">
                        Send on WhatsApp
                      </a>
                      <a className="btn btn-primary" href={submitFallback.call}>
                        Call Now
                      </a>
                    </div>
                  )}
                  <small>We usually respond within 30 minutes.</small>
                </form>
              )}
              {submitted && (
                <div className="booking-success">
                  <h3>Booking Received</h3>
                  <p>Thanks. Our team will contact you shortly.</p>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="brands" aria-label="Major brands we repair">
          <div className="container">
            <p className="brands__title">We repair all major brands</p>
            <div className="brands__track">
              <div className="brands__rail">
                {brandLogos.map(([name, src]) => (
                  <img key={name} src={src} alt={name} className="brands__logo" />
                ))}
                {brandLogos.map(([name, src]) => (
                  <img key={`${name}-dup`} src={src} alt="" aria-hidden="true" className="brands__logo" />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="services">
          <div className="container">
            <p className="section-kicker">Our Services</p>
            <h2>Repair Solutions for Every Major Fault</h2>
            <div className="process-row" role="list" aria-label="How our service works">
              {processSteps.map(([num, title, desc]) => (
                <article className="process-step" key={num} role="listitem">
                  <span className="process-step__num" aria-hidden="true">{num}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>

            <div className="service-mosaic">
              <article className="service-featured">
                <p className="service-featured__eyebrow">Doorstep Expert Service</p>
                <h3>Complete Repair Support for Top-Load and Front-Load Machines</h3>
                <p>
                  From quick electrical faults to deep mechanical repairs, Wash Fix Service technicians handle every
                  step at your home with a clear quote and warranty.
                </p>
                <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Start Booking
                </a>
              </article>

              <div className="service-compact-grid">
                {services.map((service) => (
                  <article className="service-compact" key={service.title}>
                    <p className="service-compact__badge">{service.badge}</p>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                    <a href={service.href}>View Service</a>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section-soft" id="issues">
          <div className="container">
            <p className="section-kicker">Common Problems</p>
            <h2>Spot the Issue, Then Book in One Tap</h2>
            <div className="issue-grid" role="list" aria-label="Common washing machine issues">
              {issues.map(([title, note]) => (
                <article className="issue-card" key={title} role="listitem">
                  <h3>{title}</h3>
                  <p>{note}</p>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    Book This Problem
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-soft">
          <div className="container">
            <p className="section-kicker">Customer Trust</p>
            <h2>Why Families Choose Wash Fix Service</h2>
            <div className="cards three-col">
              <article className="card">
                <h3>Fast Response</h3>
                <p>Same-day support in many Chennai locations.</p>
              </article>
              <article className="card">
                <h3>Clear Pricing</h3>
                <p>No hidden fee. Work starts only after your approval.</p>
              </article>
              <article className="card">
                <h3>Warranty Support</h3>
                <p>180-day warranty on completed repair work.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="service-areas">
          <div className="container">
            <p className="section-kicker">Service Coverage</p>
            <h2>Top Service Areas in Chennai and Nearby</h2>
            <p className="section-intro">
              We cover core Chennai plus nearby suburbs for doorstep washing machine repair.
            </p>
            <div className="areas-list">
              {visibleAreas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
            <div className="areas-action">
              <button className="btn btn-outline" type="button" onClick={() => setShowAllAreas((v) => !v)}>
                {showAllAreas ? "Show Fewer Areas" : `View All ${areas.length} Areas`}
              </button>
            </div>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container contact-box">
            <div>
              <p className="section-kicker">Contact</p>
              <h2>Book Repair with Wash Fix Service Chennai</h2>
              <p className="section-intro">Call us or message on WhatsApp for faster booking.</p>
            </div>
            <div className="contact-actions">
              <a className="btn btn-outline" href="tel:+919445959685">
                Call +91 94459 59685
              </a>
              <a className="btn btn-primary" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp Booking
              </a>
              <a className="mail-link" href="mailto:washfixchennai@gmail.com">
                washfixchennai@gmail.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>Copyright 2026 Wash Fix Service Chennai. All rights reserved.</p>
          <p>washfixservice.in</p>
        </div>
      </footer>

      <div className="floating-cta" role="region" aria-label="Quick actions">
        <a href="tel:+919445959685" className="btn btn-outline">
          Call
        </a>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          WhatsApp
        </a>
      </div>
    </>
  );
}
