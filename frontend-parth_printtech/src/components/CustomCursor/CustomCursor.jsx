"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./CustomCursor.module.css";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [isHidden, setIsHidden] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if it is a touch device to avoid rendering custom cursor
    const checkTouchDevice = () => {
      const touch = window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
      setIsTouchDevice(touch);
    };
    
    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);

    // If it's a touch device, do not add listeners
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      return () => {
        window.removeEventListener("resize", checkTouchDevice);
      };
    }

    const mouse = { x: 0, y: 0 };
    const dot = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (isHidden) setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    // Track hovered interactive elements to scale up the custom cursor ring
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;

      const isClickable = 
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "SELECT" ||
        target.tagName === "LABEL" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.onclick ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest('[class*="card" i]') ||
        target.closest('[class*="btn" i]') ||
        target.closest('[class*="Link" i]') ||
        target.closest('[class*="toggle" i]') ||
        target.closest('[class*="Tab" i]') ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsHovered(!!isClickable);
    };

    window.addEventListener("mouseover", handleMouseOver);

    let animFrameId;
    const updateCursor = () => {
      dot.x = mouse.x;
      dot.y = mouse.y;

      // Outer ring lerp trailing for premium spring feel
      const lerpFactor = 0.16;
      ring.x += (mouse.x - ring.x) * lerpFactor;
      ring.y += (mouse.y - ring.y) * lerpFactor;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }

      animFrameId = requestAnimationFrame(updateCursor);
    };

    updateCursor();

    return () => {
      window.removeEventListener("resize", checkTouchDevice);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(animFrameId);
    };
  }, [isHidden]);

  if (isTouchDevice) return null;

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.cursorDot} ${isHidden ? styles.cursorHidden : ""} ${
          isHovered ? styles.cursorHover : ""
        }`}
      />
      <div
        ref={ringRef}
        className={`${styles.cursorRing} ${isHidden ? styles.cursorHidden : ""} ${
          isHovered ? styles.cursorHover : ""
        }`}
      />
    </>
  );
}
