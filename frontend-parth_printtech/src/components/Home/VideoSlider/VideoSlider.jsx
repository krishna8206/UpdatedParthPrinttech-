"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import Link from "next/link";
import styles from "./VideoSlider.module.css";
import { getMediaUrl } from "@/lib/media";

const defaultSlides = [
  {
    id: 1,
    videoSrc: "/videos/0918(2) (1).mp4",
    title: "High-Precision",
    titleHighlight: "Rotogravure & Flexo",
    subtitle: "Delivering crisp, vivid colors on film rolls with unmatched calibration.",
  },
  {
    id: 2,
    videoSrc: "/videos/0918(2) (1).mp4",
    title: "Custom ",
    titleHighlight: "Label Solutions",
    subtitle: "Vibrant shrink sleeves and wrap-around labels custom-calibrated to container shapes.",
  },
  {
    id: 3,
    videoSrc: "/videos/0918(2) (1).mp4",
    title: "Premium",
    titleHighlight: "Shrink Films",
    subtitle: "Plain and printed packaging films engineered to protect and showcase your products.",
  },
  {
    id: 4,
    videoSrc: "/videos/0918(2) (1).mp4",
    title: "End-to-End",
    titleHighlight: "Excellence",
    subtitle: "From digital calibration to finished sleeve rolls, we ensure top-tier quality.",
  }
];

const DEFAULT_VIDEO = "/videos/0918(2) (1).mp4";

// Resolve video URL using smart media helper with local default fallback
const resolveVideoSrc = (src) => {
  if (!src) return DEFAULT_VIDEO;
  return getMediaUrl(src, DEFAULT_VIDEO);
};

const VideoSlider = ({ data, heroVideo }) => {
  const slides = (data && data.length > 0) ? data : defaultSlides;
  // Use heroVideo (from admin) as the shared background; fall back to first slide's videoSrc or default
  const bgVideo = resolveVideoSrc(heroVideo || slides[0]?.videoSrc || DEFAULT_VIDEO);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);

  // Create refs for text elements to animate
  const titleRef = useRef(null);
  const highlightRef = useRef(null);
  const subtitleRef = useRef(null);

  const goToSlide = useCallback((index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [currentSlide, isAnimating]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }, [currentSlide, goToSlide]);

  // Auto-play timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 7000); // 7 seconds per slide for a premium feel
    return () => clearInterval(timer);
  }, [isAnimating, nextSlide]);

  useEffect(() => {
    // Text reveal animation on slide change
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(titleRef.current,
        { y: 40, opacity: 0, rotationX: 45 },
        { y: 0, opacity: 1, rotationX: 0, duration: 0.8, ease: "power3.out" }
      )
        .fromTo(highlightRef.current,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
    }, sliderRef);

    return () => ctx.revert();
  }, [currentSlide]);

  return (
    <div className={styles.heroWrapper} ref={sliderRef}>
      <div className={styles.heroInner}>
        {/* Full-Screen Persistent Background Video — single video loops behind all slides */}
        <div className={styles.videoContainer}>
          <video
            key={bgVideo}
            className={styles.videoBackground}
            autoPlay
            loop
            muted
            playsInline
            src={encodeURI(bgVideo)}
            onError={(e) => {
              // Graceful fallback to default local video if remote video fails to load
              if (e.currentTarget.src && !e.currentTarget.src.endsWith(DEFAULT_VIDEO)) {
                e.currentTarget.src = DEFAULT_VIDEO;
              }
            }}
          />
          <div className={styles.overlay}></div>
        </div>

        {/* Content Box */}
        <div className={styles.contentBox}>
          <div className={styles.textContent}>
            <h1 className={styles.title}>
              <span className={styles.titleBase} ref={titleRef}>
                {slides[currentSlide].title}
              </span>
              <span className={styles.titleHighlight} ref={highlightRef}>
                {slides[currentSlide].titleHighlight}
              </span>
            </h1>
            <p className={styles.subtitle} ref={subtitleRef}>
              {slides[currentSlide].subtitle}
            </p>
            <Link href="/products" className={styles.ctaButton}>
              Explore Services
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoSlider;
