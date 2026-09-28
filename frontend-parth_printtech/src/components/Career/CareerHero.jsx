"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./CareerHero.module.css";

const CareerHero = ({ heroData = {} }) => {
  const containerRef = useRef(null);

  const title = heroData?.title || "Build Your Career,";
  const titleHighlight = heroData?.titleHighlight || "Print Your Future";
  const description = heroData?.description || "At Parth Printtech, we craft more than packaging — we build careers. Join a team of passionate engineers, designers, and print technicians pushing the boundaries of precision and creativity.";
  const ctaPrimaryText = heroData?.ctaPrimaryText || "View Open Roles";
  const ctaPrimaryLink = heroData?.ctaPrimaryLink || "#open-roles";
  const ctaSecondaryText = heroData?.ctaSecondaryText || "Talk to Us";
  const ctaSecondaryLink = heroData?.ctaSecondaryLink || "/contact";

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-text-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={styles.heroSection}>
      {/* Blueprint Grid Lines Overlay */}
      <div className={styles.blueprintOverlay}>
        <div className={styles.gridLineX}></div>
        <div className={styles.gridLineY}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.centerWrapper}>
          <div className={`${styles.subtitle} hero-text-reveal`}>
            <span className={styles.blueDot}></span>
            <span>CAREERS AT PARTH PRINTTECH</span>
          </div>

          <h1 className={`${styles.title} hero-text-reveal`}>
            {title}{" "}
            <span className={styles.accentText}>{titleHighlight}</span>
          </h1>

          <p className={`${styles.description} hero-text-reveal`}>
            {description}
          </p>

          <div className={`${styles.ctaWrapper} hero-text-reveal`}>
            <a href={ctaPrimaryLink} className={styles.ctaButton}>
              <span>{ctaPrimaryText}</span>
              <div className={styles.btnIcon}>
                <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </a>
            <Link href={ctaSecondaryLink} className={styles.ctaButtonOutline}>
              <span>{ctaSecondaryText}</span>
              <div className={styles.btnIcon}>
                <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerHero;
