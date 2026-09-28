"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutCoCreation.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const caseStudies = [
  {
    id: "pvc-sleeve",
    category: "Shrink Sleeves",
    title: "360° Contour Calibration Sleeve",
    challenge: "Graphic distortion and uneven shrinkage on highly contoured cosmetic spray bottles during heat tunnel runs.",
    solution: "Created pre-distorted dielines using advanced 3D simulation software. Calibrated localized shrinkage zones on premium PVC film to match container geometry perfectly without smiling or frowning.",
    specs: [
      { label: "Substrate", value: "High-Shrink PVC Film" },
      { label: "Shrinkage", value: "Up to 58% Uniform" },
      { label: "Print Process", value: "10-Color Rotogravure" }
    ],
    image: "/images/products/pvc_shrink_sleeves.png",
    dielineSvg: (
      <svg viewBox="0 0 300 220" fill="none" stroke="#009fe3" strokeWidth="1.2">
        <rect width="100%" height="100%" fill="rgba(0, 159, 227, 0.03)" stroke="rgba(0, 159, 227, 0.15)" rx="6" />
        {/* Sleeve profile */}
        <path d="M 110 30 Q 150 40 190 30 L 190 190 Q 150 180 110 190 Z" />
        <path d="M 110 70 Q 150 80 190 70" />
        <path d="M 110 110 Q 150 120 190 110" />
        <path d="M 110 150 Q 150 160 190 150" />
        <text x="150" y="115" fill="#009fe3" fontSize="8" fontFamily="monospace" textAnchor="middle">DISTORTION GRID</text>
      </svg>
    )
  },
  {
    id: "bopp-label",
    category: "Wrap-Around Labels",
    title: "High-Speed Web BOPP Labeling",
    challenge: "Adhesive smearing and label misalignment on high-volume rotary hot-melt labeling lines at 45,000 bottles/hour.",
    solution: "Engineered ultra-flat, high-tensile BOPP film rolls with moisture-resistant coatings. Calibrated thickness variance down to ±1 micron to prevent line jams and ensure crisp wrap registry.",
    specs: [
      { label: "Substrate", value: "BOPP Clear Film" },
      { label: "Line Speed", value: "45,000 bottles / hr" },
      { label: "Thickness", value: "38 Microns" }
    ],
    image: "/images/products/ChatGPT Image Sep 18, 2026, 05_07_28 PM.png",
    dielineSvg: (
      <svg viewBox="0 0 300 220" fill="none" stroke="#009fe3" strokeWidth="1.2">
        <rect width="100%" height="100%" fill="rgba(0, 159, 227, 0.03)" stroke="rgba(0, 159, 227, 0.15)" rx="6" />
        {/* Roll profile */}
        <rect x="50" y="50" width="200" height="120" rx="3" />
        <line x1="50" y1="90" x2="250" y2="90" strokeDasharray="3 3" />
        <line x1="50" y1="130" x2="250" y2="130" strokeDasharray="3 3" />
        <text x="150" y="115" fill="#009fe3" fontSize="8" fontFamily="monospace" textAnchor="middle">BOPP ROLL LAYOUT</text>
      </svg>
    )
  },
  {
    id: "htl-label",
    category: "Heat Transfer Labels",
    title: "Dry-Fusion Lubricant Pail HTL",
    challenge: "Traditional label peeling and chemical degradation on premium chemical and automotive lubricant jugs.",
    solution: "Developed premium dry-fusion Heat Transfer Labels (HTL) that bond permanently to HDPE containers under 160°C rollers, forming an indestructible chemical-proof scratch-resistant brand barrier.",
    specs: [
      { label: "Technology", value: "Heat & Press Fusion" },
      { label: "Chemical Resist", value: "100% Waterproof" },
      { label: "Carrier Film", value: "Siliconized PET Foil" }
    ],
    image: "/images/products/ChatGPT Image Sep 18, 2026, 03_08_38 PM.png",
    dielineSvg: (
      <svg viewBox="0 0 300 220" fill="none" stroke="#009fe3" strokeWidth="1.2">
        <rect width="100%" height="100%" fill="rgba(0, 159, 227, 0.03)" stroke="rgba(0, 159, 227, 0.15)" rx="6" />
        {/* HTL Pail print layout */}
        <polygon points="90,40 210,40 190,180 110,180" />
        <path d="M 100 80 L 200 80" strokeDasharray="2 2" />
        <path d="M 105 120 L 195 120" strokeDasharray="2 2" />
        <text x="150" y="105" fill="#009fe3" fontSize="8" fontFamily="monospace" textAnchor="middle">PAIL GRAPHIC ZONE</text>
      </svg>
    )
  }
];

