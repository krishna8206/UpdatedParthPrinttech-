"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./GlobalReach.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const countriesData = [
  {
    id: "in",
    name: "India",
    role: "Manufacturing & Domestic HQ",
    description: "Main production facilities handling high-volume gravure printing, mono cartons, and rigid boxes.",
    coords: { x: "69%", y: "48%" },
    stats: [
      { label: "Facilities", value: "2 Production Hubs" },
      { label: "Coverage", value: "Pan-India logistics" }
    ]
  },
  {
    id: "us",
    name: "United States",
    role: "Export Destination",
    description: "Exporting custom retail packaging and eco-friendly consumer product folding cartons.",
    coords: { x: "23%", y: "38%" },
    stats: [
      { label: "Key Sectors", value: "FMCG, Cosmetics" },
      { label: "Delivery", value: "DDP Shipping Options" }
    ]
  },
  {
    id: "uk",
    name: "United Kingdom",
    role: "Export Destination",
    description: "Delivering luxury visual retail materials and rigid presentation boxes to premium brands.",
    coords: { x: "48%", y: "34%" },
    stats: [
      { label: "Key Sectors", value: "Retail, Gifting" },
      { label: "Compliance", value: "FSC Certified Board" }
    ]
  },
  {
    id: "ae",
    name: "United Arab Emirates",
    role: "Export Destination",
    description: "Supplying pharmaceutical packaging and food-grade barrier boxes under stringent tolerances.",
    coords: { x: "61%", y: "46%" },
    stats: [
      { label: "Key Sectors", value: "Pharma, Food & Beverage" },
      { label: "Turnaround", value: "10-14 Day Sea Freight" }
    ]
  },
  {
    id: "de",
    name: "Germany",
    role: "Export Destination",
    description: "Providing industrial print materials and custom corrugated logistics packaging.",
    coords: { x: "52%", y: "34%" },
    stats: [
      { label: "Key Sectors", value: "Automotive, Tech" },
      { label: "Standards", value: "ISO Quality Aligned" }
    ]
  }
];

const CountryCard = ({ country, isActive, onClick, onMouseEnter }) => {
  const cardWrapperRef = useRef(null);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !cardWrapperRef.current) return;
    const rect = cardWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = -(y - yc) / (rect.height / 10);
    const rotateY = (x - xc) / (rect.width / 10);

    cardRef.current.style.setProperty("--rx", `${rotateX}deg`);
    cardRef.current.style.setProperty("--ry", `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.setProperty("--rx", "0deg");
    cardRef.current.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={cardWrapperRef}
      className={styles.cardWrapper}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div
        ref={cardRef}
        className={`${styles.countryCard} ${isActive ? styles.activeCard : ""}`}
      >
        <div className={styles.boxFlap}></div>
        <div className={styles.dieCutLine}></div>
        <div className={styles.colorStrip}>
          <div className={`${styles.stripDot} ${styles.cyanDot}`}></div>
          <div className={`${styles.stripDot} ${styles.magentaDot}`}></div>
          <div className={`${styles.stripDot} ${styles.yellowDot}`}></div>
          <div className={`${styles.stripDot} ${styles.keyDot}`}></div>
        </div>

        <div className={styles.countryHeader}>
          <h3 className={styles.countryName}>{country.name}</h3>
          <span className={styles.countryRole}>{country.role}</span>
        </div>
        
        {isActive && (
          <div className={styles.countryDetails}>
            <p className={styles.countryDesc}>{country.description}</p>
            <div className={styles.statsGrid}>
              {country.stats.map((stat, sIdx) => (
                <div key={sIdx} className={styles.statBox}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const GlobalReach = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Heading animations
      gsap.fromTo(
        ".reach-header-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          }
        }
      );

      // Grid container animation
      gsap.fromTo(
        ".reach-grid-reveal",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".reach-grid-reveal",
            start: "top 85%"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.section} exp-trigger-section`}>
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.bgVideo}
      >
        <source src="/videos/Back2.mp4" type="video/mp4" />
      </video>

      {/* Background blueprint patterns to blend with Who We Are/Our Values style */}
      <div className={styles.blueprintOverlay}></div>

      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={`${styles.title} reach-header-reveal`}>
            Serving Clients <span className={styles.accentText}>Worldwide</span>
          </h2>
          <p className={`${styles.description} reach-header-reveal`}>
            Exporting high-quality gravure print and premium custom packaging solutions directly to major international markets.
          </p>
        </div>

        {/* Layout Grid */}
        <div className={`${styles.layoutGrid} reach-grid-reveal`}>
          
          {/* Left Panel: Country Cards / Details */}
          <div className={styles.countriesList}>
            {countriesData.map((country, idx) => (
              <CountryCard
                key={country.id}
                country={country}
                isActive={activeIdx === idx}
                onClick={() => setActiveIdx(idx)}
                onMouseEnter={() => setActiveIdx(idx)}
              />
            ))}
          </div>

          {/* Right Panel: Interactive Vector Map Console */}
          <div className={styles.mapConsole}>
            <div className={styles.consoleHeader}>
              <div className={styles.consoleTitle}>EXPORT MAP CONSOLE</div>
            </div>

            <div className={styles.mapWrapper}>
              {/* High-quality world map blueprint image */}
              <img 
                src="/images/world_map_blueprint.png" 
                alt="World Map Global Presence" 
                className={styles.worldMapImg} 
              />

              {/* Glowing active pins */}
              {countriesData.map((country, idx) => (
                <div
                  key={country.id}
                  className={`${styles.mapPin} ${activeIdx === idx ? styles.activePin : ""}`}
                  style={{ left: country.coords.x, top: country.coords.y }}
                  onMouseEnter={() => setActiveIdx(idx)}
                >
                  <span className={styles.pinDot}></span>
                  <span className={styles.pinPulse}></span>
                  <span className={styles.pinTooltip}>{country.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GlobalReach;
