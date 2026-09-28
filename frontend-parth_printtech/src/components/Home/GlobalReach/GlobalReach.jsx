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
    coords: { x: "68%", y: "55%" },
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
    coords: { x: "25%", y: "40%" },
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
    coords: { x: "46%", y: "30%" },
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
    coords: { x: "58%", y: "48%" },
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
    coords: { x: "50%", y: "32%" },
    stats: [
      { label: "Key Sectors", value: "Automotive, Tech" },
      { label: "Standards", value: "ISO Quality Aligned" }
    ]
  }
];

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
    <section ref={sectionRef} className={styles.section}>
      {/* Background blueprint patterns to blend with Who We Are/Our Values style */}
      <div className={styles.blueprintOverlay}></div>

      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <div className={`${styles.subtitle} reach-header-reveal`}>
            <span className={styles.blueDot}></span> GLOBAL presence
          </div>
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
              <div
                key={country.id}
                className={`${styles.countryCard} ${activeIdx === idx ? styles.activeCard : ""}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
              >
                <div className={styles.countryHeader}>
                  <h3 className={styles.countryName}>{country.name}</h3>
                  <span className={styles.countryRole}>{country.role}</span>
                </div>
                
                {activeIdx === idx && (
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
            ))}
          </div>

          {/* Right Panel: Interactive Vector Map Console */}
          <div className={styles.mapConsole}>
            <div className={styles.consoleHeader}>
              <div className={styles.consoleTitle}>EXPORT MAP CONSOLE</div>
            </div>

            <div className={styles.mapWrapper}>
              {/* Clean abstract layout of the world map */}
              <svg viewBox="0 0 1000 500" className={styles.worldMapSvg}>
                {/* Simplified Continents Outline */}
                {/* North America */}
                <path d="M100 120 L150 100 L250 120 L270 180 L200 230 L160 250 L120 200 Z" fill="rgba(0, 159, 227, 0.04)" stroke="rgba(0, 159, 227, 0.15)" strokeWidth="1" />
                {/* South America */}
                <path d="M220 280 L270 290 L320 330 L300 420 L260 460 L240 370 Z" fill="rgba(0, 159, 227, 0.04)" stroke="rgba(0, 159, 227, 0.15)" strokeWidth="1" />
                {/* Europe */}
                <path d="M420 120 L500 110 L540 150 L500 220 L440 200 L420 150 Z" fill="rgba(0, 159, 227, 0.04)" stroke="rgba(0, 159, 227, 0.15)" strokeWidth="1" />
                {/* Africa */}
                <path d="M440 230 L520 220 L580 270 L590 320 L550 410 L500 420 L470 330 Z" fill="rgba(0, 159, 227, 0.04)" stroke="rgba(0, 159, 227, 0.15)" strokeWidth="1" />
                {/* Asia */}
                <path d="M520 120 L680 100 L850 140 L880 250 L800 350 L700 340 L550 250 Z" fill="rgba(0, 159, 227, 0.04)" stroke="rgba(0, 159, 227, 0.15)" strokeWidth="1" />
                {/* Australia */}
                <path d="M780 370 L840 360 L860 410 L810 440 Z" fill="rgba(0, 159, 227, 0.04)" stroke="rgba(0, 159, 227, 0.15)" strokeWidth="1" />

                {/* Grid guidelines for tech styling */}
                <line x1="50" y1="250" x2="950" y2="250" stroke="rgba(0, 159, 227, 0.06)" strokeDasharray="5 5" />
                <line x1="500" y1="50" x2="500" y2="450" stroke="rgba(0, 159, 227, 0.06)" strokeDasharray="5 5" />
              </svg>

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

            {/* Live console readout footer */}
            <div className={styles.consoleFooter}>
              <span className={styles.consoleText}>
                &gt;&gt; ACTIVE DESTINATION: {countriesData[activeIdx].name.toUpperCase()} {"//"} ROUTE_ESTABLISHED
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default GlobalReach;
