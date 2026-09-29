"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Clients.module.css";
import { getMediaUrl } from "@/lib/media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultClientLogos = [
  {
    id: "gulab",
    name: "Gulab Oils",
    logoSrc: "/logo/gulab_oils.webp"
  },
  {
    id: "flexibond",
    name: "Flexibond",
    logoSrc: "/logo/flexibond.webp"
  },
  {
    id: "gokul",
    name: "Gokul Sweets",
    logoSrc: "/logo/gokul.png"
  }
];

const Clients = ({ data }) => {
  const sectionRef = useRef(null);

  const title = data?.title || "Trusted by the";
  const titleHighlight = data?.titleHighlight || "Industry Leaders";
  const description =
    data?.description ||
    "We design, manufacture, and print high-performance packaging and shrink sleeves for trusted market leaders like Gulab Oils, Flexibond, and Gokul Sweets.";

  // Process custom items or fallback to default preset brand logos
  const hasCustomItems = data?.items && data.items.length > 0;
  const list = hasCustomItems
    ? data.items.map((item, idx) => {
        const brandName = (item.brand || item.name || "").trim();
        const presetLogo = defaultClientLogos.find(
          (c) =>
            c.name.toLowerCase() === brandName.toLowerCase() ||
            c.name.toLowerCase() === (item.name || "").toLowerCase()
        );

        let rawSrc = getMediaUrl(item.logoUrl || presetLogo?.logoSrc || "");

        let fallbackLogo = null;
        if (!rawSrc) {
          const brandText = brandName || "Brand";
          const brandInitial = brandText.charAt(0).toUpperCase();
          const accentColor = item.color || "#009fe3";

          fallbackLogo = (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                width: "100%"
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${accentColor}, #0066cc)`,
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "14px",
                  boxShadow: `0 3px 8px ${accentColor}40`
                }}
              >
                {brandInitial}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-montserrat), sans-serif",
                  fontWeight: 800,
                  fontSize: "11.5px",
                  letterSpacing: "0.06em",
                  color: "#1e293b",
                  textTransform: "uppercase",
                  maxWidth: "90px",
                  textAlign: "center",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {brandText}
              </span>
            </div>
          );
        }

        return {
          id: item.id || idx + 1,
          name: brandName,
          logoSrc: rawSrc,
          logo: fallbackLogo
        };
      })
    : defaultClientLogos;

  const activeItems = list && list.length > 0 ? list : defaultClientLogos;

  // Build alternating / shuffled sequences across the 3 columns so that:
  // 1) Every column displays all the different client logos mixed and alternating.
  // 2) Horizontally and vertically adjacent cards feature different brands.
  const buildColumn = (items, offset) => {
    if (!items || items.length === 0) return [];
    const n = items.length;
    let seq = [];
    for (let i = 0; i < n; i++) {
      const idx = (i + offset) % n;
      seq.push(items[idx]);
    }
    // Repeat sequence to ensure at least 12 items for seamless infinite marquee loop
    let full = [];
    while (full.length < 12) {
      full = [...full, ...seq];
    }
    return full;
  };

  // Stagger offsets so columns show different logos simultaneously
  const col1 = buildColumn(activeItems, 2);
  const col2 = buildColumn(activeItems, 1);
  const col3 = buildColumn(activeItems, 0);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal header details
      gsap.fromTo(
        ".clients-reveal",
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );

      // Reveal logos block
      gsap.fromTo(
        ".clients-grid-reveal",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCard = (item, keyPrefix, idx) => (
    <div key={`${item.id || idx}-${keyPrefix}-${idx}`} className={styles.logoCard}>
      {item.logoSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.logoSrc}
          alt={item.name || "Client Logo"}
          className={styles.clientLogoImage}
        />
      ) : (
        item.logo
      )}
    </div>
  );

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.mainContainer}>
        {/* Left Side: Title & Description */}
        <div className={`${styles.contentSide} clients-reveal`}>
          <h2 className={styles.title}>
            {title} <span className={styles.outlinedText}>{titleHighlight}</span>
          </h2>
          <p className={styles.description}>{description}</p>
        </div>

        {/* Right Side: Triple Vertical Columns with alternating logos */}
        <div className={`${styles.marqueeSide} clients-grid-reveal`}>
          {/* Column 1 */}
          <div className={styles.column}>
            <div className={`${styles.track} ${styles.trackDown}`}>
              {col1.map((item, idx) => renderCard(item, "c1", idx))}
            </div>
          </div>

          {/* Column 2 */}
          <div className={styles.column}>
            <div className={`${styles.track} ${styles.trackUp}`}>
              {col2.map((item, idx) => renderCard(item, "c2", idx))}
            </div>
          </div>

          {/* Column 3 */}
          <div className={styles.column}>
            <div className={`${styles.track} ${styles.trackDown}`}>
              {col3.map((item, idx) => renderCard(item, "c3", idx))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Clients;
