"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Products.module.css";
import { productsData } from "@/app/products/productsData";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const defaultProductsData = [
  {
    id: "01",
    category: "Shrink Sleeves",
    title: "PVC Shrink Sleeves",
    description: "Conform your packaging graphics seamlessly to complex container contours. Our high-precision PVC shrink sleeve labels offer 360-degree design coverage, high moisture resistance, and tamper-evident sealing.",
    image: "/images/products/pvc_shrink_sleeves.png",
    accentColor: "#009fe3",
    specs: [
      { label: "Substrate", value: "High-Grade PVC Film" },
      { label: "Shrinkage Rate", value: "Up to 50% - 58%" },
      { label: "Print Process", value: "Rotogravure / High-Def Flexo" },
      { label: "Layflat Range", value: "20mm to 350mm" }
    ]
  },
  {
    id: "02",
    category: "Shrink Sleeves",
    title: "PETG Shrink Sleeves",
    description: "The pinnacle of shrink label engineering. Made from eco-friendly, recyclable polyester film, these sleeves yield up to 78% shrinkage for heavily contoured containers with absolute clarity.",
    image: "/images/products/petg_shrink_sleeves.png",
    accentColor: "#e3007b",
    specs: [
      { label: "Substrate", value: "Recyclable PET G Film" },
      { label: "Shrinkage Rate", value: "Up to 70% - 78% Max" },
      { label: "Print Process", value: "Gravure / UV Flexo" },
      { label: "Sustainability", value: "100% Recyclable" }
    ]
  },
  {
    id: "03",
    category: "Wrap-Around Labels",
    title: "BOPP Wrap-Around Labels",
    description: "Engineered for high-volume, high-speed rotary labeling lines. Our roll-fed BOPP labels offer superior water resistance and high gloss/matte clarity, ideal for carbonated drinks and bottled water.",
    image: "/images/products/bopp_wrap_around_labels.png",
    imageFit: "contain",
    accentColor: "#ffd400",
    specs: [
      { label: "Substrate", value: "BOPP (Natural & Pearlised)" },
      { label: "Film Thickness", value: "35 to 50 Microns" },
      { label: "Print Process", value: "Gravure" },
      { label: "Adhesive Match", value: "Hot-Melt Glue System" }
    ]
  },
  {
    id: "04",
    category: "Heat Transfer Labels",
    title: "Heat Transfer Labels (HTL)",
    description: "Experience permanent dry-fusion graphic decoration. Using heat and pressure, graphics bond directly to containers, achieving a seamless 'no-label' look with high chemical and scratch resistance.",
    image: "/images/products/htl_label_rolls.png",
    accentColor: "#111111",
    specs: [
      { label: "Carrier Film", value: "Coated PET Carrier Foil" },
      { label: "Ink System", value: "UV Cured / Scratch-Proof" },
      { label: "Fusion Temp", value: "130°C to 180°C" },
      { label: "Container Types", value: "PE, PP, PET, PS, Glass" }
    ]
  },
  {
    id: "05",
    category: "Shrink Film",
    title: "Plain PVC Shrink Film",
    description: "Premium unprinted PVC shrink film rolls for manual or automated wrapping, offering superior clarity, uniform shrinkage, and strong seals.",
    image: "/images/products/plain_pvc_shrink_film.png",
    imageFit: "contain",
    accentColor: "#4f46e5",
    specs: [
      { label: "Substrate", value: "Premium Grade Plain PVC" },
      { label: "Shrinkage Rate", value: "Up to 40% - 45%" },
      { label: "Format", value: "Roll Form & Cut Pieces (As per Requirement)" },
      { label: "Appearance", value: "Super Clear / High Gloss" }
    ]
  }
];

