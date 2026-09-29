"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { productsData } from "./productsData";
import { getMediaUrl } from "@/lib/media";
import styles from "./ProductsPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://updatedparthprinttech.onrender.com/api";

const ProductsPage = () => {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [productsList, setProductsList] = useState(productsData);
  const [headerData, setHeaderData] = useState({
    title: "Our Print &",
    titleHighlight: "Packaging Solutions",
    description: "Inspect the engineering details, sizes, and print calibrations of our premium commercial packaging solutions."
  });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            if (json.header) setHeaderData(json.header);
            if (Array.isArray(json.data) && json.data.length > 0) {
              setProductsList(json.data);
            }
          }
        }
      } catch (err) {
        // Keep fallback data
      }
    }
    loadData();
  }, []);

  const categories = ["All", ...Array.from(new Set(productsList.map((p) => p.category).filter(Boolean)))];

  const filteredProducts = activeCategory === "All"
    ? productsList
    : productsList.filter(p => p.category === activeCategory);

  useEffect(() => {
    document.title = `${headerData.title || "Products"} | Parth Printing Technology`;

    let ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        ".prod-header-reveal",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      // Card entrance
      gsap.fromTo(
        ".prod-card-reveal",
        { scale: 0.96, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", overwrite: "auto" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [activeCategory, headerData, productsList]);

  const resolveImage = (src) => {
    return getMediaUrl(src, "/images/products/pvc_shrink_sleeves.png");
  };

  return (
    <>
      <Navbar />
      <main ref={containerRef} className={styles.mainContainer}>
        {/* Blueprint drafting grids */}
        <div className={styles.blueprintOverlay}></div>

        <div className={styles.container}>
          {/* Section Header */}
          <div className={styles.header}>
            <h1 className={`${styles.title} prod-header-reveal`}>
              {headerData.title} <span className={styles.accentText}>{headerData.titleHighlight}</span>
            </h1>
            <p className={`${styles.description} prod-header-reveal`}>
              {headerData.description}
            </p>
          </div>

          {/* Category Filter Bar */}
          <div className={`${styles.filterBar} prod-header-reveal`}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards Grid */}
          <div className={styles.grid}>
            {filteredProducts.map((prod) => (
              <div key={prod.id} className={`${styles.card} prod-card-reveal`} style={{ "--accent": prod.accentColor }}>

                {/* ── Top: Colored gradient image section ── */}
                <div className={styles.cardImageArea} style={{ background: `linear-gradient(145deg, ${prod.accentColor}22 0%, ${prod.accentColor}44 100%)` }}>
                  {/* Wishlist / badge top-right */}
                  <span className={styles.cardNumBadge}>{prod.num}</span>

                  {/* Product image — floating centered */}
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={resolveImage(prod.image)}
                      alt={prod.title || "Product"}
                      fill
                      className={styles.cardImage}
                      sizes="(max-width: 768px) 100vw, 28vw"
                      unoptimized
                      onError={(e) => {
                        e.target.src = "/images/products/pvc_shrink_sleeves.png";
                      }}
                    />
                  </div>
                </div>

                {/* ── Bottom: White info panel ── */}
                <div className={styles.cardInfoPanel}>
                  {/* Title */}
                  <h3 className={styles.cardTitle}>{prod.title}</h3>

                  {/* Category chip */}
                  <div className={styles.cardChips}>
                    <span className={styles.cardChip} style={{ color: prod.accentColor, borderColor: prod.accentColor + "55", backgroundColor: prod.accentColor + "11" }}>
                      {prod.category}
                    </span>
                    {prod.dim && (
                      <span className={styles.cardChip} style={{ color: "#64748b", borderColor: "#e2e8f0" }}>
                        {prod.dim}
                      </span>
                    )}
                  </div>

                  {/* Short description */}
                  <p className={styles.cardDesc}>{prod.description}</p>

                  {/* CTA row */}
                  <div className={styles.cardCta}>
                    <Link href={`/products/${prod.id}`} className={styles.cardBtn} style={{ backgroundColor: prod.accentColor === "#111111" ? "#1e293b" : prod.accentColor }}>
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;
