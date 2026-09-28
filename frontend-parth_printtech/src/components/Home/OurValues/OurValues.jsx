"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./OurValues.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const valuesList = [
  {
    id: 1,
    title: "Precision Quality",
    description: "Every print dot, seaming line, and custom sleeve is manufactured under strict tolerance guidelines using next-generation color profiling.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m4.93 4.93 4.24 4.24" />
        <path d="m14.83 9.17 4.24-4.24" />
        <path d="m14.83 14.83 4.24 4.24" />
        <path d="m9.17 14.83-4.24 4.24" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Advanced Technology",
    description: "We invest in world-class rotogravure and CI flexo presses and automated sleeve seaming machinery to achieve unmatched output speeds and consistency.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M6.34 17.66l-1.41 1.41" />
        <path d="M19.07 4.93l-1.41 1.41" />
        <rect x="8" y="8" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Recyclable Print",
    description: "Committed to sustainable film sourcing, Recyclable  systems, and 100% recyclable polyester (PETG) shrink sleeves.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 1 9.8A7 7 0 0 1 11 20z" />
        <path d="M9 22a7 7 0 0 1-5.18-2.3" />
        <path d="M11 20v-4" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Custom Craftsmanship",
    description: "From custom pre-distortion graphic calibration to high-end embellishments like cold foil stamping and tactile spot UV coatings, we realize your brand's unique vision.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
];

const OurValues = ({ data }) => {
  const containerRef = useRef(null);

  const title = data?.title || "Our Values Shape";
  const titleHighlight = data?.titleHighlight || "Excellence";
  const description = data?.description || "We combine high-volume production efficiency with the precise touch of artisan detail to deliver top-tier commercial printing and packaging solutions.";

  const items = (data?.items && data.items.length > 0)
    ? data.items.map((item, idx) => {
        const fallback = valuesList[idx % valuesList.length];
        return {
          id: item.id || idx + 1,
          title: item.title,
          description: item.description,
          icon: fallback?.icon || valuesList[0].icon
        };
      })
    : valuesList;

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Animate Section Header
      gsap.fromTo(".value-header-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );

      // Animate Value Cards
      gsap.fromTo(".value-card-animate",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".value-cards-trigger",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className={`${styles.section} value-section-trigger`}>
      {/* Interactive Background Graphics */}
      <div className={styles.interactiveBg}>
        <div className={`${styles.floatShape} ${styles.shape1}`}></div>
        <div className={`${styles.floatShape} ${styles.shape2}`}></div>
        <div className={`${styles.floatShape} ${styles.shape3}`}></div>
      </div>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
    
          <h2 className={`${styles.title} value-header-reveal`}>
            {title} <span className={styles.outlinedText}>{titleHighlight}</span>
          </h2>
          <p className={`${styles.description} value-header-reveal`}>
            {description}
          </p>
        </div>

        {/* Values Grid */}
        <div className={`${styles.grid} value-cards-trigger`}>
          {items.map((val) => (
            <div key={val.id} className={`${styles.card} value-card-animate`}>
              <div className={styles.iconContainer}>
                <div className={styles.iconCircle}>
                  {val.icon}
                </div>
              </div>
              <h3 className={styles.cardTitle}>{val.title}</h3>
              <p className={styles.cardDesc}>{val.description}</p>
              <div className={styles.cardBackgroundEffect}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
