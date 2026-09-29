"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutVisionMission.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://updatedparthprinttech.onrender.com/api";

const initialVisionMission = {
  title: "Driven By Purpose,",
  titleHighlight: "Built For Quality",
  description: "We are committed to redefining packaging standards through precision, consistent quality, and innovative printing solutions. Every product we create reflects our dedication to durability, vibrant color, and superior craftsmanship.",
  cards: [
    {
      id: "vision",
      title: "Our Vision",
      description: "To become a trusted leader in the printing and packaging industry by delivering innovative, sustainable, and high-quality labeling solutions."
    },
    {
      id: "mission",
      title: "Our Mission",
      description: "To provide reliable printing and packaging solutions with advanced technology, consistent quality, and a strong commitment to customer satisfaction."
    },
    {
      id: "philosophy",
      title: "Our Philosophy",
      description: "We believe quality starts with the process. Every product is made with precision, attention to detail, and a commitment to delivering packaging solutions that add value to every brand."
    }
  ]
};

const cardIcons = {
  vision: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="3" r="3" />
    </svg>
  ),
  mission: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 9.17 4.24-4.24" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
  philosophy: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
};

const colorClasses = [styles.cyanCard, styles.magentaCard, styles.yellowCard];

const RegistrationMark = ({ style }) => (
  <div className={styles.regMark} style={style}>
    <div className={styles.regMarkCircle}></div>
  </div>
);

const VisionMissionCard = ({ card, index }) => {
  const cardWrapperRef = useRef(null);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !cardWrapperRef.current) return;
    const rect = cardWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = -(y - yc) / (rect.height / 8);
    const rotateY = (x - xc) / (rect.width / 8);

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
      className={`${styles.cardWrapper} vm-card-reveal`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className={`${styles.card} ${colorClasses[index % colorClasses.length]}`}
      >
        <div className={styles.boxFlap}></div>
        <div className={styles.dieCutLine}></div>

        <div className={styles.colorStrip}>
          <div className={`${styles.stripDot} ${styles.cyanDot}`}></div>
          <div className={`${styles.stripDot} ${styles.magentaDot}`}></div>
          <div className={`${styles.stripDot} ${styles.yellowDot2}`}></div>
          <div className={`${styles.stripDot} ${styles.keyDot}`}></div>
        </div>

        <div className={styles.iconWrapper}>
          {cardIcons[card.id] || cardIcons.vision}
        </div>
        <h3 className={styles.cardTitle}>{card.title}</h3>
        <p className={styles.cardDesc}>{card.description}</p>
      </div>
    </div>
  );
};

const AboutVisionMission = () => {
  const containerRef = useRef(null);
  const [data, setData] = useState(initialVisionMission);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/about`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.visionMission) {
            setData(json.data.visionMission);
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
      // Fade/slide up section header
      gsap.fromTo(
        ".vm-header-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".vm-section-trigger",
            start: "top 80%",
          },
        }
      );

      // Staggered fade/scale in the cards
      gsap.fromTo(
        ".vm-card-reveal",
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".vm-grid-trigger",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [data]);

  return (
    <section ref={containerRef} className={`${styles.section} vm-section-trigger`}>
      {/* Ambient Floating Background */}
      <div className={styles.bgBlobsContainer}>
        <div className={`${styles.bgBlob} ${styles.blobCyan}`}></div>
        <div className={`${styles.bgBlob} ${styles.blobMagenta}`}></div>
        <div className={`${styles.bgBlob} ${styles.blobYellow}`}></div>
      </div>

      {/* Blueprint Grid and Print Registration Marks */}
      <div className={styles.registrationGrid}>
        <RegistrationMark style={{ left: "4%", top: "6%" }} />
        <RegistrationMark style={{ right: "4%", top: "6%" }} />
        <RegistrationMark style={{ left: "4%", bottom: "6%" }} />
      </div>

      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.header}>
          <h2 className={`${styles.title} vm-header-reveal`}>
            {data.title} <span className={styles.accentText}>{data.titleHighlight}</span>
          </h2>
          <p className={`${styles.description} vm-header-reveal`}>
            {data.description}
          </p>
        </div>

        {/* Grid of Hover Interactive Cards */}
        <div className={`${styles.grid} vm-grid-trigger`}>
          {(data.cards || []).map((card, idx) => (
            <VisionMissionCard key={card.id || idx} card={card} index={idx} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutVisionMission;
