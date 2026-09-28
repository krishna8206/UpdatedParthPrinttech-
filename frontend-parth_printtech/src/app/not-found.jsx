"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import styles from "./not-found.module.css";

// Inline icons — keeps the file self-contained and avoids extra deps.
const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function NotFound() {
  const containerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".nf-code-digit",
        { y: 80, opacity: 0, rotateX: -40 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.12,
          ease: "expo.out",
        }
      )
        .fromTo(
          ".nf-reveal",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 },
          "-=0.6"
        );

      // Subtle floating loop on the outer 4s to add life.
      gsap.to(".nf-float", {
        y: -14,
        duration: 2.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main ref={containerRef} className={styles.mainContainer}>
        <div className={styles.blueprintOverlay} />
        <div className={styles.glowBlob} />

        <div className={styles.container}>


          {/* Giant 404 */}
          <h1 className={styles.code} aria-label="404">
            <span className={`${styles.codeDigit} nf-code-digit nf-float`} data-digit="4">4</span>
            <span className={`${styles.codeDigit} nf-code-digit`} data-digit="0">0</span>
            <span className={`${styles.codeDigit} nf-code-digit nf-float`} data-digit="4">4</span>
          </h1>

          {/* Headline */}
          <h2 className={`${styles.headline} nf-reveal`}>
            This page went <span className={styles.accentText}>off-press</span>
          </h2>

          {/* Description */}
          <p className={`${styles.description} nf-reveal`}>
            We couldn't locate the page you were looking for. The link may be
            outdated, broken, or the page may have been moved. Don't worry —
            our press operators are on it.
          </p>

          {/* CTAs */}
          <div className={`${styles.actions} nf-reveal`}>
            <Link href="/" className={styles.primaryBtn}>
              <span>Back to Home</span>
              <ArrowRightIcon />
            </Link>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.length > 1
                    ? window.history.back()
                    : (window.location.href = "/");
                }
              }}
              className={styles.secondaryBtn}
            >
              <ArrowLeftIcon />
              <span>Go Back</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
