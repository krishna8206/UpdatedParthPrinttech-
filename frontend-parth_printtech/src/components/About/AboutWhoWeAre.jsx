"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutWhoWeAre.module.css";
import { getMediaUrl } from "@/lib/media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://updatedparthprinttech.onrender.com/api";

const initialWhoWeAre = {
  subtitle: "WHO WE ARE",
  title: "Pioneers in",
  titleHighlight: "Precision Packaging",
  leadText: "At Parth Printtech, we combine technical excellence with state-of-the-art manufacturing to produce world-class shrink sleeve packaging and high-precision labeling solutions.",
  bodyText: "Since 2009, we have partnered with leading brands across FMCG, cosmetics, pharmaceuticals, food & beverage, and industrial sectors. Our specialized facility operates high-speed gravure and flexographic presses engineered to meet demanding commercial volume while maintaining strict micron tolerances.",
  image: "/images/marketplace/Screenshot 2026-09-18 164510.png",
  metrics: [
    { id: "1", value: "17+", label: "Years of Experience" },
    { id: "2", value: "50+", label: "Sectors Served" },
    { id: "3", value: "100%", label: "Quality Guarantee" }
  ]
};

const RegistrationMark = ({ style }) => (
  <div className={styles.regMark} style={style}>
    <div className={styles.regMarkCircle}></div>
  </div>
);

const AboutWhoWeAre = () => {
  const sectionRef = useRef(null);
  const [data, setData] = useState(initialWhoWeAre);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/about`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.whoWeAre) {
            setData(json.data.whoWeAre);
          }
        }
      } catch (err) {
        // Keep fallback
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(
        ".ab-who-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  const resolveImage = (src) => {
    return getMediaUrl(src, "/images/marketplace/Screenshot 2026-09-18 164510.png");
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Background blueprint overlay */}
      <div className={styles.blueprintOverlay}></div>

      {/* Alignment Marks */}
      <div className={styles.registrationOverlay}>
        <RegistrationMark style={{ left: "3%", top: "4%" }} />
        <RegistrationMark style={{ right: "3%", top: "4%" }} />
        <RegistrationMark style={{ left: "3%", bottom: "4%" }} />
        <RegistrationMark style={{ right: "3%", bottom: "4%" }} />
      </div>

      <div className={styles.container}>
        {/* Main Grid: Left Content & Right Visual Showcase */}
        <div className={styles.mainGrid}>
          
          {/* Left Column: Heading & Narrative */}
          <div className={styles.leftCol}>
            <div className={`${styles.subtitle} ab-who-reveal`}>
              <span className={styles.blueDot}></span> {data.subtitle || "WHO WE ARE"}
            </div>
            
            <h2 className={`${styles.title} ab-who-reveal`}>
              {data.title} <span className={styles.accentText}>{data.titleHighlight}</span> & Modern Labeling
            </h2>

            <p className={`${styles.leadText} ab-who-reveal`}>
              {data.leadText}
            </p>

            <p className={`${styles.bodyText} ab-who-reveal`}>
              {data.bodyText}
            </p>

            {/* Metrics Dashboard */}
            <div className={`${styles.metricsGrid} ab-who-reveal`}>
              {data.metrics && data.metrics.map((metric, i) => (
                <div key={metric.id || i} className={styles.metricItem}>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Image Container */}
          <div className={styles.rightCol}>
            <div className={`${styles.imageFrame} ab-who-reveal`}>
              <div className={styles.wireframeBorder}></div>
              <img
                src={resolveImage(data.image)}
                alt="Parth Printtech State-of-the-art facility"
                className={styles.facilityImage}
                onError={(e) => {
                  e.currentTarget.src = "/images/marketplace/Screenshot 2026-09-18 164510.png";
                }}
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutWhoWeAre;