const RegistrationMark = ({ style }) => (
  <div className={styles.regMark} style={style}>
    <div className={styles.regMarkCircle}></div>
  </div>
);

const CaseStudyCard = ({ study }) => {
  const [showProduct, setShowProduct] = useState(false);
  const cardRef = useRef(null);

  return (
    <div ref={cardRef} className={`${styles.card} cocreate-card-reveal`}>
      {/* Visual Toggle Frame */}
      <div className={styles.visualFrame}>
        {/* Toggle Switch */}
        <div className={styles.toggleContainer}>
          <button
            onClick={() => setShowProduct(false)}
            className={`${styles.toggleBtn} ${!showProduct ? styles.toggleActive : ""}`}
          >
            Dieline
          </button>
          <button
            onClick={() => setShowProduct(true)}
            className={`${styles.toggleBtn} ${showProduct ? styles.toggleActive : ""}`}
          >
            Product
          </button>
        </div>

        <div className={styles.viewport}>
          {/* Cad Dieline SVG */}
          <div className={`${styles.dielineContainer} ${!showProduct ? styles.visibleView : styles.hiddenView}`}>
            {study.dielineSvg}
            <span className={styles.cadCode}>DWG-REV-{study.id.toUpperCase()}</span>
          </div>

          {/* Final Product Image */}
          <div className={`${styles.imageContainer} ${showProduct ? styles.visibleView : styles.hiddenView}`}>
            <Image
              src={study.image}
              alt={study.title}
              fill
              className={styles.productImg}
              onError={(e) => {
                e.target.src = "data:image/svg+xml;utf8,<svg viewBox='0 0 300 220' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='%231e293b'/><text x='50%' y='50%' font-family='sans-serif' font-size='12' fill='%236c757d' text-anchor='middle'>PARTH PRINTTECH</text></svg>";
              }}
            />
          </div>
        </div>
      </div>

      {/* Specification Content */}
      <div className={styles.content}>
        <span className={styles.category}>{study.category}</span>
        <h3 className={styles.cardTitle}>{study.title}</h3>

        <div className={styles.detailBlock}>
          <h4 className={styles.sectionHeader}>THE CHALLENGE</h4>
          <p className={styles.descText}>{study.challenge}</p>
        </div>

        <div className={styles.detailBlock}>
          <h4 className={styles.sectionHeader}>OUR CALIBRATED SOLUTION</h4>
          <p className={styles.descText}>{study.solution}</p>
        </div>

        <div className={styles.specsList}>
          {study.specs.map((spec, sIdx) => (
            <div key={sIdx} className={styles.specRow}>
              <span className={styles.specLabel}>{spec.label}</span>
              <span className={styles.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>

        <Link href={`/contact?subject=Inquiry for ${study.title}`} className={styles.learnMoreBtn}>
          Learn More
        </Link>
      </div>
    </div>
  );
};

const AboutCoCreation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fade/slide up section header
      gsap.fromTo(
        ".cocreate-header-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // Staggered cards reveal
      gsap.fromTo(
        ".cocreate-card-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cocreate-grid-trigger",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    // Refresh triggers to ensure scroll offset calculations align with home page layout elements
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.section}>
      {/* Dark Blueprint Grid Overlay */}
      <div className={styles.blueprintOverlay}></div>

      {/* Alignment Marks */}
      <div className={styles.registrationOverlay}>
        <RegistrationMark style={{ left: "4%", top: "4%" }} />
        <RegistrationMark style={{ right: "4%", top: "4%" }} />
        <RegistrationMark style={{ left: "4%", bottom: "4%" }} />
        <RegistrationMark style={{ right: "4%", bottom: "4%" }} />
      </div>

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={`${styles.subtitle} cocreate-header-reveal`}>
            <span className={styles.blueDot}></span> CASE STUDIES
          </span>
          <h2 className={`${styles.title} cocreate-header-reveal`}>
            Structural <span className={styles.accentText}>Co-Creation</span>
          </h2>
          <p className={`${styles.description} cocreate-header-reveal`}>
            Explore how we calibrated custom structural configurations to resolve complex engineering bottlenecks for major retail brands.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className={`${styles.grid} cocreate-grid-trigger`}>
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutCoCreation;
