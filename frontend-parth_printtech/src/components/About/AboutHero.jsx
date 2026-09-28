"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./AboutHero.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const initialHero = {
  title: "Engineering Packaging With",
  titleHighlight: "Precision",
  description:
    "Since 2009, Parth Printtech has been delivering high-quality packaging and labeling solutions. We specialize in PVC Shrink Sleeves, PETG Shrink Sleeves, BOPP Wrap-Around Labels, Heat Transfer Labels (HTL), and Plain PVC Shrink Film, with a focus on quality, precision, and reliable performance.",
  videoSrc: "/videos/video-3.mp4",
  ctaText: "Get a Quote",
  ctaLink: "/contact",
  image1: "/images/Who_We_Are.jpg",
  image2: "/images/products/bopp_label.png",
  image3: "/images/products/pvc_shrink_sleeves.png"
};

const AboutHero = () => {
  const containerRef = useRef(null);
  const [heroData, setHeroData] = useState(initialHero);

  useEffect(() => {
    async function loadAboutHero() {
      try {
        const res = await fetch(`${API_BASE}/about`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.hero) {
            setHeroData((prev) => ({
              ...prev,
              ...json.data.hero
            }));
          }
        }
      } catch (err) {
        // Keep fallback
      }
    }
    loadAboutHero();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Entrance animation for text
      gsap.fromTo(
        ".hero-text-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out"
        }
      );

      // Entrance animation for the structural grid collage
      gsap.fromTo(
        ".collage-item",
        { scale: 0.95, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [heroData]);

  const resolveMedia = (src, fallback) => {
    if (!src || src.trim() === "") return fallback;
    const cleanSrc = src.trim();
    if (cleanSrc.startsWith("/uploads/")) return `http://localhost:5000${cleanSrc}`;
    return cleanSrc;
  };

  return (
    <section ref={containerRef} className={styles.heroSection}>
      {/* Background Video */}
      <video
        key={heroData.videoSrc}
        autoPlay
        muted
        loop
        playsInline
        className={styles.bgVideo}
      >
        <source src={resolveMedia(heroData.videoSrc, "/videos/video-3.mp4")} type="video/mp4" />
      </video>

      {/* Blueprint Grid Lines Overlay */}
      <div className={styles.blueprintOverlay}>
        <div className={styles.gridLineX}></div>
        <div className={styles.gridLineY}></div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left Block: Modern Typography & Copy */}
          <div className={styles.contentBlock}>
            <h1 className={`${styles.title} hero-text-reveal`}>
              {heroData.title}{" "}
              <span className={styles.accentText}>{heroData.titleHighlight}</span>
            </h1>
            <p className={`${styles.description} hero-text-reveal`}>
              {heroData.description}
            </p>

            <div className={`${styles.ctaWrapper} hero-text-reveal`}>
              <Link href={heroData.ctaLink || "/contact"} className={styles.ctaButton}>
                <span>{heroData.ctaText || "Get a Quote"}</span>
                <div className={styles.btnIcon}>
                  <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Block: Premium Integrated Production Showcase */}
          <div className={styles.showcaseBlock}>
            <div className={styles.showcaseContainer}>
              {/* Primary Feature Card: Polaris S7 Rotogravure Press */}
              <div className={`${styles.showcaseCard} ${styles.mainCard} collage-item`}>
                <img
                  src={resolveMedia(heroData.image1, "/images/Who_We_Are.jpg")}
                  alt="Polaris S7 Rotogravure Printing Press"
                  className={styles.mainImg}
                  onError={(e) => {
                    if (!e.currentTarget.dataset.failed) {
                      e.currentTarget.dataset.failed = "true";
                      e.currentTarget.src = "/images/Who_We_Are.jpg";
                    }
                  }}
                />
              </div>

              {/* Secondary Duo: Materials & Final Product */}
              <div className={styles.subGrid}>
                {/* Product 1: BOPP / Rollstock */}
                <div className={`${styles.showcaseCard} ${styles.subCard} collage-item`}>
                  <img
                    src={resolveMedia(heroData.image2, "/images/products/bopp_label.png")}
                    alt="BOPP Wrap-Around Labels"
                    className={`${styles.subImg} ${styles.rollImg}`}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.failed) {
                        e.currentTarget.dataset.failed = "true";
                        e.currentTarget.src = "/images/products/bopp_label.png";
                      }
                    }}
                  />
                </div>

                {/* Product 2: Finished Shrink Sleeves */}
                <div className={`${styles.showcaseCard} ${styles.subCard} collage-item`}>
                  <img
                    src={resolveMedia(heroData.image3, "/images/products/pvc_shrink_sleeves.png")}
                    alt="PVC & PETG Shrink Sleeves"
                    className={`${styles.subImg} ${styles.bottleImg}`}
                    onError={(e) => {
                      if (!e.currentTarget.dataset.failed) {
                        e.currentTarget.dataset.failed = "true";
                        e.currentTarget.src = "/images/products/pvc_shrink_sleeves.png";
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
