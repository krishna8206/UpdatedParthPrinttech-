"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutHistory.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://updatedparthprinttech.onrender.com/api";

const initialHistory = {
  badgeLabel: "2009 – 2026 EVOLUTION",
  title: "Our Journey of",
  titleHighlight: "Evolution",
  centerBadge: "17 YEARS",
  inception: {
    year: "2009",
    tag: "INCEPTION",
    title: "Founding Printing Setup",
    description: "Established core B2B label & packaging operations."
  },
  current: {
    year: "2026",
    tag: "GLOBAL LEADER",
    title: "Global Packaging Reach",
    description: "Supplying 50+ industries with automated precision."
  }
};

const AboutHistory = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState(initialHistory);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/about`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.history) {
            setData(json.data.history);
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
      // Fade-in section reveal
      gsap.fromTo(
        ".evolution-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <section ref={containerRef} className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={`${styles.header} evolution-reveal`}>
          <span className={styles.badgeLabel}>{data.badgeLabel || "2009 – 2026 EVOLUTION"}</span>
          <h2 className={styles.title}>
            {data.title} <span className={styles.accentText}>{data.titleHighlight}</span>
          </h2>
        </div>

        {/* Compact Aligned 2-Card Transformation */}
        <div className={`${styles.evolutionGrid} evolution-reveal`}>
          {/* 2009 Card */}
          <div className={`${styles.card} ${styles.card2009}`}>
            <div className={styles.cardHeader}>
              <span className={styles.yearNumber}>{data.inception?.year || "2009"}</span>
              <span className={styles.tagPill}>{data.inception?.tag || "INCEPTION"}</span>
            </div>
            <h3 className={styles.cardTitle}>{data.inception?.title || "Founding Printing Setup"}</h3>
            <p className={styles.cardSub}>{data.inception?.description || "Established core B2B label & packaging operations."}</p>
          </div>

          {/* Center Connector */}
          <div className={styles.connector}>
            <div className={styles.line}></div>
            <div className={styles.badge}>
              <span>{data.centerBadge || "17 YEARS"}</span>
            </div>
          </div>

          {/* 2026 Card */}
          <div className={`${styles.card} ${styles.card2026}`}>
            <div className={styles.cardHeader}>
              <span className={`${styles.yearNumber} ${styles.yearActive}`}>{data.current?.year || "2026"}</span>
              <span className={styles.tagPillActive}>{data.current?.tag || "GLOBAL LEADER"}</span>
            </div>
            <h3 className={styles.cardTitle}>{data.current?.title || "Global Packaging Reach"}</h3>
            <p className={styles.cardSub}>{data.current?.description || "Supplying 50+ industries with automated precision."}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHistory;
