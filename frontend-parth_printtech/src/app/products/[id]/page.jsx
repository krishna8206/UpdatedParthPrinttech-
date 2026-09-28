"use client";

import React, { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import gsap from "gsap";
import { productsData } from "../productsData";
import styles from "../ProductsPage.module.css";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const containerRef = useRef(null);

  const staticMatch = productsData.find((p) => p.id === params.id) || null;
  const [product, setProduct] = useState(staticMatch);
  const [loading, setLoading] = useState(!staticMatch);

  useEffect(() => {
    async function loadProd() {
      try {
        const res = await fetch(`${API_BASE}/products/${params.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProduct(json.data);
          }
        }
      } catch (err) {
        // Fallback to static
      } finally {
        setLoading(false);
      }
    }
    loadProd();
  }, [params.id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Parth Printing Technology`;

      let ctx = gsap.context(() => {
        gsap.fromTo(
          ".detail-reveal",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [product]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className={styles.mainContainer}>
          <div className={styles.container} style={{ textAlign: "center", padding: "100px 0", color: "#64748b" }}>
            <p>Loading Product Specifications...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className={styles.mainContainer}>
          <div className={styles.container} style={{ textAlign: "center", padding: "100px 0" }}>
            <h1 className={styles.title}>Product Not Found</h1>
            <p className={styles.description}>The requested product specifications could not be located in our index.</p>
            <Link href="/products" className={styles.filterBtn} style={{ display: "inline-block", marginTop: "20px" }}>
              Back to Catalog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getPreFilledMessage = () => {
    let specText = `PROJECT SPECIFICATION CALIBRATION:\n`;
    specText += `- Product: ${product.title}\n`;
    specText += `- Dimensions: ${product.dim || "Standard"}\n`;
    (product.specs || []).forEach((spec) => {
      specText += `- ${spec.label}: ${spec.value}\n`;
    });
    specText += `\nPlease review these specs and contact me for calibration and quotation.`;
    return specText;
  };

  const handleInitiateQuote = () => {
    const subjectParam = encodeURIComponent(product.title);
    const descParam = encodeURIComponent(getPreFilledMessage());
    router.push(`/contact?subject=${subjectParam}&desc=${descParam}`);
  };

  const resolveImage = (src) => {
    if (!src) return "/images/products/pvc_shrink_sleeves.png";
    if (src.startsWith("/uploads/")) return `http://localhost:5000${src}`;
    return src;
  };

  return (
    <>
      <Navbar />
      <main ref={containerRef} className={styles.mainContainer}>
        <div className={styles.blueprintOverlay}></div>

        <div className={styles.container}>
          {/* Back button */}
          <div className="detail-reveal" style={{ marginBottom: "40px" }}>
            <Link href="/products" className={styles.filterBtn} style={{ textDecoration: "none" }}>
              ← Back
            </Link>
          </div>

          <div className={styles.grid} style={{ gridTemplateColumns: "1.1fr 0.9fr", gap: "60px", alignItems: "start" }}>
            
            {/* Left Column: Blueprint Visualizer Screen */}
            <div className="detail-reveal" style={{ position: "sticky", top: "120px" }}>
              <div className={styles.card} style={{ "--accent-color": product.accentColor, padding: "40px" }}>
                <div className={styles.cadHeader}>
                  <span className={styles.cadIndex}>[ {product.num} {"//"} CALIBRATION SOURCE ]</span>
                  <span className={styles.cadReg}>{product.regMark || "REG-STD"}</span>
                </div>

                <div className={styles.imageFrame} style={{ aspectRatio: "1.3 / 1" }}>
                  <div className={styles.frameGrid}></div>
                  <div className={styles.crosshair}></div>
                  <div className={styles.dimensionLabel}>{product.dim || "Custom Sizing"}</div>
                  
                  <div className={styles.imageWrapper}>
                    <Image
                      src={resolveImage(product.image)}
                      alt={product.title || "Product Image"}
                      fill
                      className={styles.productImage}
                      priority
                      unoptimized
                      onError={(e) => {
                        e.target.src = "/images/products/pvc_shrink_sleeves.png";
                      }}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Detailed Specification & CTA */}
            <div className="detail-reveal">
              <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
                <div>
                  <span className={styles.categoryLabel}>{product.category}</span>
                  <h1 className={styles.title} style={{ textAlign: "left", fontSize: "3rem", margin: "10px 0 20px 0" }}>
                    {product.title}
                  </h1>

                  {/* High Tech Status/Calibration Indicators */}
                  <div className={styles.techBadgeRow}>
                    <span className={`${styles.techBadge} ${styles.badgeSuccess}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Calibration Status: Ready
                    </span>
                    <span className={`${styles.techBadge} ${styles.badgeInfo}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      Tolerance: ±0.1mm
                    </span>
                  </div>

                  <p className={styles.description} style={{ textAlign: "left", fontSize: "1.1rem", color: "#475569" }}>
                    {product.detailedDescription || product.description}
                  </p>
                </div>

                {/* Dynamic Spec Sheet Dashboard */}
                {product.specs && product.specs.length > 0 && (
                  <div className={styles.specsTable}>
                    <div className={styles.specsTableHead}>
                      <span className={styles.specsTableTitle}>CALIBRATION SHEET PARAMETERS</span>
                      <span className={styles.specsTableSub}>[ REF-IDX-{product.num} ]</span>
                    </div>
                    <div className={styles.specsList} style={{ padding: 0 }}>
                      {product.specs.map((spec, sIdx) => (
                        <div key={sIdx} className={styles.specRowItem}>
                          <span className={styles.specRowLabel}>
                            <span className={styles.listDot}></span>
                            {spec.label}
                          </span>
                          <span className={styles.specRowVal}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quote CTA Button */}
                <button 
                  onClick={handleInitiateQuote} 
                  className={styles.quoteBtn}
                  style={{
                    backgroundColor: product.accentColor || "#009fe3",
                    borderColor: product.accentColor || "#009fe3",
                    color: "#ffffff",
                    fontSize: "1.02rem",
                    padding: "16px",
                    boxShadow: "0 10px 25px rgba(0, 159, 227, 0.15)",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <span>Initiate Quote Calibration →</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
