"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutFounders.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const RegistrationMark = ({ style }) => (
  <div className={styles.regMark} style={style}>
    <div className={styles.regMarkCircle}></div>
  </div>
);

const defaultFoundersData = {
  subtitle: "LEADERSHIP & VISION",
  title: "Meet Our",
  titleHighlight: "Founders",
  description: "Driven by technical innovation and an unwavering commitment to packaging excellence.",
  image: "/images/clients/world_map_blueprint.png",
  badgeText: "FOUNDERS & DIRECTORS",
  foundersList: [
    {
      id: "1",
      index: "01",
      name: "Parth Patel",
      description: "Leading strategic vision and technology adoption in high-precision shrink sleeves and printing innovation."
    },
    {
      id: "2",
      index: "02",
      name: "Shailesh Patel",
      description: "Pioneering industrial print engineering, rotogravure calibrations, and operational excellence across commercial markets."
    }
  ]
};

const resolveMedia = (src, fallback) => {
  if (!src || src.trim() === "") return fallback;
  const cleanSrc = src.trim();
  if (cleanSrc.startsWith("/uploads/")) return `http://localhost:5000${cleanSrc}`;
  return cleanSrc;
};

const AboutFounders = () => {
  const sectionRef = useRef(null);
  const [data, setData] = useState(defaultFoundersData);

  useEffect(() => {
    async function loadFoundersData() {
      try {
        const res = await fetch(`${API_BASE}/about`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data && json.data.founders) {
            setData((prev) => ({
              ...prev,
              ...json.data.founders,
              foundersList: json.data.founders.foundersList && json.data.founders.foundersList.length > 0
                ? json.data.founders.foundersList
                : prev.foundersList
            }));
          }
        }
      } catch (err) {
        // Keep fallback
      }
    }
    loadFoundersData();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        ".ab-founders-reveal",
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

      // Card animation
      gsap.fromTo(
        ".ab-founders-card",
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  const founders = data.foundersList || defaultFoundersData.foundersList;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.blueprintOverlay}></div>

      {/* Alignment Marks */}
      <div className={styles.registrationOverlay}>
        <RegistrationMark style={{ left: "3%", top: "4%" }} />
        <RegistrationMark style={{ right: "3%", top: "4%" }} />
        <RegistrationMark style={{ left: "3%", bottom: "4%" }} />
        <RegistrationMark style={{ right: "3%", bottom: "4%" }} />
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <div className={`${styles.subtitle} ab-founders-reveal`}>
            <span className={styles.blueDot}></span> {data.subtitle || "LEADERSHIP & VISION"}
          </div>
          <h2 className={`${styles.title} ab-founders-reveal`}>
            {data.title || "Meet Our"}{" "}
            <span className={styles.accentText}>{data.titleHighlight || "Founders"}</span>
          </h2>
          <p className={`${styles.description} ab-founders-reveal`}>
            {data.description || "Driven by technical innovation and an unwavering commitment to packaging excellence."}
          </p>
        </div>

        {/* 1 Image on the left + Names & descriptions on the right */}
        <div className={`${styles.foundersCard} ab-founders-card`}>
          
          {/* Single Image Column */}
          <div className={styles.imageColumn}>
            <div className={styles.imageFrame}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveMedia(data.image, "/images/clients/world_map_blueprint.png")}
                alt="Parth Printtech Founders"
                className={styles.founderImage}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  if (!e.currentTarget.dataset.failed) {
                    e.currentTarget.dataset.failed = "true";
                    e.currentTarget.src = "/images/world_map_blueprint.png";
                  }
                }}
              />
              <div className={styles.imageOverlayBadge}>
                <span>{data.badgeText || "FOUNDERS & DIRECTORS"}</span>
              </div>
            </div>
          </div>

          {/* Founders Details Column */}
          <div className={styles.detailsColumn}>
            {founders.map((founder, idx) => (
              <React.Fragment key={founder.id || idx}>
                {idx > 0 && <div className={styles.divider}></div>}
                <div className={styles.founderBlock}>
                  <div className={styles.founderHeader}>
                    <span className={styles.founderIndex}>{founder.index || `0${idx + 1}`}</span>
                    <div>
                      <h3 className={styles.founderName}>{founder.name}</h3>
                    </div>
                  </div>
                  <p className={styles.founderDesc}>
                    {founder.description}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default AboutFounders;
