"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./WhoWeAre.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultWhoWeAre = {
  subheading: "WHO WE ARE",
  headingLine1: "High-Speed",
  headingLine2Highlight: "Rotogravure",
  headingLine2Rest: "Printing.",
  description: "At Parth Printtech, we redefine flexible packaging through advanced engineering and high-speed precision. Powered by our state-of-the-art Polaris S7 Series multi-station rotogravure press, we deliver micron-accurate printing on PVC, PETG, and BOPP shrink films with unmatched color fidelity and razor-sharp registration.",
  image: "/images/polaris_s7_series.png",
  badgeText: "• POLARIS S7 ROTOGRAVURE • PARTH PRINTTECH •",
  features: [
    "Electronic Line Shaft (ELS) Drive",
    "High-Speed Output up to 350 m/min",
    "Automatic Register & Web Tension",
    "Micro-Precision Dot Fidelity"
  ],
  stats: [
    { 
      num: "9+", 
      label: "Color Stations", 
      backText: "Multi-station Polaris S7 rotogravure press with automated ink circulation & viscosity management." 
    },
    { 
      num: "350+", 
      label: "M/Min High Speed", 
      backText: "Rapid turnaround and large-scale industrial packaging without compromising print fidelity." 
    }
  ],
  floatCards: [
    { 
      title: "Polaris S7 Series Press", 
      desc: "Advanced multi-station rotogravure with automated register control." 
    },
    { 
      title: "Micro-Precision Fidelity", 
      desc: "Flawless dot reproduction & vibrant saturation on PVC, PETG & BOPP." 
    }
  ]
};

const WhoWeAre = ({ data }) => {
  const content = data ? { ...defaultWhoWeAre, ...data } : defaultWhoWeAre;
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Smooth subtle zoom parallax on the machine photo
      gsap.fromTo(".creative-media",
        { scale: 1.04 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );

      // Rotating circular badge
      gsap.to(".rotating-badge", {
        rotation: 360,
        ease: "none",
        repeat: -1,
        duration: 15,
      });

      // Reveal massive text lines
      gsap.fromTo(".reveal-text",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
          },
        }
      );

      // Stagger fade in the floating glass cards
      gsap.fromTo(".float-card",
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.creativeSection}>

      <div className={styles.mainGrid}>

        {/* Left Side: Massive Typography & Content */}
        <div className={`${styles.contentBlock} content-block`}>
          <div className={`${styles.subheading} reveal-text`}>
            <span className={styles.blueDot}></span> {content.subheading}
          </div>

          <h2 className={styles.heading}>
            <div className="reveal-text">{content.headingLine1 || "High-Speed"}</div>
            <div className="reveal-text">
              <span className={styles.outlinedText}>{content.headingLine2Highlight || "Rotogravure"}</span>{" "}
              {content.headingLine2Rest || "Printing."}
            </div>
          </h2>

          <div className={`${styles.descriptionWrapper} reveal-text`}>
            <p className={styles.description}>
              {content.description}
            </p>

            {/* Core Capability Checklist */}
            {content.features && (
              <div className={styles.featureGrid}>
                {content.features.map((feat, idx) => (
                  <div key={idx} className={styles.featureItem}>
                    <div className={styles.featureCheck}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#009fe3" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            )}

            <div className={styles.statsContainer}>
              {(content.stats || []).map((stat, idx) => (
                <div key={idx} className={styles.flipCard}>
                  <div className={styles.flipCardInner}>
                    <div className={styles.flipCardFront}>
                      <h4 className={styles.statNum}>{stat.num}</h4>
                      <p className={styles.statLabel}>{stat.label}</p>
                    </div>
                    <div className={styles.flipCardBack}>
                      <p className={styles.flipText}>{stat.backText}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Creative Media Composition */}
        <div className={styles.mediaBlock}>

          <div className={styles.mediaContainer}>
            <div className={styles.mediaWrapper}>
              <img
                className={`${styles.mediaElement} creative-media`}
                src={content.image || "/images/polaris_s7_series.png"}
                alt="Polaris S7 Series Rotogravure Printing Press - Polygraph"
              />
            </div>

            {/* Circular Rotating Badge */}
            <div className={`${styles.badgeWrapper}`}>
              <svg viewBox="0 0 100 100" className={`${styles.circularText} rotating-badge`}>
                <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
                <text>
                  <textPath href="#circlePath" startOffset="0%">
                    {content.badgeText}
                  </textPath>
                </text>
              </svg>
              <div className={styles.badgeCenter}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#009fe3" strokeWidth="2.5"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v8M8 12h8" /></svg>
              </div>
            </div>

            {/* Floating Glass Cards */}
            <div className={`${styles.floatCardsContainer} float-cards-container`}>
              {(content.floatCards || []).map((fc, idx) => (
                <div
                  key={idx}
                  className={`${styles.floatCard} float-card`}
                >
                  <div className={styles.cardIcon}>
                    {idx === 0 ? (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#009fe3" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#009fe3" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    )}
                  </div>
                  <div>
                    <h5>{fc.title}</h5>
                    <p>{fc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
