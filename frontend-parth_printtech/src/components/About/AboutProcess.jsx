"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutProcess.module.css";

const stepAccents = ["#009fe3", "#e02424", "#10b981", "#eab308"];

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const stepsData = [
  {
    num: "01",
    id: "cad",
    title: "3D Shrink Dieline Calibration",
    shortTitle: "Contour & Dieline",
    tagline: "3D PRE-DISTORTION CAD ENGINEERING",
    description: "Every contoured sleeve starts with geometry calculation. Our specialists engineer precise flat layouts with pre-distorted artwork using advanced 3D contour simulation. This compensates for bottle curves during heat-shrinkage, ensuring perfectly proportional graphics.",
    stats: [
      { label: "Tolerance", value: "± 0.02 mm" },
      { label: "Software", value: "Esko Studio / ArtiosCAD" }
    ],
    svg: (
      <svg viewBox="0 0 400 300" className={styles.visualSvg} fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Grid Backdrop */}
        <defs>
          <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0, 159, 227, 0.06)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cadGrid)" stroke="rgba(0, 159, 227, 0.1)" rx="8" />

        {/* Outer dimensions and cut lines for a bottle wrap sleeve */}
        <g stroke="#009fe3" strokeWidth="1.5">
          {/* Main sleeve cylinder wrap layout */}
          <rect x="130" y="70" width="140" height="140" rx="4" />
          {/* Top neck shrink zone */}
          <path d="M 130 70 L 150 40 L 250 40 L 270 70" />
          {/* Bottom base shrink zone */}
          <path d="M 130 210 L 140 230 L 260 230 L 270 210" />
        </g>

        {/* Distortion Grid overlay (Crease fold/distortion lines) */}
        <g stroke="#e02424" strokeWidth="1" strokeDasharray="3 3" opacity="0.75">
          <line x1="200" y1="40" x2="200" y2="230" />
          <path d="M 130 110 Q 200 130 270 110" />
          <path d="M 130 140 Q 200 160 270 140" />
          <path d="M 130 170 Q 200 190 270 170" />
        </g>

        {/* Dimension labels */}
        <g stroke="#888" strokeWidth="0.8">
          <line x1="130" y1="30" x2="270" y2="30" />
          <line x1="130" y1="26" x2="130" y2="34" />
          <line x1="270" y1="26" x2="270" y2="34" />

          <line x1="100" y1="40" x2="100" y2="230" />
          <line x1="96" y1="40" x2="104" y2="40" />
          <line x1="96" y1="230" x2="104" y2="230" />
        </g>
        <text x="200" y="24" fill="#888" fontFamily="monospace" fontSize="9" textAnchor="middle">Layflat: 140.00mm</text>
        <text x="60" y="140" fill="#888" fontFamily="monospace" fontSize="9" textAnchor="middle">Cut: 190.00mm</text>
        <text x="200" y="195" fill="#009fe3" fontFamily="monospace" fontSize="10" fontWeight="bold">SLEEVE // DWG-REV01</text>
      </svg>
    )
  },
  {
    num: "02",
    id: "color",
    title: "Spectrophotometer Color Sync",
    shortTitle: "Color Sync",
    tagline: "CMYK REGISTRATION CONTROL",
    description: "Digital color targets meet physical reality. We align our flexo and rotogravure ink plates through densitometer testing, securing perfect color density matching. Specially mixed Pantone shades are calibrated to Delta-E standards under regulated D50 lighting.",
    stats: [
      { label: "Color Target", value: "Delta-E < 1.0" },
      { label: "Standard", value: "ISO 12647-2 (Film/Flexo)" }
    ],
    svg: (
      <svg viewBox="0 0 400 300" className={styles.visualSvg} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.02)" stroke="rgba(0, 159, 227, 0.1)" rx="8" />
        
        {/* Overlapping CMYK circular color blocks simulating registration calibration */}
        <circle cx="160" cy="130" r="50" fill="rgba(0, 159, 227, 0.15)" stroke="#009fe3" strokeWidth="1" />
        <circle cx="240" cy="130" r="50" fill="rgba(224, 36, 36, 0.12)" stroke="#e02424" strokeWidth="1" />
        <circle cx="200" cy="175" r="50" fill="rgba(234, 179, 8, 0.12)" stroke="#eab308" strokeWidth="1" />
        
        {/* Color Bars at Bottom */}
        <rect x="50" y="240" width="70" height="20" fill="#009fe3" rx="2" />
        <rect x="130" y="240" width="70" height="20" fill="#e02424" rx="2" />
        <rect x="210" y="240" width="70" height="20" fill="#eab308" rx="2" />
        <rect x="290" y="240" width="70" height="20" fill="#1e293b" rx="2" />

        <text x="85" y="253" fill="#ffffff" fontFamily="monospace" fontSize="8" textAnchor="middle">C: 100%</text>
        <text x="165" y="253" fill="#ffffff" fontFamily="monospace" fontSize="8" textAnchor="middle">M: 100%</text>
        <text x="245" y="253" fill="#ffffff" fontFamily="monospace" fontSize="8" textAnchor="middle">Y: 100%</text>
        <text x="325" y="253" fill="#ffffff" fontFamily="monospace" fontSize="8" textAnchor="middle">K: 100%</text>

        {/* Calibration Target crosshairs overlay */}
        <g stroke="#1e293b" strokeWidth="1">
          <circle cx="200" cy="145" r="16" strokeDasharray="3 3" />
          <line x1="200" y1="120" x2="200" y2="170" />
          <line x1="175" y1="145" x2="225" y2="145" />
        </g>
        <text x="200" y="105" fill="#1e293b" fontFamily="monospace" fontSize="9" textAnchor="middle" fontWeight="bold">ALIGNMENT COMPLIANT</text>
      </svg>
    )
  },
  {
    num: "03",
    id: "press",
    title: "High-Speed Rotary Web Run",
    shortTitle: "Rotary Press Run",
    tagline: "HIGH-CAPACITY CYLINDER WEB RUN",
    description: "Our high-capacity rotogravure and CI flexo presses lock cylinder plates in perfect registry. Polymer/metal plates run at speeds up to 300 meters per minute under automatic inline spectrophotometer adjustments, ensuring continuous color uniformity across miles of web film.",
    stats: [
      { label: "Output Speed", value: "300 meters / min" },
      { label: "Technology", value: "Optical Register Control" }
    ],
    svg: (
      <svg viewBox="0 0 400 300" className={styles.visualSvg} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.02)" stroke="rgba(0, 159, 227, 0.1)" rx="8" />

        {/* Cylinder Rollers */}
        <circle cx="130" cy="150" r="35" fill="none" stroke="#009fe3" strokeWidth="3" />
        <circle cx="130" cy="150" r="40" stroke="rgba(0, 159, 227, 0.2)" strokeWidth="1" />
        
        <circle cx="270" cy="150" r="35" fill="none" stroke="#e02424" strokeWidth="3" />
        <circle cx="270" cy="150" r="40" stroke="rgba(224, 36, 36, 0.2)" strokeWidth="1" />

        {/* Continuous Web roll passing through rollers */}
        <path d="M 40 160 L 95 160 C 115 160, 145 130, 165 130 L 235 130 C 255 130, 285 160, 305 160 L 360 160" stroke="#1e293b" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Sheet indicator arrows */}
        <path d="M 60 152 L 70 152 M 65 148 L 72 152 L 65 156" stroke="#009fe3" strokeWidth="1.2" />
        <path d="M 320 152 L 330 152 M 325 148 L 332 152 L 325 156" stroke="#e02424" strokeWidth="1.2" />

        <text x="200" y="70" fill="#1e293b" fontFamily="monospace" fontSize="11" textAnchor="middle" fontWeight="bold">ROTARY ROLL FEED SYSTEM</text>
        <text x="200" y="210" fill="#888" fontFamily="monospace" fontSize="8" textAnchor="middle">WEB TENSION: SYNCED // REGISTER: 100%</text>
      </svg>
    )
  },
  {
    num: "04",
    id: "finish",
    title: "Precision Slitting & Sleeve Seaming",
    shortTitle: "Sleeve & Roll Finish",
    tagline: "AUTOMATED CONTINUOUS FORMING",
    description: "The final step of label creation. High-speed seaming machines apply micro-metered solvent adhesive to join the flat film edges, forming continuous sleeves. Precision rotary slitters then slice wrap-around label rolls to standard widths with clean, non-frayed edges.",
    stats: [
      { label: "Finishes", value: "Seam Solvent / Reel Slit" },
      { label: "Accuracy", value: "± 0.15 mm seaming tolerance" }
    ],
    svg: (
      <svg viewBox="0 0 400 300" className={styles.visualSvg} fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.02)" stroke="rgba(0, 159, 227, 0.1)" rx="8" />

        {/* Sleeve Forming Roller & Solvent weld point */}
        <g stroke="#009fe3" strokeWidth="1.2" transform="translate(60, 30)">
          {/* Sleeve roll simulation */}
          <ellipse cx="140" cy="90" rx="30" ry="60" fill="rgba(0, 159, 227, 0.05)" />
          <path d="M 140 30 L 80 50 L 80 130 L 140 150" fill="rgba(0, 159, 227, 0.08)" />
          <path d="M 140 30 L 200 50 L 200 130 L 140 150" fill="rgba(0, 159, 227, 0.02)" />

          {/* Seaming Weld Line Highlight (Gold Foil Sim) */}
          <line x1="140" y1="30" x2="140" y2="150" stroke="#eab308" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Text indicators */}
        <text x="200" y="245" fill="#eab308" fontFamily="monospace" fontSize="9" textAnchor="middle" fontWeight="bold">SOLVENT SEAM WELD CALIBRATION</text>
        <text x="200" y="260" fill="#888" fontFamily="monospace" fontSize="8" textAnchor="middle">SLEEVE FORMING COMPLETE // STAGE 4 VERIFIED</text>
      </svg>
    )
  }
];

