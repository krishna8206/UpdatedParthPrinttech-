"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./MarketsWeServe.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const marketsList = [
  {
    id: "food",
    title: "Food Packaging",
    description: "Vibrant moisture-resistant shrink sleeves, stand-up pouch film rolls, and custom-calibrated food container labels.",
    products: ["Stand-Up Pouches", "Shrink Sleeves", "Contour Labels"],
    accentColor: "#ff7a00",
    image: "/images/products/pvc_shrink_sleeves.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 26 l3-14 h10 l3 14 v22 h-16 z" fill="#009fe3" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="18" y="8" width="4" height="4" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="15" y="24" width="10" height="10" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" />
        <line x1="18" y1="29" x2="22" y2="29" stroke="#1a1a1a" strokeWidth="1.5" />
        <path d="M28 20 l3-10 h12 l3 10 v28 h-18 z" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="33" y="6" width="4" height="4" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M32 30 Q37 27 42 30 v8 Q37 40 32 38 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "beverages",
    title: "Beverages",
    description: "Waterproof bottle labels, high-shrink sleeves, and BOPP wrap-around labels built to survive condensation and high-speed filling lines.",
    products: ["Wet Glue Labels", "Shrink Sleeves", "BOPP Wrap-Arounds"],
    accentColor: "#009fe3",
    image: "/images/products/bopp_label.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="14" y="28" width="36" height="20" rx="3" fill="#1b365d" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle cx="23" cy="38" r="3" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M22 28 v-12 h4 v12 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M20 28 h8 v6 h-8 z" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" />
        <rect x="23" y="12" width="2" height="4" fill="#1a1a1a" />
        <path d="M30 28 v-12 h4 v12 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M28 28 h8 v6 h-8 z" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" />
        <rect x="31" y="12" width="2" height="4" fill="#1a1a1a" />
        <rect x="42" y="24" width="8" height="24" rx="2" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" />
        <ellipse cx="46" cy="24" rx="4" ry="1.5" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="44" y="32" width="4" height="8" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "personal-care",
    title: "Personal Care",
    description: "Premium cosmetic labels, hot-stamped metallic sleeves, and squeeze tube labels with tactile UV finishes.",
    products: ["Cosmetics Labels", "Hot Foil Sleeves", "Squeeze Tube Labels"],
    accentColor: "#e91e63",
    image: "/images/products/petg_shrink_sleeves.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="16" y="20" width="12" height="28" rx="2" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M16 20 q6-4 12 0 z" fill="#009fe3" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M20 16 h4 v4 h-4 z" fill="#1a1a1a" />
        <rect x="23" y="14" width="3" height="2" fill="#1a1a1a" />
        <path d="M29 13 q3-3 6-2 M29 16 q4-1 7 2" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M34 26 h14 v22 h-14 z" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M39 26 v-6 h4 v6" stroke="#1a1a1a" strokeWidth="2" fill="none" />
        <path d="M36 20 h10 l-2-3 h-6 z" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="2.5" />
        <rect x="37" y="32" width="8" height="10" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "family-care",
    title: "Family Care",
    description: "Moisture-resistant label solutions, wrap-around films, and tamper-evident shrink bands for household essentials.",
    products: ["Detergent Labels", "Tamper Bands", "Soap Wraps"],
    accentColor: "#4caf50",
    image: "/images/products/plain_pvc_shrink_film.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="28" y="24" width="22" height="24" rx="3" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2.5" />
        <ellipse cx="39" cy="24" rx="8" ry="3" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="39" cy="36" r="5" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="1.5" />
        <circle cx="37" cy="35" r="0.7" fill="#1a1a1a" />
        <circle cx="41" cy="35" r="0.7" fill="#1a1a1a" />
        <path d="M37 38 q2 2 4 0" fill="none" stroke="#1a1a1a" strokeWidth="1" />
        <path d="M14 18 h10 l-3 24 h-4 z" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="16" y="42" width="6" height="6" fill="#1a1a1a" stroke="#1a1a1a" strokeWidth="1" />
        <rect x="14.5" y="22" width="9" height="4" fill="#009fe3" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "pharmaceuticals",
    title: "Pharmaceuticals",
    description: "High-precision vial labels, medical container sleeves, and tamper-evident security labels with high-contrast print.",
    products: ["Vial Labels", "Security Sleeves", "Directional Labels"],
    accentColor: "#00bcd4",
    image: "/images/products/product_labels.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 22 h12 v26 h-12 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="29" y="16" width="6" height="6" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="29" y="28" width="6" height="6" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="1.5" />
        <line x1="32" y1="26" x2="32" y2="36" stroke="#e33f3b" strokeWidth="2" />
        <line x1="27" y1="31" x2="37" y2="31" stroke="#e33f3b" strokeWidth="2" />
        <rect x="12" y="38" width="10" height="14" rx="5" transform="rotate(-45 17 45)" fill="#009fe3" stroke="#1a1a1a" strokeWidth="2.5" />
        <line x1="14" y1="46" x2="22" y2="38" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="12" cy="48" r="4" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="9" y1="48" x2="15" y2="48" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    id: "dairy",
    title: "Dairy Products",
    description: "Moisture-resistant shrink sleeves, protective cup lids, and temperature-stable dairy container labels.",
    products: ["Yogurt Cup Lids", "Butter Wraps", "Dairy Sleeves"],
    accentColor: "#9c27b0",
    image: "/images/products/in_mould_labels.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 20 l4-6 h12 l4 6 v28 h-20 z" fill="#009fe3" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M20 28 Q26 24 32 28 v10 Q26 32 20 34 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M38 28 h12 l-2 20 h-8 z" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="44" cy="28" rx="7" ry="2" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "oil-lubricants",
    title: "Oils & Lubricants",
    description: "Heavy-duty labels, greaseproof container graphics, and high-tack industrial adhesives that endure rough handling.",
    products: ["Engine Oil Labels", "Grease Canister Labels", "Industrial Drum Decals"],
    accentColor: "#ff5722",
    image: "/images/products/pvc_lamination_films.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 22 h18 v26 h-18 z" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M24 24 h-4 v14 h4" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <rect x="30" y="16" width="6" height="6" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2" />
        <rect x="24" y="32" width="18" height="8" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M14 32 h8 v16 h-8 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" />
        <path d="M16 32 v-4 h4 v4" stroke="#1a1a1a" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    id: "paints",
    title: "Paints",
    description: "Vibrant, chemical-resistant bucket labels and heat transfer container graphics with industry-leading color calibration.",
    products: ["Paint Can Labels", "Heat Transfer Graphics", "Bucket Labels"],
    accentColor: "#f6cf00",
    image: "/images/products/htl_paint_pails.png",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 22 h20 l-3 26 h-14 z" fill="#cbd5e1" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M16 22 Q28 8 40 22" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
        <rect x="17.2" y="30" width="21.6" height="8" fill="#009fe3" stroke="#1a1a1a" strokeWidth="2" />
        <path d="M40 28 l6 20 h-4 l-6-20 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" />
        <rect x="40" y="24" width="4" height="4" fill="#e33f3b" stroke="#1a1a1a" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: "chemical-fertilizer",
    title: "Chemical & Fertilizer",
    description: "Hazard-resistant labeling, chemical-shielded stickers, and heavy-duty container labels with razor-sharp warning print.",
    products: ["Hazard Warning Labels", "Drum Stickers", "Chemical Resisting Labels"],
    accentColor: "#607d8b",
    image: "/images/products/htl_label_buckets.jpg",
    icon: (
      <svg viewBox="0 0 64 64" className={styles.paperSvg}>
        <line x1="8" y1="54" x2="56" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 5" />
        <line x1="16" y1="54" x2="48" y2="54" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M16 48 L26 22 V14 h6 v8 L42 48 z" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="2.5" strokeLinejoin="round" />
        <ellipse cx="29" cy="42" rx="8" ry="3" fill="#e33f3b" />
        <rect x="36" y="24" width="16" height="24" rx="2" fill="#009fe3" stroke="#1a1a1a" strokeWidth="2.5" />
        <circle cx="44" cy="34" r="3" fill="#f2ebd9" stroke="#1a1a1a" strokeWidth="1.5" />
      </svg>
    ),
  }
];

