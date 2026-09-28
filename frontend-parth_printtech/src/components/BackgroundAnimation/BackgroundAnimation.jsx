"use client";

import React, { useEffect, useRef } from "react";
import styles from "./BackgroundAnimation.module.css";

export default function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // 150 bright blue dots — 3px radius
    const DOT_COUNT = 150;
    const dots = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.4 + 0.55,  // 0.55 – 0.95 — bright & vivid
      alphaDir: Math.random() > 0.5 ? 1 : -1,
    }));

    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      dots.forEach((d) => {
        // Move
        d.x += d.vx;
        d.y += d.vy;

        // Wrap around edges
        if (d.x < 0) d.x = w;
        if (d.x > w) d.x = 0;
        if (d.y < 0) d.y = h;
        if (d.y > h) d.y = 0;

        // Gentle alpha pulse
        d.alpha += d.alphaDir * 0.003;
        if (d.alpha > 0.95 || d.alpha < 0.55) d.alphaDir *= -1;

        // bright solid blue dot — 3px radius, vivid glow
        ctx.save();
        ctx.globalAlpha = d.alpha;
        ctx.shadowColor = "#009fe3";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "#009fe3";
        ctx.beginPath();
        ctx.arc(d.x, d.y, 3, 0, Math.PI * 2); // 3px radius
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={styles.canvasContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
