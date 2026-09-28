"use client";

import React, { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Work.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const portfolioData = [
  {
    id: "mono-cartons",
    title: "Mono Carton Packaging",
    category: "Custom Board Cartons",
    description: "Premium packaging boxes with custom varnish, foil accents, and automated folding structures for FMCG, retail, and pharmaceutical products.",
    image: "/images/products/mono_cartons.png",
    specs: [
      { label: "Material", value: "350gsm Duplex Board" },
      { label: "Finishing", value: "Matte Aqueous + Spot UV" },
      { label: "Industry", value: "FMCG / Retail" }
    ]
  },
  {
    id: "luxury-boxes",
    title: "Rigid Luxury Gift Boxes",
    category: "Rigid Board Systems",
    description: "High-end rigid board packaging for perfumes, cosmetics, electronics, and VIP brand presentations, handcrafted to micron-level tolerance.",
    image: "/images/products/luxury_gift_boxes.png",
    specs: [
      { label: "Material", value: "1200gsm Rigid Kappa Board" },
      { label: "Finishing", value: "Hot Foil Stamping + Embossing" },
      { label: "Industry", value: "Cosmetics / Gifting" }
    ]
  },
  {
    id: "corrugated-boxes",
    title: "Corrugated Shipping Boxes",
    category: "Laminated Logistics Cartons",
    description: "Heavy-duty fluted cardboard shippers and product boxes with high-fidelity flexo printing for industrial transport and e-commerce distribution.",
    image: "/images/products/corrugated_boxes.png",
    specs: [
      { label: "Material", value: "3-Ply E-Flute Laminated Kraft" },
      { label: "Finishing", value: "Flexo Matte Inks" },
      { label: "Industry", value: "Industrial / E-Commerce" }
    ]
  },
  {
    id: "labels-rolls",
    title: "Premium Product Labels",
    category: "Self-Adhesive Labels",
    description: "High-speed roll-fed die-cut adhesive stickers, product identification labels, and warning overlays printed on premium glossy materials.",
    image: "/images/products/product_labels.png",
    specs: [
      { label: "Material", value: "Glossy Polypropylene Film" },
      { label: "Finishing", value: "UV Varnish Coating" },
      { label: "Industry", value: "Food, Cosmetics, Medical" }
    ]
  }
];

const PortfolioCard = ({ item }) => {
  const cardWrapperRef = useRef(null);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !cardWrapperRef.current) return;
    const rect = cardWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = -(y - yc) / (rect.height / 10);
    const rotateY = (x - xc) / (rect.width / 10);

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
      className={`${styles.cardWrapper} work-card-reveal`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={cardRef} className={styles.card}>
        <div className={styles.boxFlap}></div>
        <div className={styles.dieCutLine}></div>
        
        <div className={styles.colorStrip}>
          <div className={`${styles.stripDot} ${styles.cyanDot}`}></div>
          <div className={`${styles.stripDot} ${styles.magentaDot}`}></div>
          <div className={`${styles.stripDot} ${styles.yellowDot}`}></div>
          <div className={`${styles.stripDot} ${styles.keyDot}`}></div>
        </div>

        {/* Product Image Showcase */}
        <div className={styles.imageFrame}>
          <img 
            src={item.image} 
            alt={item.title} 
            className={styles.productImg}
            onError={(e) => {
              // Graceful fallback for placeholder visual
              e.target.src = "data:image/svg+xml;utf8,<svg viewBox='0 0 400 300' xmlns='http://www.w3.org/2000/svg'><rect width='100%' height='100%' fill='%23fafbfc'/><text x='50%' y='50%' font-family='sans-serif' font-size='16' fill='%236c757d' text-anchor='middle'>PARTH PRINTTECH</text></svg>";
            }}
          />
        </div>

        {/* Text Details */}
        <span className={styles.categoryLabel}>{item.category}</span>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDesc}>{item.description}</p>

        {/* Specifications List */}
        <div className={styles.specificationsList}>
          {item.specs.map((spec, idx) => (
            <div key={idx} className={styles.specItem}>
              <span className={styles.specLabel}>{spec.label}</span>
              <span className={styles.specValue}>{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WorkPage = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Reveal header details
      gsap.fromTo(
        ".work-header-reveal",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // Reveal grid cards
      gsap.fromTo(
        ".work-card-reveal",
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".work-grid-trigger",
            start: "top 85%"
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main ref={containerRef} className={styles.mainContainer}>
        {/* Drafting blueprint overlays */}
        <div className={styles.blueprintOverlay}></div>

        <div className={styles.container}>
          
          {/* Section Header */}
          <div className={styles.header}>
            <span className={`${styles.subtitle} work-header-reveal`}>
              <span className={styles.blueDot}></span> EXCELLENCE IN PRINT
            </span>
            <h1 className={`${styles.title} work-header-reveal`}>
              Our Featured <span className={styles.accentText}>Portfolio</span>
            </h1>
            <p className={`${styles.description} work-header-reveal`}>
              Explore our collection of custom mono cartons, rigid luxury presentation boxes, laminated shippers, and labeling products crafted with micron-level tolerance.
            </p>
          </div>

          {/* Grid Area */}
          <div className={`${styles.grid} work-grid-trigger`}>
            {portfolioData.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default WorkPage;