const Products = ({ data }) => {
  const containerRef = useRef(null);

  const title = data?.title || "Premium Shrink Sleeve & Label";
  const titleHighlight = data?.titleHighlight || "Solutions";
  const description = data?.description || "Explore our core shrink sleeves, wrap-around labels, and high-performance film packaging engineered with rotogravure precision.";
  const products = (data?.items && data.items.length > 0) ? data.items : defaultProductsData;

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        ".product-header-reveal",
        { y: 45, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );

      // Animate each row as it enters the viewport
      const rows = gsap.utils.toArray(".product-row-animate");
      rows.forEach((row) => {
        const imageBlock = row.querySelector(".row-image-block");
        const productImage = row.querySelector(".parallax-product-image");
        const contentBlock = row.querySelector(".row-content-block");
        const specBorders = row.querySelectorAll(".spec-border-draw");
        const specTexts = row.querySelectorAll(".spec-text-fade");
        
        const isLeftImage = row.classList.contains("row-left-image");
        
        // 1. Image Block Slide & Fade
        gsap.fromTo(imageBlock,
          { x: isLeftImage ? -60 : 60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 80%",
            }
          }
        );

        // 2. Image Scroll Parallax (Subtle Scrub)
        if (productImage) {
          gsap.fromTo(productImage,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: row,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              }
            }
          );
        }

        // 3. Content Block Fade/Reveal Stagger
        const contentTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 80%",
          }
        });

        contentTimeline.fromTo(contentBlock,
          { x: isLeftImage ? 60 : -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
        );

        // 4. Draw-in vertical colored borders on spec boxes
        if (specBorders.length > 0) {
          contentTimeline.fromTo(specBorders,
            { scaleY: 0 },
            { scaleY: 1, transformOrigin: "top", duration: 0.6, stagger: 0.1, ease: "power2.out" },
            "-=0.8"
          );
        }

        // 5. Stagger fade in the spec labels/values
        if (specTexts.length > 0) {
          contentTimeline.fromTo(specTexts,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power2.out" },
            "-=0.6"
          );
        }
      });
      
      // Rotate background print marks gently
      gsap.to(".print-mark-rotate", {
        rotation: 360,
        repeat: -1,
        duration: 30,
        ease: "none"
      });

    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className={`${styles.section} product-trigger-section`}>
      {/* Interactive Background Graphics */}
      <div className={styles.interactiveBg}>
        <div className={`${styles.floatShape} ${styles.shape1} print-mark-rotate`}></div>
        <div className={`${styles.floatShape} ${styles.shape2}`}></div>
        <div className={`${styles.floatShape} ${styles.shape3}`}></div>
      </div>

      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <h2 className={`${styles.title} product-header-reveal`}>
            {title} <span className={styles.outlinedText}>{titleHighlight}</span>
          </h2>
          <p className={`${styles.description} product-header-reveal`}>
            {description}
          </p>
        </div>

        {/* Alternating Showcase Rows */}
        <div className={styles.rowsContainer}>
          {products.map((prod, idx) => {
            const isLeftImage = idx % 2 === 0;
            return (
              <div 
                key={prod.id || idx} 
                className={`${styles.productRow} product-row-animate ${isLeftImage ? "row-left-image " + styles.rowLeftImage : styles.rowRightImage}`}
              >
                {/* Image Showcase Panel */}
                <div className={`${styles.imageBlock} row-image-block`}>
                  <div className={styles.imageFrame} style={{ "--accent-glow": prod.accentColor }}>
                    <div className={`${styles.imageWrapper} ${prod.imageFit === 'contain' || (prod.image && (prod.image.includes('bopp') || prod.image.includes('plain_pvc'))) ? styles.containWrapper : ''} parallax-image-container`}>
                      <Image
                        src={prod.image || '/images/products/pvc_shrink_sleeves.png'}
                        alt={prod.title || 'Product Showcase'}
                        fill
                        unoptimized
                        className={`${styles.productImage} ${prod.imageFit === 'contain' || (prod.image && (prod.image.includes('bopp') || prod.image.includes('plain_pvc'))) ? styles.containImage : ''} parallax-product-image`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Block */}
                <div className={`${styles.contentBlock} row-content-block`}>
                  {/* Category and Title */}
                  <span className={styles.categoryLabel}>{prod.category}</span>
                  <h3 className={styles.productTitle}>{prod.title}</h3>
                  <p className={styles.productDesc}>{prod.description}</p>
                  
                  {/* Technical 2x2 Specifications Grid */}
                  <div className={styles.specsGrid}>
                    {(prod.specs || []).map((spec, sIdx) => (
                      <div key={sIdx} className={styles.specBox}>
                        {/* Animated growing left border line */}
                        <span className={`${styles.specBorder} spec-border-draw`} style={{ backgroundColor: prod.accentColor }}></span>
                        
                        <span className={`${styles.specLabel} spec-text-fade`}>{spec.label}</span>
                        <span className={`${styles.specValue} spec-text-fade`}>{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Configure / Request Quote CTA button */}
                  <Link href={`/contact?subject=Inquiry for ${prod.title}`} className={styles.configureBtn} style={{ "--hover-accent": prod.accentColor }}>
                    Configure & Request Quote
                    <svg className={styles.btnArrow} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
