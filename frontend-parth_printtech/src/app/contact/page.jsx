"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import gsap from "gsap";
import styles from "./Contact.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_API_URL || "https://updatedparthprinttech.onrender.com/api";

const ContactPage = () => {
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "Custom Packaging",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Live Contact Content State
  const [contactData, setContactData] = useState({
    header: {
      title: "Let's craft",
      titleHighlight: "something remarkable",
      titleRest: "together",
      description: "Have a custom packaging design in mind or require gravure printing specs? Our packaging specialists are ready to calibrate your next project."
    },
    cards: {
      email: "info@parthprinttech.com",
      emailHint: "Click to open mail client",
      phone: "+91 99788 88056",
      phone2: "+91 97247 77606",
      phoneHint: "Mon - Sat, 9am - 7pm IST",
      responseTime: "Under 24 Hours",
      responseTimeHint: "Our engineering team will review your specs within 1 business day."
    },
    map: {
      city: "KALOL",
      state: "Gandhinagar, Gujarat",
      address: "47/8, G.I.D.C., Kalol - 382725 (N.G.), Dist. Gandhinagar, Gujarat, India.",
      mapLink: "https://maps.google.com/?q=GIDC+Kalol+Gandhinagar+Gujarat+India"
    },
    socials: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
      dribbble: "https://dribbble.com",
      github: "https://github.com"
    },
    trustBadges: [
      "Private & secure",
      "24hr reply",
      "No spam ever"
    ]
  });

  // Fetch Live Contact Page Data
  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch(`${API_BASE}/contact`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setContactData(prev => ({
              ...prev,
              ...json.data,
              header: { ...prev.header, ...(json.data.header || {}) },
              cards: { ...prev.cards, ...(json.data.cards || {}) },
              map: { ...prev.map, ...(json.data.map || {}) },
              socials: { ...prev.socials, ...(json.data.socials || {}) },
              trustBadges: Array.isArray(json.data.trustBadges) ? json.data.trustBadges : prev.trustBadges
            }));
          }
        }
      } catch (err) {
        console.warn("Using default contact content:", err);
      }
    }
    fetchContact();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal headline & details
      gsap.fromTo(
        ".contact-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    }, containerRef);

    // Parse subject & desc from URL params client-side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const subjectParam = params.get("subject");
      const descParam = params.get("desc");
      
      let updatedData = {};
      
      if (subjectParam) {
        let mappedSubject = "Custom Packaging";
        const lower = subjectParam.toLowerCase();
        if (lower.includes("rigid") || lower.includes("luxury")) {
          mappedSubject = "Rigid Boxes";
        } else if (lower.includes("label") || lower.includes("sticker") || lower.includes("print")) {
          mappedSubject = "Gravure Printing";
        }
        updatedData.subject = mappedSubject;
      }
      
      if (descParam) {
        updatedData.message = descParam;
      }
      
      if (Object.keys(updatedData).length > 0) {
        const timer = setTimeout(() => {
          setFormData(prev => ({ ...prev, ...updatedData }));
        }, 0);
        return () => {
          clearTimeout(timer);
          ctx.revert();
        };
      }
    }

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setSubmitted(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "Custom Packaging",
          message: ""
        });
      } else {
        setErrorMsg(resJson.message || "Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback display if network issue
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const { header, cards, map, socials, trustBadges } = contactData;

  return (
    <>
      <Navbar />
      <main ref={containerRef} className={styles.mainContainer}>
        {/* Blueprint drafting grids */}
        <div className={styles.blueprintOverlay}></div>

        <div className={styles.container}>
          
          {/* Editorial Headline */}
          <div className={`${styles.header} contact-reveal`}>
            <h1 className={styles.headline}>
              {header.title}{" "}
              <span className={styles.accentText}>{header.titleHighlight}</span>{" "}
              {header.titleRest}
            </h1>
            <p className={styles.description}>
              {header.description}
            </p>
          </div>

          <div className={`${styles.layoutGrid} contact-reveal`}>
            
            {/* Left Column: Info Cards & Stylized Map */}
            <div className={styles.infoColumn}>
              
              {/* Info Cards Container */}
              <div className={styles.infoCardsGrid}>
                {/* Email Info Card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <h3 className={styles.cardTitle}>Email Us</h3>
                  </div>
                  <a href={`mailto:${cards.email}`} className={styles.cardLink}>
                    {cards.email}
                  </a>
                  <p className={styles.cardHint}>{cards.emailHint}</p>
                </div>

                {/* Phone Info Card */}
                <div className={styles.infoCard}>
                  <div className={styles.cardHeader}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <h3 className={styles.cardTitle}>Call Us</h3>
                  </div>
                  <a href={`tel:${cards.phone?.replace(/[^0-9+]/g, '')}`} className={styles.cardLink}>
                    {cards.phone}
                  </a>
                  <a href={`tel:${(cards.phone2 || "+91 97247 77606").replace(/[^0-9+]/g, '')}`} className={styles.cardLink}>
                    {cards.phone2 || "+91 97247 77606"}
                  </a>
                  <p className={styles.cardHint}>{cards.phoneHint}</p>
                </div>
              </div>

              {/* Response Time Card */}
              <div className={`${styles.infoCard} ${styles.responseCard}`}>
                <div className={styles.cardHeader}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <h3 className={styles.cardTitle}>Estimated Response Time</h3>
                </div>
                <div className={styles.responseTimeValue}>{cards.responseTime}</div>
                <p className={styles.cardHint}>{cards.responseTimeHint}</p>
              </div>

              {/* Stylized Map Card */}
              <div className={`${styles.infoCard} ${styles.mapCard}`}>
                <div className={styles.mapVisual}>
                  {/* Schematic background pattern */}
                  <div className={styles.mapGridLines}></div>
                  <div className={styles.mapHotspot}>
                    <span className={styles.mapPulse}></span>
                    <span className={styles.mapDot}></span>
                  </div>
                  <div className={styles.mapDetailsText}>
                    <span className={styles.mapCity}>{map.city}</span>
                    <span className={styles.mapState}>{map.state}</span>
                  </div>
                </div>
                <div className={styles.mapCardFooter}>
                  <p className={styles.mapAddress}>
                    {map.address}
                  </p>
                  <a 
                    href={map.mapLink || "https://maps.google.com/?q=GIDC+Kalol+Gandhinagar+Gujarat+India"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.mapLink}
                  >
                    Open maps →
                  </a>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className={styles.socialRow}>
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Twitter">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    </svg>
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Instagram">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                )}
                {socials.dribbble && (
                  <a href={socials.dribbble} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Dribbble">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.49-11.05 1-11.6 8.56" />
                    </svg>
                  </a>
                )}
                {socials.github && (
                  <a href={socials.github} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                )}
              </div>

            </div>

            {/* Right Column: Contact Message Form */}
            <div className={styles.formColumn}>
              <div className={styles.formCard}>
                
                {submitted ? (
                  <div className={styles.successBlock}>
                    <div className={styles.successIconWrapper}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.successIcon}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className={styles.successTitle}>Message Sent!</h3>
                    <p className={styles.successDesc}>
                      Thank you for contacting Parth Printtech. Our packaging specialists will review your details and get back to you shortly.
                    </p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className={styles.resetBtn}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className={styles.messageForm}>
                    {errorMsg && (
                      <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
                        {errorMsg}
                      </div>
                    )}

                    <div className={styles.formGrid}>
                      
                      {/* First name */}
                      <div className={styles.inputGroup}>
                        <label htmlFor="firstName" className={styles.inputLabel}>First name</label>
                        <input 
                          type="text" 
                          id="firstName" 
                          name="firstName" 
                          required 
                          value={formData.firstName}
                          onChange={handleChange}
                          className={styles.textInput}
                          placeholder="John"
                        />
                      </div>

                      {/* Last name */}
                      <div className={styles.inputGroup}>
                        <label htmlFor="lastName" className={styles.inputLabel}>Last name</label>
                        <input 
                          type="text" 
                          id="lastName" 
                          name="lastName" 
                          required 
                          value={formData.lastName}
                          onChange={handleChange}
                          className={styles.textInput}
                          placeholder="Doe"
                        />
                      </div>

                    </div>

                    {/* Email */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="email" className={styles.inputLabel}>Email address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                        className={styles.textInput}
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Subject Dropdown */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="subject" className={styles.inputLabel}>Subject of Inquiry</label>
                      <select 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        className={styles.selectInput}
                      >
                        <option value="Custom Packaging">Custom Packaging Design</option>
                        <option value="Gravure Printing">Commercial Gravure Printing</option>
                        <option value="Rigid Boxes">Rigid Luxury Box Calibration</option>
                        <option value="General Query">General Partnership Inquiry</option>
                      </select>
                    </div>

                    {/* Message Area */}
                    <div className={styles.inputGroup}>
                      <label htmlFor="message" className={styles.inputLabel}>Your Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        required 
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className={styles.textareaInput}
                        placeholder="Describe your dimensions, quantity, material preferences or specifications..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={submitting} 
                      className={styles.submitButton}
                    >
                      <span>{submitting ? "Calibrating..." : "Send message →"}</span>
                    </button>

                    {/* Trust Badges */}
                    <div className={styles.trustBadges}>
                      {(trustBadges || ["Private & secure", "24hr reply", "No spam ever"]).map((badge, bIdx) => (
                        <span key={bIdx} className={styles.badgeItem}>
                          <span className={styles.badgeDot}></span> {badge}
                        </span>
                      ))}
                    </div>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
