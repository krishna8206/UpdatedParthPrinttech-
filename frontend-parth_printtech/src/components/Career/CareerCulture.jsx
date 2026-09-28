"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./CareerCulture.module.css";

gsap.registerPlugin(ScrollTrigger);

const defaultCultureItems = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Safety First, Always",
    desc: "We maintain the highest workplace safety standards in every production zone. Our team works in certified, hazard-free environments with regular audits and training.",
    chips: ["ISO Certified", "Safety Audits"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
        <line x1="9" y1="9" x2="9.01" y2="9"/>
        <line x1="15" y1="9" x2="15.01" y2="9"/>
      </svg>
    ),
    title: "Collaborative Culture",
    desc: "Cross-functional teams, open office layouts, and a flat hierarchy. Ideas come from everywhere — whether you're on the press floor or in the design studio.",
    chips: ["Flat Hierarchy", "Team Sprints"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    title: "Continuous Growth",
    desc: "Annual skill workshops, sponsored certifications, and mentorship programs. We invest in your development at every stage of your career.",
    chips: ["L&D Budget", "Mentorship"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: "Competitive Benefits",
    desc: "Performance bonuses, medical insurance, paid time off, and flexible shifts. We reward excellence with packages that reflect your true value.",
    chips: ["Health Insurance", "Performance Pay"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: "Diverse & Inclusive",
    desc: "We celebrate every background, language, and perspective. Our workforce spans multiple states and communities with zero tolerance for discrimination.",
    chips: ["Equal Opportunity", "Multilingual Team"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    title: "Recognition & Impact",
    desc: "Employee spotlights, annual awards, and project ownership. Your contributions are visible, credited, and celebrated across the organization.",
    chips: ["Monthly Awards", "Impact-driven"],
  },
];

const getIconForIndex = (index) => {
  return defaultCultureItems[index % defaultCultureItems.length].icon;
};

const CareerCulture = ({ cultureData = {} }) => {
  const sectionRef = useRef(null);

  const title = cultureData?.title || "Work Where";
  const titleHighlight = cultureData?.titleHighlight || "Precision";
  const titleRest = cultureData?.titleRest !== undefined ? cultureData.titleRest : "Meets Passion";
  const description = cultureData?.description || "We don't just make packaging — we build careers with purpose. Here's what sets life at Parth Printtech apart.";
  const items = cultureData?.items && cultureData.items.length > 0 ? cultureData.items : defaultCultureItems;

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".culture-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".culture-header",
            start: "top 80%",
          },
        }
      );
      gsap.fromTo(
        ".culture-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".culture-card",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.blueprintOverlay}></div>
      <div className={styles.bgBlobsContainer}>
        <div className={`${styles.bgBlob} ${styles.blobA}`}></div>
        <div className={`${styles.bgBlob} ${styles.blobB}`}></div>
      </div>

      <div className={styles.container}>
        <div className={`${styles.header} culture-header`}>
          <h2 className={styles.title}>
            {title} <span className={styles.accentText}>{titleHighlight}</span> {titleRest}
          </h2>
          <p className={styles.description}>
            {description}
          </p>
        </div>

        <div className={styles.grid}>
          {items.map((item, i) => (
            <div key={item.id || i} className={`${styles.card} culture-card`}>
              <div className={styles.dieCutLine}></div>
              <div className={styles.colorStrip}></div>
              <div className={styles.iconContainer}>{item.icon || getIconForIndex(i)}</div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDesc}>{item.desc}</p>
              <div className={styles.specRow}>
                {(item.chips || []).map((chip, ci) => (
                  <span key={ci} className={styles.specChip}>{chip}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareerCulture;
