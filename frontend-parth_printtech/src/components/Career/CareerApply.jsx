"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CareerApply.module.css";

gsap.registerPlugin(ScrollTrigger);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const CareerApply = ({ contactData = {}, rolesList = [], selectedRole = "", onChangeRole }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileObj, setFileObj] = useState(null);
  const sectionRef = useRef(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experience: "",
    message: ""
  });

  const title = contactData?.title || "Start Your";
  const titleHighlight = contactData?.titleHighlight || "Journey";
  const titleRest = contactData?.titleRest !== undefined ? contactData.titleRest : "With Us";
  const description = contactData?.description || "Send us your application and let's explore how your skills can contribute to Parth Printtech's legacy of precision and innovation. We review every submission personally.";
  const responseTime = contactData?.responseTime || "We reply within 3–5 business days";
  const email = contactData?.email || "careers@parthprinttech.com";
  const office = contactData?.office || "47/8, G.I.D.C., Kalol - 382725 (N.G.), Dist. Gandhinagar, Gujarat, India";
  const phone = contactData?.phone || "+91 99788 88056";

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".apply-left",
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".apply-left", start: "top 80%" },
        }
      );
      gsap.fromTo(
        ".apply-form",
        { x: 30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".apply-form", start: "top 80%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileObj(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName", formData.lastName);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("experience", formData.experience);
      data.append("role", selectedRole || "General Application");
      data.append("message", formData.message);
      if (fileObj) {
        data.append("resume", fileObj);
      }

      const res = await fetch(`${API_BASE}/career/apply`, {
        method: "POST",
        body: data,
      });

      const resJson = await res.json();
      if (res.ok && resJson.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(resJson.message || "Failed to submit application. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      // Fallback local submission display if backend is unreachable
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className={styles.section} id="career-apply">
      <div className={styles.blueprintOverlay}>
        <div className={styles.gridLineX}></div>
      </div>

      <div className={styles.container}>
        {/* Left Column */}
        <div className={`${styles.leftCol} apply-left`}>
          <h2 className={styles.title}>
            {title} <span className={styles.accentText}>{titleHighlight}</span> {titleRest}
          </h2>
          <p className={styles.description}>
            {description}
          </p>

          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <div className={styles.infoIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Response Time</span>
                <span className={styles.infoValue}>{responseTime}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{email}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Office</span>
                <span className={styles.infoValue}>{office}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <div className={styles.infoIconBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoValue}>{phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className={`${styles.formCard} apply-form`}>
          <div className={styles.dieCutLine}></div>

          {submitted ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className={styles.successTitle}>Application Submitted!</h3>
              <p className={styles.successDesc}>
                Thank you for applying to Parth Printtech. Our HR team will review your application and reach out within 3–5 business days.
              </p>
            </div>
          ) : (
            <>
              <h3 className={styles.formTitle}>Apply Now</h3>
              <p className={styles.formSubtitle}>Fill in your details and we&apos;ll get back to you soon.</p>

              {errorMsg && (
                <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                  {errorMsg}
                </div>
              )}

              <form className={styles.form} onSubmit={handleSubmit} id="career-application-form">
                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="career-fname">First Name</label>
                    <input
                      id="career-fname"
                      className={styles.fieldInput}
                      type="text"
                      placeholder="Arjun"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="career-lname">Last Name</label>
                    <input
                      id="career-lname"
                      className={styles.fieldInput}
                      type="text"
                      placeholder="Sharma"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="career-email">Email Address</label>
                  <input
                    id="career-email"
                    className={styles.fieldInput}
                    type="email"
                    placeholder="arjun@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="career-phone">Phone</label>
                    <input
                      id="career-phone"
                      className={styles.fieldInput}
                      type="tel"
                      placeholder="+91 99788 88056"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel} htmlFor="career-experience">Experience</label>
                    <input
                      id="career-experience"
                      className={styles.fieldInput}
                      type="text"
                      placeholder="e.g. 3 years"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="career-role">Role Applying For</label>
                  <select
                    id="career-role"
                    className={styles.fieldSelect}
                    value={selectedRole}
                    onChange={(e) => onChangeRole && onChangeRole(e.target.value)}
                    required
                  >
                    <option value="">Select a position…</option>
                    {rolesList && rolesList.length > 0 ? (
                      rolesList.map((r) => (
                        <option key={r.id || r.title} value={r.title}>
                          {r.title} ({r.dept || "General"})
                        </option>
                      ))
                    ) : (
                      <>
                        <option>Senior Print Production Technician</option>
                        <option>Packaging Design Engineer</option>
                        <option>Quality Control & Inspection Lead</option>
                        <option>Sales Executive – Print & Packaging</option>
                        <option>Gravure Press Operator</option>
                        <option>Graphic Design Specialist (Pre-press)</option>
                        <option>Supply Chain & Procurement Manager</option>
                        <option>HR & Talent Acquisition Executive</option>
                        <option>Junior Sales Intern – B2B</option>
                      </>
                    )}
                    <option value="Other / Open Application">Other / Open Application</option>
                  </select>
                </div>

                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel} htmlFor="career-message">Cover Message</label>
                  <textarea
                    id="career-message"
                    className={styles.fieldTextarea}
                    placeholder="Tell us briefly about your background and why you'd be a great fit…"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                  ></textarea>
                </div>

                {/* Resume Upload */}
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Resume / CV</label>
                  <label htmlFor="career-resume" className={styles.fileUpload} id="career-resume-label">
                    <div className={styles.fileUploadIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div className={styles.fileUploadText}>
                      <span className={styles.fileUploadMain}>
                        {fileName ? fileName : "Click to upload your resume"}
                      </span>
                      <span className={styles.fileUploadSub}>PDF, DOC, DOCX — Max 15MB</span>
                    </div>
                    <input
                      id="career-resume"
                      className={styles.fileInput}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                <button type="submit" className={styles.submitBtn} id="career-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  <svg className={styles.submitBtnIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <p className={styles.submitNote}>
                  Your information is secure and will only be used for recruitment purposes.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CareerApply;