const RegistrationMark = ({ style }) => (
  <div className={styles.regMark} style={style}>
    <div className={styles.regMarkCircle}></div>
  </div>
);

const AboutProcess = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fade-in header details
      gsap.fromTo(
        ".process-header-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-section-trigger",
            start: "top 80%",
          }
        }
      );

      // Fade-in main grid layout
      gsap.fromTo(
        ".process-grid-reveal",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-grid-reveal",
            start: "top 85%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animate active visual card change
  useEffect(() => {
    gsap.fromTo(
      ".active-visual-reveal",
      { scale: 0.96, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
    );

    gsap.fromTo(
      ".active-content-reveal",
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1 }
    );
  }, [activeStep]);

  return (
    <section ref={containerRef} className={`${styles.section} process-section-trigger`} style={{ "--step-accent": stepAccents[activeStep] }}>
      {/* Blueprint grid pattern backdrop */}
      <div className={styles.blueprintOverlay}>
        <div className={styles.gridLineX}></div>
        <div className={styles.gridLineY}></div>
      </div>

      {/* Calibration markers */}
      <div className={styles.registrationOverlay}>
        <RegistrationMark style={{ left: "4%", top: "5%" }} />
        <RegistrationMark style={{ right: "4%", top: "5%" }} />
        <RegistrationMark style={{ left: "4%", bottom: "5%" }} />
        <RegistrationMark style={{ right: "4%", bottom: "5%" }} />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={`${styles.title} process-header-reveal`}>
            The Journey From <span className={styles.accentText}>Dieline to Detail</span>
          </h2>
          <p className={`${styles.description} process-header-reveal`}>
            Follow the process of structural execution, verifying print calibration tolerances and tactile embellishments at every stage.
          </p>
        </div>

        {/* Layout Grid */}
        <div className={`${styles.layoutGrid} process-grid-reveal`}>
          {/* Left Panel: Steps & Descriptions */}
          <div className={styles.leftPanel}>
            {/* Step Navigation Tabs */}
            <div className={styles.tabsContainer}>
              {stepsData.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`${styles.tabBtn} ${activeStep === idx ? styles.activeTab : ""}`}
                >
                  <span className={styles.tabNum}>{step.num}</span>
                  <span className={styles.tabLabel}>{step.shortTitle}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Step Content */}
            <div className={styles.contentBlock}>
              <span className={`${styles.tagline} active-content-reveal`}>
                {stepsData[activeStep].tagline}
              </span>
              <h3 className={`${styles.stepTitle} active-content-reveal`}>
                {stepsData[activeStep].title}
              </h3>
              <p className={`${styles.stepDesc} active-content-reveal`}>
                {stepsData[activeStep].description}
              </p>

              {/* Step Specs */}
              <div className={`${styles.specsGrid} active-content-reveal`}>
                {stepsData[activeStep].stats.map((stat, sIdx) => (
                  <div key={sIdx} className={styles.specBox}>
                    <span className={styles.specLabel}>{stat.label}</span>
                    <span className={styles.specValue}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive CAD Viewport */}
          <div className={styles.rightPanel}>
            <div className={styles.viewportConsole}>
              <div className={styles.consoleHeader}>
                <div className={styles.consoleTitle}>
                  DIELINE LAB // CALIBRATION_STAGE_{stepsData[activeStep].num}
                </div>
              </div>

              <div className={`${styles.viewportBody} active-visual-reveal`}>
                {stepsData[activeStep].svg}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutProcess;