const resolveMedia = (src, fallback) => {
  if (!src || typeof src !== "string" || src.trim() === "") return fallback;
  const cleanSrc = src.trim();
  if (cleanSrc.startsWith("/uploads/")) return `http://localhost:5000${cleanSrc}`;
  return cleanSrc;
};

const MarketsWeServe = ({ data }) => {
  const containerRef = useRef(null);

  const title = data?.title || "Markets We";
  const titleHighlight = data?.titleHighlight || "Serve";
  const description = data?.description || "We combine high-precision gravure printing and customized packaging prototypes to deliver premium solutions across diverse industrial sectors.";

  // Merge dynamic items with existing images/icons
  const items = (data?.items && data.items.length > 0)
    ? data.items.map((item, idx) => {
        const fallback = marketsList.find((m) => m.id === item.id) || marketsList[idx % marketsList.length];
        // Normalize products – backend may return a string or an array
        const products = Array.isArray(item.products)
          ? item.products
          : typeof item.products === "string"
          ? item.products.split(",").map((s) => s.trim()).filter(Boolean)
          : fallback?.products || [];
        return {
          ...item,
          products,
          image: item.image || item.photo || fallback?.image || "/images/products/pvc_shrink_sleeves.png",
          accentColor: item.accentColor || fallback?.accentColor || "#009fe3"
        };
      })
    : marketsList;

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal the main section on scroll
      gsap.fromTo(
        ".markets-section-reveal",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // Stagger reveal the paper card wraps
      gsap.fromTo(
        ".paper-card-reveal",
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".paper-cards-grid",
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
    <section ref={containerRef} className={`${styles.section} markets-trigger-section`}>
      {/* Interactive Background Graphics */}
      <div className={styles.interactiveBg}>
        <div className={`${styles.floatShape} ${styles.shape1}`}></div>
        <div className={`${styles.floatShape} ${styles.shape2}`}></div>
        <div className={`${styles.floatShape} ${styles.shape3}`}></div>
      </div>
      <div className={`${styles.container} markets-section-reveal`}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {title} <span className={styles.outlinedText}>{titleHighlight}</span>
          </h2>
          <p className={styles.description}>
            {description}
          </p>
        </div>

        {/* Fanned Paper Cards Grid */}
        <div className={`${styles.grid} paper-cards-grid`}>
          {items.map((market) => (
            <div key={market.id} className={`${styles.cardWrapper} paper-card-reveal`}>
              {/* Back fanning paper sheets */}
              <div className={`${styles.paperLayer} ${styles.layerBack}`} style={{ backgroundColor: `${market.accentColor}12` }}></div>
              <div className={`${styles.paperLayer} ${styles.layerMiddle}`} style={{ backgroundColor: `${market.accentColor}25` }}></div>
              
              {/* Main Card Sheet */}
              <div className={styles.mainCard} style={{ "--accent-color": market.accentColor }}>
                {/* Print registration marks (CMYK dots) at top right */}
                <div className={styles.registrationMarks}>
                  <span className={`${styles.regDot} ${styles.cyan}`}></span>
                  <span className={`${styles.regDot} ${styles.magenta}`}></span>
                  <span className={`${styles.regDot} ${styles.yellow}`}></span>
                  <span className={`${styles.regDot} ${styles.key}`}></span>
                </div>

                {/* Packaging / Product Image Showcase */}
                <div className={styles.imageContainer}>
                  <img
                    src={resolveMedia(market.image, "/images/products/pvc_shrink_sleeves.png")}
                    alt={market.title}
                    className={styles.marketImage}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/images/products/pvc_shrink_sleeves.png";
                    }}
                  />
                </div>
                <h3 className={styles.cardTitle}>{market.title}</h3>
                <p className={styles.cardDesc}>{market.description}</p>

                {/* Specific printed products badges */}
                <div className={styles.tagsContainer}>
                  {(market.products || []).map((prod, idx) => (
                    <span key={idx} className={styles.tag}>
                      <span className={styles.tagDot} style={{ backgroundColor: market.accentColor }}></span>
                      {prod}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketsWeServe;
